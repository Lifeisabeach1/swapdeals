// app/api/trades/route.js
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import { generateSlug } from '@/lib/utils/slug';
import { supabase } from '@/lib/supabase';

// GET - Public (no auth required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category') ? decodeURIComponent(searchParams.get('category')) : null;
    const location = searchParams.get('location') ? decodeURIComponent(searchParams.get('location')) : null;
    const userId = searchParams.get('userId');
    const exclude = searchParams.get('exclude');
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = searchParams.get('limit') ? Math.max(1, parseInt(searchParams.get('limit'))) : null;
    const offset = limit ? (page - 1) * limit : 0;

    // Build query
    let query = supabase
      .from('trade_listings')
      .select(`
        *,
        users!inner (id, username, email, phone, bio, location, created_at, avatar_url, is_active)
      `)
      .eq('status', 'active')
      .eq('users.is_active', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (category && category !== 'all') query = query.ilike('category', category);
    if (location && location !== 'all') query = query.ilike('location', location);
    if (userId) query = query.eq('user_id', userId);
    if (exclude) query = query.neq('id', exclude);
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data: baseListings, error: listingsError } = await query;
    
    if (listingsError) {
      throw new Error(`Failed to fetch listings: ${listingsError.message}`);
    }

    if (!baseListings || baseListings.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          listings: [],
          pagination: {
            currentPage: limit ? page : 1,
            totalPages: 0,
            totalCount: 0,
            limit: limit || 'unlimited',
            hasMore: false
          }
        }
      });
    }

    const listingIds = baseListings.map(l => l.id);

    // Fetch related data in parallel
    const [
      { data: allItems },
      { data: allImages }
    ] = await Promise.all([
      supabase.from('trade_items').select('id, listing_id, type, name, category, description').in('listing_id', listingIds),
      supabase.from('images').select('id, listing_id, filename, original_name, url, file_path, mime_type').in('listing_id', listingIds)
    ]);

    // Group by listing_id and type
    const itemsByListing = {};
    const imagesByListing = {};

    (allItems || []).forEach(item => {
      if (!itemsByListing[item.listing_id]) {
        itemsByListing[item.listing_id] = {
          offering: [],
          wanting: []
        };
      }
      if (item.type === 'offering') {
        itemsByListing[item.listing_id].offering.push(item);
      } else if (item.type === 'wanting') {
        itemsByListing[item.listing_id].wanting.push(item);
      }
    });

    (allImages || []).forEach(image => {
      if (!imagesByListing[image.listing_id]) imagesByListing[image.listing_id] = [];
      imagesByListing[image.listing_id].push(image);
    });

    // Process listings
    const processedListings = baseListings.map(listing => {
      const { users, ...listingData } = listing;
      const items = itemsByListing[listing.id] || { offering: [], wanting: [] };
      const images = imagesByListing[listing.id] || [];

      return {
        ...listingData,
        items: [...items.offering, ...items.wanting],
        itemsOffering: items.offering,
        itemsWanted: items.wanting,
        images,
        seller: {
          id: users.id,
          name: users.username,
          email: users.email,
          phone: users.phone,
          bio: users.bio,
          location: users.location,
          joinedDate: users.created_at,
          avatar: users.avatar_url
        },
        imageCount: images.length,
        primaryImage: images[0] || null,
        imageUrl: images[0]?.url || null
      };
    });

    // Get total count for pagination
    let totalCount = baseListings.length;
    let totalPages = 1;
    
    if (limit) {
      let countQuery = supabase
        .from('trade_listings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');

      if (category && category !== 'all') countQuery = countQuery.ilike('category', category);
      if (location && location !== 'all') countQuery = countQuery.ilike('location', location);
      if (userId) countQuery = countQuery.eq('user_id', userId);
      if (exclude) countQuery = countQuery.neq('id', exclude);

      const { count } = await countQuery;
      totalCount = count || 0;
      totalPages = Math.ceil(totalCount / limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        listings: processedListings,
        pagination: {
          currentPage: limit ? page : 1,
          totalPages,
          totalCount,
          limit: limit || 'unlimited',
          hasMore: limit ? page < totalPages : false,
          hasNextPage: limit ? page < totalPages : false,
          hasPrevPage: limit ? page > 1 : false
        }
      }
    });

  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}

// PATCH - Update trade listing (requires auth)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { status, listingId } = body;
    
    // Use Next.js headers() instead of request.headers
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }

    // Validate
    if (!status || !listingId) {
      return NextResponse.json({
        success: false,
        message: 'Status and listing ID required'
      }, { status: 400 });
    }
    
    const validStatuses = ['active', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status value'
      }, { status: 400 });
    }

    // Check ownership
    const { data: existingListing } = await supabase
      .from('trade_listings')
      .select('*')
      .eq('id', listingId)
      .eq('user_id', decoded.id)
      .single();
    
    if (!existingListing) {
      return NextResponse.json({
        success: false,
        message: 'Listing not found or permission denied'
      }, { status: 404 });
    }
    
    // Update
    const { data: updatedListing, error: updateError } = await supabase
      .from('trade_listings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', listingId)
      .eq('user_id', decoded.id)
      .select('*')
      .single();
    
    if (updateError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update listing'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Listing status updated',
      data: updatedListing
    });

  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST - Create new trade listing (requires auth)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, location, description, itemsToTrade, itemsWanted, imageIds, itemsToTradeCount, itemsWantedCount } = body;
    
    // Use Next.js headers() instead of request.headers
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }

    // Validate
    if (!title?.trim() || !category?.trim() || !location?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Title, category, and location required'
      }, { status: 400 });
    }

    const finalItemsToTradeCount = itemsToTrade?.length || parseInt(itemsToTradeCount) || 0;
    const finalItemsWantedCount = itemsWanted?.length || parseInt(itemsWantedCount) || 0;

    if (!finalItemsToTradeCount || !finalItemsWantedCount) {
      return NextResponse.json({
        success: false,
        message: 'Items to trade and wanted counts required'
      }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existingSlug } = await supabase
        .from('trade_listings')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (!existingSlug) break;
      slug = `${baseSlug}-${counter++}`;
    }

    // Create listing
    const { data: listing, error: listingError } = await supabase
      .from('trade_listings')
      .insert({
        user_id: decoded.id,
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        description: description?.trim() || title.trim(),
        slug,
        items_to_trade_count: finalItemsToTradeCount,
        items_wanted_count: finalItemsWantedCount,
        status: 'active',
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, slug')
      .single();
    
    if (listingError || !listing) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create listing'
      }, { status: 500 });
    }

    // Create items (offering)
    if (itemsToTrade?.length > 0) {
      const tradeItemsData = itemsToTrade
        .filter(item => item.name?.trim())
        .map(item => ({
          listing_id: listing.id,
          type: 'offering',
          name: item.name.trim(),
          category: item.category?.trim() || category,
          description: item.description?.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      
      if (tradeItemsData.length > 0) {
        await supabase.from('trade_items').insert(tradeItemsData);
      }
    }
    
    // Create items (wanting)
    if (itemsWanted?.length > 0) {
      const wantedItemsData = itemsWanted
        .filter(item => item.category?.trim() || item.description?.trim())
        .map(item => ({
          listing_id: listing.id,
          type: 'wanting',
          name: null,
          category: item.category?.trim(),
          description: item.description?.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      
      if (wantedItemsData.length > 0) {
        await supabase.from('trade_items').insert(wantedItemsData);
      }
    }

    // Link images
    if (imageIds?.length > 0) {
      const { data: existingImages } = await supabase
        .from('images')
        .select('id')
        .in('id', imageIds)
        .eq('user_id', decoded.id)
        .is('listing_id', null);
      
      if (existingImages?.length > 0) {
        const validImageIds = existingImages.map(img => img.id);
        await supabase
          .from('images')
          .update({ listing_id: listing.id, updated_at: new Date().toISOString() })
          .in('id', validImageIds);
      }
    }

    // Fetch complete listing
    const { data: baseListing } = await supabase
      .from('trade_listings')
      .select('*, users!trade_listings_user_id_fkey (username)')
      .eq('id', listing.id)
      .single();

    const [{ data: items }, { data: images }] = await Promise.all([
      supabase.from('trade_items').select('*').eq('listing_id', listing.id),
      supabase.from('images').select('*').eq('listing_id', listing.id)
    ]);

    return NextResponse.json({
      success: true,
      message: 'Trade listing created',
      data: {
        ...baseListing,
        items: items || [],
        images: images || []
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

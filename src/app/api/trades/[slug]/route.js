// app/api/trades/[slug]/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Public (no auth required)
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Listing ID is required'
      }, { status: 400 });
    }

    // Get listing ID from slug
    let listingId;
    if (isNaN(slug)) {
      const { data: listing } = await supabase
        .from('trade_listings')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (!listing) {
        return NextResponse.json({
          success: false,
          message: 'Listing not found'
        }, { status: 404 });
      }
      
      listingId = listing.id;
    } else {
      listingId = parseInt(slug);
    }

    // Fetch offers
    const { data: offers, error: offersError } = await supabase
      .from('trade_offers')
      .select('id, listing_id, user_id, message, images, status, created_at, updated_at, accepted_at, rejected_at, withdrawn_at, rejection_reason')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (offersError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to load offers'
      }, { status: 500 });
    }

    // Get user data for all offers
    const userIds = [...new Set(offers?.map(o => o.user_id) || [])];
    const { data: users } = await supabase
      .from('users')
      .select('id, username, first_name, last_name, avatar_url')
      .in('id', userIds);

    const userMap = {};
    users?.forEach(user => {
      userMap[user.id] = user;
    });

    // Format offers
    const formattedOffers = (offers || []).map(offer => {
      const user = userMap[offer.user_id];
      
      // Parse images if stored as JSON string
      let parsedImages = offer.images;
      if (typeof offer.images === 'string' && offer.images) {
        try {
          parsedImages = JSON.parse(offer.images);
        } catch {
          parsedImages = [];
        }
      } else if (!offer.images) {
        parsedImages = [];
      }
      
      return {
        id: offer.id,
        message: offer.message,
        images: parsedImages,
        timestamp: offer.created_at,
        status: offer.status,
        accepted_at: offer.accepted_at,
        rejected_at: offer.rejected_at,
        withdrawn_at: offer.withdrawn_at,
        rejection_reason: offer.rejection_reason,
        user: {
          id: offer.user_id,
          name: user?.username || 
                `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 
                'Anonymous',
          avatar: user?.avatar_url
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedOffers
    });

  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to load offers'
    }, { status: 500 });
  }
}

// POST - Create new offer (requires auth)
export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    // ✅ FIXED: Use request.headers directly
    const authHeader = request.headers.get('authorization');
    
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

    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Listing ID is required'
      }, { status: 400 });
    }

    const { message } = body;
    if (!message?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Message is required'
      }, { status: 400 });
    }

    // Get listing
    let listingId;
    let listing;
    
    if (isNaN(slug)) {
      const { data: listingData } = await supabase
        .from('trade_listings')
        .select('id, user_id, status')
        .eq('slug', slug)
        .single();
      
      if (!listingData) {
        return NextResponse.json({
          success: false,
          message: 'Listing not found'
        }, { status: 404 });
      }
      
      listing = listingData;
      listingId = listingData.id;
    } else {
      listingId = parseInt(slug);
      
      const { data: listingData } = await supabase
        .from('trade_listings')
        .select('id, user_id, status')
        .eq('id', listingId)
        .single();
      
      if (!listingData) {
        return NextResponse.json({
          success: false,
          message: 'Listing not found'
        }, { status: 404 });
      }
      
      listing = listingData;
    }

    // Prevent self-offers
    if (listing.user_id === decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'Cannot make an offer on your own listing'
      }, { status: 400 });
    }

    // Check listing status
    if (listing.status !== 'active') {
      return NextResponse.json({
        success: false,
        message: 'Cannot make offers on inactive listings'
      }, { status: 400 });
    }

    // Handle images
    let imagesData = null;
    if (body.images) {
      if (typeof body.images === 'string') {
        try {
          JSON.parse(body.images);
          imagesData = body.images;
        } catch {
          imagesData = JSON.stringify(body.images);
        }
      } else if (Array.isArray(body.images) || typeof body.images === 'object') {
        imagesData = JSON.stringify(body.images);
      }
    }

    // Create offer
    const { data: newOffer, error: createError } = await supabase
      .from('trade_offers')
      .insert({
        listing_id: listingId,
        user_id: decoded.id,
        message: message.trim(),
        images: imagesData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, listing_id, user_id, message, images, status, created_at, updated_at, accepted_at, rejected_at, withdrawn_at, rejection_reason')
      .single();

    if (createError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create offer'
      }, { status: 500 });
    }

    // Get user info
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, first_name, last_name, avatar_url')
      .eq('id', decoded.id)
      .single();

    const formattedOffer = {
      id: newOffer.id,
      message: newOffer.message,
      images: newOffer.images,
      timestamp: newOffer.created_at,
      status: newOffer.status,
      accepted_at: newOffer.accepted_at,
      rejected_at: newOffer.rejected_at,
      withdrawn_at: newOffer.withdrawn_at,
      rejection_reason: newOffer.rejection_reason,
      user: {
        id: newOffer.user_id,
        name: userData?.username || 
              `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 
              'Anonymous',
        avatar: userData?.avatar_url
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Offer created successfully',
      data: formattedOffer
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create offer'
    }, { status: 500 });
  }
}

// DELETE - Delete listing (requires auth and ownership)
export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    
    // ✅ FIXED: Use request.headers directly
    const authHeader = request.headers.get('authorization');
    
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

    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Listing ID is required'
      }, { status: 400 });
    }

    // Try both table names (trade_listings or listings)
    let listing = null;
    let listingId = null;
    let tableName = 'listings'; // Default
    
    // Try listings table first
    if (isNaN(slug)) {
      const { data: listingData } = await supabase
        .from('listings')
        .select('id, user_id, title')
        .eq('slug', slug)
        .single();
      
      if (listingData) {
        listing = listingData;
        listingId = listingData.id;
        tableName = 'listings';
      }
    } else {
      listingId = parseInt(slug);
      const { data: listingData } = await supabase
        .from('listings')
        .select('id, user_id, title')
        .eq('id', listingId)
        .single();
      
      if (listingData) {
        listing = listingData;
        tableName = 'listings';
      }
    }
    
    // If not found, try trade_listings table
    if (!listing) {
      if (isNaN(slug)) {
        const { data: listingData } = await supabase
          .from('trade_listings')
          .select('id, user_id, title')
          .eq('slug', slug)
          .single();
        
        if (listingData) {
          listing = listingData;
          listingId = listingData.id;
          tableName = 'trade_listings';
        }
      } else {
        const { data: listingData } = await supabase
          .from('trade_listings')
          .select('id, user_id, title')
          .eq('id', listingId)
          .single();
        
        if (listingData) {
          listing = listingData;
          tableName = 'trade_listings';
        }
      }
    }
    
    if (!listing) {
      return NextResponse.json({
        success: false,
        message: 'Listing not found'
      }, { status: 404 });
    }

    // Check ownership (or admin)
    const isOwner = listing.user_id === decoded.id;
    const isAdmin = decoded.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({
        success: false,
        message: 'You do not have permission to delete this listing'
      }, { status: 403 });
    }

    // Delete related data first (to avoid foreign key constraints)
    // Use Promise.allSettled to continue even if some deletions fail
    const deleteResults = await Promise.allSettled([
      supabase.from('trade_offers').delete().eq('listing_id', listingId),
      supabase.from('trade_items').delete().eq('listing_id', listingId),
      supabase.from('listing_questions').delete().eq('listing_id', listingId),
      supabase.from('images').delete().eq('listing_id', listingId)
    ]);

    // Log any failed deletions but continue
    deleteResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Failed to delete related data ${index}:`, result.reason);
      }
    });

    // Delete the listing
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq('id', listingId);

    if (deleteError) {
      console.error('Error deleting listing:', deleteError);
      return NextResponse.json({
        success: false,
        message: `Failed to delete listing: ${deleteError.message}`,
        error: deleteError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete listing',
      error: error.message
    }, { status: 500 });
  }
}
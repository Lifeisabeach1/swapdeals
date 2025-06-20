// src/app/api/trades/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import { withAuth, APIError } from '@/lib/middleware/auth.js';
import { generateSlug } from '@/lib/utils/slug.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Properly decode URL parameters
    const category = searchParams.get('category') ? decodeURIComponent(searchParams.get('category')) : null;
    const location = searchParams.get('location') ? decodeURIComponent(searchParams.get('location')) : null;
    const userId = searchParams.get('userId');
    const exclude = searchParams.get('exclude');
    
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const requestedLimit = searchParams.get('limit');
    const limit = requestedLimit ? Math.max(1, parseInt(requestedLimit)) : null;
    const offset = limit ? (page - 1) * limit : 0;
    
    const debug = searchParams.get('debug') === 'true';

    console.log('GET /api/trades - Filters:', {
      category,
      location,
      userId,
      exclude,
      page,
      limit
    });

    // ✅ NEW APPROACH: Separate queries to avoid Cartesian product
    console.log('Fetching listings with separate queries...');

    // 1. First get base listings with seller info (no JOINs that cause duplication)
    let baseQuery = knex('trade_listings')
      .select([
        'trade_listings.*',
        // Seller information
        'users.username as seller_name',
        'users.email as seller_email',
        'users.phone as seller_phone',
        'users.bio as seller_bio',
        'users.location as seller_location',
        'users.created_at as seller_joined_date',
        'users.avatar_url as seller_avatar'
      ])
      .join('users', 'trade_listings.user_id', 'users.id')
      .where('trade_listings.status', 'active')
      .where('users.is_active', true)
      .orderBy('trade_listings.created_at', 'desc');

    // Apply filters with case-insensitive matching
    if (category && category !== 'all') {
      baseQuery = baseQuery.whereRaw('LOWER(trade_listings.category) = LOWER(?)', [category]);
      console.log('Applied category filter:', category);
    }

    if (location && location !== 'all') {
      baseQuery = baseQuery.whereRaw('LOWER(trade_listings.location) = LOWER(?)', [location]);
      console.log('Applied location filter:', location);
    }

    if (userId) {
      baseQuery = baseQuery.where('trade_listings.user_id', userId);
    }

    if (exclude) {
      baseQuery = baseQuery.where('trade_listings.id', '!=', exclude);
    }

    // Apply pagination only if limit is specified
    if (limit) {
      baseQuery = baseQuery.limit(limit).offset(offset);
    }

    // Debug: Print the actual SQL query
    if (debug) {
      console.log('Generated SQL Query:', baseQuery.toString());
    }
    
    // Execute the base query
    const baseListings = await baseQuery;
    console.log(`Retrieved ${baseListings.length} base listings`);

    if (baseListings.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          listings: [],
          pagination: {
            currentPage: limit ? page : 1,
            totalPages: 0,
            totalCount: 0,
            limit: limit || 'unlimited',
            hasMore: false,
            hasNextPage: false,
            hasPrevPage: false,
            totalItems: 0
          }
        }
      });
    }

    // 2. Get all listing IDs for fetching related data
    const listingIds = baseListings.map(listing => listing.id);
    console.log('Fetching related data for listing IDs:', listingIds);

    // 3. Fetch all trade items for these listings
    const allItems = await knex('trade_items')
      .select('id', 'listing_id', 'type', 'name', 'category', 'description')
      .whereIn('listing_id', listingIds);

    console.log(`Retrieved ${allItems.length} trade items`);

    // 4. Fetch all images for these listings
    const allImages = await knex('images')
      .select('id', 'listing_id', 'filename', 'original_name', 'url', 'file_path', 'mime_type')
      .whereIn('listing_id', listingIds);

    console.log(`Retrieved ${allImages.length} images`);

    // 5. Group items and images by listing_id for efficient lookup
    const itemsByListing = {};
    const imagesByListing = {};

    allItems.forEach(item => {
      if (!itemsByListing[item.listing_id]) {
        itemsByListing[item.listing_id] = [];
      }
      itemsByListing[item.listing_id].push({
        id: item.id,
        type: item.type,
        name: item.name,
        category: item.category,
        description: item.description
      });
    });

    allImages.forEach(image => {
      if (!imagesByListing[image.listing_id]) {
        imagesByListing[image.listing_id] = [];
      }
      imagesByListing[image.listing_id].push({
        id: image.id,
        filename: image.filename,
        original_name: image.original_name,
        url: image.url,
        file_path: image.file_path,
        mime_type: image.mime_type
      });
    });

    // 6. Combine everything together
    const processedListings = baseListings.map(listing => {
      const {
        seller_name,
        seller_email,
        seller_phone,
        seller_bio,
        seller_location,
        seller_joined_date,
        seller_avatar,
        ...listingData
      } = listing;

      const items = itemsByListing[listing.id] || [];
      const images = imagesByListing[listing.id] || [];

      return {
        ...listingData,
        items,
        images,
        seller: {
          id: listing.user_id,
          name: seller_name,
          email: seller_email,
          phone: seller_phone,
          bio: seller_bio,
          location: seller_location,
          joinedDate: seller_joined_date,
          avatar: seller_avatar
        },
        imageCount: images.length,
        primaryImage: images.length > 0 ? images[0] : null,
        imageUrl: images.length > 0 ? images[0].url : null
      };
    });

    console.log('Processed listings with items and images attached');

    // Get total count for pagination with same filters (only if pagination is being used)
    let totalCount = baseListings.length;
    let totalPages = 1;
    
    if (limit) {
      let countQuery = knex('trade_listings')
        .join('users', 'trade_listings.user_id', 'users.id')
        .where('trade_listings.status', 'active')
        .where('users.is_active', true)
        .count('trade_listings.id as count')
        .first();

      // Apply same filters to count query
      if (category && category !== 'all') {
        countQuery = countQuery.whereRaw('LOWER(trade_listings.category) = LOWER(?)', [category]);
      }
      if (location && location !== 'all') {
        countQuery = countQuery.whereRaw('LOWER(trade_listings.location) = LOWER(?)', [location]);
      }
      if (userId) {
        countQuery = countQuery.where('trade_listings.user_id', userId);
      }

      const { count } = await countQuery;
      totalCount = parseInt(count);
      totalPages = Math.ceil(totalCount / limit);
    }

    // Debug: Also return what's actually in the database for debugging
    if (debug) {
      const allListings = await knex('trade_listings')
        .select('id', 'title', 'category', 'location', 'status')
        .where('status', 'active');
      
      console.log('All active listings in database:', allListings);
      
      return NextResponse.json({
        success: true,
        debug: {
          filters: { category, location, userId, exclude },
          totalInDb: allListings.length,
          allListings: allListings,
          filteredCount: processedListings.length,
          itemsCount: allItems.length,
          imagesCount: allImages.length
        },
        data: {
          listings: processedListings,
          pagination: {
            currentPage: limit ? page : 1,
            totalPages,
            totalCount,
            limit: limit || 'unlimited',
            hasMore: limit ? page < totalPages : false,
            hasNextPage: limit ? page < totalPages : false,
            hasPrevPage: limit ? page > 1 : false,
            totalItems: totalCount
          }
        }
      });
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
          hasPrevPage: limit ? page > 1 : false,
          totalItems: totalCount
        }
      }
    });

  } catch (error) {
    console.error('Error fetching trade listings:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}

// PATCH /api/trades - Update trade listing status (requires auth)
export const PATCH = withAuth(async (request) => {
  try {
    const body = await request.json();
    const { user } = request.auth;
    const { status, listingId } = body;
    
    // Validate required fields
    if (!status) {
      throw new APIError('Status is required', 400, 'MISSING_STATUS');
    }
    
    if (!listingId) {
      throw new APIError('Listing ID is required', 400, 'MISSING_LISTING_ID');
    }
    
    // Validate status values
    const validStatuses = ['active', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new APIError('Invalid status value', 400, 'INVALID_STATUS');
    }
    
    console.log('Updating trade listing status:', {
      listingId,
      status,
      userId: user.id
    });

    // Check if listing exists and user owns it
    const existingListing = await knex('trade_listings')
      .where('id', listingId)
      .where('user_id', user.id)
      .first();
    
    if (!existingListing) {
      throw new APIError('Listing not found or you do not have permission to update it', 404, 'LISTING_NOT_FOUND');
    }
    
    // Update the listing status
    const [updatedListing] = await knex('trade_listings')
      .where('id', listingId)
      .where('user_id', user.id)
      .update({
        status,
        updated_at: new Date()
      })
      .returning('*');
    
    if (!updatedListing) {
      throw new APIError('Failed to update listing', 500, 'UPDATE_FAILED');
    }
    
    console.log('Trade listing status updated successfully:', updatedListing.id);

    return NextResponse.json({
      success: true,
      message: 'Trade listing status updated successfully',
      data: updatedListing
    });

  } catch (error) {
    console.error('Error updating trade listing:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        code: error.code
      }, { status: error.statusCode });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
});

// POST /api/trades - Create new trade listing (requires auth)
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const { user } = request.auth;
    const { title, category, location, description, itemsToTrade, itemsWanted, imageIds, itemsToTradeCount, itemsWantedCount } = body;
    
    console.log('Creating trade listing:', {
      userId: user.id,
      title,
      category,
      location,
      itemsToTradeCount: itemsToTrade?.length || itemsToTradeCount || 0,
      itemsWantedCount: itemsWanted?.length || itemsWantedCount || 0,
      imageIds: imageIds || []
    });

    // Validate required fields
    if (!title?.trim() || !category?.trim() || !location?.trim()) {
      throw new APIError('Missing required fields: title, category, location', 400, 'MISSING_REQUIRED_FIELDS');
    }

    // Validate items count (either from arrays or explicit counts)
    const finalItemsToTradeCount = itemsToTrade?.length || parseInt(itemsToTradeCount) || 0;
    const finalItemsWantedCount = itemsWanted?.length || parseInt(itemsWantedCount) || 0;

    if (!finalItemsToTradeCount || !finalItemsWantedCount) {
      throw new APIError('Items to trade and items wanted counts are required', 400, 'VALIDATION_ERROR');
    }

    // Use database transaction for data consistency
    const result = await knex.transaction(async (trx) => {
      // Generate unique slug
      const baseSlug = generateSlug(title);
      let slug = baseSlug;
      let counter = 1;
      
      while (await trx('trade_listings').where('slug', slug).first()) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create trade listing
      const listingData = {
        user_id: user.id,
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        description: description?.trim() || title.trim(),
        slug,
        items_to_trade_count: finalItemsToTradeCount,
        items_wanted_count: finalItemsWantedCount,
        status: 'active',
        views: 0
      };

      const [listing] = await trx('trade_listings')
        .insert(listingData)
        .returning(['id', 'slug']);
      
      console.log('Trade listing created:', listing);

      // Create trade items (items user has/offering)
      if (itemsToTrade && itemsToTrade.length > 0) {
        const tradeItemsData = itemsToTrade
          .filter(item => item.name?.trim()) // Only include items with names
          .map(item => ({
            listing_id: listing.id,
            type: 'offering',
            name: item.name.trim(),
            category: item.category?.trim() || category,
            description: item.description?.trim()
          }));
        
        if (tradeItemsData.length > 0) {
          await trx('trade_items').insert(tradeItemsData);
          console.log('Trade items (offering) created:', tradeItemsData.length);
        }
      }
      
      // Create wanted items
      if (itemsWanted && itemsWanted.length > 0) {
        const wantedItemsData = itemsWanted
          .filter(item => item.category?.trim() || item.description?.trim()) // Must have category or description
          .map(item => ({
            listing_id: listing.id,
            type: 'wanting',
            name: null,
            category: item.category?.trim(),
            description: item.description?.trim()
          }));
        
        if (wantedItemsData.length > 0) {
          await trx('trade_items').insert(wantedItemsData);
          console.log('Trade items (wanting) created:', wantedItemsData.length);
        }
      }

      // Link uploaded images to the listing
      if (imageIds && imageIds.length > 0) {
        // Verify images exist and belong to the user
        const existingImages = await trx('images')
          .whereIn('id', imageIds)
          .where('user_id', user.id)
          .whereNull('listing_id'); // Only unlinked images
        
        if (existingImages.length > 0) {
          const validImageIds = existingImages.map(img => img.id);
          
          await trx('images')
            .whereIn('id', validImageIds)
            .update({ 
              listing_id: listing.id,
              updated_at: new Date()
            });
          
          console.log('Images linked to listing:', validImageIds);
        } else {
          console.warn('No valid images found to link');
        }
      }

      return listing;
    });

    console.log('Trade listing created successfully:', result.id);

    // ✅ FIXED: Use separate queries instead of complex LEFT JOIN
    console.log('Fetching complete listing data with separate queries...');

    // Get the base listing with user info
    const baseListing = await knex('trade_listings')
      .select('trade_listings.*', 'users.username as seller_name')
      .join('users', 'trade_listings.user_id', 'users.id')
      .where('trade_listings.id', result.id)
      .first();

    // Get trade items separately
    const items = await knex('trade_items')
      .select('id', 'type', 'name', 'category', 'description')
      .where('listing_id', result.id);

    // Get images separately  
    const images = await knex('images')
      .select('id', 'filename', 'original_name', 'url', 'file_path', 'mime_type')
      .where('listing_id', result.id);

    // Combine everything
    const completeListingQuery = {
      ...baseListing,
      items: items || [],
      images: images || []
    };

    console.log('Complete listing data fetched:', {
      listingId: result.id,
      itemsCount: items.length,
      imagesCount: images.length
    });

    return NextResponse.json({
      success: true,
      message: 'Trade listing created successfully',
      data: completeListingQuery
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating trade listing:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        code: error.code
      }, { status: error.statusCode });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
});
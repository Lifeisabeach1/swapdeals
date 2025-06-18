// src/app/api/traderoom/[tradeId]/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import jwt from 'jsonwebtoken';

// Helper function to safely parse JSON or return default
const safeJsonParse = (jsonString, defaultValue = []) => {
  if (!jsonString) return defaultValue;
  
  // If it's already an object/array, return it
  if (typeof jsonString === 'object') {
    return Array.isArray(jsonString) ? jsonString : defaultValue;
  }
  
  // If it's a string, try to parse it
  if (typeof jsonString === 'string') {
    // Check for invalid JSON strings like "[object Object]"
    if (jsonString.includes('[object Object]') || jsonString === '[object Object]') {
      console.warn('Invalid JSON string detected:', jsonString);
      return defaultValue;
    }
    
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch (e) {
      console.error('Error parsing JSON:', e.message, 'String:', jsonString);
      return defaultValue;
    }
  }
  
  return defaultValue;
};

export async function GET(request, { params }) {
  try {
    // Await params before destructuring (Next.js 15 requirement)
    const { tradeId } = await params;
    
    // Get auth token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization token required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Verify token and get user
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }

    const userId = decoded.id;

    // Special case: Handle my-trades endpoint
    if (tradeId === 'my-trades') {
      // Query to get all trades where user is either buyer or seller with complete listing data
      const trades = await knex('trades')
        .select([
          'trades.*',
          'buyer.username as buyer_username',
          'buyer.first_name as buyer_first_name',
          'buyer.last_name as buyer_last_name',
          'buyer.avatar_url as buyer_avatar_url',
          'seller.username as seller_username',
          'seller.first_name as seller_first_name',
          'seller.last_name as seller_last_name',
          'seller.avatar_url as seller_avatar_url',
          // Complete listing information
          'trade_listings.title as listing_title',
          'trade_listings.description as listing_description',
          'trade_listings.category as listing_category',
          'trade_listings.location as listing_location',
          'trade_listings.views as listing_views',
          'trade_listings.slug as listing_slug',
          // Aggregated listing images
          knex.raw(`
            COALESCE(
              json_agg(
                CASE 
                  WHEN images.id IS NOT NULL 
                  THEN jsonb_build_object(
                    'id', images.id,
                    'filename', images.filename,
                    'original_name', images.original_name,
                    'url', images.url,
                    'file_path', images.file_path,
                    'mime_type', images.mime_type
                  )
                  ELSE NULL
                END
              ) FILTER (WHERE images.id IS NOT NULL),
              '[]'::json
            ) as listing_images
          `),
          // Aggregated listing items
          knex.raw(`
            COALESCE(
              json_agg(
                CASE 
                  WHEN trade_items.id IS NOT NULL 
                  THEN jsonb_build_object(
                    'id', trade_items.id,
                    'type', trade_items.type,
                    'name', trade_items.name,
                    'category', trade_items.category,
                    'description', trade_items.description
                  )
                  ELSE NULL
                END
              ) FILTER (WHERE trade_items.id IS NOT NULL),
              '[]'::json
            ) as listing_items
          `)
        ])
        .leftJoin('users as buyer', 'trades.buyer_id', 'buyer.id')
        .leftJoin('users as seller', 'trades.seller_id', 'seller.id')
        .leftJoin('trade_listings', 'trades.listing_id', 'trade_listings.id')
        .leftJoin('images', 'trade_listings.id', 'images.listing_id')
        .leftJoin('trade_items', 'trade_listings.id', 'trade_items.listing_id')
        .where(function() {
          this.where('trades.buyer_id', userId).orWhere('trades.seller_id', userId);
        })
        .groupBy([
          'trades.id', 
          'buyer.id', 
          'seller.id', 
          'trade_listings.id'
        ])
        .orderBy('trades.created_at', 'desc');

      // Format the trades data with complete listing information
      const formattedTrades = trades.map(trade => {
        const buyerName = `${trade.buyer_first_name || ''} ${trade.buyer_last_name || ''}`.trim() || trade.buyer_username;
        const sellerName = `${trade.seller_first_name || ''} ${trade.seller_last_name || ''}`.trim() || trade.seller_username;

        // Process listing items
        const listingItems = Array.isArray(trade.listing_items) ? trade.listing_items : [];
        const itemsOffering = listingItems.filter(item => item.type === 'offering');
        const itemsWanting = listingItems.filter(item => item.type === 'wanting');

        // Safely parse offer images
        const offerImages = safeJsonParse(trade.offer_images, []);

        // Combine listing and offer images for complete image transfer
        const listingImages = Array.isArray(trade.listing_images) ? trade.listing_images : [];
        const allImages = [...listingImages, ...offerImages];

        return {
          id: trade.id,
          offer_id: trade.offer_id,
          listing_id: trade.listing_id,
          buyer_id: trade.buyer_id,
          seller_id: trade.seller_id,
          status: trade.status,
          offer_message: trade.offer_message,
          offer_images: offerImages,
          offer_amount: trade.offer_amount,
          meeting_location: trade.meeting_location,
          proposed_meeting_time: trade.proposed_meeting_time,
          actual_meeting_time: trade.actual_meeting_time,
          trade_notes: trade.trade_notes,
          seller_response: trade.seller_response,
          buyer_notes: trade.buyer_notes,
          buyer_rating: trade.buyer_rating,
          buyer_review: trade.buyer_review,
          buyer_rated_at: trade.buyer_rated_at,
          seller_rating: trade.seller_rating,
          seller_review: trade.seller_review,
          seller_rated_at: trade.seller_rated_at,
          created_at: trade.created_at,
          accepted_at: trade.accepted_at,
          started_at: trade.started_at,
          completed_at: trade.completed_at,
          cancelled_at: trade.cancelled_at,
          disputed_at: trade.disputed_at,
          cancellation_reason: trade.cancellation_reason,
          cancelled_by: trade.cancelled_by,
          dispute_reason: trade.dispute_reason,
          disputed_by: trade.disputed_by,
          updated_at: trade.updated_at,
          // Complete listing information
          listing_title: trade.listing_title,
          listing_description: trade.listing_description,
          listing_category: trade.listing_category,
          listing_location: trade.listing_location,
          listing_views: trade.listing_views,
          listing_slug: trade.listing_slug,
          listing_images: listingImages,
          listing_items: listingItems,
          listing_items_offering: itemsOffering,
          listing_items_wanting: itemsWanting,
          // Combined images for transfer (listing + offer images)
          images: allImages,
          all_images: allImages,
          // Legacy support
          items: listingItems,
          itemsOffering: itemsOffering,
          itemsWanting: itemsWanting,
          views: trade.listing_views,
          buyer: {
            username: trade.buyer_username,
            name: buyerName,
            first_name: trade.buyer_first_name,
            last_name: trade.buyer_last_name,
            avatar_url: trade.buyer_avatar_url
          },
          seller: {
            username: trade.seller_username,
            name: sellerName,
            first_name: trade.seller_first_name,
            last_name: trade.seller_last_name,
            avatar_url: trade.seller_avatar_url
          },
          listing: {
            title: trade.listing_title,
            description: trade.listing_description,
            category: trade.listing_category,
            location: trade.listing_location,
            views: trade.listing_views,
            slug: trade.listing_slug
          }
        };
      });

      return NextResponse.json({
        success: true,
        data: formattedTrades
      });
    }

    // Regular trade fetching logic for specific trade IDs with complete listing data
    const trade = await knex('trades')
      .select([
        'trades.*',
        'buyer.username as buyer_username',
        'buyer.first_name as buyer_first_name',
        'buyer.last_name as buyer_last_name',
        'buyer.avatar_url as buyer_avatar_url',
        'seller.username as seller_username',
        'seller.first_name as seller_first_name',
        'seller.last_name as seller_last_name',
        'seller.avatar_url as seller_avatar_url',
        // Complete listing information
        'trade_listings.title as listing_title',
        'trade_listings.description as listing_description',
        'trade_listings.category as listing_category',
        'trade_listings.location as listing_location',
        'trade_listings.views as listing_views',
        'trade_listings.slug as listing_slug',
        // Aggregated listing images
        knex.raw(`
          COALESCE(
            json_agg(
              CASE 
                WHEN images.id IS NOT NULL 
                THEN jsonb_build_object(
                  'id', images.id,
                  'filename', images.filename,
                  'original_name', images.original_name,
                  'url', images.url,
                  'file_path', images.file_path,
                  'mime_type', images.mime_type
                )
                ELSE NULL
              END
            ) FILTER (WHERE images.id IS NOT NULL),
            '[]'::json
          ) as listing_images
        `),
        // Aggregated listing items
        knex.raw(`
          COALESCE(
            json_agg(
              CASE 
                WHEN trade_items.id IS NOT NULL 
                THEN jsonb_build_object(
                  'id', trade_items.id,
                  'type', trade_items.type,
                  'name', trade_items.name,
                  'category', trade_items.category,
                  'description', trade_items.description
                )
                ELSE NULL
              END
            ) FILTER (WHERE trade_items.id IS NOT NULL),
            '[]'::json
          ) as listing_items
        `)
      ])
      .leftJoin('users as buyer', 'trades.buyer_id', 'buyer.id')
      .leftJoin('users as seller', 'trades.seller_id', 'seller.id')
      .leftJoin('trade_listings', 'trades.listing_id', 'trade_listings.id')
      .leftJoin('images', 'trade_listings.id', 'images.listing_id')
      .leftJoin('trade_items', 'trade_listings.id', 'trade_items.listing_id')
      .where('trades.id', tradeId)
      .groupBy([
        'trades.id', 
        'buyer.id', 
        'seller.id', 
        'trade_listings.id'
      ])
      .first();

    if (!trade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Trade not found' 
      }, { status: 404 });
    }

    // Verify that the authenticated user is either the buyer or seller
    if (userId !== trade.buyer_id && userId !== trade.seller_id) {
      return NextResponse.json({
        success: false,
        message: 'You are not authorized to view this trade'
      }, { status: 403 });
    }

    // Format names properly
    const buyerName = `${trade.buyer_first_name || ''} ${trade.buyer_last_name || ''}`.trim() || trade.buyer_username;
    const sellerName = `${trade.seller_first_name || ''} ${trade.seller_last_name || ''}`.trim() || trade.seller_username;

    // Process listing items
    const listingItems = Array.isArray(trade.listing_items) ? trade.listing_items : [];
    const itemsOffering = listingItems.filter(item => item.type === 'offering');
    const itemsWanting = listingItems.filter(item => item.type === 'wanting');

    // Safely parse offer images
    const offerImages = safeJsonParse(trade.offer_images, []);

    // Combine listing and offer images for complete image transfer
    const listingImages = Array.isArray(trade.listing_images) ? trade.listing_images : [];
    const allImages = [...listingImages, ...offerImages];

    // Return enhanced data structure with complete listing information and image transfer
    return NextResponse.json({
      success: true,
      data: {
        id: trade.id,
        offer_id: trade.offer_id,
        listing_id: trade.listing_id,
        buyer_id: trade.buyer_id,
        seller_id: trade.seller_id,
        status: trade.status,
        offer_message: trade.offer_message,
        offer_images: offerImages,
        offer_amount: trade.offer_amount,
        meeting_location: trade.meeting_location,
        proposed_meeting_time: trade.proposed_meeting_time,
        actual_meeting_time: trade.actual_meeting_time,
        trade_notes: trade.trade_notes,
        seller_response: trade.seller_response,
        buyer_notes: trade.buyer_notes,
        buyer_rating: trade.buyer_rating,
        buyer_review: trade.buyer_review,
        buyer_rated_at: trade.buyer_rated_at,
        seller_rating: trade.seller_rating,
        seller_review: trade.seller_review,
        seller_rated_at: trade.seller_rated_at,
        created_at: trade.created_at,
        accepted_at: trade.accepted_at,
        started_at: trade.started_at,
        completed_at: trade.completed_at,
        cancelled_at: trade.cancelled_at,
        disputed_at: trade.disputed_at,
        cancellation_reason: trade.cancellation_reason,
        cancelled_by: trade.cancelled_by,
        dispute_reason: trade.dispute_reason,
        disputed_by: trade.disputed_by,
        updated_at: trade.updated_at,
        // Complete listing information
        listing_title: trade.listing_title,
        listing_description: trade.listing_description,
        listing_category: trade.listing_category,
        listing_location: trade.listing_location,
        listing_views: trade.listing_views,
        listing_slug: trade.listing_slug,
        listing_images: listingImages,
        listing_items: listingItems,
        listing_items_offering: itemsOffering,
        listing_items_wanting: itemsWanting,
        // Combined images for transfer (listing + offer images)
        images: allImages,
        all_images: allImages,
        // Legacy support
        items: listingItems,
        itemsOffering: itemsOffering,
        itemsWanting: itemsWanting,
        views: trade.listing_views,
        buyer: {
          username: trade.buyer_username,
          name: buyerName,
          first_name: trade.buyer_first_name,
          last_name: trade.buyer_last_name,
          avatar_url: trade.buyer_avatar_url
        },
        seller: {
          username: trade.seller_username,
          name: sellerName,
          first_name: trade.seller_first_name,
          last_name: trade.seller_last_name,
          avatar_url: trade.seller_avatar_url
        },
        listing: {
          title: trade.listing_title,
          description: trade.listing_description,
          category: trade.listing_category,
          location: trade.listing_location,
          views: trade.listing_views,
          slug: trade.listing_slug
        }
      }
    });

  } catch (error) {
    console.error('Error fetching trade:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trade',
      error: error.message
    }, { status: 500 });
  }
}

// PATCH endpoint for updating trade status and handling image transfers
export async function PATCH(request, { params }) {
  try {
    // Await params before destructuring (Next.js 15 requirement)
    const { tradeId } = await params;
    const body = await request.json();
    
    // Get auth token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization token required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Verify token and get user
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }

    const userId = decoded.id;

    // Get the trade to verify permissions
    const trade = await knex('trades')
      .select('seller_id', 'buyer_id', 'status', 'offer_images')
      .where('id', tradeId)
      .first();

    if (!trade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Trade not found' 
      }, { status: 404 });
    }

    // Verify that the authenticated user is part of this trade
    if (userId !== trade.buyer_id && userId !== trade.seller_id) {
      return NextResponse.json({
        success: false,
        message: 'You are not authorized to update this trade'
      }, { status: 403 });
    }

    // Prepare update data
    const updateData = {
      updated_at: knex.fn.now()
    };

    // Handle status updates
    if (body.status) {
      updateData.status = body.status;
      
      if (body.status === 'completed') {
        updateData.completed_at = knex.fn.now();
      } else if (body.status === 'cancelled') {
        updateData.cancelled_at = knex.fn.now();
      } else if (body.status === 'accepted') {
        updateData.accepted_at = knex.fn.now();
      } else if (body.status === 'started') {
        updateData.started_at = knex.fn.now();
      } else if (body.status === 'disputed') {
        updateData.disputed_at = knex.fn.now();
      }
    }

    // Handle image transfer updates
    if (body.offer_images !== undefined) {
      // Ensure we're storing valid JSON
      if (Array.isArray(body.offer_images)) {
        updateData.offer_images = JSON.stringify(body.offer_images);
      } else if (typeof body.offer_images === 'string') {
        // Validate that it's valid JSON before storing
        try {
          JSON.parse(body.offer_images);
          updateData.offer_images = body.offer_images;
        } catch (e) {
          console.error('Invalid JSON provided for offer_images:', body.offer_images);
          updateData.offer_images = JSON.stringify([]);
        }
      } else {
        updateData.offer_images = JSON.stringify([]);
      }
    }

    // Handle other trade updates
    if (body.meeting_location !== undefined) {
      updateData.meeting_location = body.meeting_location;
    }

    if (body.proposed_meeting_time !== undefined) {
      updateData.proposed_meeting_time = body.proposed_meeting_time;
    }

    if (body.actual_meeting_time !== undefined) {
      updateData.actual_meeting_time = body.actual_meeting_time;
    }

    if (body.trade_notes !== undefined) {
      updateData.trade_notes = body.trade_notes;
    }

    if (body.seller_response !== undefined) {
      updateData.seller_response = body.seller_response;
    }

    if (body.buyer_notes !== undefined) {
      updateData.buyer_notes = body.buyer_notes;
    }

    if (body.cancellation_reason !== undefined) {
      updateData.cancellation_reason = body.cancellation_reason;
      updateData.cancelled_by = userId;
    }

    if (body.dispute_reason !== undefined) {
      updateData.dispute_reason = body.dispute_reason;
      updateData.disputed_by = userId;
    }

    // Handle ratings and reviews
    if (body.buyer_rating !== undefined) {
      updateData.buyer_rating = body.buyer_rating;
      updateData.buyer_rated_at = knex.fn.now();
    }

    if (body.buyer_review !== undefined) {
      updateData.buyer_review = body.buyer_review;
    }

    if (body.seller_rating !== undefined) {
      updateData.seller_rating = body.seller_rating;
      updateData.seller_rated_at = knex.fn.now();
    }

    if (body.seller_review !== undefined) {
      updateData.seller_review = body.seller_review;
    }

    // Update the trade
    await knex('trades')
      .where('id', tradeId)
      .update(updateData);

    // Return success response with updated data
    return NextResponse.json({
      success: true,
      message: 'Trade updated successfully',
      data: {
        tradeId: tradeId,
        updatedFields: Object.keys(updateData),
        status: body.status || trade.status
      }
    });

  } catch (error) {
    console.error('Error updating trade:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update trade',
      error: error.message
    }, { status: 500 });
  }
}
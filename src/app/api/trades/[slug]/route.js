// src/app/api/trades/[slug]/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import jwt from 'jsonwebtoken';

export async function GET(request, { params }) {
  try {
    // Await params before destructuring - Next.js 15 requirement
    const { slug } = await params;
    
    console.log('Fetching trade with slug:', slug);
    
    // Get trade with seller info, items, and images
    const trade = await knex('trade_listings')
      .select([
        'trade_listings.*',
        // Seller information
        'users.username as seller_name',
        'users.email as seller_email', 
        'users.phone as seller_phone',
        'users.bio as seller_bio',
        'users.location as seller_location',
        'users.created_at as seller_joined_date',
        'users.avatar_url as seller_avatar',
        // Items aggregation
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
          ) as items
        `),
        // Images aggregation
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
          ) as images
        `)
      ])
      .leftJoin('trade_items', 'trade_listings.id', 'trade_items.listing_id')
      .leftJoin('images', 'trade_listings.id', 'images.listing_id')
      .join('users', 'trade_listings.user_id', 'users.id')
      .where('trade_listings.slug', slug)
      .where('trade_listings.status', 'active')
      .groupBy(['trade_listings.id', 'users.id'])
      .first();

    if (!trade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Trade listing not found' 
      }, { status: 404 });
    }

    // Process trade data to organize seller info
    const {
      seller_name,
      seller_email,
      seller_phone,
      seller_bio,
      seller_location,
      seller_joined_date,
      seller_avatar,
      ...tradeData
    } = trade;

    const processedTrade = {
      ...tradeData,
      seller: {
        id: trade.user_id,
        name: seller_name,
        email: seller_email,
        phone: seller_phone,
        bio: seller_bio,
        location: seller_location,
        joinedDate: seller_joined_date,
        avatar: seller_avatar
      },
      // Add computed properties
      imageCount: Array.isArray(trade.images) ? trade.images.length : 0,
      primaryImage: Array.isArray(trade.images) && trade.images.length > 0 
        ? trade.images[0] 
        : null,
      itemsOffering: Array.isArray(trade.items) 
        ? trade.items.filter(item => item.type === 'offering')
        : [],
      itemsWanting: Array.isArray(trade.items) 
        ? trade.items.filter(item => item.type === 'wanting')
        : []
    };

    return NextResponse.json({
      success: true,
      data: processedTrade
    });

  } catch (error) {
    console.error('Error fetching individual trade:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}

// PATCH handler for updating trade listings
export async function PATCH(request, { params }) {
  try {
    // Await params before destructuring - Next.js 15 requirement
    const { slug } = await params;
    const body = await request.json();
    
    console.log('Updating trade with slug:', slug, 'Data:', body);
    
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

    // Find the listing by slug first to get the ID
    const listing = await knex('trade_listings')
      .select('id', 'user_id', 'title', 'status')
      .where('slug', slug)
      .first();

    if (!listing) {
      return NextResponse.json({
        success: false,
        message: 'Listing not found'
      }, { status: 404 });
    }

    // Verify that the current user owns this listing
    if (listing.user_id !== decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'You can only update your own listings'
      }, { status: 403 });
    }

    // Use database transaction for consistency when updating items
    const result = await knex.transaction(async (trx) => {
      // Prepare update data for main listing - expand allowed fields
      const allowedFields = ['status', 'title', 'description', 'category', 'location'];
      const updateData = {};
      
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field];
        }
      }

      // Always update the updated_at timestamp
      updateData.updated_at = knex.fn.now();

      if (Object.keys(updateData).length > 1) { // More than just updated_at
        // Update the main listing
        await trx('trade_listings')
          .where('id', listing.id)
          .update(updateData);
      }

      // Handle items offering updates
      if (body.itemsOffering !== undefined) {
        // Remove existing offering items
        await trx('trade_items')
          .where('listing_id', listing.id)
          .where('type', 'offering')
          .del();

        // Add new offering items
        if (body.itemsOffering && body.itemsOffering.length > 0) {
          const offeringItems = body.itemsOffering
            .filter(item => {
              const itemName = typeof item === 'string' ? item : item.name;
              return itemName && itemName.trim();
            })
            .map(item => {
              const itemName = typeof item === 'string' ? item : item.name;
              const itemCategory = typeof item === 'object' ? item.category : body.category;
              const itemDescription = typeof item === 'object' ? item.description : null;
              
              return {
                listing_id: listing.id,
                type: 'offering',
                name: itemName.trim(),
                category: itemCategory || body.category || 'Other',
                description: itemDescription
              };
            });

          if (offeringItems.length > 0) {
            await trx('trade_items').insert(offeringItems);
          }
        }
      }

      // Handle items wanting updates
      if (body.itemsWanting !== undefined) {
        // Remove existing wanting items
        await trx('trade_items')
          .where('listing_id', listing.id)
          .where('type', 'wanting')
          .del();

        // Add new wanting items
        if (body.itemsWanting && body.itemsWanting.length > 0) {
          const wantingItems = body.itemsWanting
            .filter(item => {
              const itemName = typeof item === 'string' ? item : item.name;
              return itemName && itemName.trim();
            })
            .map(item => {
              const itemName = typeof item === 'string' ? item : item.name;
              const itemCategory = typeof item === 'object' ? item.category : body.category;
              const itemDescription = typeof item === 'object' ? item.description : null;
              
              return {
                listing_id: listing.id,
                type: 'wanting',
                name: itemName.trim(),
                category: itemCategory || body.category || 'Other',
                description: itemDescription
              };
            });

          if (wantingItems.length > 0) {
            await trx('trade_items').insert(wantingItems);
          }
        }
      }

      return listing.id;
    });

    // Get the updated listing with all related data
    const updatedListing = await knex('trade_listings')
      .select([
        'trade_listings.*',
        'users.username as seller_name',
        // Items aggregation
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
          ) as items
        `),
        // Images aggregation
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
          ) as images
        `)
      ])
      .leftJoin('trade_items', 'trade_listings.id', 'trade_items.listing_id')
      .leftJoin('images', 'trade_listings.id', 'images.listing_id')
      .join('users', 'trade_listings.user_id', 'users.id')
      .where('trade_listings.id', listing.id)
      .groupBy(['trade_listings.id', 'users.id'])
      .first();

    // Process the response to include computed fields
    const {
      seller_name,
      ...listingData
    } = updatedListing;

    const processedListing = {
      ...listingData,
      seller: {
        name: seller_name
      },
      itemsOffering: Array.isArray(updatedListing.items) 
        ? updatedListing.items.filter(item => item.type === 'offering')
        : [],
      itemsWanting: Array.isArray(updatedListing.items) 
        ? updatedListing.items.filter(item => item.type === 'wanting')
        : []
    };

    return NextResponse.json({
      success: true,
      message: 'Listing updated successfully',
      data: processedListing
    });

  } catch (error) {
    console.error('Error updating trade listing:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update listing',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE handler for deleting trade listings
export async function DELETE(request, { params }) {
  try {
    // Await params before destructuring - Next.js 15 requirement
    const { slug } = await params;
    
    console.log('Deleting trade with slug:', slug);
    
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

    // Find the listing by slug first to get the ID
    const listing = await knex('trade_listings')
      .select('id', 'user_id', 'title', 'slug')
      .where('slug', slug)
      .first();

    if (!listing) {
      return NextResponse.json({
        success: false,
        message: 'Listing not found'
      }, { status: 404 });
    }

    // Verify that the current user owns this listing
    if (listing.user_id !== decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'You can only delete your own listings'
      }, { status: 403 });
    }

    // Use database transaction for consistency when deleting
    await knex.transaction(async (trx) => {
      // Delete related trade items first
      await trx('trade_items')
        .where('listing_id', listing.id)
        .del();

      // Update images to unlink them from the listing (don't delete the files)
      await trx('images')
        .where('listing_id', listing.id)
        .update({ 
          listing_id: null,
          updated_at: knex.fn.now()
        });

      // Delete any trade offers related to this listing
      await trx('trade_offers')
        .where('listing_id', listing.id)
        .del();

      // Finally, delete the main listing
      await trx('trade_listings')
        .where('id', listing.id)
        .del();
    });

    console.log('Trade listing deleted successfully:', listing.id);

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully',
      data: {
        id: listing.id,
        title: listing.title,
        slug: listing.slug
      }
    });

  } catch (error) {
    console.error('Error deleting trade listing:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete listing',
      error: error.message 
    }, { status: 500 });
  }
}
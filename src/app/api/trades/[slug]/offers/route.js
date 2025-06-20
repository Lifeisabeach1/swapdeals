// src/app/api/trades/[slug]/offers/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Use default export

export async function GET(request, { params }) {
  try {
    const { slug } = await params; // Await params before destructuring
    
    console.log('Fetching offers for listing:', slug);
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Listing ID is required'
      }, { status: 400 });
    }

    // Use proper Knex syntax - REMOVED 'users.name' since it doesn't exist
    const offers = await db('trade_offers')
      .select(
        'trade_offers.id',
        'trade_offers.message',
        'trade_offers.images',
        'trade_offers.created_at',
        'trade_offers.status',
        'trade_offers.listing_id',
        'users.id as user_id',
        'users.username',
        'users.first_name',
        'users.last_name',
        'users.avatar_url'
      )
      .leftJoin('users', 'trade_offers.user_id', 'users.id')
      .where('trade_offers.listing_id', parseInt(slug))
      .orderBy('trade_offers.created_at', 'desc');

    // Format the response data
    const formattedOffers = offers.map(offer => ({
      id: offer.id,
      message: offer.message,
      images: offer.images,
      timestamp: offer.created_at,
      status: offer.status,
      user: {
        id: offer.user_id,
        name: offer.username || `${offer.first_name || ''} ${offer.last_name || ''}`.trim() || 'Anonymous',
        avatar: offer.avatar_url
      }
    }));

    return NextResponse.json({
      success: true,
      data: formattedOffers
    });

  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to load offers',
      error: error.message
    }, { status: 500 });
  }
}

// POST handler for creating new offers
export async function POST(request, { params }) {
  try {
    const { slug } = await params; // Await params before destructuring
    const body = await request.json();
    
    console.log('Creating offer for listing:', slug);
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Listing ID is required'
      }, { status: 400 });
    }

    // Validate required fields
    const { message, user_id } = body;
    if (!message || !user_id) {
      return NextResponse.json({
        success: false,
        message: 'Message and user ID are required'
      }, { status: 400 });
    }

    // Check if listing exists
    const listing = await db('trade_listings')
      .select('id', 'user_id')
      .where('id', parseInt(slug))
      .first();

    if (!listing) {
      return NextResponse.json({
        success: false,
        message: 'Listing not found'
      }, { status: 404 });
    }

    // Prevent users from making offers on their own listings
    if (listing.user_id === parseInt(user_id)) {
      return NextResponse.json({
        success: false,
        message: 'Cannot make an offer on your own listing'
      }, { status: 400 });
    }

    // Handle images data - ensure it's properly formatted JSON
    let imagesData = null;
    if (body.images) {
      if (typeof body.images === 'string') {
        try {
          // Validate that it's valid JSON
          JSON.parse(body.images);
          imagesData = body.images;
        } catch (e) {
          // If it's not valid JSON, stringify it
          imagesData = JSON.stringify(body.images);
        }
      } else if (Array.isArray(body.images) || typeof body.images === 'object') {
        // If it's an array or object, stringify it
        imagesData = JSON.stringify(body.images);
      }
    }

    // Create the offer
    const [newOffer] = await db('trade_offers')
      .insert({
        listing_id: parseInt(slug),
        user_id: parseInt(user_id),
        message: message,
        images: imagesData,
        status: 'pending',
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');

    return NextResponse.json({
      success: true,
      message: 'Offer created successfully',
      data: newOffer
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create offer',
      error: error.message
    }, { status: 500 });
  }
}
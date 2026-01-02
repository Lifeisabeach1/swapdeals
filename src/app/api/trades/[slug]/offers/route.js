// src/app/api/trades/[slug]/offers/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withAuth, APIError } from '@/lib/middleware/auth.js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    console.log('Fetching offers for listing:', slug);
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Listing ID is required'
      }, { status: 400 });
    }

    // First, get the listing to verify it exists and get the listing ID
    let listingId;
    if (isNaN(slug)) {
      const { data: listing, error: listingError } = await supabase
        .from('trade_listings')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (listingError || !listing) {
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
      .select(`
        id,
        listing_id,
        user_id,
        message,
        images,
        status,
        accepted_at,
        rejected_at,
        withdrawn_at,
        rejection_reason,
        created_at,
        updated_at
      `)
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (offersError) {
      console.error('Error fetching offers:', offersError);
      return NextResponse.json({
        success: false,
        message: 'Failed to load offers',
        error: offersError.message
      }, { status: 500 });
    }

    // Get unique user IDs from offers
    const userIds = [...new Set((offers || []).map(offer => offer.user_id))];
    
    // Fetch user information separately
    let users = [];
    if (userIds.length > 0) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, avatar_url')
        .in('id', userIds);
      
      if (userError) {
        console.error('Error fetching user data:', userError);
      } else {
        users = userData || [];
      }
    }

    // Create a lookup map for users
    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = user;
    });

    // Format offers with parsed images
    const formattedOffers = (offers || []).map(offer => {
      const user = userMap[offer.user_id];
      
      // Parse images if they're stored as JSON string
      let parsedImages = offer.images;
      if (typeof offer.images === 'string' && offer.images) {
        try {
          parsedImages = JSON.parse(offer.images);
        } catch (e) {
          console.error('Error parsing images JSON:', e);
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
      message: 'Failed to load offers',
      error: error.message
    }, { status: 500 });
  }
}

// POST handler - FIXED to use request.user instead of request.auth.user
export const POST = withAuth(async (request, context) => {
  try {
    const { params } = context;
    const { slug } = await params;
    const body = await request.json();
    
    // CHANGED: Get user from request.user (set by withAuth middleware)
    const user = request.user;
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 });
    }
    
    console.log('Creating offer for listing:', slug, 'by user:', user.id);
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Listing ID is required'
      }, { status: 400 });
    }

    // Validate required fields
    const { message } = body;
    if (!message?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Message is required'
      }, { status: 400 });
    }

    // Get the listing
    let listingId;
    let listing;
    
    if (isNaN(slug)) {
      const { data: listingData, error: listingError } = await supabase
        .from('trade_listings')
        .select('id, user_id, status')
        .eq('slug', slug)
        .single();
      
      if (listingError || !listingData) {
        return NextResponse.json({
          success: false,
          message: 'Listing not found'
        }, { status: 404 });
      }
      
      listing = listingData;
      listingId = listingData.id;
    } else {
      listingId = parseInt(slug);
      
      const { data: listingData, error: listingError } = await supabase
        .from('trade_listings')
        .select('id, user_id, status')
        .eq('id', listingId)
        .single();
      
      if (listingError || !listingData) {
        return NextResponse.json({
          success: false,
          message: 'Listing not found'
        }, { status: 404 });
      }
      
      listing = listingData;
    }

    // Prevent users from making offers on their own listings
    if (listing.user_id === user.id) {
      return NextResponse.json({
        success: false,
        message: 'Cannot make an offer on your own listing'
      }, { status: 400 });
    }

    // Check if listing is active
    if (listing.status !== 'active') {
      return NextResponse.json({
        success: false,
        message: 'Cannot make offers on inactive listings'
      }, { status: 400 });
    }

    // Handle images data
    let imagesData = null;
    if (body.images) {
      if (typeof body.images === 'string') {
        try {
          JSON.parse(body.images);
          imagesData = body.images;
        } catch (e) {
          imagesData = JSON.stringify(body.images);
        }
      } else if (Array.isArray(body.images) || typeof body.images === 'object') {
        imagesData = JSON.stringify(body.images);
      }
    }

    // Create the offer
    const { data: newOffer, error: createError } = await supabase
      .from('trade_offers')
      .insert({
        listing_id: listingId,
        user_id: user.id,
        message: message.trim(),
        images: imagesData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        id,
        listing_id,
        user_id,
        message,
        images,
        status,
        accepted_at,
        rejected_at,
        withdrawn_at,
        rejection_reason,
        created_at,
        updated_at
      `)
      .single();

    if (createError) {
      console.error('Error creating offer:', createError);
      return NextResponse.json({
        success: false,
        message: 'Failed to create offer',
        error: createError.message
      }, { status: 500 });
    }

    // Get user information
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, first_name, last_name, avatar_url')
      .eq('id', user.id)
      .single();

    // Parse images for response
    let parsedImages = newOffer.images;
    if (typeof newOffer.images === 'string' && newOffer.images) {
      try {
        parsedImages = JSON.parse(newOffer.images);
      } catch (e) {
        parsedImages = [];
      }
    } else if (!newOffer.images) {
      parsedImages = [];
    }

    const formattedOffer = {
      id: newOffer.id,
      message: newOffer.message,
      images: parsedImages,
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
      message: 'Failed to create offer',
      error: error.message
    }, { status: 500 });
  }
});
// app/api/trades/[slug]/offers/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers'; // ← LÄGG TILL
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
    
    // ← FIX: Verify auth med headers()
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
// src/app/api/trades/[slug]/offers/[offerId]/accept/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers'; // ← LÄGG TILL DENNA
import { verifyToken } from '@/lib/auth/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request, { params }) {
  try {
    const { slug, offerId } = await params;
    
    if (!slug || !offerId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Listing slug and Offer ID are required' 
      }, { status: 400 });
    }

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

    // Get listing
    const { data: listing, error: listingError } = await supabase
      .from('trade_listings')
      .select('id, user_id, title, status')
      .eq('slug', slug)
      .single();

    if (listingError || !listing) {
      console.error('Listing error:', listingError);
      return NextResponse.json({
        success: false,
        message: 'Listing not found',
        error: listingError?.message
      }, { status: 404 });
    }

    // Verify ownership
    if (listing.user_id !== decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'You can only accept offers on your own listings'
      }, { status: 403 });
    }

    // Check listing status
    if (listing.status !== 'active') {
      return NextResponse.json({
        success: false,
        message: 'This listing is no longer active'
      }, { status: 400 });
    }

    // Get offer
    const { data: offer, error: offerError } = await supabase
      .from('trade_offers')
      .select('*')
      .eq('id', parseInt(offerId))
      .eq('listing_id', listing.id)
      .single();

    if (offerError || !offer) {
      console.error('Offer error:', offerError);
      return NextResponse.json({
        success: false,
        message: 'Offer not found',
        error: offerError?.message
      }, { status: 404 });
    }

    // Check offer status
    if (offer.status !== 'pending') {
      return NextResponse.json({
        success: false,
        message: 'This offer has already been processed'
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    // === FIX: Properly handle offer_images ===
    let offerImages = offer.images;
    
    if (offerImages && typeof offerImages === 'string') {
      try {
        const parsed = JSON.parse(offerImages);
        offerImages = JSON.stringify(parsed);
      } catch (e) {
        console.warn('Invalid JSON in offer.images, setting to null:', e);
        offerImages = null;
      }
    }
    else if (offerImages && typeof offerImages === 'object') {
      offerImages = JSON.stringify(offerImages);
    }
    else if (!offerImages) {
      offerImages = null;
    }

    // Accept the offer
    const { error: updateOfferError } = await supabase
      .from('trade_offers')
      .update({ status: 'accepted', accepted_at: now, updated_at: now })
      .eq('id', parseInt(offerId));

    if (updateOfferError) {
      console.error('Error updating offer:', updateOfferError);
      return NextResponse.json({
        success: false,
        message: 'Failed to accept offer',
        error: updateOfferError.message
      }, { status: 500 });
    }

    // Reject other offers
    await supabase
      .from('trade_offers')
      .update({ status: 'rejected', updated_at: now })
      .eq('listing_id', listing.id)
      .neq('id', parseInt(offerId))
      .eq('status', 'pending');

    // Create trade with offer images
    const { data: tradeResult, error: tradeError } = await supabase
      .from('trades')
      .insert({
        offer_id: parseInt(offerId),
        listing_id: listing.id,
        buyer_id: offer.user_id,
        seller_id: listing.user_id,
        status: 'accepted',
        offer_message: offer.message || '',
        offer_amount: offer.amount || null,
        offer_images: offerImages,
        meeting_location: offer.meeting_location || null,
        proposed_meeting_time: offer.proposed_time || null,
        created_at: now,
        accepted_at: now,
        updated_at: now
      })
      .select('id')
      .single();

    if (tradeError) {
      console.error('Error creating trade:', tradeError);
      
      // Rollback
      await supabase
        .from('trade_offers')
        .update({ status: 'pending', accepted_at: null, updated_at: now })
        .eq('id', parseInt(offerId));
      
      return NextResponse.json({
        success: false,
        message: 'Failed to create trade',
        error: tradeError.message,
        details: tradeError
      }, { status: 500 });
    }

    // Update listing
    const { error: listingUpdateError } = await supabase
      .from('trade_listings')
      .update({ 
        accepted_offer_id: parseInt(offerId), 
        status: 'traded',
        updated_at: now 
      })
      .eq('id', listing.id);

    if (listingUpdateError) {
      console.error('Error updating listing:', listingUpdateError);
    }

    // Get user info
    const [{ data: buyerUser }, { data: seller }] = await Promise.all([
      supabase.from('users').select('username, first_name, last_name, avatar_url').eq('id', offer.user_id).single(),
      supabase.from('users').select('username, first_name, last_name, avatar_url').eq('id', listing.user_id).single()
    ]);

    const buyerName = `${buyerUser?.first_name || ''} ${buyerUser?.last_name || ''}`.trim() || buyerUser?.username;
    const sellerName = `${seller?.first_name || ''} ${seller?.last_name || ''}`.trim() || seller?.username;

    // Parse images for response
    let parsedImages = [];
    if (offerImages) {
      try {
        parsedImages = JSON.parse(offerImages);
      } catch (e) {
        parsedImages = [];
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Offer accepted successfully and trade created',
      data: {
        id: tradeResult.id,
        offer_id: parseInt(offerId),
        listing_id: listing.id,
        buyer_id: offer.user_id,
        seller_id: listing.user_id,
        status: 'accepted',
        offer_message: offer.message || '',
        offer_images: parsedImages,
        created_at: now,
        accepted_at: now,
        buyer: {
          username: buyerUser?.username,
          name: buyerName,
          first_name: buyerUser?.first_name,
          last_name: buyerUser?.last_name,
          avatar_url: buyerUser?.avatar_url
        },
        seller: {
          username: seller?.username,
          name: sellerName,
          first_name: seller?.first_name,
          last_name: seller?.last_name,
          avatar_url: seller?.avatar_url
        },
        listing: {
          title: listing.title
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error accepting offer:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to accept offer',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
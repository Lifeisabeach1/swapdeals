// src/app/api/trades/[slug]/offers/[offerId]/accept/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import jwt from 'jsonwebtoken';

export async function POST(request, { params }) {
  try {
    const { slug, offerId } = await params; // Await params before destructuring
    
    console.log('Accept offer - URL Parameters:', { slug, offerId });
    
    // Verify that we have both parameters
    if (!slug || !offerId) {
      console.log('Missing parameters - slug:', slug, 'offerId:', offerId);
      return NextResponse.json({ 
        success: false, 
        message: 'Listing slug and Offer ID are required' 
      }, { status: 400 });
    }

    // Get auth token
    const authHeader = request.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization token required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('Token found, attempting to verify...');

    // Verify token and get user
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', { userId: decoded.id });
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }

    // Start a transaction
    const trx = await knex.transaction();

    try {
      // First, get the listing by slug to get the listing ID
      const listing = await trx('trade_listings')
        .select('id', 'user_id', 'title', 'status')
        .where('slug', slug)
        .first();

      if (!listing) {
        await trx.rollback();
        return NextResponse.json({
          success: false,
          message: 'Listing not found'
        }, { status: 404 });
      }

      console.log('Found listing:', { id: listing.id, userId: listing.user_id });

      // Verify that the current user is the owner of the listing
      if (listing.user_id !== decoded.id) {
        await trx.rollback();
        return NextResponse.json({
          success: false,
          message: 'You can only accept offers on your own listings'
        }, { status: 403 });
      }

      // Check if listing is still active
      if (listing.status !== 'active') {
        await trx.rollback();
        return NextResponse.json({
          success: false,
          message: 'This listing is no longer active'
        }, { status: 400 });
      }

      // Get the offer with user information
      const offer = await trx('trade_offers')
        .select([
          'trade_offers.*',
          'users.username as buyer_username',
          'users.first_name as buyer_first_name',
          'users.last_name as buyer_last_name',
          'users.avatar_url as buyer_avatar_url'
        ])
        .leftJoin('users', 'trade_offers.user_id', 'users.id')
        .where('trade_offers.id', parseInt(offerId))
        .where('trade_offers.listing_id', listing.id)
        .first();

      if (!offer) {
        await trx.rollback();
        return NextResponse.json({
          success: false,
          message: 'Offer not found'
        }, { status: 404 });
      }

      console.log('Found offer:', { id: offer.id, status: offer.status });

      // Check if offer is still pending
      if (offer.status !== 'pending') {
        await trx.rollback();
        return NextResponse.json({
          success: false,
          message: 'This offer has already been processed'
        }, { status: 400 });
      }

      // Accept the offer
      await trx('trade_offers')
        .where('id', parseInt(offerId))
        .update({
          status: 'accepted',
          updated_at: trx.fn.now()
        });

      // Reject all other pending offers for this listing
      await trx('trade_offers')
        .where('listing_id', listing.id)
        .where('id', '!=', parseInt(offerId))
        .where('status', 'pending')
        .update({
          status: 'rejected',
          updated_at: trx.fn.now()
        });

      // Create a trade record when an offer is accepted
      const tradeData = {
        offer_id: parseInt(offerId),
        listing_id: listing.id,
        buyer_id: offer.user_id,
        seller_id: listing.user_id,
        status: 'accepted',
        offer_message: offer.message || '',
        offer_amount: offer.amount || null,
        offer_images: offer.images ? JSON.stringify(offer.images) : JSON.stringify([]),
        meeting_location: offer.meeting_location || null,
        proposed_meeting_time: offer.proposed_time || null,
        created_at: trx.fn.now(),
        accepted_at: trx.fn.now(),
        updated_at: trx.fn.now()
      };

      const [tradeResult] = await trx('trades')
        .insert(tradeData)
        .returning('id');

      const tradeId = tradeResult?.id || tradeResult;

      console.log('Trade created with ID:', tradeId);

      // Update the listing to mark that an offer was accepted (optional)
      await trx('trade_listings')
        .where('id', listing.id)
        .update({
          accepted_offer_id: parseInt(offerId),
          updated_at: trx.fn.now()
        });

      // Get seller information for the response
      const seller = await trx('users')
        .select('username', 'first_name', 'last_name', 'avatar_url')
        .where('id', listing.user_id)
        .first();

      // Commit the transaction
      await trx.commit();

      console.log('Offer accepted successfully, trade created');

      // Format names properly - combine first_name and last_name or fallback to username
      const buyerName = `${offer.buyer_first_name || ''} ${offer.buyer_last_name || ''}`.trim() || offer.buyer_username;
      const sellerName = `${seller.first_name || ''} ${seller.last_name || ''}`.trim() || seller.username;

      return NextResponse.json({
        success: true,
        message: 'Offer accepted successfully and trade created',
        data: {
          id: tradeId,
          offer_id: parseInt(offerId),
          listing_id: listing.id,
          buyer_id: offer.user_id,
          seller_id: listing.user_id,
          status: 'accepted',
          offer_message: offer.message || '',
          offer_images: (() => {
            try {
              return offer.images ? JSON.parse(offer.images) : [];
            } catch (e) {
              console.error('Error parsing offer_images:', e);
              return [];
            }
          })(),
          created_at: new Date().toISOString(),
          accepted_at: new Date().toISOString(),
          buyer: {
            username: offer.buyer_username,
            name: buyerName,
            first_name: offer.buyer_first_name,
            last_name: offer.buyer_last_name,
            avatar_url: offer.buyer_avatar_url
          },
          seller: {
            username: seller.username,
            name: sellerName,
            first_name: seller.first_name,
            last_name: seller.last_name,
            avatar_url: seller.avatar_url
          },
          listing: {
            title: listing.title
          }
        }
      }, { status: 201 });

    } catch (error) {
      await trx.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error accepting offer:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to accept offer',
      error: error.message
    }, { status: 500 });
  }
}
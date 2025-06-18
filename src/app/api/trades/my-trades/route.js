// src/app/api/trades/my-trades/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
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

    // Query to get all trades where user is either buyer or seller
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
        'trade_listings.title as listing_title'
      ])
      .leftJoin('users as buyer', 'trades.buyer_id', 'buyer.id')
      .leftJoin('users as seller', 'trades.seller_id', 'seller.id')
      .leftJoin('trade_listings', 'trades.listing_id', 'trade_listings.id')
      .where(function() {
        this.where('trades.buyer_id', userId).orWhere('trades.seller_id', userId);
      })
      .orderBy('trades.created_at', 'desc');

    // If no trades found, return empty array instead of 404
    if (!trades || trades.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Format the trades data
    const formattedTrades = trades.map(trade => {
      const buyerName = `${trade.buyer_first_name || ''} ${trade.buyer_last_name || ''}`.trim() || trade.buyer_username;
      const sellerName = `${trade.seller_first_name || ''} ${trade.seller_last_name || ''}`.trim() || trade.seller_username;

      return {
        id: trade.id,
        offer_id: trade.offer_id,
        listing_id: trade.listing_id,
        buyer_id: trade.buyer_id,
        seller_id: trade.seller_id,
        status: trade.status,
        offer_message: trade.offer_message,
        offer_images: (() => {
          try {
            // Handle various cases: null, empty string, whitespace, malformed JSON
            if (!trade.offer_images || 
                typeof trade.offer_images !== 'string' || 
                trade.offer_images.trim() === '' ||
                trade.offer_images.trim() === 'null') {
              return [];
            }
            return JSON.parse(trade.offer_images);
          } catch (e) {
            console.error('Error parsing offer_images for trade', trade.id, ':', e.message, 'Raw value:', trade.offer_images);
            return [];
          }
        })(),
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
          title: trade.listing_title
        },
        // Add these for frontend compatibility
        listing_title: trade.listing_title,
        buyer_first_name: trade.buyer_first_name,
        buyer_username: trade.buyer_username,
        seller_first_name: trade.seller_first_name,
        seller_username: trade.seller_username
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedTrades
    });

  } catch (error) {
    console.error('Error fetching user trades:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trades',
      error: error.message
    }, { status: 500 });
  }
}
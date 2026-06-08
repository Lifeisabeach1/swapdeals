// app/api/trades/my-trades/route.js
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    // Verify auth med headers()
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

    // Get trades where user is buyer or seller
    const { data: trades, error } = await supabase
      .from('trades')
      .select(`
        *,
        buyer:buyer_id (id, username, first_name, last_name, avatar_url),
        seller:seller_id (id, username, first_name, last_name, avatar_url),
        trade_listings!inner (id, title)
      `)
      .or(`buyer_id.eq.${decoded.id},seller_id.eq.${decoded.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trades:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch trades'
      }, { status: 500 });
    }

    if (!trades || trades.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Parse offer images helper
    const parseOfferImages = (images) => {
      if (!images || typeof images !== 'string' || images.trim() === '' || images.trim() === 'null') {
        return [];
      }
      try {
        return JSON.parse(images);
      } catch {
        return [];
      }
    };

    // Format trades
    const formattedTrades = trades.map(trade => {
      const buyerName = `${trade.buyer?.first_name || ''} ${trade.buyer?.last_name || ''}`.trim() || trade.buyer?.username;
      const sellerName = `${trade.seller?.first_name || ''} ${trade.seller?.last_name || ''}`.trim() || trade.seller?.username;

      return {
        id: trade.id,
        offer_id: trade.offer_id,
        listing_id: trade.listing_id,
        buyer_id: trade.buyer_id,
        seller_id: trade.seller_id,
        status: trade.status,
        offer_message: trade.offer_message,
        offer_images: parseOfferImages(trade.offer_images),
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
          username: trade.buyer?.username,
          name: buyerName,
          first_name: trade.buyer?.first_name,
          last_name: trade.buyer?.last_name,
          avatar_url: trade.buyer?.avatar_url
        },
        seller: {
          username: trade.seller?.username,
          name: sellerName,
          first_name: trade.seller?.first_name,
          last_name: trade.seller?.last_name,
          avatar_url: trade.seller?.avatar_url
        },
        listing: {
          title: trade.trade_listings?.title
        },
        // Frontend compatibility
        listing_title: trade.trade_listings?.title,
        buyer_first_name: trade.buyer?.first_name,
        buyer_username: trade.buyer?.username,
        seller_first_name: trade.seller?.first_name,
        seller_username: trade.seller?.username
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedTrades
    });

  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trades'
    }, { status: 500 });
  }
}

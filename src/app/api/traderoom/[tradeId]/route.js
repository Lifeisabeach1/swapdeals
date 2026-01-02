// app/api/traderoom/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers'; // ← LÄGG TILL
import { verifyToken } from '@/lib/auth/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: Parse JSON safely
const safeJsonParse = (jsonString, defaultValue = []) => {
  if (!jsonString) return defaultValue;
  if (typeof jsonString === 'object') return Array.isArray(jsonString) ? jsonString : defaultValue;
  if (typeof jsonString === 'string') {
    if (jsonString.includes('[object Object]')) return defaultValue;
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
};

// Helper: Ensure array
const ensureArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return [data];
};

// Helper: Format trade data
const formatTradeData = (trade) => {
  const buyerName = `${trade.buyer?.first_name || ''} ${trade.buyer?.last_name || ''}`.trim() || trade.buyer?.username;
  const sellerName = `${trade.seller?.first_name || ''} ${trade.seller?.last_name || ''}`.trim() || trade.seller?.username;

  const listingItems = ensureArray(trade.trade_listings?.trade_items);
  const listingImages = ensureArray(trade.trade_listings?.images);
  const itemsOffering = listingItems.filter(item => item?.type === 'offering');
  const itemsWanting = listingItems.filter(item => item?.type === 'wanting');
  const offerImages = safeJsonParse(trade.offer_images, []);
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
    listing_title: trade.trade_listings?.title || null,
    listing_description: trade.trade_listings?.description || null,
    listing_category: trade.trade_listings?.category || null,
    listing_location: trade.trade_listings?.location || null,
    listing_views: trade.trade_listings?.views || 0,
    listing_slug: trade.trade_listings?.slug || null,
    listing_images: listingImages,
    listing_items: listingItems,
    listing_items_offering: itemsOffering,
    listing_items_wanting: itemsWanting,
    images: allImages,
    all_images: allImages,
    items: listingItems,
    itemsOffering,
    itemsWanting,
    views: trade.trade_listings?.views || 0,
    buyer: {
      username: trade.buyer?.username || null,
      name: buyerName,
      first_name: trade.buyer?.first_name || null,
      last_name: trade.buyer?.last_name || null,
      avatar_url: trade.buyer?.avatar_url || null
    },
    seller: {
      username: trade.seller?.username || null,
      name: sellerName,
      first_name: trade.seller?.first_name || null,
      last_name: trade.seller?.last_name || null,
      avatar_url: trade.seller?.avatar_url || null
    },
    listing: {
      title: trade.trade_listings?.title || null,
      description: trade.trade_listings?.description || null,
      category: trade.trade_listings?.category || null,
      location: trade.trade_listings?.location || null,
      views: trade.trade_listings?.views || 0,
      slug: trade.trade_listings?.slug || null
    }
  };
};

// GET - Fetch trade(s)
export async function GET(request, { params }) {
  try {
    const { tradeId } = await params;
    
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

    // Handle "my-trades" endpoint
    if (tradeId === 'my-trades') {
      const { data: trades, error } = await supabase
        .from('trades')
        .select(`
          *,
          buyer:users!buyer_id (username, first_name, last_name, avatar_url),
          seller:users!seller_id (username, first_name, last_name, avatar_url),
          trade_listings (
            title, description, category, location, views, slug,
            images:images!images_listing_id_fkey (id, filename, original_name, url, file_path, mime_type),
            trade_items (id, type, name, category, description)
          )
        `)
        .or(`buyer_id.eq.${decoded.id},seller_id.eq.${decoded.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({
          success: false,
          message: 'Failed to fetch trades'
        }, { status: 500 });
      }

      const formattedTrades = ensureArray(trades).map(formatTradeData);
      return NextResponse.json({ success: true, data: formattedTrades });
    }

    // Fetch specific trade
    const { data: trade, error } = await supabase
      .from('trades')
      .select(`
        *,
        buyer:users!buyer_id (username, first_name, last_name, avatar_url),
        seller:users!seller_id (username, first_name, last_name, avatar_url),
        trade_listings (
          title, description, category, location, views, slug,
          images:images!images_listing_id_fkey (id, filename, original_name, url, file_path, mime_type),
          trade_items (id, type, name, category, description)
        )
      `)
      .eq('id', tradeId)
      .single();

    if (error || !trade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Trade not found' 
      }, { status: 404 });
    }

    // Verify access
    if (decoded.id !== trade.buyer_id && decoded.id !== trade.seller_id) {
      return NextResponse.json({
        success: false,
        message: 'Access denied'
      }, { status: 403 });
    }

    const formattedTrade = formatTradeData(trade);
    return NextResponse.json({ success: true, data: formattedTrade });

  } catch (error) {
    console.error('Error fetching trade:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trade'
    }, { status: 500 });
  }
}

// PATCH - Update trade
export async function PATCH(request, { params }) {
  try {
    const { tradeId } = await params;
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

    // Get trade
    const { data: trade } = await supabase
      .from('trades')
      .select('seller_id, buyer_id, status')
      .eq('id', tradeId)
      .single();

    if (!trade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Trade not found' 
      }, { status: 404 });
    }

    // Verify access
    if (decoded.id !== trade.buyer_id && decoded.id !== trade.seller_id) {
      return NextResponse.json({
        success: false,
        message: 'Access denied'
      }, { status: 403 });
    }

    // Prepare update
    const updateData = { updated_at: new Date().toISOString() };
    const now = new Date().toISOString();

    // Status updates with timestamps
    if (body.status) {
      updateData.status = body.status;
      if (body.status === 'completed') updateData.completed_at = now;
      else if (body.status === 'cancelled') updateData.cancelled_at = now;
      else if (body.status === 'accepted') updateData.accepted_at = now;
      else if (body.status === 'started') updateData.started_at = now;
      else if (body.status === 'disputed') updateData.disputed_at = now;
    }

    // Image transfer
    if (body.offer_images !== undefined) {
      if (Array.isArray(body.offer_images)) {
        updateData.offer_images = JSON.stringify(body.offer_images);
      } else if (typeof body.offer_images === 'string') {
        try {
          JSON.parse(body.offer_images);
          updateData.offer_images = body.offer_images;
        } catch {
          updateData.offer_images = JSON.stringify([]);
        }
      } else {
        updateData.offer_images = JSON.stringify([]);
      }
    }

    // Other fields
    if (body.meeting_location !== undefined) updateData.meeting_location = body.meeting_location;
    if (body.proposed_meeting_time !== undefined) updateData.proposed_meeting_time = body.proposed_meeting_time;
    if (body.actual_meeting_time !== undefined) updateData.actual_meeting_time = body.actual_meeting_time;
    if (body.trade_notes !== undefined) updateData.trade_notes = body.trade_notes;
    if (body.seller_response !== undefined) updateData.seller_response = body.seller_response;
    if (body.buyer_notes !== undefined) updateData.buyer_notes = body.buyer_notes;
    
    if (body.cancellation_reason !== undefined) {
      updateData.cancellation_reason = body.cancellation_reason;
      updateData.cancelled_by = decoded.id;
    }
    
    if (body.dispute_reason !== undefined) {
      updateData.dispute_reason = body.dispute_reason;
      updateData.disputed_by = decoded.id;
    }

    // Ratings
    if (body.buyer_rating !== undefined) {
      updateData.buyer_rating = body.buyer_rating;
      updateData.buyer_rated_at = now;
    }
    if (body.buyer_review !== undefined) updateData.buyer_review = body.buyer_review;
    if (body.seller_rating !== undefined) {
      updateData.seller_rating = body.seller_rating;
      updateData.seller_rated_at = now;
    }
    if (body.seller_review !== undefined) updateData.seller_review = body.seller_review;

    // Update
    const { error } = await supabase
      .from('trades')
      .update(updateData)
      .eq('id', tradeId);

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update trade'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Trade updated successfully',
      data: {
        tradeId,
        updatedFields: Object.keys(updateData),
        status: body.status || trade.status
      }
    });

  } catch (error) {
    console.error('Error updating trade:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update trade'
    }, { status: 500 });
  }
}
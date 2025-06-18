// /src/app/api/user/conversations/route.js
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

    // Get all trades where user is buyer or seller, with last message info
    const conversations = await knex('trades')
      .select([
        'trades.id as trade_id',
        'trades.status as trade_status',
        'trades.buyer_id',
        'trades.seller_id',
        'trades.created_at as trade_created_at',
        'trades.updated_at as trade_updated_at',
        
        // Listing info
        'listings.title as listing_title',
        'listings.location',
        'listings.images',
        
        // Other user info (buyer or seller, whoever is NOT the current user)
        knex.raw(`
          CASE 
            WHEN trades.buyer_id = ? THEN seller_user.id
            ELSE buyer_user.id
          END as other_user_id
        `, [userId]),
        knex.raw(`
          CASE 
            WHEN trades.buyer_id = ? THEN seller_user.username
            ELSE buyer_user.username
          END as other_user_username
        `, [userId]),
        knex.raw(`
          CASE 
            WHEN trades.buyer_id = ? THEN seller_user.first_name
            ELSE buyer_user.first_name
          END as other_user_first_name
        `, [userId]),
        knex.raw(`
          CASE 
            WHEN trades.buyer_id = ? THEN seller_user.last_name
            ELSE buyer_user.last_name
          END as other_user_last_name
        `, [userId]),
        knex.raw(`
          CASE 
            WHEN trades.buyer_id = ? THEN seller_user.email
            ELSE buyer_user.email
          END as other_user_email
        `, [userId]),
        knex.raw(`
          CASE 
            WHEN trades.buyer_id = ? THEN seller_user.phone
            ELSE buyer_user.phone
          END as other_user_phone
        `, [userId]),
        knex.raw(`
          CASE 
            WHEN trades.buyer_id = ? THEN seller_user.avatar_url
            ELSE buyer_user.avatar_url
          END as other_user_avatar_url
        `, [userId]),
      ])
      .leftJoin('listings', 'trades.listing_id', 'listings.id')
      .leftJoin('users as buyer_user', 'trades.buyer_id', 'buyer_user.id')
      .leftJoin('users as seller_user', 'trades.seller_id', 'seller_user.id')
      .where(function() {
        this.where('trades.buyer_id', userId)
            .orWhere('trades.seller_id', userId);
      })
      .orderBy('trades.updated_at', 'desc');

    // For each conversation, get the last message and unread count
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        // Get last message
        const lastMessage = await knex('trade_messages')
          .select([
            'id',
            'content',
            'sender_id',
            'created_at',
            'status'
          ])
          .where('trade_id', conversation.trade_id)
          .where('is_deleted', false)
          .orderBy('created_at', 'desc')
          .first();

        // Get unread count (messages sent by the other user that haven't been read)
        const unreadCount = await knex('trade_messages')
          .count('* as count')
          .where('trade_id', conversation.trade_id)
          .where('sender_id', '!=', userId)
          .where('is_deleted', false)
          .whereNull('read_at')
          .first();

        return {
          trade_id: conversation.trade_id,
          trade_status: conversation.trade_status,
          listing_title: conversation.listing_title,
          location: conversation.location,
          listing_images: conversation.images,
          trade_created_at: conversation.trade_created_at,
          trade_updated_at: conversation.trade_updated_at,
          other_user: {
            id: conversation.other_user_id,
            username: conversation.other_user_username,
            first_name: conversation.other_user_first_name,
            last_name: conversation.other_user_last_name,
            name: `${conversation.other_user_first_name || ''} ${conversation.other_user_last_name || ''}`.trim() || conversation.other_user_username,
            email: conversation.other_user_email,
            phone: conversation.other_user_phone,
            avatar_url: conversation.other_user_avatar_url
          },
          last_message: lastMessage,
          unread_count: parseInt(unreadCount?.count || 0)
        };
      })
    );

    // Sort by last message time (most recent first)
    conversationsWithMessages.sort((a, b) => {
      const aTime = a.last_message?.created_at || a.trade_updated_at;
      const bTime = b.last_message?.created_at || b.trade_updated_at;
      return new Date(bTime) - new Date(aTime);
    });

    return NextResponse.json({
      success: true,
      data: conversationsWithMessages
    });

  } catch (error) {
    console.error('Error fetching user conversations:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    }, { status: 500 });
  }
}
// src/app/api/trades/[tradeId]/messages/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request, { params }) {
  try {
    const { tradeId } = await params; // Add await here
    
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

    // First, verify that the user is part of this trade
    const trade = await knex('trades')
      .select('buyer_id', 'seller_id')
      .where('id', tradeId)
      .first();

    if (!trade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Trade not found' 
      }, { status: 404 });
    }

    // Verify that the authenticated user is either the buyer or seller
    if (userId !== trade.buyer_id && userId !== trade.seller_id) {
      return NextResponse.json({
        success: false,
        message: 'You are not authorized to view messages for this trade'
      }, { status: 403 });
    }

    // Query messages for this trade using NEW SCHEMA
    const messages = await knex('trade_messages')
      .select([
        'trade_messages.id',
        'trade_messages.message_uuid',
        'trade_messages.trade_id',
        'trade_messages.sender_id',
        'trade_messages.content',        // Changed from 'message'
        'trade_messages.type',           // Changed from 'message_type'
        'trade_messages.status',
        'trade_messages.attachments',
        'trade_messages.metadata',
        'trade_messages.sent_at',
        'trade_messages.delivered_at',
        'trade_messages.read_at',
        'trade_messages.reply_to_id',
        'trade_messages.is_pinned',
        'trade_messages.is_important',
        'trade_messages.is_system_message',
        'trade_messages.system_event_type',
        'trade_messages.is_edited',
        'trade_messages.created_at',
        'trade_messages.updated_at',
        'users.username',
        'users.first_name',
        'users.last_name',
        'users.avatar_url'
      ])
      .leftJoin('users', 'trade_messages.sender_id', 'users.id')
      .where('trade_messages.trade_id', tradeId)
      .where('trade_messages.is_deleted', false)  // Only get non-deleted messages
      .orderBy('trade_messages.created_at', 'asc');

    // Format messages
    const formattedMessages = messages.map(message => ({
      id: message.id,
      message_uuid: message.message_uuid,
      trade_id: message.trade_id,
      sender_id: message.sender_id,
      content: message.content,           // Using new column name
      type: message.type,                 // Using new column name
      status: message.status,
      attachments: message.attachments,
      metadata: message.metadata,
      sent_at: message.sent_at,
      delivered_at: message.delivered_at,
      read_at: message.read_at,
      reply_to_id: message.reply_to_id,
      is_pinned: message.is_pinned,
      is_important: message.is_important,
      is_system_message: message.is_system_message,
      system_event_type: message.system_event_type,
      is_edited: message.is_edited,
      created_at: message.created_at,
      updated_at: message.updated_at,
      sender: {
        username: message.username,
        first_name: message.first_name,
        last_name: message.last_name,
        name: `${message.first_name || ''} ${message.last_name || ''}`.trim() || message.username,
        avatar_url: message.avatar_url
      }
    }));

    return NextResponse.json({
      success: true,
      data: formattedMessages
    });

  } catch (error) {
    console.error('Error fetching trade messages:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { tradeId } = await params; // Add await here
    
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

    // Get request body
    const body = await request.json();
    const { message, message_type = 'text', attachments, metadata } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json({
        success: false,
        message: 'Message content is required'
      }, { status: 400 });
    }

    // First, verify that the user is part of this trade
    const trade = await knex('trades')
      .select('buyer_id', 'seller_id')
      .where('id', tradeId)
      .first();

    if (!trade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Trade not found' 
      }, { status: 404 });
    }

    // Verify that the authenticated user is either the buyer or seller
    if (userId !== trade.buyer_id && userId !== trade.seller_id) {
      return NextResponse.json({
        success: false,
        message: 'You are not authorized to send messages for this trade'
      }, { status: 403 });
    }

    // Insert the new message using NEW SCHEMA
    const messageData = {
      message_uuid: uuidv4(),
      trade_id: tradeId,
      sender_id: userId,
      content: message.trim(),
      type: message_type,
      status: 'sent',
      attachments: attachments || null,
      metadata: metadata || null
    };

    // FIX: Handle the returned ID correctly
    const insertResult = await knex('trade_messages')
      .insert(messageData)
      .returning('id');

    // Extract the actual ID value - this was the bug!
    let messageId;
    if (Array.isArray(insertResult)) {
      // PostgreSQL returns an array
      messageId = insertResult[0].id || insertResult[0];
    } else {
      // Some databases might return the ID directly
      messageId = insertResult.id || insertResult;
    }

    // Make sure we have a valid integer ID
    if (typeof messageId === 'object') {
      messageId = messageId.id;
    }

    console.log('Message ID extracted:', messageId, typeof messageId);

    // Fetch the created message with sender info
    const createdMessage = await knex('trade_messages')
      .select([
        'trade_messages.*',
        'users.username',
        'users.first_name',
        'users.last_name',
        'users.avatar_url'
      ])
      .leftJoin('users', 'trade_messages.sender_id', 'users.id')
      .where('trade_messages.id', messageId)  // Now passing the correct integer ID
      .first();

    if (!createdMessage) {
      console.error('Could not find created message with ID:', messageId);
      return NextResponse.json({
        success: false,
        message: 'Message created but could not retrieve it'
      }, { status: 500 });
    }

    // Format the response to match what your frontend expects
    const formattedMessage = {
      id: createdMessage.id,
      message_uuid: createdMessage.message_uuid,
      trade_id: createdMessage.trade_id,
      sender_id: createdMessage.sender_id,
      content: createdMessage.content,
      type: createdMessage.type,
      status: createdMessage.status,
      attachments: createdMessage.attachments,
      metadata: createdMessage.metadata,
      sent_at: createdMessage.sent_at,
      created_at: createdMessage.created_at,
      updated_at: createdMessage.updated_at,
      sender: {
        username: createdMessage.username,
        first_name: createdMessage.first_name,
        last_name: createdMessage.last_name,
        name: `${createdMessage.first_name || ''} ${createdMessage.last_name || ''}`.trim() || createdMessage.username,
        avatar_url: createdMessage.avatar_url
      }
    };

    return NextResponse.json({
      success: true,
      data: formattedMessage
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating trade message:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    }, { status: 500 });
  }
}
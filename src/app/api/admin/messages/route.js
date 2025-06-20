// app/api/admin/messages/route.js
import { NextResponse } from 'next/server';
import knex from '@/lib/db'; // Adjust import path based on your db config location

// Note: This handles the main /api/admin/messages route
// Individual message operations are handled in [id]/route.js

// GET /api/admin/messages - Fetch all messages
export async function GET(request) {
  try {
    console.log('=== MESSAGES API START ===');
    
    // Optional: Add authentication check here
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const status = searchParams.get('status'); // 'read', 'unread', 'deleted', or null for all
    const tradeId = searchParams.get('trade_id');
    const search = searchParams.get('search');
    
    console.log('Query params:', { page, limit, status, tradeId, search });
    
    // Check if trade_messages table exists
    const tableExists = await knex.schema.hasTable('trade_messages');
    console.log('Trade messages table exists:', tableExists);
    
    if (!tableExists) {
      console.error('Trade messages table does not exist');
      return NextResponse.json({
        success: false,
        error: 'Trade messages table not found',
        messages: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 }
      });
    }
    
    // Build base query for messages (without count)
    let baseQuery = knex('trade_messages')
      .leftJoin('users as sender', 'trade_messages.sender_id', 'sender.id')
      .leftJoin('trades', 'trade_messages.trade_id', 'trades.id');

    // Apply filters to base query
    if (status) {
      switch (status) {
        case 'read':
          baseQuery = baseQuery.whereNotNull('trade_messages.read_at');
          break;
        case 'unread':
          baseQuery = baseQuery.whereNull('trade_messages.read_at');
          break;
        case 'deleted':
          baseQuery = baseQuery.where('trade_messages.is_deleted', true);
          break;
        case 'flagged':
          baseQuery = baseQuery.where('trade_messages.is_flagged', true);
          break;
        case 'system':
          baseQuery = baseQuery.where('trade_messages.is_system_message', true);
          break;
      }
    }

    if (tradeId) {
      baseQuery = baseQuery.where('trade_messages.trade_id', tradeId);
    }

    if (search) {
      baseQuery = baseQuery.where(function() {
        this.where('trade_messages.content', 'ilike', `%${search}%`)
          .orWhere('sender.first_name', 'ilike', `%${search}%`)
          .orWhere('sender.last_name', 'ilike', `%${search}%`)
          .orWhere('sender.username', 'ilike', `%${search}%`)
          .orWhere('trade_messages.trade_id', 'like', `%${search}%`);
      });
    }

    // Get total count for pagination (separate query)
    console.log('Getting total count...');
    const countResult = await baseQuery.clone().count('* as count');
    const total = parseInt(countResult[0]?.count || 0);
    console.log('Total messages:', total);

    // Get the actual messages with all fields
    console.log('Getting messages...');
    const offset = (page - 1) * limit;
    console.log('Applying pagination:', { limit, offset });
    
    const messages = await baseQuery.clone()
      .select(
        'trade_messages.id',
        'trade_messages.content as message', // Map content to message for consistency
        'trade_messages.sender_id',
        'trade_messages.trade_id',
        'trade_messages.read_at',
        'trade_messages.created_at',
        'trade_messages.updated_at',
        'trade_messages.is_deleted',
        'trade_messages.type',
        'trade_messages.status',
        'trade_messages.is_system_message',
        'trade_messages.is_flagged',
        'trade_messages.flag_reason',
        'trade_messages.flagged_at',
        // Use the correct column names from users table
        'sender.first_name as sender_first_name',
        'sender.last_name as sender_last_name',
        'sender.username as sender_username',
        'sender.email as sender_email',
        // Concatenate first_name and last_name to create a full name
        knex.raw('CONCAT(COALESCE(sender.first_name, \'\'), \' \', COALESCE(sender.last_name, \'\')) as sender_name'),
        // Get trade title if trades table exists and has a title column
        'trades.id as trade_exists' // Simple check if trade exists
      )
      .orderBy('trade_messages.created_at', 'desc')
      .limit(limit)
      .offset(offset);
    
    console.log('Retrieved messages count:', messages.length);

    // Process messages to clean up the sender_name field
    const processedMessages = messages.map(msg => ({
      ...msg,
      sender_name: msg.sender_name ? msg.sender_name.trim() : (msg.sender_username || 'Unknown User')
    }));

    const result = {
      success: true,
      messages: processedMessages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    console.log('=== MESSAGES API SUCCESS ===');
    return NextResponse.json(result);

  } catch (error) {
    console.error('=== MESSAGES API ERROR ===');
    console.error('Error fetching messages:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to fetch messages',
        details: error.message,
        success: false 
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/messages - Create a new message (if needed)
export async function POST(request) {
  try {
    // Optional: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { message, sender_id, trade_id, recipient_id } = body;

    // Validate required fields
    if (!message || !sender_id) {
      return NextResponse.json(
        { error: 'Message and sender_id are required' },
        { status: 400 }
      );
    }

    // Insert new message
    const [newMessage] = await knex('trade_messages')
      .insert({
        content: message, // Use 'content' instead of 'message'
        sender_id,
        trade_id: trade_id || null,
        message_uuid: knex.raw('gen_random_uuid()'), // Generate UUID
        type: 'text',
        status: 'sent',
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return NextResponse.json({
      success: true,
      message: 'Message created successfully',
      data: newMessage
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
// app/api/traderoom/[tradeId]/messages/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers'; // ← LÄGG TILL
import { verifyToken } from '@/lib/auth/jwt';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Fetch messages
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

    // Verify user is part of trade
    const { data: trade } = await supabase
      .from('trades')
      .select('buyer_id, seller_id')
      .eq('id', tradeId)
      .single();

    if (!trade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Trade not found' 
      }, { status: 404 });
    }

    if (decoded.id !== trade.buyer_id && decoded.id !== trade.seller_id) {
      return NextResponse.json({
        success: false,
        message: 'Access denied'
      }, { status: 403 });
    }

    // Get messages
    const { data: messages, error } = await supabase
      .from('trade_messages')
      .select('*, users:sender_id (username, first_name, last_name, avatar_url)')
      .eq('trade_id', tradeId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      // Fallback: fetch separately
      const { data: messagesOnly } = await supabase
        .from('trade_messages')
        .select('*')
        .eq('trade_id', tradeId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      const senderIds = [...new Set(messagesOnly?.map(m => m.sender_id) || [])];
      const { data: users } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, avatar_url')
        .in('id', senderIds);

      const userMap = {};
      users?.forEach(u => { userMap[u.id] = u; });

      const formatted = (messagesOnly || []).map(m => ({
        ...m,
        sender: {
          username: userMap[m.sender_id]?.username,
          first_name: userMap[m.sender_id]?.first_name,
          last_name: userMap[m.sender_id]?.last_name,
          name: `${userMap[m.sender_id]?.first_name || ''} ${userMap[m.sender_id]?.last_name || ''}`.trim() || userMap[m.sender_id]?.username,
          avatar_url: userMap[m.sender_id]?.avatar_url
        }
      }));

      return NextResponse.json({ success: true, data: formatted });
    }

    // Format messages
    const formatted = (messages || []).map(m => ({
      ...m,
      sender: {
        username: m.users?.username,
        first_name: m.users?.first_name,
        last_name: m.users?.last_name,
        name: `${m.users?.first_name || ''} ${m.users?.last_name || ''}`.trim() || m.users?.username,
        avatar_url: m.users?.avatar_url
      }
    }));

    return NextResponse.json({ success: true, data: formatted });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch messages'
    }, { status: 500 });
  }
}

// POST - Send message
export async function POST(request, { params }) {
  try {
    const { tradeId } = await params;
    const body = await request.json();
    const { message, message_type = 'text', attachments, metadata } = body;
    
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

    if (!message?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Message content required'
      }, { status: 400 });
    }

    // Verify user is part of trade
    const { data: trade } = await supabase
      .from('trades')
      .select('buyer_id, seller_id')
      .eq('id', tradeId)
      .single();

    if (!trade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Trade not found' 
      }, { status: 404 });
    }

    if (decoded.id !== trade.buyer_id && decoded.id !== trade.seller_id) {
      return NextResponse.json({
        success: false,
        message: 'Access denied'
      }, { status: 403 });
    }

    // Insert message
    const { data: insertedMessage, error: insertError } = await supabase
      .from('trade_messages')
      .insert({
        message_uuid: uuidv4(),
        trade_id: tradeId,
        sender_id: decoded.id,
        content: message.trim(),
        type: message_type,
        status: 'sent',
        attachments: attachments || null,
        metadata: metadata || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({
        success: false,
        message: 'Failed to send message'
      }, { status: 500 });
    }

    // Get user info
    const { data: userData } = await supabase
      .from('users')
      .select('username, first_name, last_name, avatar_url')
      .eq('id', decoded.id)
      .single();

    const formatted = {
      ...insertedMessage,
      sender: {
        username: userData?.username,
        first_name: userData?.first_name,
        last_name: userData?.last_name,
        name: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || userData?.username,
        avatar_url: userData?.avatar_url
      }
    };

    return NextResponse.json({
      success: true,
      data: formatted
    }, { status: 201 });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send message'
    }, { status: 500 });
  }
}
// app/api/user/conversations/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    // Get authorization header directly from request
    const authHeader = request.headers.get('authorization');
    
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
    const { data: conversations, error: tradesError } = await supabase
      .from('trades')
      .select(`
        id,
        status,
        buyer_id,
        seller_id,
        created_at,
        updated_at,
        listings:listing_id (title, location, images),
        buyer_user:users!buyer_id (id, username, first_name, last_name, email, phone, avatar_url),
        seller_user:users!seller_id (id, username, first_name, last_name, email, phone, avatar_url)
      `)
      .or(`buyer_id.eq.${decoded.id},seller_id.eq.${decoded.id}`)
      .order('updated_at', { ascending: false });

    if (tradesError) {
      console.error('Error fetching conversations:', tradesError);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch conversations'
      }, { status: 500 });
    }

    // Get messages and unread counts for each conversation
    const conversationsWithMessages = await Promise.all(
      (conversations || []).map(async (conversation) => {
        // Get last message
        const { data: lastMessage } = await supabase
          .from('trade_messages')
          .select('id, content, sender_id, created_at, status')
          .eq('trade_id', conversation.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { count: unreadCount } = await supabase
          .from('trade_messages')
          .select('*', { count: 'exact', head: true })
          .eq('trade_id', conversation.id)
          .neq('sender_id', decoded.id)
          .eq('is_deleted', false)
          .is('read_at', null);

        // Determine other user
        const isCurrentUserBuyer = conversation.buyer_id === decoded.id;
        const otherUser = isCurrentUserBuyer ? conversation.seller_user : conversation.buyer_user;

        return {
          trade_id: conversation.id,
          trade_status: conversation.status,
          listing_title: conversation.listings?.title,
          location: conversation.listings?.location,
          listing_images: conversation.listings?.images,
          trade_created_at: conversation.created_at,
          trade_updated_at: conversation.updated_at,
          other_user: {
            id: otherUser?.id,
            username: otherUser?.username,
            first_name: otherUser?.first_name,
            last_name: otherUser?.last_name,
            name: `${otherUser?.first_name || ''} ${otherUser?.last_name || ''}`.trim() || otherUser?.username,
            email: otherUser?.email,
            phone: otherUser?.phone,
            avatar_url: otherUser?.avatar_url
          },
          last_message: lastMessage || null,
          unread_count: unreadCount || 0
        };
      })
    );

    // Sort by most recent message
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
    console.error('Error fetching conversations:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    }, { status: 500 });
  }
}

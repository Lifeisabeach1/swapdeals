// app/api/user/conversations/[tradeId]/mark-read/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request, { params }) {
  try {
    const { tradeId } = await params;

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

    // Mark unread messages as read
    const { data, error } = await supabase
      .from('trade_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('trade_id', tradeId)
      .neq('sender_id', decoded.id)
      .eq('is_deleted', false)
      .is('read_at', null)
      .select();

    if (error) {
      console.error('Error marking messages as read:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to mark messages as read',
        error: error.message
      }, { status: 500 });
    }

    const updatedCount = data?.length || 0;

    return NextResponse.json({
      success: true,
      message: `Marked ${updatedCount} messages as read`,
      updated_count: updatedCount
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    }, { status: 500 });
  }
}
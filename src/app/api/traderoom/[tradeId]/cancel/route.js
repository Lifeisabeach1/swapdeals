
// ============================================
// app/api/trades/[tradeId]/cancel/route.js
// ============================================
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers'; // ← LÄGG TILL
import { verifyToken } from '@/lib/auth/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request, { params }) {
  try {
    const { tradeId } = await params;
    
    // ← FIX: Verify auth
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

    // Get trade (either buyer or seller can cancel)
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .or(`seller_id.eq.${decoded.id},buyer_id.eq.${decoded.id}`)
      .eq('status', 'accepted')
      .single();

    if (tradeError || !trade) {
      return NextResponse.json({
        success: false,
        message: 'Trade not found or access denied'
      }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Cancel trade
    const { data: updatedTrade, error } = await supabase
      .from('trades')
      .update({
        status: 'cancelled',
        cancelled_at: now,
        updated_at: now
      })
      .eq('id', tradeId)
      .select()
      .single();

    if (error) {
      console.error('Error cancelling trade:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to cancel trade',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedTrade,
      message: 'Trade cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling trade:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to cancel trade',
      error: error.message
    }, { status: 500 });
  }
}
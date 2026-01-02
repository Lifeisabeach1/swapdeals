// ============================================
// app/api/trades/[tradeId]/complete/route.js
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

    // Get trade (seller only)
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .eq('seller_id', decoded.id)
      .eq('status', 'accepted')
      .single();

    if (tradeError || !trade) {
      return NextResponse.json({
        success: false,
        message: 'Trade not found or access denied'
      }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Complete trade
    const { data: updatedTrade, error } = await supabase
      .from('trades')
      .update({
        status: 'completed',
        completed_at: now,
        updated_at: now
      })
      .eq('id', tradeId)
      .select()
      .single();

    if (error) {
      console.error('Error updating trade:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to complete trade',
        error: error.message
      }, { status: 500 });
    }

    // Update platform stats
    const { data: existingStats } = await supabase
      .from('platform_stats')
      .select('*')
      .eq('stat_name', 'deals_made')
      .single();

    if (existingStats) {
      await supabase
        .from('platform_stats')
        .update({
          stat_value: existingStats.stat_value + 1,
          updated_at: now
        })
        .eq('stat_name', 'deals_made');
    } else {
      await supabase
        .from('platform_stats')
        .insert({
          stat_name: 'deals_made',
          stat_value: 1,
          created_at: now,
          updated_at: now
        });
    }

    return NextResponse.json({
      success: true,
      data: updatedTrade,
      message: 'Trade completed successfully'
    });

  } catch (error) {
    console.error('Error completing trade:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to complete trade',
      error: error.message
    }, { status: 500 });
  }
}
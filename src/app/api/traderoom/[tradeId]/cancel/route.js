
// src/app/api/trades/[tradeId]/cancel/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import jwt from 'jsonwebtoken';

export async function POST(request, { params }) {
  try {
    // Await params before accessing properties
    const { tradeId } = await params;
    const body = await request.json();
    const { reason } = body;
    
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

    // Check if trade exists and user is part of it
    const trade = await knex('trades')
      .select('*')
      .where('id', tradeId)
      .andWhere(function() {
        this.where('buyer_id', userId).orWhere('seller_id', userId);
      })
      .andWhere('status', 'in', ['accepted', 'in_progress'])
      .first();

    if (!trade) {
      return NextResponse.json({
        success: false,
        message: 'Trade not found, access denied, or trade cannot be cancelled'
      }, { status: 404 });
    }

    // Cancel the trade
    const updatedTrade = await knex('trades')
      .where('id', tradeId)
      .update({
        status: 'cancelled',
        cancelled_at: knex.fn.now(),
        cancelled_by: userId,
        cancellation_reason: reason || 'User cancelled',
        updated_at: knex.fn.now()
      })
      .returning('*');

    // Also update the original offer status back to cancelled
    // Check what statuses are allowed for trade_offers first
    if (trade.offer_id) {
      try {
        await knex('trade_offers')
          .where('id', trade.offer_id)
          .update({
            status: 'rejected', // Use 'rejected' instead of 'cancelled' if constraint doesn't allow 'cancelled'
            updated_at: knex.fn.now()
          });
      } catch (offerUpdateError) {
        console.warn('Could not update offer status:', offerUpdateError.message);
        // Continue execution even if offer update fails
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedTrade[0],
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
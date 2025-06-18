// src/app/api/trades/[tradeId]/complete/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import jwt from 'jsonwebtoken';

export async function POST(request, { params }) {
  try {
    // Await params before accessing properties
    const { tradeId } = await params;
    
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

    // Check if trade exists and user is the seller
    const trade = await knex('trades')
      .select('*')
      .where('id', tradeId)
      .andWhere('seller_id', userId)
      .andWhere('status', 'accepted')
      .first();

    if (!trade) {
      return NextResponse.json({
        success: false,
        message: 'Trade not found, access denied, or trade is not in accepted status'
      }, { status: 404 });
    }

    // Use transaction to ensure both operations succeed
    const result = await knex.transaction(async (trx) => {
      // Mark trade as completed
      const updatedTrade = await trx('trades')
        .where('id', tradeId)
        .update({
          status: 'completed',
          completed_at: trx.fn.now(),
          updated_at: trx.fn.now()
        })
        .returning('*');

      // Update or insert platform stats
      const existingStats = await trx('platform_stats')
        .select('*')
        .where('stat_name', 'deals_made')
        .first();

      if (existingStats) {
        // Update existing counter
        await trx('platform_stats')
          .where('stat_name', 'deals_made')
          .update({
            stat_value: existingStats.stat_value + 1,
            updated_at: trx.fn.now()
          });
      } else {
        // Insert new counter starting from 49
        await trx('platform_stats').insert({
          stat_name: 'deals_made',
          stat_value: 49,
          created_at: trx.fn.now(),
          updated_at: trx.fn.now()
        });
      }

      return updatedTrade[0];
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Trade marked as completed successfully'
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
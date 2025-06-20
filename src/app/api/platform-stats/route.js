// src/app/api/platform-stats/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';

/**
 * GET /api/platform-stats
 * Fetch current platform statistics
 */
export async function GET(request) {
  try {
    // Get all platform stats
    const stats = await knex('platform_stats')
      .select('stat_name', 'stat_value', 'updated_at')
      .orderBy('id');

    // Convert to object format
    const statsObj = {};
    stats.forEach(stat => {
      statsObj[stat.stat_name] = {
        value: parseInt(stat.stat_value) || 0,
        updated_at: stat.updated_at
      };
    });

    // Prepare response data with fallbacks
    const platformData = {
      registered_users: statsObj.registered_users?.value || 0,
      deals_made: statsObj.deals_made?.value || 49,
      total_visits: statsObj.total_visits?.value || 14310,
      active_listings: statsObj.active_listings?.value || 0,
      last_updated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: platformData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Return fallback data if database fails
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch platform stats',
      data: {
        registered_users: 0,
        deals_made: 49,
        total_visits: 14310,
        active_listings: 0
      },
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
    }, { status: 500 });
  }
}

/**
 * PUT /api/platform-stats
 * Update platform statistics
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { action, stat_name, increment = 1, user_id } = body;

    // Validate action
    const validActions = ['increment', 'decrement', 'set'];
    if (!action || !validActions.includes(action)) {
      return NextResponse.json({
        success: false,
        message: 'Valid action required: increment, decrement, or set'
      }, { status: 400 });
    }

    // Validate stat_name
    const validStats = ['registered_users', 'deals_made', 'total_visits', 'active_listings'];
    if (!stat_name || !validStats.includes(stat_name)) {
      return NextResponse.json({
        success: false,
        message: `Valid stat_name required: ${validStats.join(', ')}`
      }, { status: 400 });
    }

    let result;

    // Use transaction for data consistency
    await knex.transaction(async (trx) => {
      if (action === 'increment') {
        result = await trx('platform_stats')
          .where('stat_name', stat_name)
          .increment('stat_value', increment)
          .update('updated_at', knex.fn.now())
          .returning(['stat_name', 'stat_value']);
          
      } else if (action === 'decrement') {
        result = await trx('platform_stats')
          .where('stat_name', stat_name)
          .decrement('stat_value', increment)
          .update('updated_at', knex.fn.now())
          .returning(['stat_name', 'stat_value']);
          
      } else if (action === 'set') {
        const { value } = body;
        if (typeof value !== 'number') {
          throw new Error('Value must be a number for set action');
        }
        
        result = await trx('platform_stats')
          .where('stat_name', stat_name)
          .update({
            stat_value: value,
            updated_at: knex.fn.now()
          })
          .returning(['stat_name', 'stat_value']);
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${stat_name}`,
      data: {
        stat_name,
        action,
        increment,
        result: result?.[0] || null
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update platform stats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
    }, { status: 500 });
  }
}

/**
 * POST /api/platform-stats/sync
 * Sync stats with real data from other tables
 */
export async function POST(request) {
  try {
    // Get real registered users count
    const usersResult = await knex('users')
      .where('is_active', true)
      .count('* as count')
      .first();
    const registeredUsers = parseInt(usersResult?.count) || 0;
    
    // Get real active listings count (if listings table exists)
    let activeListings = 0;
    try {
      const hasListingsTable = await knex.schema.hasTable('listings');
      if (hasListingsTable) {
        const listingsResult = await knex('listings')
          .where('status', 'active')
          .count('* as count')
          .first();
        activeListings = parseInt(listingsResult?.count) || 0;
      }
    } catch (e) {
      // No listings table found
    }
    
    // Get real deals count (if trades table exists)
    let dealsCount = null;
    try {
      const hasTradesTable = await knex.schema.hasTable('trades');
      if (hasTradesTable) {
        const tradesResult = await knex('trades')
          .where('status', 'completed')
          .count('* as count')
          .first();
        dealsCount = parseInt(tradesResult?.count) || 0;
      }
    } catch (e) {
      // No trades table found
    }
    
    // Update stats with real data
    const updates = [];
    
    // Always update registered users
    await knex('platform_stats')
      .where('stat_name', 'registered_users')
      .update({
        stat_value: registeredUsers,
        updated_at: knex.fn.now()
      });
    updates.push(`registered_users: ${registeredUsers}`);
    
    // Update active listings
    await knex('platform_stats')
      .where('stat_name', 'active_listings')
      .update({
        stat_value: activeListings,
        updated_at: knex.fn.now()
      });
    updates.push(`active_listings: ${activeListings}`);
    
    // Update deals if we have real data
    if (dealsCount !== null) {
      await knex('platform_stats')
        .where('stat_name', 'deals_made')
        .update({
          stat_value: dealsCount,
          updated_at: knex.fn.now()
        });
      updates.push(`deals_made: ${dealsCount}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Platform stats synced with real data',
      updates: updates
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to sync platform stats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
    }, { status: 500 });
  }
}

// src/app/api/admin/trade-listings/stats/route.js
import { knex } from '@/lib/db';

export async function GET(request) {
  try {
    // Verify admin authentication
    const user = await verifyAdminToken(request);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get trade listings statistics using Promise.all for concurrent queries
    const [
      totalResult,
      activeResult,
      completedResult,
      cancelledResult,
      inactiveResult,
      categories,
      locations,
      recentResult,
      mostViewed
    ] = await Promise.all([
      // Total listings
      knex('trade_listings').count('* as total').first(),
      
      // Active listings
      knex('trade_listings')
        .count('* as active')
        .where('status', 'active')
        .orWhereNull('status')
        .first(),
      
      // Completed listings
      knex('trade_listings')
        .count('* as completed')
        .where('status', 'completed')
        .first(),
      
      // Cancelled listings
      knex('trade_listings')
        .count('* as cancelled')
        .where('status', 'cancelled')
        .first(),
      
      // Inactive listings
      knex('trade_listings')
        .count('* as inactive')
        .where('status', 'inactive')
        .first(),
      
      // Listings by category
      knex('trade_listings')
        .select('category')
        .count('* as count')
        .whereNotNull('category')
        .andWhere('category', '!=', '')
        .groupBy('category')
        .orderBy('count', 'desc'),
      
      // Listings by location
      knex('trade_listings')
        .select('location')
        .count('* as count')
        .whereNotNull('location')
        .andWhere('location', '!=', '')
        .groupBy('location')
        .orderBy('count', 'desc'),
      
      // Recent listings (last 30 days)
      knex('trade_listings')
        .count('* as recent')
        .where('created_at', '>=', knex.raw("NOW() - INTERVAL '30 days'"))
        .first(),
      
      // Most viewed listings
      knex('trade_listings as tl')
        .leftJoin('trade_listing_views as tlv', 'tl.id', 'tlv.listing_id')
        .select([
          'tl.id',
          'tl.title',
          'tl.category',
          'tl.location',
          knex.raw('COUNT(tlv.id) as views')
        ])
        .groupBy(['tl.id', 'tl.title', 'tl.category', 'tl.location'])
        .orderBy('views', 'desc')
        .limit(10)
    ]);

    return Response.json({
      success: true,
      stats: {
        total: parseInt(totalResult?.total || 0),
        active: parseInt(activeResult?.active || 0),
        completed: parseInt(completedResult?.completed || 0),
        cancelled: parseInt(cancelledResult?.cancelled || 0),
        inactive: parseInt(inactiveResult?.inactive || 0),
        categories: categories || [],
        locations: locations || [],
        recent: parseInt(recentResult?.recent || 0),
        mostViewed: mostViewed || []
      }
    });

  } catch (error) {
    console.error('Trade listings stats API error:', error);
    return Response.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
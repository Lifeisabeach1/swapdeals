// ============================================================================
// FILE 3: app/api/admin/trade-listings/stats/route.js
// Statistics endpoint
// ============================================================================
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const [
      totalResult,
      activeResult,
      completedResult,
      cancelledResult,
      inProgressResult,
      recentResult
    ] = await Promise.all([
      supabase.from('trade_listings').select('*', { count: 'exact', head: true }),
      supabase.from('trade_listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('trade_listings').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('trade_listings').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
      supabase.from('trade_listings').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('trade_listings').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    const { data: categoriesData } = await supabase
      .from('trade_listings')
      .select('category')
      .eq('status', 'active');

    const { data: locationsData } = await supabase
      .from('trade_listings')
      .select('location')
      .eq('status', 'active');

    const categories = {};
    categoriesData?.forEach(item => {
      if (item.category) {
        categories[item.category] = (categories[item.category] || 0) + 1;
      }
    });

    const locations = {};
    locationsData?.forEach(item => {
      if (item.location) {
        locations[item.location] = (locations[item.location] || 0) + 1;
      }
    });

    const { data: mostViewed } = await supabase
      .from('trade_listings')
      .select('id, title, views, status')
      .order('views', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      stats: {
        total: totalResult.count || 0,
        active: activeResult.count || 0,
        completed: completedResult.count || 0,
        cancelled: cancelledResult.count || 0,
        inProgress: inProgressResult.count || 0,
        recent: recentResult.count || 0,
        categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
        locations: Object.entries(locations).map(([name, count]) => ({ name, count })),
        mostViewed: mostViewed || []
      }
    });

  } catch (error) {
    console.error('Trade listings stats error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch statistics'
    }, { status: 500 });
  }
}

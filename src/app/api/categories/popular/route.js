// app/api/categories/popular/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4');
    const days = parseInt(searchParams.get('days') || '30');
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Get listings with active users from the last N days
    const { data: listings, error: listingsError } = await supabase
      .from('trade_listings')
      .select(`
        category,
        views,
        user_id,
        users!inner (
          id,
          is_active
        )
      `)
      .eq('status', 'active')
      .eq('users.is_active', true)
      .gte('created_at', cutoffDate.toISOString())
      .not('category', 'is', null)
      .neq('category', '');
    
    if (listingsError) {
      console.error('Error fetching listings:', listingsError);
      throw listingsError;
    }
    
    // Process the data manually for aggregation
    const categoryStats = {};
    
    listings?.forEach(listing => {
      const category = listing.category;
      
      if (!categoryStats[category]) {
        categoryStats[category] = {
          name: category,
          totalViews: 0,
          listingCount: 0,
          uniqueSellers: new Set()
        };
      }
      
      categoryStats[category].totalViews += parseInt(listing.views) || 0;
      categoryStats[category].listingCount += 1;
      categoryStats[category].uniqueSellers.add(listing.user_id);
    });
    
    // Convert to array and sort
    const categories = Object.values(categoryStats)
      .map(category => ({
        name: category.name,
        totalViews: category.totalViews,
        listingCount: category.listingCount,
        uniqueSellers: category.uniqueSellers.size,
        avgViews: category.listingCount > 0 ? 
          parseFloat((category.totalViews / category.listingCount).toFixed(2)) : 0
      }))
      .sort((a, b) => {
        // Sort by total views first, then by listing count
        if (b.totalViews !== a.totalViews) {
          return b.totalViews - a.totalViews;
        }
        return b.listingCount - a.listingCount;
      })
      .slice(0, limit);
    
    return NextResponse.json({
      success: true,
      categories
    });
    
  } catch (error) {
    console.error('Error in popular categories API:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch popular categories'
    }, { status: 500 });
  }
}

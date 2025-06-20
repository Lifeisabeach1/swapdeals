// app/api/categories/popular/route.js - Debug Version
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';

export async function GET(request) {
  console.log('=== POPULAR CATEGORIES API START ===');
  
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4');
    const days = parseInt(searchParams.get('days') || '30');
    
    console.log('Request params:', { limit, days });
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    console.log('Cutoff date:', cutoffDate);
    
    // First, let's check if we have any listings at all
    const totalListings = await knex('trade_listings')
      .count('id as count')
      .first();
    console.log('Total listings in database:', totalListings);
    
    // Check active listings
    const activeListings = await knex('trade_listings')
      .count('id as count')
      .where('status', 'active')
      .first();
    console.log('Active listings:', activeListings);
    
    // Simple query first
    const allCategories = await knex('trade_listings')
      .select('category')
      .distinct()
      .whereNotNull('category')
      .where('category', '!=', '');
    console.log('All categories in database:', allCategories);
    
    // Now the main query
    const categories = await knex('trade_listings')
      .select([
        'trade_listings.category as name',
        knex.raw('COALESCE(SUM(trade_listings.views), 0) as totalViews'),
        knex.raw('COUNT(trade_listings.id) as listingCount'),
        knex.raw('COUNT(DISTINCT trade_listings.user_id) as uniqueSellers')
      ])
      .innerJoin('users', 'trade_listings.user_id', 'users.id')
      .where('trade_listings.status', 'active')
      .where('users.is_active', true)
      .where('trade_listings.created_at', '>=', cutoffDate)
      .whereNotNull('trade_listings.category')
      .where('trade_listings.category', '!=', '')
      .groupBy('trade_listings.category')
      .orderByRaw('COALESCE(SUM(trade_listings.views), 0) DESC, COUNT(trade_listings.id) DESC')
      .limit(limit);
    
    console.log('Raw categories from query:', categories);
    
    // Convert numeric strings to actual numbers
    const processedCategories = categories.map(category => {
      const processed = {
        name: category.name,
        totalViews: parseInt(category.totalViews) || 0,
        listingCount: parseInt(category.listingCount) || 0,
        uniqueSellers: parseInt(category.uniqueSellers) || 0,
        avgViews: parseFloat(category.avgViews) || 0
      };
      console.log('Processing category:', category, '→', processed);
      return processed;
    });
    
    console.log('Final processed categories:', processedCategories);
    
    const response = {
      success: true,
      data: {
        categories: processedCategories
      },
      debug: {
        totalListings: totalListings.count,
        activeListings: activeListings.count,
        allCategories: allCategories.length,
        foundCategories: categories.length
      }
    };
    
    console.log('=== SENDING RESPONSE ===');
    console.log(JSON.stringify(response, null, 2));
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('=== ERROR IN POPULAR CATEGORIES API ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    
    const errorResponse = {
      success: false,
      message: 'Failed to fetch popular categories',
      error: error.message,
      stack: error.stack
    };
    
    console.log('=== SENDING ERROR RESPONSE ===');
    console.log(JSON.stringify(errorResponse, null, 2));
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
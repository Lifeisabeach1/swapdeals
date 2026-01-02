// ============================================================================
// FILE 1: app/api/admin/trade-listings/route.js
// List all trade listings with pagination and filters
// ============================================================================
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - List all trade listings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('trade_listings')
      .select(`
        id,
        user_id,
        title,
        description,
        category,
        location,
        status,
        views,
        created_at,
        updated_at,
        users!inner (
          username,
          email
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);
    query = query.range(offset, offset + limit - 1);

    const { data: listings, error, count } = await query;

    if (error) throw error;

    const transformedListings = listings.map(listing => ({
      id: listing.id,
      user_id: listing.user_id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      location: listing.location,
      status: listing.status,
      views: listing.views || 0,
      created_at: listing.created_at,
      updated_at: listing.updated_at,
      username: listing.users?.username,
      email: listing.users?.email
    }));

    return NextResponse.json({
      success: true,
      data: transformedListings,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasMore: offset + limit < count
      }
    });

  } catch (error) {
    console.error('Trade listings API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch trade listings'
    }, { status: 500 });
  }
}
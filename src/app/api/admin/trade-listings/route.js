// app/api/admin/trade-listings/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';

async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Authorization required', status: 401 };
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  if (decoded.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }

  return { user: decoded };
}

export async function GET(request) {
  const authCheck = await verifyAdmin(request);
  if (authCheck.error) {
    return NextResponse.json({ 
      success: false, 
      error: authCheck.error 
    }, { status: authCheck.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 100;
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

    const formatted = listings.map(listing => ({
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
      data: formatted,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasMore: offset + limit < count
      }
    });

  } catch (error) {
    console.error('Fetch listings error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch listings'
    }, { status: 500 });
  }
}
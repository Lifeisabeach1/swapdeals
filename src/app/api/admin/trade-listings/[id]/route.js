// app/api/admin/trade-listings/[id]/route.js
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

// DELETE - Delete listing (REQUIRES ADMIN AUTH)
export async function DELETE(request, { params }) {
  const authCheck = await verifyAdmin(request);
  if (authCheck.error) {
    return NextResponse.json({ 
      success: false, 
      error: authCheck.error 
    }, { status: authCheck.status });
  }

  try {
    // ✅ CRITICAL FIX: Await params in Next.js 15
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid listing ID' 
      }, { status: 400 });
    }

    const listingId = parseInt(id);

    // Check if listing exists
    const { data: existingListing, error: fetchError } = await supabase
      .from('trade_listings')
      .select('id, user_id, title')
      .eq('id', listingId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false,
          error: 'Trade listing not found' 
        }, { status: 404 });
      }
      throw fetchError;
    }

    // Delete related data first
    await Promise.allSettled([
      supabase.from('trade_items').delete().eq('listing_id', listingId),
      supabase.from('images').delete().eq('listing_id', listingId),
      supabase.from('trade_listing_views').delete().eq('listing_id', listingId)
    ]);

    // Delete the listing
    const { error: deleteError } = await supabase
      .from('trade_listings')
      .delete()
      .eq('id', listingId);

    if (deleteError) throw deleteError;

    // Log admin action (optional - won't fail if table doesn't exist)
    try {
      await supabase.from('admin_actions').insert({
        admin_id: authCheck.user.id,
        action_type: 'delete',
        target_type: 'trade_listing',
        target_id: listingId,
        details: JSON.stringify({
          title: existingListing.title,
          deleted_by_admin: true
        }),
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.warn('Could not log admin action:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Trade listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete trade listing'
    }, { status: 500 });
  }
}

// GET - Get single listing (public - no auth needed)
export async function GET(request, { params }) {
  try {
    // ✅ CRITICAL FIX: Await params in Next.js 15
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid listing ID' 
      }, { status: 400 });
    }

    const listingId = parseInt(id);

    const { data: listing, error: listingError } = await supabase
      .from('trade_listings')
      .select(`
        *,
        users!inner (
          id,
          username,
          email,
          phone,
          bio,
          location,
          created_at,
          avatar_url
        )
      `)
      .eq('id', listingId)
      .single();

    if (listingError) {
      if (listingError.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false,
          error: 'Trade listing not found' 
        }, { status: 404 });
      }
      throw listingError;
    }

    const [
      { data: items },
      { data: images },
      { count: viewsCount }
    ] = await Promise.all([
      supabase.from('trade_items').select('*').eq('listing_id', listingId),
      supabase.from('images').select('*').eq('listing_id', listingId),
      supabase.from('trade_listing_views').select('*', { count: 'exact', head: true }).eq('listing_id', listingId)
    ]);

    const formattedListing = {
      ...listing,
      items: items || [],
      images: images || [],
      views: viewsCount || 0,
      seller: {
        id: listing.users.id,
        name: listing.users.username,
        email: listing.users.email,
        phone: listing.users.phone,
        bio: listing.users.bio,
        location: listing.users.location,
        joinedDate: listing.users.created_at,
        avatar: listing.users.avatar_url
      }
    };

    delete formattedListing.users;

    return NextResponse.json({
      success: true,
      data: formattedListing
    });

  } catch (error) {
    console.error('Trade listing API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch trade listing'
    }, { status: 500 });
  }
}

// PUT - Update listing (REQUIRES ADMIN AUTH)
export async function PUT(request, { params }) {
  const authCheck = await verifyAdmin(request);
  if (authCheck.error) {
    return NextResponse.json({ 
      success: false, 
      error: authCheck.error 
    }, { status: authCheck.status });
  }

  try {
    // ✅ CRITICAL FIX: Await params in Next.js 15
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid listing ID' 
      }, { status: 400 });
    }

    const listingId = parseInt(id);
    const body = await request.json();
    const { title, description, category, location, status } = body;

    if (title && title.trim().length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Title cannot be empty' 
      }, { status: 400 });
    }

    const validStatuses = ['active', 'in_progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid status value' 
      }, { status: 400 });
    }

    const { data: existingListing, error: fetchError } = await supabase
      .from('trade_listings')
      .select('id, user_id, status, title')
      .eq('id', listingId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false,
          error: 'Trade listing not found' 
        }, { status: 404 });
      }
      throw fetchError;
    }

    const updateData = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (category !== undefined) updateData.category = category?.trim() || null;
    if (location !== undefined) updateData.location = location?.trim() || null;
    if (status !== undefined) updateData.status = status;

    const { error: updateError } = await supabase
      .from('trade_listings')
      .update(updateData)
      .eq('id', listingId);

    if (updateError) throw updateError;

    // Log admin action
    try {
      await supabase.from('admin_actions').insert({
        admin_id: authCheck.user.id,
        action_type: 'update',
        target_type: 'trade_listing',
        target_id: listingId,
        details: JSON.stringify({
          old_status: existingListing.status,
          updates: updateData
        }),
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.warn('Could not log admin action:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Trade listing updated successfully'
    });

  } catch (error) {
    console.error('Update listing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update trade listing'
    }, { status: 500 });
  }
}
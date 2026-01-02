// app/api/users/[userId]/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers'; // ← LÄGG TILL
import { verifyToken } from '@/lib/auth/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Public/Private (depends on ownership)
export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const includeStatus = searchParams.get('include')?.includes('status');
    const includeStats = searchParams.get('include')?.includes('stats');
    
    // ← FIX: Check auth (optional) med headers()
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    let currentUser = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded) currentUser = decoded;
    }
    
    const isOwnProfile = currentUser?.id == userId;
    const isAdmin = currentUser?.role === 'admin';
    const hasDetailedAccess = isOwnProfile || isAdmin;
    
    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Get listing stats
    const { data: listings } = await supabase
      .from('trade_listings')
      .select('id, status, views')
      .eq('user_id', userId);

    const listingStats = {
      total_listings: listings?.length || 0,
      active_listings: listings?.filter(l => l.status === 'active').length || 0,
      completed_listings: listings?.filter(l => l.status === 'completed').length || 0,
      avg_views: listings?.length ? listings.reduce((sum, l) => sum + (l.views || 0), 0) / listings.length : 0
    };

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username;

    // Response based on access level
    let responseData;
    
    if (hasDetailedAccess) {
      // Full profile
      responseData = {
        id: user.id,
        username: user.username,
        name: fullName,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        location: user.location,
        role: user.role,
        isActive: user.is_active,
        isBanned: user.is_banned,
        bannedAt: user.banned_at,
        lastLoginAt: user.last_login_at,
        joinedDate: user.created_at,
        updatedAt: user.updated_at,
        avatar: user.avatar_url,
        ...listingStats
      };
    } else {
      // Public profile
      responseData = {
        id: user.id,
        username: user.username,
        name: fullName,
        bio: user.bio,
        location: user.location,
        joinedDate: user.created_at,
        avatar: user.avatar_url,
        totalListings: listingStats.total_listings,
        activeListings: listingStats.active_listings,
        isBanned: user.is_banned
      };
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch user'
    }, { status: 500 });
  }
}

// PUT - Update user (own profile or admin)
export async function PUT(request, { params }) {
  try {
    const { userId } = await params;
    const body = await request.json();
    
    // ← FIX: Verify auth med headers()
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }
    
    const isOwnProfile = decoded.id == userId;
    const isAdmin = decoded.role === 'admin';
    
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied' 
      }, { status: 403 });
    }
    
    // Check user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    // Prepare update
    const updateData = { ...body };
    
    // Remove sensitive fields for non-admins
    if (!isAdmin) {
      delete updateData.role;
      delete updateData.is_active;
      delete updateData.is_banned;
      delete updateData.banned_at;
      delete updateData.id;
      delete updateData.created_at;
    }

    updateData.updated_at = new Date().toISOString();
    
    // Update
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, username, first_name, last_name, email, phone, bio, location, role, is_active, is_banned, avatar_url, created_at, updated_at')
      .single();

    if (updateError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update user' 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update user' 
    }, { status: 500 });
  }
}

// DELETE - Admin only
export async function DELETE(request, { params }) {
  try {
    const { userId } = await params;
    
    // ← FIX: Verify auth med headers()
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }
    
    // Admin check
    if (decoded.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin access required' 
      }, { status: 403 });
    }
    
    // Check user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    // Prevent self-deletion
    if (decoded.id == userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      }, { status: 400 });
    }
    
    // Delete related data
    const { data: userListings } = await supabase
      .from('trade_listings')
      .select('id')
      .eq('user_id', userId);

    if (userListings?.length > 0) {
      const listingIds = userListings.map(l => l.id);
      await supabase.from('trade_items').delete().in('listing_id', listingIds);
    }
    
    // Delete user data
    await Promise.all([
      supabase.from('images').delete().eq('user_id', userId),
      supabase.from('trade_listings').delete().eq('user_id', userId),
      supabase.from('bans').delete().eq('user_id', userId)
    ]);
    
    // Delete user
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteUserError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to delete user' 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete user' 
    }, { status: 500 });
  }
}
// src/app/api/users/[userId]/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { knex } from '@/lib/db/index.js';

// JWT verification utility
function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No valid authorization header' };
    }
    
    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      return { success: false, error: 'Server configuration error' };
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, user: decoded };
  } catch (error) {
    return { success: false, error: 'Invalid or expired token' };
  }
}

/**
 * Get user profile - Public access for basic info, authenticated for detailed info
 * @route GET /api/users/:userId?include=status,stats
 */
export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const includeStatus = searchParams.get('include')?.includes('status');
    const includeStats = searchParams.get('include')?.includes('stats');
    
    // Check for authentication
    const authResult = verifyToken(request);
    const isAuthenticated = authResult.success;
    const currentUser = authResult.user;
    
    // Check permissions
    const isOwnProfile = isAuthenticated && (currentUser.userId || currentUser.id) == userId;
    const isAdmin = isAuthenticated && currentUser.role === 'admin';
    const hasDetailedAccess = isOwnProfile || isAdmin;
    
    // Get basic user profile with listing count
    const userQuery = knex('users')
      .select([
        'users.id',
        'users.username',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.phone',
        'users.bio',
        'users.location',
        'users.role',
        'users.is_active',
        'users.is_banned',
        'users.banned_at',
        'users.last_login_at',
        'users.created_at as joined_date',
        'users.updated_at',
        'users.avatar_url',
        knex.raw('COUNT(DISTINCT trade_listings.id) as total_listings'),
        knex.raw('COUNT(DISTINCT CASE WHEN trade_listings.status = ? THEN trade_listings.id END) as active_listings', ['active']),
        knex.raw('COUNT(DISTINCT CASE WHEN trade_listings.status = ? THEN trade_listings.id END) as completed_listings', ['completed']),
        knex.raw('AVG(trade_listings.views) as avg_views')
      ])
      .leftJoin('trade_listings', function() {
        this.on('users.id', '=', 'trade_listings.user_id');
      })
      .where('users.id', userId)
      .groupBy([
        'users.id',
        'users.username',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.phone',
        'users.bio',
        'users.location',
        'users.role',
        'users.is_active',
        'users.is_banned',
        'users.banned_at',
        'users.last_login_at',
        'users.created_at',
        'users.updated_at',
        'users.avatar_url'
      ])
      .first();

    const user = await userQuery;

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Create full name from first_name and last_name
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username;

    // Prepare response data based on access level
    let responseData;
    
    if (hasDetailedAccess) {
      // Full profile for own profile or admin
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
        joinedDate: user.joined_date,
        updatedAt: user.updated_at,
        avatar: user.avatar_url,
        totalListings: parseInt(user.total_listings) || 0,
        activeListings: parseInt(user.active_listings) || 0,
        completedListings: parseInt(user.completed_listings) || 0,
        averageViews: parseFloat(user.avg_views) || 0
      };
    } else {
      // Public profile - limited information
      responseData = {
        id: user.id,
        username: user.username,
        name: fullName,
        bio: user.bio,
        location: user.location,
        joinedDate: user.joined_date,
        avatar: user.avatar_url,
        totalListings: parseInt(user.total_listings) || 0,
        activeListings: parseInt(user.active_listings) || 0,
        isBanned: user.is_banned // Public info for safety
      };
    }

    // Include status information if requested and authorized
    if (includeStatus && hasDetailedAccess) {
      try {
        // Get active bans (if you have a separate bans table)
        const activeBan = await knex('bans')
          .where('user_id', userId)
          .where('is_active', true)
          .where(function() {
            this.whereNull('expires_at').orWhere('expires_at', '>', new Date());
          })
          .first();

        // Get report statistics (if you have a reports table)
        const reportStats = await knex('reports')
          .where('reported_user_id', userId)
          .select([
            knex.raw('COUNT(*) as total_reports'),
            knex.raw('COUNT(CASE WHEN status = ? THEN 1 END) as pending_reports', ['pending']),
            knex.raw('COUNT(CASE WHEN status = ? THEN 1 END) as resolved_reports', ['resolved'])
          ])
          .first();

        responseData.status = {
          banned: user.is_banned || !!activeBan,
          banInfo: activeBan ? {
            reason: activeBan.reason,
            banType: activeBan.ban_type,
            createdAt: activeBan.created_at,
            expiresAt: activeBan.expires_at,
            reportCount: activeBan.report_count
          } : (user.is_banned ? {
            bannedAt: user.banned_at,
            reason: 'Banned by admin'
          } : null),
          reportStats: reportStats ? {
            totalReports: parseInt(reportStats.total_reports) || 0,
            pendingReports: parseInt(reportStats.pending_reports) || 0,
            resolvedReports: parseInt(reportStats.resolved_reports) || 0
          } : null
        };
      } catch (statusError) {
        console.error('Error fetching user status:', statusError);
        responseData.status = {
          error: 'Could not fetch status information'
        };
      }
    }

    // Include detailed statistics if requested and authorized
    if (includeStats && hasDetailedAccess) {
      try {
        // Get category breakdown
        const categoryStats = await knex('trade_listings')
          .select('category')
          .count('* as count')
          .where('user_id', userId)
          .where('status', 'active')
          .groupBy('category')
          .orderBy('count', 'desc');

        // Get recent activity
        const recentActivity = await knex('trade_listings')
          .select(['id', 'title', 'created_at', 'status', 'views'])
          .where('user_id', userId)
          .orderBy('created_at', 'desc')
          .limit(5);

        responseData.stats = {
          categoryBreakdown: categoryStats.map(cat => ({
            category: cat.category,
            count: parseInt(cat.count)
          })),
          recentActivity: recentActivity,
          lastActivity: recentActivity.length > 0 ? recentActivity[0].created_at : null
        };
      } catch (statsError) {
        console.error('Error fetching user stats:', statsError);
        responseData.stats = {
          error: 'Could not fetch statistics'
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    }, { status: 500 });
  }
}

/**
 * Update user - Admin access or own profile
 * @route PUT /api/users/:userId
 */
export async function PUT(request, { params }) {
  try {
    const { userId } = params;
    const body = await request.json();
    
    // Verify authentication
    const authResult = verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    const currentUser = authResult.user;
    const currentUserId = currentUser.userId || currentUser.id;
    
    // Check permissions
    const isOwnProfile = currentUserId == userId;
    const isAdmin = currentUser.role === 'admin';
    
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied' 
      }, { status: 403 });
    }
    
    // Check if user exists
    const existingUser = await knex('users').where('id', userId).first();
    if (!existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    // Prepare update data
    const updateData = { ...body };
    
    // Remove sensitive fields that regular users can't update
    if (!isAdmin) {
      delete updateData.role;
      delete updateData.is_active;
      delete updateData.is_banned;
      delete updateData.banned_at;
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;
    }

    // Add updated timestamp
    updateData.updated_at = new Date();
    
    // Update user
    await knex('users').where('id', userId).update(updateData);
    
    // Fetch updated user
    const updatedUser = await knex('users')
      .select([
        'id', 
        'username', 
        'first_name', 
        'last_name', 
        'email', 
        'phone', 
        'bio', 
        'location', 
        'role', 
        'is_active', 
        'is_banned',
        'avatar_url', 
        'created_at', 
        'updated_at'
      ])
      .where('id', userId)
      .first();
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update user',
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * Delete user - Admin only
 * @route DELETE /api/users/:userId
 */
export async function DELETE(request, { params }) {
  try {
    const { userId } = params;
    
    // Verify authentication
    const authResult = verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    const currentUser = authResult.user;
    const currentUserId = currentUser.userId || currentUser.id;
    
    // Check if user is admin
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin access required' 
      }, { status: 403 });
    }
    
    // Check if user exists
    const existingUser = await knex('users').where('id', userId).first();
    if (!existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    // Prevent self-deletion
    if (currentUserId == userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      }, { status: 400 });
    }
    
    // Use transaction to safely delete user and related data
    await knex.transaction(async (trx) => {
      // Delete related data first
      await trx('trade_items').whereIn('listing_id', 
        trx('trade_listings').select('id').where('user_id', userId)
      ).del();
      
      await trx('images').where('user_id', userId).del();
      await trx('trade_listings').where('user_id', userId).del();
      await trx('bans').where('user_id', userId).del();
      
      // Delete user
      await trx('users').where('id', userId).del();
    });
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete user',
      error: error.message 
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import { requireAdmin } from '@/lib/middleware/auth';

/**
 * Unban user (Admin only)
 * @route DELETE /api/admin/bans/[userId]
 */
async function unbanUser(req, { params }) {
  try {
    const { userId } = params;
    const adminId = req.user.id;

    console.log('Unbanning user:', userId, 'by admin:', adminId);

    // Check if user has active ban
    const activeBan = await knex('bans')
      .where('user_id', userId)
      .where('is_active', true)
      .first();

    if (!activeBan) {
      return NextResponse.json({
        success: false,
        error: 'User is not currently banned'
      }, { status: 400 });
    }

    // Deactivate the ban
    await knex('bans')
      .where('user_id', userId)
      .where('is_active', true)
      .update({ 
        is_active: false,
        updated_at: new Date()
      });

    // Update user status
    await knex('users')
      .where('id', userId)
      .update({ 
        status: 'active',
        banned: false,
        updated_at: new Date()
      });

    console.log('User unbanned successfully:', userId);

    return NextResponse.json({
      success: true,
      message: 'User unbanned successfully'
    });

  } catch (error) {
    console.error('Unban error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Get user ban history (Admin only)
 * @route GET /api/admin/bans/[userId]
 */
async function getUserBanHistory(req, { params }) {
  try {
    const { userId } = params;

    const history = await knex('bans')
      .select(
        'bans.*',
        'admin_users.username as banned_by_username'
      )
      .leftJoin('users as admin_users', 'bans.banned_by', 'admin_users.id')
      .where('bans.user_id', userId)
      .orderBy('bans.created_at', 'desc');

    return NextResponse.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Get ban history error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}

export const DELETE = requireAdmin(unbanUser);
export const GET = requireAdmin(getUserBanHistory);


// @/lib/middleware/banCheck.js
import { knex } from '@/lib/db/index.js';
import { NextResponse } from 'next/server';

export async function checkUserBan(userId) {
  try {
    const activeBan = await knex('bans')
      .where('user_id', userId)
      .where('is_active', true)
      .where(function() {
        this.whereNull('expires_at')
          .orWhere('expires_at', '>', new Date());
      })
      .first();

    if (activeBan) {
      return {
        isBanned: true,
        reason: activeBan.reason,
        expiresAt: activeBan.expires_at,
        isPermanent: !activeBan.expires_at
      };
    }

    return { isBanned: false };
  } catch (error) {
    console.error('Error checking user ban:', error);
    return { isBanned: false }; // Fail open for safety
  }
}

export function requireNotBanned(handler) {
  return async function(request, context) {
    try {
      // Assuming user is attached to request by auth middleware
      if (!request.user || !request.user.id) {
        return NextResponse.json({
          success: false,
          error: 'Authentication required'
        }, { status: 401 });
      }

      const banCheck = await checkUserBan(request.user.id);
      
      if (banCheck.isBanned) {
        const message = banCheck.isPermanent 
          ? `Your account has been permanently banned. Reason: ${banCheck.reason}`
          : `Your account is banned until ${new Date(banCheck.expiresAt).toLocaleString()}. Reason: ${banCheck.reason}`;

        return NextResponse.json({
          success: false,
          error: 'Account banned',
          message,
          banned: true,
          banDetails: {
            reason: banCheck.reason,
            expiresAt: banCheck.expiresAt,
            isPermanent: banCheck.isPermanent
          }
        }, { status: 403 });
      }

      return handler(request, context);
    } catch (error) {
      console.error('Ban check middleware error:', error);
      return NextResponse.json({
        success: false,
        error: 'Internal server error'
      }, { status: 500 });
    }
  };
}
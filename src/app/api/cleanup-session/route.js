// src/app/api/cleanup-sessions/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db/knex';

export async function GET(request) {
  try {
    // Security: Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Check if it's a Vercel cron job or has the correct secret
    const isVercelCron = request.headers.get('user-agent')?.includes('vercel');
    const hasValidSecret = cronSecret && authHeader === `Bearer ${cronSecret}`;
    
    if (!isVercelCron && !hasValidSecret) {
      console.log('❌ Unauthorized cleanup attempt');
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    console.log('🧹 Starting automated session cleanup via Vercel Cron...');
    
    // Get current stats before cleanup
    const totalSessionsBefore = await db('sessions').count('* as count').first();
    const activeSessionsBefore = await db('sessions')
      .where('is_active', true)
      .where('expires_at', '>', new Date())
      .count('* as count')
      .first();
    
    console.log(`📊 Sessions before cleanup: Total ${totalSessionsBefore.count}, Active ${activeSessionsBefore.count}`);
    
    // Delete expired sessions
    const deletedCount = await db('sessions')
      .where('expires_at', '<', new Date())
      .orWhere('is_active', false)
      .del();
    
    // Get updated stats
    const activeSessionsAfter = await db('sessions')
      .where('is_active', true)
      .where('expires_at', '>', new Date())
      .count('* as count')
      .first();
    
    // Get sessions by user for monitoring
    const sessionsByUser = await db('sessions')
      .select('user_id')
      .count('* as count')
      .where('is_active', true)
      .where('expires_at', '>', new Date())
      .groupBy('user_id')
      .limit(10); // Top 10 users with most sessions
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      cleanup: {
        deletedSessions: deletedCount,
        activeSessionsBefore: activeSessionsBefore.count,
        activeSessionsAfter: activeSessionsAfter.count
      },
      stats: {
        topUsersSessions: sessionsByUser
      }
    };
    
    console.log(`✅ Session cleanup completed:`, {
      deleted: deletedCount,
      activeBefore: activeSessionsBefore.count,
      activeAfter: activeSessionsAfter.count
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Session cleanup failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also allow POST for manual triggers (with proper auth)
export async function POST(request) {
  try {
    // For manual triggers, require authentication
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }
    
    const { dryRun = false } = await request.json();
    
    console.log(`🧹 Starting manual session cleanup (dry run: ${dryRun})...`);
    
    // Find what would be deleted
    const expiredSessions = await db('sessions')
      .select(['user_id', 'expires_at', 'is_active', 'created_at'])
      .where('expires_at', '<', new Date())
      .orWhere('is_active', false);
    
    let deletedCount = 0;
    
    if (!dryRun) {
      deletedCount = await db('sessions')
        .where('expires_at', '<', new Date())
        .orWhere('is_active', false)
        .del();
    } else {
      deletedCount = expiredSessions.length;
    }
    
    const activeCount = await db('sessions')
      .where('is_active', true)
      .where('expires_at', '>', new Date())
      .count('* as count')
      .first();
    
    const result = {
      success: true,
      dryRun,
      timestamp: new Date().toISOString(),
      cleanup: {
        foundExpired: expiredSessions.length,
        deletedSessions: deletedCount,
        activeSessionsRemaining: activeCount.count
      },
      expiredSessions: dryRun ? expiredSessions : undefined
    };
    
    console.log(`✅ Manual cleanup ${dryRun ? 'preview' : 'completed'}:`, {
      found: expiredSessions.length,
      deleted: deletedCount,
      active: activeCount.count
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Manual session cleanup failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
// src/app/api/cleanup-sessions/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to verify cron authorization
function verifyCronAuth(request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Check if it's a Vercel cron job or has the correct secret
  const isVercelCron = request.headers.get('user-agent')?.includes('vercel');
  const hasValidSecret = cronSecret && authHeader === `Bearer ${cronSecret}`;
  
  return isVercelCron || hasValidSecret;
}

export async function GET(request) {
  try {
    // Verify authorization
    if (!verifyCronAuth(request)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get current stats before cleanup
    const { count: totalSessionsBefore } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });
    
    const { count: activeSessionsBefore } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());
    
    // Delete expired sessions
    const { error: deleteError } = await supabase
      .from('sessions')
      .delete()
      .or(`expires_at.lt.${new Date().toISOString()},is_active.eq.false`);
    
    if (deleteError) {
      console.error('Error deleting sessions:', deleteError);
      throw deleteError;
    }
    
    // Get updated stats
    const { count: totalSessionsAfter } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });
    
    const { count: activeSessionsAfter } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());
    
    const deletedCount = (totalSessionsBefore || 0) - (totalSessionsAfter || 0);
    
    // Get sessions by user for monitoring
    const { data: sessionsByUser } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .limit(10);
    
    // Count sessions per user
    const userSessionCounts = {};
    sessionsByUser?.forEach(session => {
      userSessionCounts[session.user_id] = (userSessionCounts[session.user_id] || 0) + 1;
    });
    
    const topUsersSessions = Object.entries(userSessionCounts)
      .map(([user_id, count]) => ({ user_id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cleanup: {
        deletedSessions: deletedCount,
        activeSessionsBefore: activeSessionsBefore || 0,
        activeSessionsAfter: activeSessionsAfter || 0
      },
      stats: {
        topUsersSessions
      }
    });
    
  } catch (error) {
    console.error('Session cleanup failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Session cleanup failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Manual triggers with proper auth
export async function POST(request) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }
    
    const body = await request.json();
    const { dryRun = false } = body;
    
    // Find what would be deleted
    const { data: expiredSessions } = await supabase
      .from('sessions')
      .select('user_id, expires_at, is_active, created_at')
      .or(`expires_at.lt.${new Date().toISOString()},is_active.eq.false`);
    
    let deletedCount = 0;
    
    if (!dryRun) {
      const { count: beforeCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });
      
      const { error: deleteError } = await supabase
        .from('sessions')
        .delete()
        .or(`expires_at.lt.${new Date().toISOString()},is_active.eq.false`);
      
      if (deleteError) {
        throw deleteError;
      }
      
      const { count: afterCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });
      
      deletedCount = (beforeCount || 0) - (afterCount || 0);
    } else {
      deletedCount = expiredSessions?.length || 0;
    }
    
    const { count: activeCount } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());
    
    return NextResponse.json({
      success: true,
      dryRun,
      timestamp: new Date().toISOString(),
      cleanup: {
        foundExpired: expiredSessions?.length || 0,
        deletedSessions: deletedCount,
        activeSessionsRemaining: activeCount || 0
      },
      expiredSessions: dryRun ? expiredSessions : undefined
    });
    
  } catch (error) {
    console.error('Manual session cleanup failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Manual session cleanup failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

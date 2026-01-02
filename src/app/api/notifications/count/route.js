// ============================================
// app/api/notifications/count/route.js
// ============================================

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request) {
  try {
    // Verify auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Authorization required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ 
        error: 'Invalid or expired token' 
      }, { status: 401 });
    }

    // TODO: Implement actual notification count query
    // Example with Supabase:
    // const { count } = await supabase
    //   .from('notifications')
    //   .select('*', { count: 'exact', head: true })
    //   .eq('user_id', decoded.id)
    //   .is('read_at', null);

    const count = 0; // Placeholder

    return NextResponse.json({
      success: true,
      data: { count }
    });

  } catch (error) {
    console.error('Error fetching notification count:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notification count'
    }, { status: 500 });
  }
}
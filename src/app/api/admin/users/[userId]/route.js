// app/api/users/[userId]/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';

export async function GET(request, { params }) {
  try {
    // AWAIT params before accessing properties - Next.js 15 requirement
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const includeStatus = searchParams.get('include')?.includes('status');
    const includeStats = searchParams.get('include')?.includes('stats');

    // Your existing logic here...
    const user = await knex('users')
      .where('id', userId)
      .first();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Add status and stats if requested
    let result = { ...user };
    
    if (includeStatus) {
      // Add user status logic
    }
    
    if (includeStats) {
      // Add user stats logic
    }

    return NextResponse.json({
      success: true,
      user: result
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user'
    }, { status: 500 });
  }
}

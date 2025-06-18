// Create: app/api/auth/me/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import knex from '@/lib/db'; // Adjust path to your knex instance

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const sessionId = cookieStore.get('session-id')?.value;

    // Option 1: Simple development bypass (remove in production)
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        isAdmin: true,
        user: {
          id: 1,
          username: 'admin',
          role: 'admin'
        }
      });
    }

    // Option 2: Check session in database
    if (sessionId) {
      const user = await knex('users')
        .join('sessions', 'users.id', 'sessions.user_id')
        .where('sessions.id', sessionId)
        .where('sessions.expires_at', '>', new Date())
        .select('users.*')
        .first();

      if (user && user.role === 'admin') {
        return NextResponse.json({
          isAdmin: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      }
    }

    // Option 3: Check auth token
    if (authToken) {
      const user = await knex('users')
        .where('auth_token', authToken)
        .where('role', 'admin')
        .first();

      if (user) {
        return NextResponse.json({
          isAdmin: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      }
    }

    return NextResponse.json({
      isAdmin: false,
      error: 'Unauthorized'
    }, { status: 401 });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      isAdmin: false,
      error: 'Server error'
    }, { status: 500 });
  }
}
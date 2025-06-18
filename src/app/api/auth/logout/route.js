// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import Session from '@/lib/db/models/Session';
import jwtUtils from '@/lib/auth/jwt';

/**
 * Logout user - shared logic
 */
async function handleLogout(request) {
  try {
    console.log('=== Logout Start ===');
    
    // Get token from authorization header or cookies
    let token = null;
    
    // First try authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // If no auth header, try to get from cookies
    if (!token) {
      const cookies = request.headers.get('cookie');
      console.log('Raw cookies:', cookies);
      
      if (cookies) {
        const tokenCookie = cookies
          .split(';')
          .find(cookie => cookie.trim().startsWith('auth_token='));
        
        console.log('Found auth_token cookie:', tokenCookie);
        
        if (tokenCookie) {
          // Handle URL-encoded values and trim whitespace
          token = decodeURIComponent(tokenCookie.split('=')[1]).trim();
        }
      }
    }

    console.log('Token found:', token ? 'YES' : 'NO');
    console.log('Token length:', token ? token.length : 0);
    
    // If we have a token, try to delete the session
    if (token) {
      try {
        // Decode JWT to verify it's valid
        console.log('Attempting to decode JWT token...');
        const decoded = jwtUtils.verify(token);
        console.log('JWT decoded successfully:', { ...decoded, iat: '[HIDDEN]', exp: '[HIDDEN]' });
        
        // Delete session if exists
        try {
          const session = await Session.findByToken(token);
          if (session) {
            await Session.delete(session.id);
            console.log('✅ Session deleted successfully');
          } else {
            console.log('ℹ️ No session found for token');
          }
        } catch (sessionErr) {
          console.error('⚠️ Session deletion failed:', sessionErr.message);
        }
        
      } catch (jwtError) {
        console.error('❌ JWT verification failed:', jwtError.message);
        console.error('JWT Error details:', jwtError);
        // Continue with logout even if JWT verification fails
      }
    } else {
      console.log('❌ No token found in request');
    }

    // Create response and clear auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 });

    // Clear the auth token cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0), // Expire immediately
      path: '/'
    });

    console.log('=== Logout End - Success ===');
    return response;

  } catch (error) {
    console.error('=== Logout End - Error ===');
    console.error('Logout error:', error);

    // Even if there's an error, clear the cookie and return success
    const response = NextResponse.json({
      success: true,
      message: 'Logged out'
    }, { status: 200 });

    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/'
    });

    return response;
  }
}

/**
 * Logout user - POST method
 * @route POST /api/auth/logout
 */
export async function POST(request) {
  return handleLogout(request);
}

/**
 * Logout user - GET method (for browser navigation)
 * @route GET /api/auth/logout
 */
export async function GET(request) {
  return handleLogout(request);
}
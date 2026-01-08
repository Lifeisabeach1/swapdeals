// middleware.js - Authentication middleware for protected routes
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Paths that don't require authentication
  const publicPaths = [
    '/login',
    '/register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-reset-code',
    '/api/test',
    '/api/debug',
    '/api/trades', // Public listings
    '/', // Homepage
    '/_next', // Next.js internals
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ];
  
  const path = request.nextUrl.pathname;
  
  // Check if the path is public
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }
  
  // Get the token from cookies using request.cookies (NOT cookies() from next/headers)
  const token = request.cookies.get('auth_token')?.value;
  
  // If no token found for protected routes, redirect to login
  if (!token && (path.startsWith('/dashboard') || path.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // For API routes that require auth, they will handle it themselves
  // Just pass through
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/api/user/:path*',
    // Add other protected routes here
  ],
};
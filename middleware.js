import { NextResponse } from 'next/server';

const rateLimitMap = new Map();

function rateLimit(ip, key, { limit, windowMs }) {
  const mapKey = `${ip}:${key}`;
  const now = Date.now();
  const record = rateLimitMap.get(mapKey) || { count: 0, start: now };

  if (now - record.start > windowMs) {
    record.count = 0;
    record.start = now;
  }

  record.count++;
  rateLimitMap.set(mapKey, record);

  return record.count > limit;
}

export function middleware(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const path = request.nextUrl.pathname;

  // --- STRICTEST: Auth routes (protects Supabase auth + stops brute force) ---
  if (
    path.startsWith('/api/auth/login') ||
    path.startsWith('/api/auth/register') ||
    path.startsWith('/api/auth/forgot-password') ||
    path.startsWith('/api/auth/reset-password') ||
    path.startsWith('/api/auth/verify-reset-code')
  ) {
    if (rateLimit(ip, 'auth', { limit: 5, windowMs: 600_000 })) { // 5 per 10 min
      return new NextResponse('Too Many Requests', { status: 429, headers: { 'Retry-After': '600' } });
    }
  }

  // --- STRICT: All other API routes (protects Supabase DB calls + Vercel functions) ---
  else if (path.startsWith('/api/')) {
    if (rateLimit(ip, 'api', { limit: 30, windowMs: 600_000 })) { // 30 per 10 min
      return new NextResponse('Too Many Requests', { status: 429, headers: { 'Retry-After': '600' } });
    }
  }

  // --- RELAXED: Page navigation (no Supabase/Vercel cost, just Next.js) ---
  else {
    if (rateLimit(ip, 'pages', { limit: 100, windowMs: 600_000 })) { // 100 per 10 min
      return new NextResponse('Too Many Requests', { status: 429, headers: { 'Retry-After': '600' } });
    }
  }

  // --- AUTH LOGIC ---
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
    '/api/trades',
    '/',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ];

  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token && (path.startsWith('/dashboard') || path.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
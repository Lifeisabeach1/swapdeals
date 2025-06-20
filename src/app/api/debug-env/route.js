// app/api/debug-env/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
    DATABASE_URL_LENGTH: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
    DATABASE_URL_STARTS_WITH: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    ALL_ENV_KEYS: Object.keys(process.env).filter(key => 
      key.includes('DATABASE') || 
      key.includes('SUPABASE') || 
      key.includes('DB_')
    )
  });
}
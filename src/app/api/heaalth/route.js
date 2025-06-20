// app/api/health/route.js - Health check endpoint

import { checkDatabaseHealth } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    const healthStatus = {
      status: dbHealth.healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || 'unknown'
    };

    return NextResponse.json(
      healthStatus,
      { status: dbHealth.healthy ? 200 : 503 }
    );
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      { status: 500 }
    );
  }
}
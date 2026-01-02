// app/api/debug/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        serviceRolePrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...',
        hasJwtSecret: !!process.env.JWT_SECRET,
      },
      tests: {}
    };

    // Test 1: Supabase Admin Connection
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );

        const { data: tradesCount, error: tradesError } = await supabaseAdmin
          .from('trades')
          .select('id', { count: 'exact', head: true });

        results.tests.supabaseAdminConnection = {
          success: !tradesError,
          tradesTableAccessible: !tradesError,
          error: tradesError?.message,
          errorDetails: tradesError
        };

        // Test 2: Check specific tables
        const tables = ['trades', 'trade_messages', 'listings', 'users'];
        results.tests.tableAccess = {};

        for (const table of tables) {
          const { error } = await supabaseAdmin
            .from(table)
            .select('id', { count: 'exact', head: true })
            .limit(1);

          results.tests.tableAccess[table] = {
            accessible: !error,
            error: error?.message
          };
        }

      } catch (error) {
        results.tests.supabaseAdminConnection = {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    } else {
      results.tests.supabaseAdminConnection = {
        success: false,
        error: 'Missing Supabase credentials'
      };
    }

    // Test 3: Anon Key Connection
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabaseAnon = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { error: anonError } = await supabaseAnon
          .from('listings')
          .select('id', { count: 'exact', head: true })
          .limit(1);

        results.tests.supabaseAnonConnection = {
          success: !anonError,
          error: anonError?.message
        };
      } catch (error) {
        results.tests.supabaseAnonConnection = {
          success: false,
          error: error.message
        };
      }
    }

    // Test 4: JWT Verification
    results.tests.jwtConfiguration = {
      jwtSecretConfigured: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0
    };

    // Test 5: Headers
    const authHeader = request.headers.get('authorization');
    results.tests.authHeader = {
      present: !!authHeader,
      format: authHeader?.startsWith('Bearer ') ? 'valid' : 'invalid or missing'
    };

    // Overall status
    results.overallStatus = {
      allEnvVarsPresent: results.environment.hasSupabaseUrl && 
                          results.environment.hasSupabaseAnonKey && 
                          results.environment.hasServiceRoleKey && 
                          results.environment.hasJwtSecret,
      supabaseConnected: results.tests.supabaseAdminConnection?.success,
      readyForProduction: results.tests.supabaseAdminConnection?.success && 
                          results.environment.hasJwtSecret
    };

    return NextResponse.json(results, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
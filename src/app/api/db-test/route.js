// app/api/db-test/route.js
import { NextResponse } from 'next/server';
import knex from 'knex';
const knexConfig = require('../../../knexfile.js');

export async function GET() {
  let db;
  
  try {
    // Use production config in production, development locally
    const config = process.env.NODE_ENV === 'production' ? knexConfig.production : knexConfig.development;
    db = knex(config);
    
    // Test basic connection
    const result = await db.raw('SELECT NOW() as current_time');
    
    // Test if tables exist
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      environment: process.env.NODE_ENV,
      currentTime: result.rows[0],
      tablesFound: tables.rows.length,
      tables: tables.rows.map(t => t.table_name)
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail || 'No additional details',
      environment: process.env.NODE_ENV
    }, { status: 500 });
    
  } finally {
    if (db) {
      await db.destroy();
    }
  }
}
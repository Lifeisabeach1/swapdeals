// Test database connection
// Add this to a temporary API route: /api/test-db.js

import { Pool } from 'pg';

const pool = new Pool({
  host: 'aws-0-eu-north-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.obczdbbbcppsjbiyayvq',
  password: 'Sharky2277!!00',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  try {
    // Test basic connection
    const client = await pool.connect();
    
    // Test a simple query
    const result = await client.query('SELECT current_database(), current_user, version()');
    
    client.release();
    
    res.status(200).json({
      success: true,
      connection: 'OK',
      database: result.rows[0].current_database,
      user: result.rows[0].current_user,
      version: result.rows[0].version
    });
    
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail
    });
  }
}
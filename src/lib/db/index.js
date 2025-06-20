// lib/db/index.js - Global singleton for serverless
import knex from 'knex';

// Use global to ensure singleton across serverless function calls
const globalForDb = globalThis;

// Create database configuration
const dbConfig = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL ? {
    // If using DATABASE_URL (like Supabase connection string)
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  } : {
    // If using individual environment variables
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 0,        // No minimum connections
    max: 2,        // Increased slightly for better performance
    createTimeoutMillis: 10000,
    acquireTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
    propagateCreateError: false
  },
  acquireConnectionTimeout: 10000
};

// Create or reuse the database instance
const db = globalForDb.db ?? knex(dbConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}

// Export both named and default exports for compatibility
export { db as knex };
export default db;
// lib/db/index.js - Global singleton for serverless
import knex from 'knex';

// Use global to ensure singleton across serverless function calls
const globalForDb = globalThis;

// Create database configuration
const dbConfig = {
  client: 'postgresql',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 0,        // Keep at 0 for serverless
    max: 1,        // CRITICAL: Set to 1 for serverless environments
    createTimeoutMillis: 30000,    // Increased timeout
    acquireTimeoutMillis: 30000,   // Increased timeout
    idleTimeoutMillis: 30000,      // Increased idle timeout
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
    propagateCreateError: false,
    // Add these important settings
    destroyTimeoutMillis: 5000,
    log: (message, logLevel) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Knex ${logLevel}: ${message}`);
      }
    }
  },
  // Remove this duplicate property
  // acquireConnectionTimeout: 10000,  // This is redundant with acquireTimeoutMillis
  
  // Add these important serverless optimizations
  debug: process.env.NODE_ENV !== 'production',
  asyncStackTraces: process.env.NODE_ENV !== 'production'
};

// Create or reuse the database instance
const db = globalForDb.db ?? knex(dbConfig);

// In production, ensure we're using the global instance
if (process.env.NODE_ENV === 'production') {
  globalForDb.db = db;
} else {
  globalForDb.db = db;
}

// Add graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Gracefully shutting down database connections...');
  await db.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Gracefully shutting down database connections...');
  await db.destroy();
  process.exit(0);
});

// Export both named and default exports for compatibility
export { db as knex };
export default db;
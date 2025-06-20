// lib/db/index.js - Single database instance for serverless
import knex from 'knex';

// Create a singleton instance to avoid multiple connections
let db;

if (!db) {
  db = knex({
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
      min: 0,        // Don't maintain idle connections
      max: 1,        // Limit to 1 connection per serverless function
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false
    },
    acquireConnectionTimeout: 30000,
    migrations: {
      tableName: 'knex_migrations'
    }
  });
}

// Export both named and default exports for compatibility
export { db as knex };
export default db;
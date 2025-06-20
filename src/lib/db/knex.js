import knex from 'knex';

// Create a singleton instance to avoid multiple connections
let db;

if (!db) {
  db = knex({
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 6543,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 0, // Better for serverless
      max: 1, // Limit connections for Vercel
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

export default db;
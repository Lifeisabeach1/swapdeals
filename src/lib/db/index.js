// src/lib/db/index.js  
import knex from 'knex';

const knexConfig = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL || {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 6543,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'postgres',
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 2,
    max: 10
  },
  acquireConnectionTimeout: 60000,
};

// Create the knex instance
const db = knex(knexConfig);

// Export multiple ways for compatibility
export { db }; // Named export as 'db'
export { db as knex }; // Named export as 'knex'
export default db; // Default export
import knex from 'knex';

const db = knex({
  client: 'pg', // or whatever database you're using
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
});

// Export the knex instance
export { db as knex };
export default db;
// src/lib/db/index.js
import knexConfig from 'knex';

const config = {
  client: 'pg', // or 'mysql2', 'sqlite3', etc.
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  // Add other knex configuration options as needed
};

const knex = knexConfig(config);

export { knex };
export default knex;
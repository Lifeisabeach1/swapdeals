const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
require('dotenv').config({ path: envFile });

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // Only use SSL for non-localhost
      ...(process.env.DB_HOST !== 'localhost' && {
        ssl: { rejectUnauthorized: false }
      })
    },
    migrations: {
      directory: './src/lib/db/migrations'
    },
    seeds: {
      directory: './src/lib/db/seeds'
    },
    pool: { min: 2, max: 10 }
  }
};
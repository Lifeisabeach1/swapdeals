// knexfile.js
require('dotenv').config();

const commonConfig = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/lib/db/migrations'
  },
  seeds: {
    directory: './src/lib/db/seeds'
  }
};

module.exports = {
  development: {
    ...commonConfig,
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    ...commonConfig,
    pool: {
      min: 2,
      max: 20
    },
    acquireConnectionTimeout: 60000
  }
};
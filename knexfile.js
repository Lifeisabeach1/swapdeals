<<<<<<< HEAD
// knexfile.js
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/lib/db/migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/lib/db/migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
=======
// knexfile.js
require('dotenv').config({ 
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' 
});

const commonConfig = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL || {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 6543,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'postgres',
    ssl: { rejectUnauthorized: false }
  },
  migrations: {
    directory: './src/lib/db/migrations'
  },
  seeds: {
    directory: './src/lib/db/seeds'
  }
};

module.exports = {
  development: {
    ...commonConfig,
    pool: { min: 2, max: 10 }
  },
  
  production: {
    ...commonConfig,
    pool: { min: 2, max: 20 },
    acquireConnectionTimeout: 60000
  }
>>>>>>> a85d38ce00c54be91845a9d76146dfdcf3733976
};
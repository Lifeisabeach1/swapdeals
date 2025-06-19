
require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'aws-0-eu-north-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres.mghbexawntwdktpkmubp',
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: './src/lib/db/migrations'
    }
  }
};
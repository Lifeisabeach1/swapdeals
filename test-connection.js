require('dotenv').config();

console.log('Password loaded:', process.env.DB_PASSWORD ? 'Yes' : 'No');
console.log('Password type:', typeof process.env.DB_PASSWORD);

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: 'aws-0-eu-north-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.mghbexawntwdktpkmubp',
    password: process.env.DB_PASSWORD, // Changed to DB_PASSWORD
    ssl: { rejectUnauthorized: false }
  }
});

knex.raw('SELECT 1')
  .then(() => {
    console.log('Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
<<<<<<< HEAD
// test-connection.js
require('dotenv').config();
const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
});

async function testConnection() {
  try {
    console.log('Testing connection to Supabase...');
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@')); // Hide password
    
    const result = await knex.raw('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('PostgreSQL version:', result.rows[0].postgres_version);
    
    // Test creating a simple table to verify permissions
    await knex.raw('CREATE TABLE IF NOT EXISTS connection_test (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())');
    console.log('✅ Table creation test successful!');
    
    // Clean up test table
    await knex.raw('DROP TABLE IF EXISTS connection_test');
    console.log('✅ Cleanup successful!');
    
    await knex.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
    await knex.destroy();
    process.exit(1);
  }
}

testConnection();
=======
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
>>>>>>> a85d38ce00c54be91845a9d76146dfdcf3733976

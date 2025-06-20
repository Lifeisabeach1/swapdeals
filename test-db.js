// test-db.js
require('dotenv').config();

console.log('Testing database connection...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test 1: Direct connection with pg
const { Client } = require('pg');

async function testDirectConnection() {
    console.log('\n--- Testing Direct PostgreSQL Connection ---');
    
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Direct connection successful!');
        
        const result = await client.query('SELECT NOW()');
        console.log('✅ Query successful:', result.rows[0]);
        
        await client.end();
    } catch (error) {
        console.error('❌ Direct connection failed:', error.message);
        console.error('Full error:', error);
    }
}

// Test 2: Knex connection
async function testKnexConnection() {
    console.log('\n--- Testing Knex Connection ---');
    
    try {
        const knexConfig = require('./knexfile.js');
        const environment = process.env.NODE_ENV || 'development';
        const config = knexConfig[environment];
        
        console.log('Using environment:', environment);
        console.log('Knex config:', JSON.stringify(config, null, 2));
        
        const knex = require('knex')(config);
        
        const result = await knex.raw('SELECT NOW()');
        console.log('✅ Knex connection successful!');
        console.log('✅ Query result:', result.rows[0]);
        
        await knex.destroy();
    } catch (error) {
        console.error('❌ Knex connection failed:', error.message);
        console.error('Full error:', error);
    }
}

// Test 3: Supabase connection
async function testSupabaseConnection() {
    console.log('\n--- Testing Supabase Connection ---');
    
    try {
        const { createClient } = require('@supabase/supabase-js');
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Missing Supabase environment variables');
            return;
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Try a simple query - adjust table name as needed
        const { data, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .limit(1);
        
        if (error) {
            console.error('❌ Supabase query failed:', error.message);
        } else {
            console.log('✅ Supabase connection successful!');
            console.log('✅ Sample data:', data);
        }
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    await testDirectConnection();
    await testKnexConnection();
    await testSupabaseConnection();
    
    console.log('\n--- Test Complete ---');
}

runAllTests();
// test-db.js with debugging
console.log('🚀 Script starting...');

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

// Test 3: Supabase connection (Fixed)
async function testSupabaseConnection() {
    console.log('\n--- Testing Supabase Connection ---');
    
    try {
        console.log('📦 Loading Supabase client...');
        const { createClient } = require('@supabase/supabase-js');
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        console.log('Supabase URL exists:', !!supabaseUrl);
        console.log('Service role key exists:', !!supabaseKey);
        
        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Missing Supabase environment variables');
            console.log('Required variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
            return;
        }
        
        console.log('🔗 Creating Supabase client...');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Simple REST API connectivity check
        console.log('🌐 Testing REST API connectivity...');
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        
        if (response.ok) {
            console.log('✅ Supabase connection successful! (REST API check)');
            console.log('📊 Response status:', response.status);
        } else {
            console.error('❌ Supabase REST API check failed:', response.status);
            console.error('Response text:', await response.text());
        }
        
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        console.error('Full error:', error);
    }
}

// Run all tests
async function runAllTests() {
    console.log('🎯 Starting all tests...');
    
    try {
        await testDirectConnection();
        await testKnexConnection();
        await testSupabaseConnection();
        
        console.log('\n--- Test Complete ---');
        console.log('✨ All tests finished!');
    } catch (error) {
        console.error('💥 Fatal error in test runner:', error);
    }
}

console.log('📋 Calling runAllTests...');
runAllTests().then(() => {
    console.log('🏁 Script completed successfully');
}).catch((error) => {
    console.error('💀 Script failed:', error);
});
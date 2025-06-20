// test-all-tables-fixed.js - Using your actual environment variables
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use the correct environment variable names from your .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Environment Check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Make sure your .env file has:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const expectedTables = [
  'users', 'user_profiles', 'categories', 'items', 'item_images', 
  'item_conditions', 'deals', 'deal_participants', 'deal_items', 
  'deal_messages', 'deal_history', 'user_ratings', 'user_favorites', 
  'user_blocks', 'notifications', 'notification_settings', 'reports', 
  'admin_actions', 'platform_stats', 'audit_logs'
];

async function testAllTables() {
  console.log(`\n🔍 Testing all ${expectedTables.length} SwapDeals tables...`);
  
  const results = {
    successful: [],
    failed: [],
    missing: []
  };

  console.log('🚀 Testing tables...');
  
  for (const tableName of expectedTables) {
    console.log(`📋 Testing table: ${tableName}`);
    
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table '${tableName}' error: ${error.message}`);
        if (error.message.includes('does not exist')) {
          results.missing.push(tableName);
        } else {
          results.failed.push(tableName);
        }
      } else {
        console.log(`✅ Table '${tableName}' accessible - ${count || 0} record(s) found`);
        results.successful.push(tableName);
      }
    } catch (err) {
      console.log(`❌ Table '${tableName}' error: ${err.message}`);
      results.failed.push(tableName);
    }
  }

  // Summary
  console.log('\n==================================================');
  console.log('📊 SUMMARY');
  console.log('==================================================');
  console.log(`✅ Successful: ${results.successful.length}/${expectedTables.length}`);
  if (results.successful.length > 0) {
    console.log(`   Tables: ${results.successful.join(', ')}`);
  }
  
  console.log(`❌ Failed: ${results.failed.length}/${expectedTables.length}`);
  if (results.failed.length > 0) {
    console.log(`   Tables: ${results.failed.join(', ')}`);
  }
  
  console.log(`🚫 Missing: ${results.missing.length}/${expectedTables.length}`);
  if (results.missing.length > 0) {
    console.log(`   Tables: ${results.missing.join(', ')}`);
  }

  // Recommendations
  console.log('\n==================================================');
  console.log('🔧 FIXES NEEDED');
  console.log('==================================================');
  
  if (results.missing.length > 0) {
    console.log('📝 Missing tables need to be created first.');
    console.log(`   Run your table creation SQL scripts for: ${results.missing.join(', ')}`);
  }
  
  if (results.failed.length > 0) {
    console.log('🔒 Some tables have permission issues.');
    console.log('   Run the permission fix SQL script again.');
  }
  
  if (results.successful.length === expectedTables.length) {
    console.log('🎉 All tables are working perfectly!');
  }
  
  console.log('\n✨ All tests completed!');
}

testAllTables().catch(console.error);
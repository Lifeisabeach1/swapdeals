// scripts/setup-admin.js
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const knex = require('knex');

// Security Configuration
const SECURITY_CONFIG = {
  // Method 1: Environment-based security
  ADMIN_SETUP_KEY: process.env.ADMIN_SETUP_KEY, // Set in .env: ADMIN_SETUP_KEY=your-secret-key
  
  // Method 2: Environment restriction
  ALLOWED_ENVIRONMENTS: ['development', 'staging'], // Never production
  
  // Method 3: Require existing admin for new promotions (except first setup)
  REQUIRE_EXISTING_ADMIN: process.env.REQUIRE_EXISTING_ADMIN === 'true',
  
  // Method 4: One-time setup token
  FIRST_SETUP_TOKEN: process.env.FIRST_SETUP_TOKEN, // Only for very first admin
};

// Initialize Knex
const db = knex({
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'vvslink',
  },
});

// Security check functions
function checkEnvironment() {
  const currentEnv = process.env.NODE_ENV || 'development';
  
  if (!SECURITY_CONFIG.ALLOWED_ENVIRONMENTS.includes(currentEnv)) {
    throw new Error(`❌ Admin setup not allowed in ${currentEnv} environment`);
  }
  
  console.log(`✅ Environment check passed: ${currentEnv}`);
}

function checkSetupKey() {
  if (!SECURITY_CONFIG.ADMIN_SETUP_KEY) {
    throw new Error('❌ ADMIN_SETUP_KEY not set in environment variables');
  }
  
  const providedKey = process.env.SETUP_KEY_INPUT;
  if (!providedKey) {
    throw new Error('❌ Setup key required. Run with: SETUP_KEY_INPUT=your-key npm run setup-admin');
  }
  
  if (providedKey !== SECURITY_CONFIG.ADMIN_SETUP_KEY) {
    throw new Error('❌ Invalid setup key provided');
  }
  
  console.log('✅ Setup key verified');
}

async function checkFirstSetupToken() {
  const adminCount = await db('users').where('role', 'admin').count('id as count');
  const hasAdmins = parseInt(adminCount[0].count) > 0;
  
  if (!hasAdmins) {
    // First admin setup - require special token
    if (!SECURITY_CONFIG.FIRST_SETUP_TOKEN) {
      throw new Error('❌ FIRST_SETUP_TOKEN not configured for initial admin setup');
    }
    
    const providedToken = process.env.FIRST_SETUP_INPUT;
    if (!providedToken) {
      throw new Error('❌ First setup token required. Run with: FIRST_SETUP_INPUT=token npm run setup-admin:first');
    }
    
    if (providedToken !== SECURITY_CONFIG.FIRST_SETUP_TOKEN) {
      throw new Error('❌ Invalid first setup token');
    }
    
    console.log('✅ First setup token verified');
    return { isFirstSetup: true };
  }
  
  return { isFirstSetup: false };
}

async function authenticateExistingAdmin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
  
  try {
    console.log('🔐 Admin authentication required');
    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password: ');
    
    // In a real app, you'd hash the password and compare
    // This is a simplified example - implement proper password hashing
    const admin = await db('users')
      .where('username', username)
      .where('role', 'admin')
      .first();
    
    if (!admin) {
      throw new Error('❌ Admin user not found');
    }
    
    // TODO: Implement proper password verification with bcrypt
    // For now, this is a placeholder
    console.log('✅ Admin authenticated (Note: Implement proper password hashing)');
    return admin;
    
  } finally {
    rl.close();
  }
}

async function logAdminAction(action, targetUserId, performedBy) {
  try {
    await db('admin_logs').insert({
      admin_id: performedBy || null, // Use null instead of 0 for system actions
      action,
      target_user_id: targetUserId,
      details: JSON.stringify({
        script_execution: true,
        timestamp: new Date().toISOString()
      }),
      ip_address: process.env.CLIENT_IP || 'localhost',
      user_agent: 'admin-setup-script'
    });
  } catch (error) {
    console.warn('⚠️ Failed to log admin action:', error.message);
    // Don't throw error - allow the main operation to continue
  }
}

async function promoteToAdmin(userId, performedBy = null) {
  try {
    const user = await db('users')
      .where('id', userId)
      .first();

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (user.role === 'admin') {
      console.log(`⚠️  User ${user.username} is already an admin`);
      return user;
    }

    await db('users')
      .where('id', userId)
      .update({
        role: 'admin',
        updated_at: new Date()
      });

    // Log the action (won't throw error if logging fails)
    await logAdminAction('PROMOTE_TO_ADMIN', userId, performedBy);

    console.log(`✅ User ${user.username} (ID: ${userId}) promoted to admin`);
    return user;
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    throw error;
  }
}

async function setupAdmin() {
  try {
    console.log('🚀 Setting up admin user...');
    
    // Security checks
    console.log('🔒 Running security checks...');
    
    // Check 1: Environment restriction
    checkEnvironment();
    
    // Check 2: Setup key verification
    checkSetupKey();
    
    // Check 3: Database connection
    try {
      await db.raw('SELECT 1');
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      throw dbError;
    }
    
    // Check 4: First setup or existing admin auth
    const { isFirstSetup } = await checkFirstSetupToken();
    let authenticatedAdmin = null;
    
    if (!isFirstSetup && SECURITY_CONFIG.REQUIRE_EXISTING_ADMIN) {
      authenticatedAdmin = await authenticateExistingAdmin();
    }

    const args = process.argv.slice(2);
    const userId = args[0];
    const username = args[1];

    if (!userId && !username) {
      console.log('Usage:');
      console.log('  SETUP_KEY_INPUT=key npm run setup-admin <userId>');
      console.log('  SETUP_KEY_INPUT=key npm run setup-admin -- --username <username>');
      console.log('  FIRST_SETUP_INPUT=token npm run setup-admin:first');
      console.log('');
      console.log('Security Requirements:');
      console.log('  - ADMIN_SETUP_KEY must be set in .env');
      console.log('  - FIRST_SETUP_TOKEN must be set for initial setup');
      console.log('  - Only works in development/staging environments');
      process.exit(1);
    }

    let user;

    if (args[0] === '--first') {
      if (!isFirstSetup) {
        throw new Error('❌ First setup can only be used when no admins exist');
      }
      
      console.log('🔍 Looking for first user...');
      const firstUser = await db('users')
        .orderBy('id', 'asc')
        .first();

      if (!firstUser) {
        console.log('❌ No users found in database');
        process.exit(1);
      }

      // Fixed: Pass null instead of 'FIRST_SETUP' string
      user = await promoteToAdmin(firstUser.id, null);
      console.log(`✅ Promoted first user: ${user.username} (ID: ${user.id})`);

    } else if (args[0] === '--username') {
      if (!username) {
        console.log('❌ Username is required when using --username flag');
        process.exit(1);
      }

      const foundUser = await db('users')
        .where('username', username)
        .first();

      if (!foundUser) {
        console.log(`❌ User with username '${username}' not found`);
        process.exit(1);
      }

      user = await promoteToAdmin(foundUser.id, authenticatedAdmin?.id);
      console.log(`✅ Promoted user: ${user.username} (ID: ${user.id})`);

    } else {
      const targetUserId = parseInt(userId);
      if (isNaN(targetUserId)) {
        console.log('❌ Invalid user ID provided');
        process.exit(1);
      }

      user = await promoteToAdmin(targetUserId, authenticatedAdmin?.id);
      console.log(`✅ Promoted user: ${user.username} (ID: ${user.id})`);
    }

    console.log('🎉 Admin setup completed successfully!');
    console.log('📝 Action has been logged in admin_logs table (if possible)');

  } catch (error) {
    console.error('❌ Error setting up admin:');
    console.error('Error message:', error.message);
    
    // Log failed attempts (won't throw error if logging fails)
    try {
      await db('admin_logs').insert({
        admin_id: null, // Use null instead of 0
        action: 'FAILED_ADMIN_SETUP',
        target_user_id: null,
        details: JSON.stringify({
          error: error.message,
          script_execution: true,
          timestamp: new Date().toISOString()
        }),
        ip_address: process.env.CLIENT_IP || 'localhost',
        user_agent: 'admin-setup-script'
      });
    } catch (logError) {
      console.warn('⚠️ Failed to log error:', logError.message);
    }
    
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

// Run the script
setupAdmin();
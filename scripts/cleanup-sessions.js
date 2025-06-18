// scripts/cleanup-sessions.js
// Run this periodically to clean up expired sessions

const db = require('../src/lib/db/knex');

async function cleanupExpiredSessions() {
  try {
    console.log('🧹 Starting session cleanup...');
    
    // Delete expired sessions
    const deletedCount = await db('sessions')
      .where('expires_at', '<', new Date())
      .orWhere('is_active', false)
      .del();
    
    console.log(`✅ Cleaned up ${deletedCount} expired sessions`);
    
    // Optional: Show current active sessions count
    const activeCount = await db('sessions')
      .where('is_active', true)
      .where('expires_at', '>', new Date())
      .count('* as count')
      .first();
    
    console.log(`📊 Active sessions remaining: ${activeCount.count}`);
    
  } catch (error) {
    console.error('❌ Session cleanup failed:', error);
  } finally {
    await db.destroy();
  }
}

cleanupExpiredSessions();
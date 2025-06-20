// lib/utils/admin.js
import { knex } from '@/lib/db/index.js';

export class AdminUtils {
  // Promote user to admin
  static async promoteToAdmin(userId) {
    try {
      const user = await knex('users')
        .where('id', userId)
        .first();

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      await knex('users')
        .where('id', userId)
        .update({
          role: 'admin',
          updated_at: new Date()
        });

      console.log(`User ${user.username} (ID: ${userId}) promoted to admin`);
      return user;
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      throw error;
    }
  }

  // Demote admin to regular user
  static async demoteFromAdmin(userId) {
    try {
      const user = await knex('users')
        .where('id', userId)
        .first();

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      await knex('users')
        .where('id', userId)
        .update({
          role: 'user',
          updated_at: new Date()
        });

      console.log(`User ${user.username} (ID: ${userId}) demoted from admin`);
      return user;
    } catch (error) {
      console.error('Error demoting user from admin:', error);
      throw error;
    }
  }

  // Check if user is admin
  static async isAdmin(userId) {
    try {
      const user = await knex('users')
        .select('role')
        .where('id', userId)
        .first();

      return user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Get all admins
  static async getAllAdmins() {
    try {
      const admins = await knex('users')
        .select('id', 'username', 'email', 'first_name', 'last_name', 'created_at')
        .where('role', 'admin')
        .where('is_active', true);

      return admins;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }
}

// Console script to promote first user to admin (for initial setup)
export const promoteFirstUserToAdmin = async () => {
  try {
    const firstUser = await knex('users')
      .orderBy('id', 'asc')
      .first();

    if (!firstUser) {
      console.log('No users found in database');
      return;
    }

    if (firstUser.role === 'admin') {
      console.log(`User ${firstUser.username} is already an admin`);
      return;
    }

    await AdminUtils.promoteToAdmin(firstUser.id);
    console.log(`✅ Successfully promoted ${firstUser.username} to admin!`);
    
  } catch (error) {
    console.error('❌ Error promoting first user to admin:', error);
  }
};
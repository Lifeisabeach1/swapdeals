// lib/utils/admin.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export class AdminUtils {
  // Promote user to admin
  static async promoteToAdmin(userId) {
    try {
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

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
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'user',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

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
      const { data: user, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        return false;
      }

      return user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Get all admins
  static async getAllAdmins() {
    try {
      const { data: admins, error } = await supabase
        .from('users')
        .select('id, username, email, first_name, last_name, created_at')
        .eq('role', 'admin')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      return admins || [];
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }
}

// Console script to promote first user to admin (for initial setup)
export const promoteFirstUserToAdmin = async () => {
  try {
    const { data: firstUser, error } = await supabase
      .from('users')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();

    if (error || !firstUser) {
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
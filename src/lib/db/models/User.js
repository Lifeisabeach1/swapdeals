
import knex from "../knex";
const bcrypt = require('bcryptjs');

/**
 * User model methods
 */
const User = {
  /**
   * Find all users
   * @param {Object} filters - Query filters
   * @returns {Promise<Array>} List of users
   */
  findAll: async (filters = {}) => {
    const query = knex('users').select('id', 'email', 'username', 'first_name', 'last_name', 'role', 'is_active', 'created_at', 'updated_at');
    
    // Apply filters if needed
    if (filters.isActive !== undefined) {
      query.where('is_active', filters.isActive);
    }
    
    if (filters.role) {
      query.where('role', filters.role);
    }
    
    if (filters.search) {
      query.where(builder => {
        builder.where('email', 'like', `%${filters.search}%`)
          .orWhere('username', 'like', `%${filters.search}%`)
          .orWhere('first_name', 'like', `%${filters.search}%`)
          .orWhere('last_name', 'like', `%${filters.search}%`);
      });
    }
    
    return query;
  },
  
  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  findById: (id) => {
    return knex('users')
      .select('id', 'email', 'username', 'first_name', 'last_name', 'role', 'is_active', 'created_at', 'updated_at')
      .where({ id })
      .first();
  },
  
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  findByEmail: (email) => {
    return knex('users')
      .select('*')
      .where({ email })
      .first();
  },
  
  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<Object|null>} User object or null
   */
  findByUsername: (username) => {
    return knex('users')
      .select('*')
      .where({ username })
      .first();
  },
  
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  create: async (userData) => {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(userData.password, salt);
    
    const [user] = await knex('users')
      .insert({
        email: userData.email,
        username: userData.username,
        password_hash,
        first_name: userData.first_name || null,
        last_name: userData.last_name || null,
        role: userData.role || 'user',
      })
      .returning(['id', 'email', 'username', 'first_name', 'last_name', 'role', 'is_active', 'created_at', 'updated_at']);
    
    return user;
  },
  
  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user
   */
  update: async (id, userData) => {
    const updateData = { ...userData };
    
    // If password is being updated, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(updateData.password, salt);
      delete updateData.password; // Don't store plaintext password
    }
    
    const [user] = await knex('users')
      .where({ id })
      .update(updateData)
      .returning(['id', 'email', 'username', 'first_name', 'last_name', 'role', 'is_active', 'created_at', 'updated_at']);
    
    return user;
  },
  
  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (id) => {
    const deleted = await knex('users')
      .where({ id })
      .del();
    
    return deleted > 0;
  },
  
  /**
   * Verify user password
   * @param {Object} user - User object with password_hash
   * @param {string} password - Password to verify
   * @returns {Promise<boolean>} Is password valid
   */
  verifyPassword: async (user, password) => {
    return bcrypt.compare(password, user.password_hash);
  }
};
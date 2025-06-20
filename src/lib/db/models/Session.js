// lib/models/Session.js
import { knex } from '../index.js'
import { v4 as uuidv4 } from 'uuid';

/**
 * Session model methods
 */
const Session = {
  /**
   * Create a new session
   * @param {number} userId - User ID
   * @param {Object} options - Session options
   * @returns {Promise<Object>} Session object
   */
  create: async (userId, options = {}) => {
    const expiresInHours = options.expiresIn || 24; // Default 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    
    const sessionId = uuidv4();
    const token = uuidv4(); // In production, use more secure token generation
    
    const [session] = await knex('sessions')
      .insert({
        id: sessionId,
        user_id: userId,
        token,
        expires_at: expiresAt
      })
      .returning('*');
    
    return session;
  },
  
  /**
   * Find session by ID
   * @param {string} id - Session ID
   * @returns {Promise<Object|null>} Session object or null
   */
  findById: (id) => {
    return knex('sessions')
      .where({ id })
      .first();
  },
  
  /**
   * Find session by token
   * @param {string} token - Session token
   * @returns {Promise<Object|null>} Session object or null
   */
  findByToken: (token) => {
    return knex('sessions')
      .where({ token })
      .first();
  },
  
  /**
   * Delete session
   * @param {string} id - Session ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (id) => {
    const deleted = await knex('sessions')
      .where({ id })
      .del();
    
    return deleted > 0;
  },
  
  /**
   * Delete all sessions for a user
   * @param {number} userId - User ID
   * @returns {Promise<number>} Number of deleted sessions
   */
  deleteAllForUser: async (userId) => {
    return knex('sessions')
      .where({ user_id: userId })
      .del();
  },
  
  /**
   * Clean expired sessions
   * @returns {Promise<number>} Number of deleted sessions
   */
  cleanExpired: async () => {
    return knex('sessions')
      .where('expires_at', '<', new Date())
      .del();
  }
};

export default Session;
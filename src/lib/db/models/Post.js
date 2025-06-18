
// 9. lib/models/Post.js

import knex from "../knex";

/**
 * Post model methods
 */
const Post = {
  /**
   * Find all posts
   * @param {Object} filters - Query filters
   * @returns {Promise<Array>} List of posts
   */
  findAll: async (filters = {}) => {
    const query = knex('posts')
      .select(
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.user_id',
        'posts.published',
        'posts.created_at',
        'posts.updated_at',
        'users.username as author'
      )
      .leftJoin('users', 'posts.user_id', 'users.id');
    
    // Apply filters
    if (filters.published !== undefined) {
      query.where('posts.published', filters.published);
    }
    
    if (filters.userId) {
      query.where('posts.user_id', filters.userId);
    }
    
    if (filters.search) {
      query.where(builder => {
        builder.where('posts.title', 'like', `%${filters.search}%`)
          .orWhere('posts.content', 'like', `%${filters.search}%`);
      });
    }
    
    // Add sorting
    const sortField = filters.sortBy || 'created_at';
    const sortDirection = filters.sortDir || 'desc';
    query.orderBy(`posts.${sortField}`, sortDirection);
    
    return query;
  },
  
  /**
   * Find post by ID
   * @param {number} id - Post ID
   * @param {boolean} includeAuthor - Include author details
   * @returns {Promise<Object|null>} Post object or null
   */
  findById: async (id, includeAuthor = true) => {
    const query = knex('posts')
      .where('posts.id', id);
    
    if (includeAuthor) {
      query.select(
        'posts.*',
        'users.username as author_username',
        'users.id as author_id'
      )
      .leftJoin('users', 'posts.user_id', 'users.id');
    } else {
      query.select('*');
    }
    
    return query.first();
  },
  
  /**
   * Create a new post
   * @param {Object} postData - Post data
   * @returns {Promise<Object>} Created post
   */
  create: async (postData) => {
    const [post] = await knex('posts')
      .insert({
        title: postData.title,
        content: postData.content,
        user_id: postData.user_id,
        published: postData.published || false,
      })
      .returning('*');
    
    return post;
  },
  
  /**
   * Update post
   * @param {number} id - Post ID
   * @param {Object} postData - Post data to update
   * @returns {Promise<Object>} Updated post
   */
  update: async (id, postData) => {
    const [post] = await knex('posts')
      .where({ id })
      .update(postData)
      .returning('*');
    
    return post;
  },
  
  /**
   * Delete post
   * @param {number} id - Post ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (id) => {
    const deleted = await knex('posts')
      .where({ id })
      .del();
    
    return deleted > 0;
  },
  
  /**
   * Count posts by user
   * @param {number} userId - User ID
   * @returns {Promise<number>} Post count
   */
  countByUser: async (userId) => {
    const result = await knex('posts')
      .where({ user_id: userId })
      .count('id as count')
      .first();
    
    return parseInt(result.count, 10);
  }
};

module.exports = Post;
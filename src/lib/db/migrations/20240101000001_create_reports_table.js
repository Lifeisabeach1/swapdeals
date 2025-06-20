// migrations/20240101000001_create_reports_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('reports', function(table) {
    table.increments('id').primary();
    table.integer('reported_user_id').notNullable();
    table.integer('reporter_user_id').notNullable();
    table.enum('reason', [
      'spam', 
      'harassment', 
      'inappropriate_content', 
      'fake_profile', 
      'other'
    ]).notNullable();
    table.text('description');
    table.enum('content_type', [
      'post', 
      'comment', 
      'message', 
      'profile'
    ]).nullable();
    table.integer('content_id').nullable();
    table.enum('status', [
      'pending', 
      'reviewed', 
      'dismissed', 
      'auto_processed'
    ]).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('reviewed_at').nullable();
    table.integer('reviewed_by').nullable();
    
    // Indexes
    table.index('reported_user_id', 'idx_reported_user');
    table.index('reporter_user_id', 'idx_reporter_user');
    table.index('created_at', 'idx_created_at');
    table.index('status', 'idx_status');
    
    // Foreign keys
    table.foreign('reported_user_id').references('id').inTable('users');
    table.foreign('reporter_user_id').references('id').inTable('users');
    table.foreign('reviewed_by').references('id').inTable('users');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('reports');
};

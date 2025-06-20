// Create a NEW migration file for admin_logs (this should come AFTER users table)
// migrations/20240101000020_create_admin_logs_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('admin_logs', function(table) {
    table.increments('id').primary();
    table.integer('admin_id').unsigned().notNullable();
    table.string('action', 100).notNullable(); // 'ban', 'unban', 'role_change', etc.
    table.integer('target_user_id').unsigned().nullable();
    table.text('details').nullable(); // JSON string with action details
    table.string('ip_address', 45).nullable();
    table.string('user_agent', 500).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key constraints
    table.foreign('admin_id').references('id').inTable('users').onDelete('RESTRICT');
    table.foreign('target_user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index(['admin_id']);
    table.index(['action']);
    table.index(['target_user_id']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('admin_logs');
};
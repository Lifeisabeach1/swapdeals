// src/lib/db/migrations/20240101000020_create_sessions_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('sessions', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.text('token').notNullable().unique();
    table.timestamp('expires_at').notNullable();
    table.string('ip_address', 45).nullable(); // Supports both IPv4 and IPv6
    table.text('user_agent').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('last_used_at').defaultTo(knex.fn.now());
    table.boolean('is_active').defaultTo(true);
    
    // Add indexes for better performance
    table.index('user_id');
    table.index('token');
    table.index('expires_at');
    table.index('is_active');
    table.index(['user_id', 'is_active']);
    
    // Foreign key constraint (assuming you have a users table)
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('sessions');
};
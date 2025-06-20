// migrations/YYYYMMDD_create_bans_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.up = function(knex) {
  return knex.schema.createTable('bans', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('banned_by').unsigned().nullable(); // null for system bans
    table.string('reason', 500).notNullable();
    table.enum('ban_type', ['temporary', 'permanent', 'manual', 'automatic']).defaultTo('manual');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('expires_at').nullable(); // null for permanent bans
    table.timestamp('banned_at').defaultTo(knex.fn.now());
    table.timestamp('unbanned_at').nullable();
    table.integer('unbanned_by').unsigned().nullable(); // Admin who lifted the ban
    table.text('unban_reason').nullable();
    table.integer('report_count').defaultTo(0);
    table.timestamps(true, true); // created_at and updated_at

    // Foreign key constraints
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('banned_by').references('id').inTable('users').onDelete('SET NULL');
    table.foreign('unbanned_by').references('id').inTable('users').onDelete('SET NULL');

    // Indexes for performance
    table.index(['user_id']);
    table.index(['banned_by']);
    table.index(['is_active']);
    table.index(['ban_type']);
    table.index(['expires_at']);
    table.index(['banned_at']);
    table.index(['user_id', 'is_active']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('bans');
};

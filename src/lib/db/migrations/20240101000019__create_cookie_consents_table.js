// migrations/001_create_cookie_consents_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('cookie_consents', function(table) {
    table.increments('id').primary();
    table.string('consent_type').notNullable(); // 'accepted', 'declined', 'custom'
    table.string('ip_address').nullable();
    table.text('user_agent').nullable();
    table.timestamp('consent_date').notNullable();
    table.json('cookie_settings').nullable(); // For custom settings
    table.timestamps(true, true); // created_at, updated_at
    
    // Indexes
    table.index('consent_type');
    table.index('consent_date');
    table.index('ip_address');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('cookie_consents');
};
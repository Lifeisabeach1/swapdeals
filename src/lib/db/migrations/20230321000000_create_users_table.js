// migrations/001_create_users_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('users').then(function() {
    return knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username', 255).notNullable().unique();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('phone', 20).nullable();
      table.string('first_name', 100).nullable();
      table.string('last_name', 100).nullable();
      table.text('bio').nullable();
      table.string('location', 255).nullable();
      table.string('avatar_url', 500).nullable();
      table.enum('role', ['user', 'admin', 'moderator']).defaultTo('user');
      table.boolean('is_active').defaultTo(true);
      table.boolean('is_banned').defaultTo(false);
      table.timestamp('banned_at').nullable();
      table.timestamp('last_login_at').nullable();
      table.timestamps(true, true); // creates created_at and updated_at
      
      // Add indexes for better performance
      table.index(['email']);
      table.index(['username']);
      table.index(['role']);
      table.index(['is_active']);
      table.index(['is_banned']);
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};




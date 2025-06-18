// migrations/005_create_user_sessions_table.js
exports.up = function(knex) {
  return knex.schema.createTable('user_sessions', function(table) {
    table.string('session_id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.text('session_data');
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['expires_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_sessions');
};

exports.up = function(knex) {
  return knex.schema.createTable('notifications', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('type').notNullable(); // 'message', 'trade_update', 'trade_request', etc.
    table.string('title').notNullable();
    table.text('message');
    table.json('data'); // Store additional data like trade_id, message_id, etc.
    table.boolean('is_read').defaultTo(false);
    table.string('action_url'); // Optional URL to navigate to when clicked
    table.timestamps(true, true);
    
    // Indexes for performance
    table.index(['user_id', 'is_read']);
    table.index(['user_id', 'created_at']);
    table.index('type');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications');
};
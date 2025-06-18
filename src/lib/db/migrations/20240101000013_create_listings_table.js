/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('listings', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.string('location');
    table.json('images').defaultTo('[]'); // Store as JSON array
    table.decimal('price', 10, 2);
    table.string('category');
    table.string('condition');
    table.integer('user_id').unsigned().notNullable();
    table.string('status').defaultTo('active'); // active, sold, inactive
    table.timestamps(true, true); // created_at, updated_at
    
    // Foreign key constraint
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes for better performance
    table.index(['user_id']);
    table.index(['status']);
    table.index(['category']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('listings');
};
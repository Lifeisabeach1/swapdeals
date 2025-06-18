// ==================
// migrations/001_create_testimonials_table.js
exports.up = function(knex) {
  return knex.schema.createTable('testimonials', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('location').notNullable();
    table.text('text').notNullable();
    table.string('avatar').notNullable();
    table.integer('rating').notNullable().checkBetween([1, 5]);
    table.string('bg_color').notNullable();
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['is_active', 'created_at']);
    table.index('rating');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('testimonials');
};
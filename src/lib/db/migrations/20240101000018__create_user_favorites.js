//migrations/YYYYMMDDHHMMSS_create_user_favorites.js
exports.up = function(knex) {
  return knex.schema.createTable('user_favorites', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('listing_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Foreign key constraints
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('listing_id').references('id').inTable('trade_listings').onDelete('CASCADE');
    
    // Ensure unique user-listing combination
    table.unique(['user_id', 'listing_id'], 'unique_user_listing_favorite');
    
    // Indexes for performance
    table.index('user_id');
    table.index('listing_id');
    table.index(['user_id', 'listing_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_favorites');
};
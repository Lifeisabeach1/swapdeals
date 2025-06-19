// migrations/004_create_trade_offers_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('trade_offers', function(table) {
    table.increments('id').primary();
    table.integer('listing_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable(); // Person making the offer
    table.text('message').notNullable();
    table.json('images'); // Images of items being offered
    table.string('status').defaultTo('pending').checkIn([
      'pending', 
      'accepted', 
      'rejected', 
      'withdrawn', 
      'expired'
    ]);
    table.timestamp('accepted_at').nullable();
    table.timestamp('rejected_at').nullable();
    table.timestamp('withdrawn_at').nullable();
    table.text('rejection_reason').nullable();
    table.timestamps(true, true);
    
    // Foreign key constraints
    table.foreign('listing_id').references('id').inTable('trade_listings').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes for better performance
    table.index(['listing_id'], 'idx_trade_offers_listing_id');
    table.index(['user_id'], 'idx_trade_offers_user_id');
    table.index(['status'], 'idx_trade_offers_status');
    table.index(['created_at'], 'idx_trade_offers_created_at');
    table.index(['listing_id', 'status'], 'idx_trade_offers_listing_status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('trade_offers');
};
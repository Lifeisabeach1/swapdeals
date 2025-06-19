/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('trades').then(function() {
    return knex.schema.createTable('trades', function(table) {
      // Primary key
      table.increments('id').primary();
      
      // Foreign keys with proper references
      table.integer('offer_id').unsigned().notNullable();
      table.integer('listing_id').unsigned().notNullable();
      table.integer('buyer_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.integer('seller_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      
      // Trade status
      table.enum('status', [
        'pending',
        'accepted', 
        'in_progress',
        'completed',
        'cancelled',
        'disputed'
      ]).defaultTo('pending');
      
      // Offer details (copied from the original offer)
      table.text('offer_message').nullable();
      table.json('offer_images').nullable(); // Array of image URLs/objects
      table.decimal('offer_amount', 10, 2).nullable(); // If monetary offers are involved
      
      // Trade logistics
      table.string('meeting_location', 500).nullable();
      table.timestamp('proposed_meeting_time').nullable();
      table.timestamp('actual_meeting_time').nullable();
      table.text('trade_notes').nullable();
      
      // Communication
      table.text('seller_response').nullable();
      table.text('buyer_notes').nullable();
      
      // Completion and feedback
      table.integer('buyer_rating').nullable().checkBetween([1, 5]);
      table.text('buyer_review').nullable();
      table.timestamp('buyer_rated_at').nullable();
      
      table.integer('seller_rating').nullable().checkBetween([1, 5]);
      table.text('seller_review').nullable();
      table.timestamp('seller_rated_at').nullable();
      
      // Status timestamps
      table.timestamp('accepted_at').nullable();
      table.timestamp('started_at').nullable();
      table.timestamp('completed_at').nullable();
      table.timestamp('cancelled_at').nullable();
      table.timestamp('disputed_at').nullable();
      
      // Cancellation/dispute info
      table.text('cancellation_reason').nullable();
      table.integer('cancelled_by').unsigned().nullable()
        .references('id').inTable('users');
      table.text('dispute_reason').nullable();
      table.integer('disputed_by').unsigned().nullable()
        .references('id').inTable('users');
      
      // Standard timestamps
      table.timestamps(true, true); // created_at, updated_at
      
      // Indexes for performance
      table.index(['offer_id'], 'trades_offer_id_index');
      table.index(['listing_id'], 'trades_listing_id_index');
      table.index(['buyer_id'], 'trades_buyer_id_index');
      table.index(['seller_id'], 'trades_seller_id_index');
      table.index(['status'], 'trades_status_index');
      table.index(['created_at'], 'trades_created_at_index');
      
      // Composite indexes for common queries
      table.index(['buyer_id', 'status'], 'trades_buyer_status_index');
      table.index(['seller_id', 'status'], 'trades_seller_status_index');
      table.index(['listing_id', 'status'], 'trades_listing_status_index');
      table.index(['status', 'created_at'], 'trades_status_created_index');
      
      // Unique constraint to prevent duplicate trades for same offer
      table.unique(['offer_id'], 'trades_offer_id_unique');
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('trades');
};
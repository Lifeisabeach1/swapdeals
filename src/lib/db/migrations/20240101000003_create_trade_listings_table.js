// migrations/20240101000002_create_trade_listings.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Check if the table exists
  const tableExists = await knex.schema.hasTable('trade_listings');
  
  if (tableExists) {
    console.log('Table exists - checking for existing constraint...');
    
    // Check if the status constraint exists before trying to drop it
    const constraintExists = await knex.raw(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'trade_listings' 
      AND constraint_name = 'trade_listings_status_check'
    `);

    if (constraintExists.rows.length > 0) {
      console.log('Dropping existing status check constraint...');
      await knex.raw('ALTER TABLE trade_listings DROP CONSTRAINT trade_listings_status_check');
    }

    console.log('Dropping existing trade_listings table for clean recreation...');
    await knex.schema.dropTable('trade_listings');
  }

  console.log('Creating trade_listings table...');
  
  // Create trade_listings table with all features including unique_views
  await knex.schema.createTable('trade_listings', function(table) {
    // Primary key
    table.increments('id').primary();
    
    // Basic listing information
    table.string('title').notNullable();
    table.text('description');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('category').nullable();
    table.string('location').nullable();
    table.string('slug').unique().notNullable();
    
    // Trading information
    table.integer('items_to_trade_count').defaultTo(0);
    table.integer('items_wanted_count').defaultTo(0);
    
    // Enhanced fields (from migration 002)
    table.json('images').nullable();
    table.string('condition').nullable();
    table.json('preferred_trades').nullable();
    table.decimal('estimated_value', 10, 2).nullable();
    
    // Engagement metrics (including unique_views)
    table.integer('views').defaultTo(0);
    table.integer('unique_views').defaultTo(0);
    table.integer('offer_count').defaultTo(0);
    table.timestamp('last_offer_at').nullable();
    
    // Status and references
    table.enu('status', ['active', 'inactive', 'completed', 'cancelled', 'offer_accepted', 'pending_trade']).defaultTo('active');
    table.integer('accepted_offer_id').nullable();
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes for better performance
    table.index('user_id');
    table.index('category');
    table.index('location');
    table.index('status');
    table.index('slug');
    table.index('created_at');
    table.index('accepted_offer_id');
    table.index('views');
    table.index('unique_views');
  });

  console.log('Trade listings table created successfully!');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('trade_listings');
};
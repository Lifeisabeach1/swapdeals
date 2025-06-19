// migrations/003_create_trade_items_table.js
exports.up = function(knex) {
  return knex.schema.createTable('trade_items', function(table) {
    table.increments('id').primary();
    table.integer('listing_id').unsigned().references('id').inTable('trade_listings').onDelete('CASCADE');
    
    // Type: 'offering' (items user has) or 'wanting' (items user wants)
    table.string('type').notNullable().checkIn(['offering', 'wanting']);
    
    table.string('name'); // Can be null for 'wanting' items (they might just specify category)
    table.string('category');
    table.text('description');
    table.timestamps(true, true);
    
    // Add indexes for better performance
    table.index(['listing_id'], 'idx_trade_items_listing_id');
    table.index(['type'], 'idx_trade_items_type');
    table.index(['category'], 'idx_trade_items_category');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trade_items');
};
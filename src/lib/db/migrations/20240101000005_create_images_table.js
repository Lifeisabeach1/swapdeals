// migrations/20240101000005_create_images_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('images', function(table) {
    table.increments('id').primary();
    table.string('filename', 255).notNullable();
    table.string('original_name', 255).notNullable();
    table.string('file_path', 500).notNullable();
    table.string('url', 500).notNullable();
    table.string('mime_type', 100).notNullable();
    table.integer('file_size').notNullable();
    table.integer('listing_id').unsigned().nullable();
    table.integer('user_id').unsigned().notNullable();
    
    // New fields for image processing
    table.integer('rotation').defaultTo(0); // 0, 90, 180, 270
    table.integer('original_width').nullable();
    table.integer('original_height').nullable();
    table.integer('processed_width').nullable();
    table.integer('processed_height').nullable();
    
    table.timestamps(true, true);
    
    // Foreign key constraints
    table.foreign('listing_id').references('id').inTable('trade_listings').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index('listing_id');
    table.index('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('images');
};
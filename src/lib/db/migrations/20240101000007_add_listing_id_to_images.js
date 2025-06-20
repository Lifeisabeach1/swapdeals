// migrations/20240101000007_add_listing_id_to_images.js

exports.up = async function(knex) {
  // Drop constraint if it exists (won't fail if it doesn't exist)
  await knex.raw('ALTER TABLE images DROP CONSTRAINT IF EXISTS images_listing_id_foreign');

  // Check if column exists and add/modify it
  const columnExists = await knex.raw(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'images' 
    AND column_name = 'listing_id'
  `);

  if (columnExists.rows.length === 0) {
    // Column doesn't exist, add it
    await knex.raw('ALTER TABLE images ADD COLUMN listing_id INTEGER');
  } else {
    // Column exists, make it nullable
    await knex.raw('ALTER TABLE images ALTER COLUMN listing_id DROP NOT NULL');
  }

  // Add the foreign key constraint
  await knex.raw(`
    ALTER TABLE images 
    ADD CONSTRAINT images_listing_id_foreign 
    FOREIGN KEY (listing_id) 
    REFERENCES trade_listings(id) 
    ON DELETE CASCADE
  `);
};

exports.down = async function(knex) {
  await knex.raw('ALTER TABLE images DROP CONSTRAINT IF EXISTS images_listing_id_foreign');
};
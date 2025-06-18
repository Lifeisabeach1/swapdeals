// migrations/20240101000009_add_trade_triggers.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // First, add the views column if it doesn't exist
  const hasViewsColumn = await knex.schema.hasColumn('trade_listings', 'views');
  if (!hasViewsColumn) {
    await knex.schema.alterTable('trade_listings', function(table) {
      table.integer('views').defaultTo(0);
    });
  }

  // Create functions and triggers using knex.raw
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_listing_offer_stats()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE trade_listings 
        SET 
          offer_count = offer_count + 1,
          last_offer_at = NEW.created_at,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.listing_id;
        RETURN NEW;
      ELSIF TG_OP = 'DELETE' THEN
        UPDATE trade_listings
        SET
          offer_count = GREATEST(offer_count - 1, 0),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.listing_id;
        RETURN OLD;
      ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
          UPDATE trade_listings
          SET
            status = 'offer_accepted',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = NEW.listing_id;
        END IF;
        RETURN NEW;
      END IF;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql
  `);

  await knex.raw(`DROP TRIGGER IF EXISTS trigger_update_listing_offer_stats ON trade_offers`);
  await knex.raw(`
    CREATE TRIGGER trigger_update_listing_offer_stats
      AFTER INSERT OR DELETE OR UPDATE ON trade_offers
      FOR EACH ROW
      EXECUTE FUNCTION update_listing_offer_stats()
  `);

  await knex.raw(`
    CREATE OR REPLACE FUNCTION prevent_self_offers()
    RETURNS TRIGGER AS $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM trade_listings
        WHERE id = NEW.listing_id AND user_id = NEW.user_id
      ) THEN
        RAISE EXCEPTION 'Users cannot make offers on their own listings';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `);

  await knex.raw(`DROP TRIGGER IF EXISTS trigger_prevent_self_offers ON trade_offers`);
  await knex.raw(`
    CREATE TRIGGER trigger_prevent_self_offers
      BEFORE INSERT ON trade_offers
      FOR EACH ROW
      EXECUTE FUNCTION prevent_self_offers()
  `);

  await knex.raw(`
    CREATE OR REPLACE FUNCTION increment_listing_views(listing_id_param INTEGER)
    RETURNS void AS $$
    BEGIN
      UPDATE trade_listings
      SET
        views = views + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = listing_id_param;
    END;
    $$ LANGUAGE plpgsql
  `);

  // Create indexes using knex schema builder (no CONCURRENTLY)
  const hasOfferListingUserIndex = await knex.raw(`
    SELECT indexname FROM pg_indexes 
    WHERE tablename = 'trade_offers' 
    AND indexname = 'idx_trade_offers_listing_user'
  `);
  
  if (hasOfferListingUserIndex.rows.length === 0) {
    await knex.schema.alterTable('trade_offers', function(table) {
      table.index(['listing_id', 'user_id'], 'idx_trade_offers_listing_user');
    });
  }

  const hasOfferStatusCreatedIndex = await knex.raw(`
    SELECT indexname FROM pg_indexes 
    WHERE tablename = 'trade_offers' 
    AND indexname = 'idx_trade_offers_status_created'
  `);
  
  if (hasOfferStatusCreatedIndex.rows.length === 0) {
    await knex.schema.alterTable('trade_offers', function(table) {
      table.index(['status', 'created_at'], 'idx_trade_offers_status_created');
    });
  }

  const hasListingStatusUpdatedIndex = await knex.raw(`
    SELECT indexname FROM pg_indexes 
    WHERE tablename = 'trade_listings' 
    AND indexname = 'idx_trade_listings_status_updated'
  `);
  
  if (hasListingStatusUpdatedIndex.rows.length === 0) {
    await knex.schema.alterTable('trade_listings', function(table) {
      table.index(['status', 'updated_at'], 'idx_trade_listings_status_updated');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Drop triggers
  await knex.raw('DROP TRIGGER IF EXISTS trigger_update_listing_offer_stats ON trade_offers');
  await knex.raw('DROP TRIGGER IF EXISTS trigger_prevent_self_offers ON trade_offers');
  
  // Drop functions
  await knex.raw('DROP FUNCTION IF EXISTS update_listing_offer_stats()');
  await knex.raw('DROP FUNCTION IF EXISTS prevent_self_offers()');
  await knex.raw('DROP FUNCTION IF EXISTS increment_listing_views(INTEGER)');
  
  // Drop indexes using knex
  await knex.schema.alterTable('trade_offers', function(table) {
    table.dropIndex(['listing_id', 'user_id'], 'idx_trade_offers_listing_user');
  });
  
  await knex.schema.alterTable('trade_offers', function(table) {
    table.dropIndex(['status', 'created_at'], 'idx_trade_offers_status_created');
  });
  
  await knex.schema.alterTable('trade_listings', function(table) {
    table.dropIndex(['status', 'updated_at'], 'idx_trade_listings_status_updated');
  });
  
  // Drop views column
  await knex.schema.alterTable('trade_listings', function(table) {
    table.dropColumn('views');
  });
};
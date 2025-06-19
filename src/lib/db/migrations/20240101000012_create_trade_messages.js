/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('trade_messages', function(table) {
    // Primary key
    table.increments('id').primary();
    
    // Core message data
    table.uuid('message_uuid').unique().notNullable(); // For client-side deduplication
    table.integer('trade_id').unsigned().notNullable();
    table.integer('sender_id').unsigned().notNullable();
    table.text('content').notNullable();
    
    // Message type and category
    table.enum('type', [
      'text',
      'image',
      'file',
      'location',
      'offer_update',
      'price_change',
      'trade_request',
      'trade_accepted',
      'trade_declined',
      'trade_completed',
      'trade_cancelled',
      'system_notification',
      'auto_reminder'
    ]).defaultTo('text');
    
    // Rich content support
    table.json('attachments').nullable(); // Array of file objects
    table.json('metadata').nullable(); // Extra data (location coords, offer details, etc.)
    
    // Message status and delivery
    table.enum('status', [
      'draft',
      'sending',
      'sent',
      'delivered',
      'read',
      'failed'
    ]).defaultTo('sent');
    
    // Timestamps for message lifecycle
    table.timestamp('sent_at').defaultTo(knex.fn.now());
    table.timestamp('delivered_at').nullable();
    table.timestamp('read_at').nullable();
    
    // Message organization
    table.integer('reply_to_id').unsigned().nullable(); // For threaded conversations
    table.boolean('is_pinned').defaultTo(false);
    table.boolean('is_important').defaultTo(false);
    
    // Moderation and safety
    table.boolean('is_flagged').defaultTo(false);
    table.text('flag_reason').nullable();
    table.integer('flagged_by').unsigned().nullable();
    table.timestamp('flagged_at').nullable();
    
    // System message data
    table.boolean('is_system_message').defaultTo(false);
    table.string('system_event_type').nullable(); // 'trade_status_change', 'user_joined', etc.
    table.json('system_data').nullable(); // Additional system message context
    
    // Soft delete
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('deleted_at').nullable();
    table.integer('deleted_by').unsigned().nullable();
    
    // Edit history
    table.boolean('is_edited').defaultTo(false);
    table.timestamp('edited_at').nullable();
    table.text('original_content').nullable(); // Store original if edited
    
    // Timestamps
    table.timestamps(true, true);
    
    // Foreign key constraints
    table.foreign('trade_id').references('id').inTable('trades').onDelete('CASCADE');
    table.foreign('sender_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('reply_to_id').references('id').inTable('trade_messages').onDelete('SET NULL');
    table.foreign('flagged_by').references('id').inTable('users').onDelete('SET NULL');
    table.foreign('deleted_by').references('id').inTable('users').onDelete('SET NULL');
    
    // Performance indexes
    table.index(['trade_id', 'created_at']); // Main conversation view
    table.index(['trade_id', 'is_deleted', 'created_at']); // Active messages only
    table.index(['sender_id', 'created_at']); // User's message history
    table.index(['message_uuid']); // Quick UUID lookups
    table.index(['status']); // Message delivery tracking
    table.index(['type']); // Filter by message type
    table.index(['is_system_message']); // Separate system vs user messages
    table.index(['read_at']); // Unread message queries
    table.index(['is_flagged']); // Moderation queries
    table.index(['reply_to_id']); // Thread navigation
    
    // Composite indexes for complex queries
    table.index(['trade_id', 'sender_id', 'created_at']); // User activity in trade
    table.index(['trade_id', 'type', 'is_deleted']); // Filter messages by type
    table.index(['is_system_message', 'system_event_type']); // System message types
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('trade_messages');
};
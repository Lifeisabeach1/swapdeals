// migrations/create_platform_stats_table.js
exports.up = function(knex) {
  return knex.schema.createTable('platform_stats', function(table) {
    table.increments('id').primary();
    table.string('stat_name', 50).unique().notNullable();
    table.integer('stat_value').defaultTo(0).notNullable();
    table.timestamps(true, true); // created_at and updated_at
    
    // Add index for faster lookups
    table.index('stat_name');
  }).then(function() {
    // Insert initial values - INCLUDING registered_users
    return knex('platform_stats').insert([
      { stat_name: 'deals_made', stat_value: 5 },
      { stat_name: 'registered_users', stat_value: 26 }, // This was missing!
      { stat_name: 'online_users', stat_value: 100 },
      { stat_name: 'total_visits', stat_value: 123 }
    ]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('platform_stats');
};
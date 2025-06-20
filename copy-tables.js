// copy-tables.js - Script to copy existing tables to Supabase
require('dotenv').config();
const knex = require('knex');

// Your current database connection
const sourceDb = knex({
  client: 'postgresql',
  connection: {
    host: process.env.SOURCE_DB_HOST,
    port: process.env.SOURCE_DB_PORT || 6543,
    user: process.env.SOURCE_DB_USER,
    password: process.env.SOURCE_DB_PASSWORD,
    database: process.env.SOURCE_DB_NAME,
  }
});

// Supabase connection
const targetDb = knex({
  client: 'postgresql',
  connection: {
    connectionString: process.env.DATABASE_URL, // Supabase connection string
    ssl: { rejectUnauthorized: false }
  }
});

async function copyTables() {
  try {
    // Get all table names from source database
    const tables = await sourceDb.raw(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    console.log('Found tables:', tables.rows.map(t => t.tablename));
    
    for (const table of tables.rows) {
      const tableName = table.tablename;
      
      // Skip if table already exists
      const exists = await targetDb.schema.hasTable(tableName);
      if (exists) {
        console.log(`Table ${tableName} already exists, skipping...`);
        continue;
      }
      
      // Get table schema
      const schema = await sourceDb.raw(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = ? AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [tableName]);
      
      console.log(`\nCreating table: ${tableName}`);
      
      // Create table in target database
      await targetDb.schema.createTable(tableName, (table) => {
        schema.rows.forEach(col => {
          let column;
          
          // Map PostgreSQL types to Knex methods
          switch (col.data_type) {
            case 'integer':
              column = table.integer(col.column_name);
              break;
            case 'bigint':
              column = table.bigInteger(col.column_name);
              break;
            case 'character varying':
            case 'text':
              column = table.string(col.column_name);
              break;
            case 'boolean':
              column = table.boolean(col.column_name);
              break;
            case 'timestamp with time zone':
            case 'timestamp without time zone':
              column = table.timestamp(col.column_name);
              break;
            case 'date':
              column = table.date(col.column_name);
              break;
            case 'numeric':
              column = table.decimal(col.column_name);
              break;
            case 'json':
              column = table.json(col.column_name);
              break;
            case 'jsonb':
              column = table.jsonb(col.column_name);
              break;
            default:
              column = table.specificType(col.column_name, col.data_type);
          }
          
          if (col.is_nullable === 'NO') {
            column.notNullable();
          }
          
          if (col.column_default && !col.column_default.includes('nextval')) {
            column.defaultTo(targetDb.raw(col.column_default));
          }
        });
      });
      
      // Copy data
      const data = await sourceDb.select('*').from(tableName);
      if (data.length > 0) {
        await targetDb(tableName).insert(data);
        console.log(`Copied ${data.length} rows to ${tableName}`);
      }
    }
    
    console.log('\nAll tables copied successfully!');
    
  } catch (error) {
    console.error('Error copying tables:', error);
  } finally {
    await sourceDb.destroy();
    await targetDb.destroy();
  }
}

copyTables();
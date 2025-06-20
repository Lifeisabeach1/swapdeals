// src/lib/db/index.js
import knex from 'knex';
import config from '../../knexfile.js';

// Use the appropriate environment config
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Create a singleton instance
let db;

if (!db) {
  db = knex(dbConfig);
}

export default db;
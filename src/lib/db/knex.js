<<<<<<< HEAD
import knex from 'knex';

const db = knex({
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 6543,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 2,
    max: 10
  },
  acquireConnectionTimeout: 60000,
  migrations: {
    tableName: 'knex_migrations'
  }
});

=======
import knex from 'knex';

const db = knex({
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 6543,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 2,
    max: 10
  },
  acquireConnectionTimeout: 60000,
  migrations: {
    tableName: 'knex_migrations'
  }
});

>>>>>>> a85d38ce00c54be91845a9d76146dfdcf3733976
export default db;
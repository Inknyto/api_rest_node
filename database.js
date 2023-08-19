// database.js

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dall_diamm_api',
  user: 'fatou',
  password: 'fatou',
});

module.exports = pool
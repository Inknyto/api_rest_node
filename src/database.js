// database.js

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dall_diamm',
  user: 'nyto',
  password: 'thedatabase',
});

module.exports = pool
const { Pool } = require('pg');

const pool=new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
});

async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to database', err.stack);
  } finally {
    if (client) client.release();
    }
  }

  testConnection();

  module.exports = pool;

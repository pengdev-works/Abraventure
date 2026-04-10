const { Client } = require('pg');
require('dotenv').config();

async function check() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings_inquiry'
    `);
    
    console.log('Columns in bookings_inquiry:');
    console.table(res.rows);
    
    const resLogs = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_logs'
      )
    `);
    console.log('Audit logs table exists:', resLogs.rows[0].exists);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

check();

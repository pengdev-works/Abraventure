require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const migrate = async () => {
  try {
    console.log('Connecting to database...');
    // Add payment_reference column
    await pool.query(`
      ALTER TABLE bookings_inquiry 
      ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100);
    `);
    console.log('Successfully added payment_reference column to bookings_inquiry.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();

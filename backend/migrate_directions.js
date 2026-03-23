const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrateDirections() {
  try {
    console.log('Connecting to database...');
    
    // Add directions to tourist_spots
    await pool.query('ALTER TABLE tourist_spots ADD COLUMN IF NOT EXISTS directions TEXT;');
    console.log('Added directions column to tourist_spots table.');

    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    pool.end();
  }
}

migrateDirections();

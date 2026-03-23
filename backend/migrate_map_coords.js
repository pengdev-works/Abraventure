const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrateMapCoords() {
  try {
    console.log('Connecting to database...');
    
    // Add latitude and longitude to tourist_spots
    await pool.query('ALTER TABLE tourist_spots ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);');
    await pool.query('ALTER TABLE tourist_spots ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);');
    console.log('Added latitude and longitude columns to tourist_spots table.');

    // Add some default coordinates for existing spots so they show up on the map
    // Abra, Philippines coordinates are roughly: Lat 17.5995, Lng 120.6200
    await pool.query('UPDATE tourist_spots SET latitude = 17.5995, longitude = 120.6200 WHERE latitude IS NULL;');
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    pool.end();
  }
}

migrateMapCoords();

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function updatePreciseCoords() {
  try {
    console.log('Connecting to database...');
    
    // Update Kaparkan Falls
    // 17.7800945, 120.7807732
    await pool.query(
      "UPDATE tourist_spots SET latitude = 17.78009, longitude = 120.78077 WHERE name ILIKE '%Kaparkan%' OR name ILIKE '%Mulawin%';"
    );
    console.log('Updated coordinates for Kaparkan Falls.');

    // Update Apao Rolling Hills
    // 17.72030, 120.82617
    await pool.query(
      "UPDATE tourist_spots SET latitude = 17.72030, longitude = 120.82617 WHERE name ILIKE '%Apao%' OR name ILIKE '%Rolling Hills%';"
    );
    console.log('Updated coordinates for Apao Rolling Hills.');

    console.log('Coordinate fix successful!');
  } catch (error) {
    console.error('Update failed:', error);
  } finally {
    pool.end();
  }
}

updatePreciseCoords();

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrateLocations() {
  try {
    console.log('Connecting to database...');
    
    // Add location to guides
    await pool.query('ALTER TABLE guides ADD COLUMN IF NOT EXISTS location VARCHAR(255);');
    console.log('Added location column to guides table.');

    // Add location to homestays
    await pool.query('ALTER TABLE homestays ADD COLUMN IF NOT EXISTS location VARCHAR(255);');
    console.log('Added location column to homestays table.');

    // Update existing records to have a default location so they don't break existing spots
    // Since Abra is small, setting default to "Tineg" or just null is fine. Let's leave them null, 
    // the user will update them in the dashboard.
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    pool.end();
  }
}

migrateLocations();

const { Client } = require('pg');
require('dotenv').config();

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database for migration');

    // 1. Update bookings_inquiry
    console.log('Updating bookings_inquiry table...');
    await client.query(`
      ALTER TABLE bookings_inquiry 
      ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
    `);

    // 2. Create audit_logs
    console.log('Creating audit_logs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(id),
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INTEGER,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create verified_reviews
    console.log('Creating verified_reviews table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.verified_reviews (
        id SERIAL PRIMARY KEY,
        inquiry_id INTEGER UNIQUE REFERENCES public.bookings_inquiry(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create municipal_metrics
    console.log('Creating municipal_metrics table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.municipal_metrics (
        id SERIAL PRIMARY KEY,
        municipality VARCHAR(100) UNIQUE NOT NULL,
        target_revenue NUMERIC(12, 2) DEFAULT 50000.00,
        total_visitors INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Migration completed successfully');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();

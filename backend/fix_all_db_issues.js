const db = require('./db');

async function fixAll() {
  console.log('--- Starting Database Level-Up ---');
  try {
    // 1. Add user_id to guides
    console.log('Synchronizing guides table...');
    await db.query(`
      ALTER TABLE public.guides 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL
    `);

    // 2. Add user_id to homestays
    console.log('Synchronizing homestays table...');
    await db.query(`
      ALTER TABLE public.homestays 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL
    `);

    // 3. Update bookings_inquiry reference length
    console.log('Adjusting booking inquiry fields...');
    await db.query(`
      ALTER TABLE public.bookings_inquiry 
      ALTER COLUMN payment_reference TYPE VARCHAR(100)
    `);

    // 4. Migrate admins to users table
    console.log('Migrating existing admin accounts...');
    const migrationResult = await db.query(`
      INSERT INTO public.users (username, password_hash, role, status)
      SELECT username, password_hash, 'admin', 'approved' FROM public.admins
      ON CONFLICT (username) DO NOTHING
      RETURNING id
    `);
    console.log(`Migrated ${migrationResult.rowCount} admin accounts to the new unified 'users' table.`);

    console.log('--- Database Level-Up Complete! ---');
    process.exit(0);
  } catch (err) {
    console.error('Migration Failed:', err.message);
    process.exit(1);
  }
}

fixAll();

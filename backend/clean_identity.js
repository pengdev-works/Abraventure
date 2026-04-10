const db = require('./db');

async function cleanup() {
  console.log('--- Cleaning Up Database Identity Data ---');
  try {
    const result = await db.query(`
      UPDATE users 
      SET username = TRIM(username), 
          email = LOWER(TRIM(email))
      RETURNING id, username
    `);
    console.log(`Cleaned up ${result.rowCount} user accounts.`);
    
    // Also clean up guides and homestays names if they were derived from untrimmed usernames
    await db.query('UPDATE guides SET name = TRIM(name)');
    await db.query('UPDATE homestays SET name = TRIM(name)');
    
    console.log('Identity cleanup complete. All usernames and emails are now trimmed and standardized.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup Failed:', err.message);
    process.exit(1);
  }
}

cleanup();

const db = require('./db');

async function checkUsers() {
  try {
    const result = await db.query('SELECT count(*) FROM users');
    console.log(`User count in 'users' table: ${result.rows[0].count}`);
    
    const adminsCount = await db.query('SELECT count(*) FROM admins');
    console.log(`User count in 'admins' table: ${adminsCount.rows[0].count}`);
  } catch (err) {
    console.error('Check failed:', err.message);
  }
}

checkUsers();

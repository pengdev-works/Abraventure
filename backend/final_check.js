const db = require('./db');

async function finalCheck() {
  try {
    const result = await db.query("SELECT username, role, status FROM users WHERE role = 'admin'");
    console.log('--- Migrated Admins in Users Table ---');
    result.rows.forEach(r => {
      console.log(`User: ${r.username} | Role: ${r.role} | Status: ${r.status}`);
    });
  } catch (err) {
    console.error('Final check failed:', err.message);
  }
}

finalCheck();

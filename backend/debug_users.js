const db = require('./db');

async function debug() {
  try {
    const result = await db.query('SELECT id, username, role, status FROM users ORDER BY created_at DESC LIMIT 5');
    console.log('--- Latest Users ---');
    result.rows.forEach(r => {
      console.log(`ID: ${r.id} | User: "${r.username}" | Role: ${r.role} | Status: ${r.status}`);
    });
  } catch (err) {
    console.error('Debug failed:', err.message);
  }
}

debug();

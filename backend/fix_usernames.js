const db = require('./db');

async function fix() {
  try {
    const users = await db.query('SELECT id, username, email FROM users');
    for (const user of users.rows) {
      const cleanUsername = user.username.trim();
      const cleanEmail = user.email ? user.email.trim().toLowerCase() : null;
      
      if (cleanUsername !== user.username || cleanEmail !== user.email) {
        console.log(`Cleaning ID ${user.id}: "${user.username}" -> "${cleanUsername}"`);
        await db.query('UPDATE users SET username = $1, email = $2 WHERE id = $3', [cleanUsername, cleanEmail, user.id]);
      }
    }
    console.log('Database identity cleanup finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Fix failed:', err.message);
    process.exit(1);
  }
}

fix();

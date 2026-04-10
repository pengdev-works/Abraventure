const db = require('./db');
const bcrypt = require('bcryptjs');

async function reset() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const result = await db.query(
      "UPDATE users SET password_hash = $1 WHERE username = 'admin' RETURNING username",
      [hashedPassword]
    );
    
    if (result.rowCount > 0) {
      console.log(`Password reset for user "${result.rows[0].username}" to "password123"`);
    } else {
      console.log('User "admin" not found.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Reset failed:', err.message);
    process.exit(1);
  }
}

reset();

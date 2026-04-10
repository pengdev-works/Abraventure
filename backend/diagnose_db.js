const db = require('./db');

async function diagnose() {
  console.log('--- Database Diagnosis ---');
  try {
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables.rows.map(r => r.table_name).join(', '));

    const columns = await db.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'guides', 'homestays', 'bookings_inquiry')
    `);
    console.log('Columns:');
    columns.rows.forEach(r => {
      console.log(`  ${r.table_name}.${r.column_name} (${r.data_type})`);
    });

  } catch (err) {
    console.error('Diagnosis Failed:', err.message);
  }
}

diagnose();

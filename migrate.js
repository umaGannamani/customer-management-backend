// migrate.js - runs migrations/init.sql using the db module
const fs = require('fs');
const path = require('path');
const db = require('./db');

const sqlPath = path.join(__dirname, 'migrations', 'init.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

db.exec(sql, (err) => {
  if (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } else {
    console.log('Migration completed.');
    process.exit(0);
  }
});

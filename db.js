// server/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file will be stored in the server folder
const dbPath = path.resolve(__dirname, "customers.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database at", dbPath);
  }
});

module.exports = db;

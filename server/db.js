const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'nursery.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_name TEXT NOT NULL,
    common_name TEXT NOT NULL,
    availability_date TEXT NOT NULL,
    container_size TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    sun_requirements TEXT,
    moisture_requirements TEXT,
    type TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    plant_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (plant_id) REFERENCES plants(id)
  );
`);

// Migrate existing databases to add new columns if missing
const existingCols = db.prepare('PRAGMA table_info(plants)').all().map((c) => c.name);
for (const [col, def] of [
  ['description', 'TEXT'],
  ['sun_requirements', 'TEXT'],
  ['moisture_requirements', 'TEXT'],
  ['type', 'TEXT'],
  ['image_url', 'TEXT'],
]) {
  if (!existingCols.includes(col)) {
    db.exec(`ALTER TABLE plants ADD COLUMN ${col} ${def}`);
  }
}

module.exports = db;

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
    status TEXT NOT NULL DEFAULT 'pending',
    customer_name TEXT NOT NULL DEFAULT '',
    customer_email TEXT NOT NULL DEFAULT '',
    customer_phone TEXT NOT NULL DEFAULT ''
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

  CREATE TABLE IF NOT EXISTS email_templates (
    name TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    body TEXT NOT NULL
  );
`);

// Seed default email templates if missing
const seedTemplate = db.prepare('INSERT OR IGNORE INTO email_templates (name, subject, body) VALUES (?, ?, ?)');
seedTemplate.run(
  'admin_order',
  'New Order #{{order_id}} from {{customer_name}}',
  `A new order has been placed.

Order #{{order_id}}
Date: {{date}}

Customer:
  Name:  {{customer_name}}
  Email: {{customer_email}}
  Phone: {{customer_phone}}

Items:
{{items}}

Total: \${{total}}`
);
seedTemplate.run(
  'customer_order',
  'Order Confirmation #{{order_id}} — Native Plant Nursery',
  `Hi {{customer_name}},

Thank you for your order! We've received it and will be in touch soon to arrange pickup or delivery.

Order #{{order_id}}
Date: {{date}}

Items:
{{items}}

Total: \${{total}}

If you have any questions, just reply to this email.

Native Plant Nursery`
);

// Migrate: add contact columns to existing orders table
const columns = db.prepare("PRAGMA table_info(orders)").all().map(c => c.name);
if (!columns.includes('customer_name')) {
  db.exec(`
    ALTER TABLE orders ADD COLUMN customer_name TEXT NOT NULL DEFAULT '';
    ALTER TABLE orders ADD COLUMN customer_email TEXT NOT NULL DEFAULT '';
    ALTER TABLE orders ADD COLUMN customer_phone TEXT NOT NULL DEFAULT '';
  `);
}

module.exports = db;

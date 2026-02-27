const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/orders — create a new order
router.post('/', (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const insertOrder = db.prepare(
    'INSERT INTO orders (total, status) VALUES (?, ?)'
  );
  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, plant_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
  );
  const getPlant = db.prepare('SELECT * FROM plants WHERE id = ?');

  const createOrder = db.transaction((items) => {
    let total = 0;
    const resolvedItems = [];

    for (const item of items) {
      const plant = getPlant.get(item.plant_id);
      if (!plant) {
        throw new Error(`Plant with id ${item.plant_id} not found`);
      }
      const lineTotal = plant.price * item.quantity;
      total += lineTotal;
      resolvedItems.push({ ...item, unit_price: plant.price, plant });
    }

    const orderResult = insertOrder.run(total, 'pending');
    const orderId = orderResult.lastInsertRowid;

    for (const item of resolvedItems) {
      insertItem.run(orderId, item.plant_id, item.quantity, item.unit_price);
    }

    return { id: Number(orderId), total, status: 'pending' };
  });

  try {
    const order = createOrder(items);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/orders — list all orders
router.get('/', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders);
});

// GET /api/orders/:id — order details with line items
router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const items = db.prepare(`
    SELECT oi.*, p.plant_name, p.common_name, p.container_size
    FROM order_items oi
    JOIN plants p ON p.id = oi.plant_id
    WHERE oi.order_id = ?
  `).all(req.params.id);

  res.json({ ...order, items });
});

// PATCH /api/orders/:id — update order status
router.patch('/:id', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'completed'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json(order);
});

module.exports = router;

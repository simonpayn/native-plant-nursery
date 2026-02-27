const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/admin/orders — list all orders
router.get('/', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders);
});

// GET /api/admin/orders/:id — order details with line items
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

// PATCH /api/admin/orders/:id — update order status
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

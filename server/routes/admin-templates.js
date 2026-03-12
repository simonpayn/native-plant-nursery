const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/admin/templates — list both templates
router.get('/', (req, res) => {
  const templates = db.prepare('SELECT * FROM email_templates').all();
  res.json(templates);
});

// PUT /api/admin/templates/:name — update a template
router.put('/:name', (req, res) => {
  const { subject, body } = req.body;
  const { name } = req.params;

  if (!['admin_order', 'customer_order'].includes(name)) {
    return res.status(404).json({ error: 'Template not found' });
  }
  if (!subject || !body) {
    return res.status(400).json({ error: 'Subject and body are required' });
  }

  db.prepare('UPDATE email_templates SET subject = ?, body = ? WHERE name = ?').run(subject, body, name);
  const updated = db.prepare('SELECT * FROM email_templates WHERE name = ?').get(name);
  res.json(updated);
});

module.exports = router;

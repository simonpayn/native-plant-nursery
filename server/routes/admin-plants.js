const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/admin/plants — list all plants
router.get('/', (req, res) => {
  const plants = db.prepare('SELECT * FROM plants ORDER BY common_name').all();
  res.json(plants);
});

// POST /api/admin/plants — create a plant
router.post('/', (req, res) => {
  const { plant_name, common_name, availability_date, container_size, price } = req.body;
  if (!plant_name || !common_name || !availability_date || !container_size || price == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const result = db.prepare(
    'INSERT INTO plants (plant_name, common_name, availability_date, container_size, price) VALUES (?, ?, ?, ?, ?)'
  ).run(plant_name, common_name, availability_date, container_size, Number(price));
  const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(plant);
});

// PUT /api/admin/plants/:id — update a plant
router.put('/:id', (req, res) => {
  const { plant_name, common_name, availability_date, container_size, price } = req.body;
  if (!plant_name || !common_name || !availability_date || !container_size || price == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const result = db.prepare(
    'UPDATE plants SET plant_name = ?, common_name = ?, availability_date = ?, container_size = ?, price = ? WHERE id = ?'
  ).run(plant_name, common_name, availability_date, container_size, Number(price), req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Plant not found' });
  }
  const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(req.params.id);
  res.json(plant);
});

// DELETE /api/admin/plants/:id — delete a plant
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM plants WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Plant not found' });
  }
  res.json({ success: true });
});

module.exports = router;

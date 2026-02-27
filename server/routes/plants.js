const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/plants — list all plants
router.get('/', (req, res) => {
  const plants = db.prepare('SELECT * FROM plants ORDER BY common_name').all();
  res.json(plants);
});

// GET /api/plants/:id — single plant
router.get('/:id', (req, res) => {
  const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(req.params.id);
  if (!plant) {
    return res.status(404).json({ error: 'Plant not found' });
  }
  res.json(plant);
});

module.exports = router;

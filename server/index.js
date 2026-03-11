const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

const plantsRouter = require('./routes/plants');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3001;

// Admin password — set via ADMIN_PASSWORD env var, defaults to 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

// Simple token store (in-memory, resets on restart)
const adminTokens = new Set();

app.use(cors());
app.use(express.json());

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    adminTokens.add(token);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Admin auth middleware
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ') || !adminTokens.has(auth.slice(7))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Health check for Fly.io
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public API routes (customers can browse plants and create/view orders)
app.use('/api/plants', plantsRouter);
app.use('/api/orders', ordersRouter);

// Admin API routes (protected)
const adminPlantsRouter = require('./routes/admin-plants');
const adminOrdersRouter = require('./routes/admin-orders');
app.use('/api/admin/plants', requireAdmin, adminPlantsRouter);
app.use('/api/admin/orders', requireAdmin, adminOrdersRouter);

// Serve static frontend in production
const clientBuild = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

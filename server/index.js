const express = require('express');
const cors = require('cors');
const path = require('path');

const plantsRouter = require('./routes/plants');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/plants', plantsRouter);
app.use('/api/orders', ordersRouter);

// Serve static frontend in production
const clientBuild = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

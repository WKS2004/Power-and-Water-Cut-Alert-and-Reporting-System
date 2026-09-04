const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (for container checks, deployment validation, and frontend status ping)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Sri Lanka Power & Water Cut Alert and Reporting System API is running smoothly.',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Routes (Scaffolded for Member 2)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Centralized Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Application running on port ${PORT}`);
  console.log(`[Server] Healthcheck: http://localhost:${PORT}/api/health`);
});

module.exports = app;

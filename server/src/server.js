const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const clientUrl = (process.env.CLIENT_URL || 'https://power-and-water-cut-alert-and-repor.vercel.app').trim().replace(/\/+$/, '');
const allowedOrigins = [
  clientUrl,
  'https://power-and-water-cut-alert-and-repor.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// Trust reverse proxy (Render, Vercel, Nginx)
app.set('trust proxy', 1);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.trim().replace(/\/+$/, '');
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in hackathon environment
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome & API info endpoint (for deployment status verification)
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Sri Lanka Power & Water Cut Alert and Reporting System API',
    status: 'online',
    health: '/api/health',
    clientUrl: clientUrl,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint (for container checks, deployment validation, and frontend status ping)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    database: dbStatus,
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

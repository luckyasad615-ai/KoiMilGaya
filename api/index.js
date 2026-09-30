import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isMongooseConnected } from '../server/config/db.js';
import { seedSampleProfiles } from '../server/seed/seedProfiles.js';
import { memDb } from '../server/config/memoryStore.js';

import authRoutes from '../server/routes/authRoutes.js';
import userRoutes from '../server/routes/userRoutes.js';
import bookingRoutes from '../server/routes/bookingRoutes.js';
import paymentRoutes from '../server/routes/paymentRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Handle CORS preflight
app.options('*', cors());

// Routes mounted on both /api/* and direct routes for Vercel rewrite safety
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

app.use('/api/bookings', bookingRoutes);
app.use('/bookings', bookingRoutes);

app.use('/api/payments', paymentRoutes);
app.use('/payments', paymentRoutes);

app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Koi Mil Gaya (KMG) API',
    database: isMongooseConnected ? 'MongoDB' : 'In-Memory Store',
    timestamp: new Date().toISOString()
  });
});

// Fallback 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl || req.url} not found` });
});

// Global Error Handler - Returns JSON instead of Vercel default 500 HTML
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

let isInitialized = false;

export default async function handler(req, res) {
  if (!isInitialized) {
    try {
      const isDbConnected = await connectDB();
      if (isDbConnected) {
        await seedSampleProfiles().catch((err) => console.warn('Mongoose seed warning:', err.message));
      } else {
        await memDb.init().catch(() => {});
      }
    } catch (initErr) {
      console.error('Serverless init error:', initErr.message);
      await memDb.init().catch(() => {});
    } finally {
      isInitialized = true;
    }
  }
  return app(req, res);
}


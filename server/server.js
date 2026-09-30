import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isMongooseConnected } from './config/db.js';
import { seedSampleProfiles } from './seed/seedProfiles.js';
import { memDb } from './config/memoryStore.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'HeartSync API',
    database: isMongooseConnected ? 'MongoDB' : 'In-Memory Store',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Start server
const startServer = async () => {
  const isDbConnected = await connectDB();
  
  if (isDbConnected) {
    await seedSampleProfiles().catch((err) => console.warn('Mongoose seed warning:', err.message));
  } else {
    await memDb.init();
  }

  const server = app.listen(PORT, () => {
    console.log(`HeartSync Server running cleanly on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is already in use by another instance. API is active.`);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer();

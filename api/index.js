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
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Koi Mil Gaya (KMG) API',
    database: isMongooseConnected ? 'MongoDB' : 'In-Memory Store',
    timestamp: new Date().toISOString()
  });
});

let isInitialized = false;

export default async function handler(req, res) {
  try {
    if (!isInitialized) {
      const isDbConnected = await connectDB();
      if (isDbConnected) {
        await seedSampleProfiles().catch((err) => console.warn('Mongoose seed warning:', err.message));
      } else {
        await memDb.init();
      }
      isInitialized = true;
    }
  } catch (initErr) {
    console.error('Serverless init error:', initErr.message);
  }
  return app(req, res);
}

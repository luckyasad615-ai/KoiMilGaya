const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, isMongooseConnected } = require('./config/db.js');
const { seedSampleProfiles } = require('./seed/seedProfiles.js');
const { memDb } = require('./config/memoryStore.js');

const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');

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
    app: 'Koi Mil Gaya (KMG) API',
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
    console.log(`Koi Mil Gaya (KMG) Server running cleanly on http://localhost:${PORT}`);
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


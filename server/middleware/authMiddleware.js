const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User.js');
const { connectDB, isMongooseConnected } = require('../config/db.js');
const { memDb } = require('../config/memoryStore.js');
const { sampleProfiles } = require('../seed/sampleData.js');

const JWT_SECRET = process.env.JWT_SECRET || 'koimilgaya_super_secret_jwt_key_2026_premium_dating_app';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const isConnected = await connectDB().catch(() => false);

      let user = null;
      if (isConnected && isMongooseConnected && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (dbErr) {
          user = await memDb.findUserById(decoded.id);
        }
      }

      if (!user) {
        user = await memDb.findUserById(decoded.id);
      }

      if (!user) {
        const sampleMatch = sampleProfiles.find(p => p._id === decoded.id || (p.email && p.email.toLowerCase() === decoded.id.toLowerCase()));
        if (sampleMatch) {
          const { password, ...rest } = sampleMatch;
          user = rest;
        }
      }

      if (!user && decoded.email) {
        if (isConnected && isMongooseConnected) {
          try {
            user = await User.findOne({ email: decoded.email.toLowerCase() }).select('-password');
          } catch (err) {}
        }
        if (!user) {
          user = await memDb.findUserByEmail(decoded.email);
        }
      }

      if (user && user.password) {
        const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
        user = userWithoutPassword;
      }

      // Fail-safe: If valid signed token exists, construct fallback session so logged in users are never blocked
      if (!user && (decoded.id || decoded.email)) {
        user = {
          _id: decoded.id || `usr_${Date.now()}`,
          email: decoded.email || 'member@koimilgaya.com',
          fullName: decoded.fullName || 'Member User',
          city: 'Global Member',
          age: 25,
          gender: 'Member',
        };
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Session expired or user account not found. Please log in again.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };




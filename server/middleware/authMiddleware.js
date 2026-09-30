import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { connectDB, isMongooseConnected } from '../config/db.js';
import { memDb } from '../config/memoryStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'koimilgaya_super_secret_jwt_key_2026_premium_dating_app';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const isConnected = await connectDB().catch(() => false);

      let user = null;
      if (isConnected && isMongooseConnected) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (dbErr) {
          user = await memDb.findUserById(decoded.id);
        }
      } else {
        user = await memDb.findUserById(decoded.id);
      }

      if (user && user.password) {
        const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
        user = userWithoutPassword;
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
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


import express from 'express';
import { getAllUsers, getUserById, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongooseConnected } from '../config/db.js';
import { memDb } from '../config/memoryStore.js';

const router = express.Router();

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'heartsync_super_secret_jwt_key_2026_premium_dating_app');
      
      if (isMongooseConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = await memDb.findUserById(decoded.id);
      }
    } catch (err) {
      // Ignore invalid token
    }
  }
  next();
};

router.get('/', optionalAuth, getAllUsers);
router.get('/:id', getUserById);
router.put('/profile', protect, updateProfile);

export default router;

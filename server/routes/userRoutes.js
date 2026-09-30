const express = require('express');
const { getAllUsers, getUserById, updateProfile } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const { isMongooseConnected } = require('../config/db.js');
const { memDb } = require('../config/memoryStore.js');

const router = express.Router();

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'koimilgaya_super_secret_jwt_key_2026_premium_dating_app');
      
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

module.exports = router;


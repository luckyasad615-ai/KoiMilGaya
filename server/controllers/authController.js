const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User.js');
const { connectDB, isMongooseConnected } = require('../config/db.js');
const { memDb } = require('../config/memoryStore.js');

const JWT_SECRET = process.env.JWT_SECRET || 'koimilgaya_super_secret_jwt_key_2026_premium_dating_app';

const generateToken = (userObj) => {
  const idStr = typeof userObj === 'object' && userObj._id ? userObj._id.toString() : (typeof userObj === 'string' ? userObj : `usr_${Date.now()}`);
  const emailStr = typeof userObj === 'object' ? userObj.email || '' : '';
  const nameStr = typeof userObj === 'object' ? userObj.fullName || '' : '';
  
  return jwt.sign(
    { id: idStr, email: emailStr, fullName: nameStr },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, age, gender, country, city, profileImage, bio, interests } = req.body;

    if (!fullName || !email || !password || !age || !city) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (Number(age) < 18) {
      return res.status(400).json({ success: false, message: 'You must be at least 18 years old to join Koi Mil Gaya (KMG)' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    // Attempt DB connection safely
    const isConnected = await connectDB().catch(() => false);

    let existingUser = null;
    if (isConnected && mongoose.connection.readyState === 1) {
      try {
        existingUser = await User.findOne({ email: email.toLowerCase() });
      } catch (dbErr) {
        console.warn('MongoDB findOne error, falling back to memDb:', dbErr.message);
        existingUser = await memDb.findUserByEmail(email);
      }
    } else {
      existingUser = await memDb.findUserByEmail(email);
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      age: Number(age),
      gender: gender || 'Female',
      country: country || 'Worldwide',
      city,
      profileImage: profileImage || undefined,
      bio: bio || '',
      interests: Array.isArray(interests) ? interests : (typeof interests === 'string' ? interests.split(',').map(i => i.trim()).filter(Boolean) : []),
    };

    let user;
    if (isConnected && mongoose.connection.readyState === 1) {
      try {
        user = await User.create(userData);
        await memDb.createUser({ ...userData, _id: user._id.toString() }).catch(() => {});
      } catch (createErr) {
        console.warn('MongoDB User.create error, falling back to memDb:', createErr.message);
        user = await memDb.createUser(userData);
      }
    } else {
      user = await memDb.createUser(userData);
    }

    const userIdStr = user._id ? user._id.toString() : `usr_${Date.now()}`;
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: userIdStr,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        country: user.country,
        city: user.city,
        profileImage: user.profileImage,
        bio: user.bio,
        interests: user.interests,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const isConnected = await connectDB().catch(() => false);

    let user = null;
    if (isConnected && mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: email.toLowerCase() });
      } catch (dbErr) {
        console.warn('MongoDB login findOne error, falling back to memDb:', dbErr.message);
        user = await memDb.findUserByEmail(email);
      }
    } else {
      user = await memDb.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const userIdStr = user._id ? user._id.toString() : `usr_${Date.now()}`;
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: userIdStr,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        country: user.country,
        city: user.city,
        profileImage: user.profileImage,
        bio: user.bio,
        interests: user.interests,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};



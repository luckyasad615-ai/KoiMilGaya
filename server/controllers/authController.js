import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongooseConnected } from '../config/db.js';
import { memDb } from '../config/memoryStore.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'heartsync_super_secret_jwt_key_2026_premium_dating_app', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
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

    let existingUser;
    if (isMongooseConnected) {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    } else {
      existingUser = await memDb.findUserByEmail(email);
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
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

    if (isMongooseConnected) {
      user = await User.create(userData);
    } else {
      user = await memDb.createUser(userData);
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    let user;
    if (isMongooseConnected) {
      user = await User.findOne({ email: email.toLowerCase() });
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

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        gender: user.gender,
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

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

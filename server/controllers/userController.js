const mongoose = require('mongoose');
const User = require('../models/User.js');
const { connectDB, isMongooseConnected } = require('../config/db.js');
const { memDb } = require('../config/memoryStore.js');

const getAllUsers = async (req, res) => {
  try {
    const { search, city, gender, minAge, maxAge } = req.query;
    const isConnected = await connectDB().catch(() => false);

    let mongoUsers = [];
    if (isConnected && isMongooseConnected) {
      try {
        const found = await User.find({}).select('-password').sort({ createdAt: -1 });
        mongoUsers = found.map(u => (u.toObject ? u.toObject() : u));
      } catch (dbErr) {
        console.warn('MongoDB getAllUsers error, falling back to memDb:', dbErr.message);
      }
    }

    const memUsers = await memDb.findUsers({});

    // Merge users without duplicates by email and _id
    const combined = [];
    const seenIds = new Set();
    const seenEmails = new Set();

    for (const mu of mongoUsers) {
      const idStr = mu._id ? mu._id.toString() : '';
      const emailLower = (mu.email || '').toLowerCase();
      if (idStr && !seenIds.has(idStr) && !seenEmails.has(emailLower)) {
        seenIds.add(idStr);
        if (emailLower) seenEmails.add(emailLower);
        combined.push(mu);
      }
    }

    for (const mem of memUsers) {
      const idStr = mem._id ? mem._id.toString() : '';
      const emailLower = (mem.email || '').toLowerCase();
      if (!seenIds.has(idStr) && (!emailLower || !seenEmails.has(emailLower))) {
        if (idStr) seenIds.add(idStr);
        if (emailLower) seenEmails.add(emailLower);
        const { password, ...rest } = mem;
        combined.push(rest);
      }
    }

    const currentUserIdStr = req.user ? (req.user._id ? req.user._id.toString() : req.user.toString()) : '';

    const users = combined.filter((u) => {
      const uId = u._id ? u._id.toString() : '';
      // Exclude logged in user from discover list so they don't see themselves
      if (currentUserIdStr && uId === currentUserIdStr) {
        return false;
      }

      if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        const matchesName = (u.fullName || '').toLowerCase().includes(s);
        const matchesBio = (u.bio || '').toLowerCase().includes(s);
        const matchesCity = (u.city || '').toLowerCase().includes(s);
        const matchesCountry = (u.country || '').toLowerCase().includes(s);
        const matchesInterests = Array.isArray(u.interests) && u.interests.some(i => i.toLowerCase().includes(s));
        if (!matchesName && !matchesBio && !matchesCity && !matchesCountry && !matchesInterests) {
          return false;
        }
      }

      if (city && city !== 'All') {
        if (!(u.city || '').toLowerCase().includes(city.toLowerCase())) {
          return false;
        }
      }

      if (gender && gender !== 'All') {
        if (u.gender !== gender) {
          return false;
        }
      }

      if (minAge && u.age < Number(minAge)) {
        return false;
      }

      if (maxAge && u.age > Number(maxAge)) {
        return false;
      }

      return true;
    });

    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profiles' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = await connectDB().catch(() => false);
    let user = null;

    if (isConnected && isMongooseConnected) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          user = await User.findById(id).select('-password');
        }
        if (!user) {
          user = await User.findOne({ email: id.toLowerCase() }).select('-password');
        }
      } catch (dbErr) {
        console.warn('MongoDB getUserById error:', dbErr.message);
      }
    }

    if (!user) {
      user = await memDb.findUserById(id);
    }

    if (!user) {
      user = await memDb.findUserByEmail(id);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user && user.password) {
      const { password, ...rest } = user.toObject ? user.toObject() : user;
      user = rest;
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get User By Id Error:', error);
    return res.status(500).json({ success: false, message: 'Invalid profile ID or server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, age, gender, city, profileImage, bio, interests } = req.body;
    const isConnected = await connectDB().catch(() => false);

    let updatedUser = null;
    if (isConnected && isMongooseConnected && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const user = await User.findById(userId);
        if (user) {
          if (fullName) user.fullName = fullName;
          if (age) user.age = Number(age);
          if (gender) user.gender = gender;
          if (city) user.city = city;
          if (profileImage) user.profileImage = profileImage;
          if (bio !== undefined) user.bio = bio;
          if (interests) {
            user.interests = Array.isArray(interests) 
              ? interests 
              : typeof interests === 'string' 
                ? interests.split(',').map(i => i.trim()).filter(Boolean)
                : user.interests;
          }
          await user.save();
          updatedUser = user;
        }
      } catch (dbErr) {
        console.warn('MongoDB updateProfile error, falling back to memDb:', dbErr.message);
      }
    }

    if (!updatedUser) {
      const existing = await memDb.findUserById(userId);
      if (!existing) return res.status(404).json({ success: false, message: 'User not found' });

      const parsedInterests = interests 
        ? (Array.isArray(interests) ? interests : typeof interests === 'string' ? interests.split(',').map(i => i.trim()).filter(Boolean) : existing.interests)
        : existing.interests;

      updatedUser = await memDb.updateUser(userId, {
        fullName: fullName || existing.fullName,
        age: age ? Number(age) : existing.age,
        gender: gender || existing.gender,
        city: city || existing.city,
        profileImage: profileImage || existing.profileImage,
        bio: bio !== undefined ? bio : existing.bio,
        interests: parsedInterests,
      });
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject ? updatedUser.toObject() : updatedUser;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
};




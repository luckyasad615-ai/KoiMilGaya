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
        let query = {};
        if (req.user) {
          query._id = { $ne: req.user._id };
        }
        if (search) {
          query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { bio: { $regex: search, $options: 'i' } },
            { interests: { $regex: search, $options: 'i' } },
          ];
        }
        if (city && city !== 'All') {
          query.city = { $regex: `^${city}$`, $options: 'i' };
        }
        if (gender && gender !== 'All') {
          query.gender = gender;
        }
        if (minAge || maxAge) {
          query.age = {};
          if (minAge) query.age.$gte = Number(minAge);
          if (maxAge) query.age.$lte = Number(maxAge);
        }

        const found = await User.find(query).select('-password').sort({ createdAt: -1 });
        mongoUsers = found.map(u => (u.toObject ? u.toObject() : u));
      } catch (dbErr) {
        console.warn('MongoDB getAllUsers error, falling back to memDb:', dbErr.message);
      }
    }

    const memUsers = await memDb.findUsers({
      search,
      city,
      gender,
      minAge,
      maxAge,
      excludeId: req.user?._id,
    });

    // Merge users without duplicates by email
    const users = [...mongoUsers];
    const existingEmails = new Set(users.map(u => (u.email || '').toLowerCase()));
    for (const mu of memUsers) {
      if (!existingEmails.has((mu.email || '').toLowerCase())) {
        const { password, ...rest } = mu;
        users.push(rest);
        existingEmails.add((mu.email || '').toLowerCase());
      }
    }

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

    if (isConnected && isMongooseConnected && mongoose.Types.ObjectId.isValid(id)) {
      try {
        user = await User.findById(id).select('-password');
      } catch (dbErr) {
        user = await memDb.findUserById(id);
      }
    }

    if (!user) {
      user = await memDb.findUserById(id);
    }

    if (user && user.password) {
      const { password, ...rest } = user.toObject ? user.toObject() : user;
      user = rest;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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




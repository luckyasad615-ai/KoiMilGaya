import User from '../models/User.js';
import { isMongooseConnected } from '../config/db.js';
import { memDb } from '../config/memoryStore.js';

export const getAllUsers = async (req, res) => {
  try {
    const { search, city, gender, minAge, maxAge } = req.query;

    if (isMongooseConnected) {
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

      const users = await User.find(query).select('-password').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: users.length, users });
    } else {
      const users = await memDb.findUsers({
        search,
        city,
        gender,
        minAge,
        maxAge,
        excludeId: req.user?._id,
      });

      const usersWithoutPassword = users.map((u) => {
        const { password, ...rest } = u;
        return rest;
      });

      return res.status(200).json({ success: true, count: usersWithoutPassword.length, users: usersWithoutPassword });
    }
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profiles' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    let user;

    if (isMongooseConnected) {
      user = await User.findById(id).select('-password');
    } else {
      user = await memDb.findUserById(id);
      if (user) {
        const { password, ...rest } = user;
        user = rest;
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get User By Id Error:', error);
    return res.status(500).json({ success: false, message: 'Invalid profile ID or server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, age, gender, city, profileImage, bio, interests } = req.body;

    let updatedUser;
    if (isMongooseConnected) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

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
    } else {
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

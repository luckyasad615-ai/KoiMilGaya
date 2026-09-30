const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User.js');
const { sampleProfiles } = require('./sampleData.js');

dotenv.config();

const seedSampleProfiles = async () => {
  try {
    console.log('Verifying and seeding sample profiles into MongoDB...');
    for (const profile of sampleProfiles) {
      const objId = new mongoose.Types.ObjectId(profile._id);
      const existing = await User.findById(objId);
      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(profile.password, salt);
        await User.create({
          ...profile,
          _id: objId,
          password: hashedPassword,
        });
      }
    }
    console.log('Sample profiles successfully verified/seeded into MongoDB!');
  } catch (error) {
    console.error('Error seeding profiles:', error.message);
  }
};

// If run directly via node seed/seedProfiles.js
if (process.argv[1]?.includes('seedProfiles.js')) {
  const runDirectSeed = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/heartsync_dating');
      console.log('Connected to MongoDB for direct seeding...');
      await User.deleteMany({ isSample: true });
      console.log('Cleared previous sample profiles...');
      await seedSampleProfiles();
      console.log('Direct seeding completed successfully.');
      process.exit(0);
    } catch (err) {
      console.error('Direct seed failed:', err.message);
      process.exit(1);
    }
  };
  runDirectSeed();
}

module.exports = { seedSampleProfiles };


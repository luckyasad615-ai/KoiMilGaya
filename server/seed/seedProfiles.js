const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User.js');
const { sampleProfiles } = require('./sampleData.js');

dotenv.config();

const seedSampleProfiles = async () => {
  try {
    const existingCount = await User.countDocuments({ isSample: true });
    if (existingCount > 0) {
      console.log(`Sample profiles already present in DB (${existingCount} found). Skipping auto-seed.`);
      return;
    }

    console.log('Seeding initial sample profiles...');
    const hashedProfiles = await Promise.all(
      sampleProfiles.map(async (profile) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(profile.password, salt);
        return {
          ...profile,
          password: hashedPassword,
        };
      })
    );

    await User.insertMany(hashedProfiles);
    console.log('Sample profiles successfully seeded into MongoDB!');
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


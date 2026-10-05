const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Must be at least 18 years old'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Non-Binary', 'Other'],
    default: 'Female',
  },
  country: {
    type: String,
    default: 'Worldwide',
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  profileImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  },
  profileImages: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: '',
    maxLength: 500,
  },
  interests: {
    type: [String],
    default: [],
  },
  isSample: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);


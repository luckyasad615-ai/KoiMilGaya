const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  meetingDate: {
    type: String,
    required: [true, 'Meeting date is required'],
  },
  meetingTime: {
    type: String,
    required: [true, 'Meeting time is required'],
  },
  meetingLocation: {
    type: String,
    required: [true, 'Meeting location is required'],
  },
  message: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    default: 499,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  bookingStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);


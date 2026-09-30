const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 499,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'crypto', 'easypaisa', 'jazzcash', 'bank_transfer', 'test_sandbox'],
    default: 'card',
  },
  txHash: {
    type: String,
    default: '',
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);


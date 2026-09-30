const mongoose = require('mongoose');
const Payment = require('../models/Payment.js');
const Booking = require('../models/Booking.js');
const { connectDB, isMongooseConnected } = require('../config/db.js');
const { memDb } = require('../config/memoryStore.js');

const getIdStr = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (val._id) return val._id.toString();
  return val.toString();
};

const createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod = 'card', txHash } = req.body;
    const userId = getIdStr(req.user._id);

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required for payment' });
    }

    const isConnected = await connectDB().catch(() => false);
    let booking = null;

    if (isConnected && isMongooseConnected && mongoose.Types.ObjectId.isValid(bookingId)) {
      try {
        booking = await Booking.findById(bookingId);
      } catch (dbErr) {
        booking = await memDb.findBookingById(bookingId);
      }
    }

    if (!booking) {
      booking = await memDb.findBookingById(bookingId);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Associated booking not found' });
    }

    const bookingOwnerId = getIdStr(booking.bookedBy);
    if (bookingOwnerId && userId && bookingOwnerId !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized for this payment' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'This meeting booking is already paid and confirmed' });
    }

    const transactionId = `KMG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let payment = null;
    if (isConnected && isMongooseConnected && mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(bookingId)) {
      try {
        payment = await Payment.create({
          userId,
          bookingId,
          amount: 499,
          paymentMethod,
          txHash: txHash || '',
          transactionId,
          status: 'pending',
        });
      } catch (dbErr) {
        console.warn('MongoDB createPayment error, falling back to memDb:', dbErr.message);
      }
    }

    if (!payment) {
      payment = await memDb.createPayment({
        userId,
        bookingId,
        amount: 499,
        paymentMethod,
        txHash: txHash || '',
        transactionId,
        status: 'pending',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Payment intent initialized',
      payment,
      bookingId,
      amount: 499,
    });
  } catch (error) {
    console.error('Create Payment Error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing payment creation' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { bookingId, transactionId, simulateOutcome = 'success' } = req.body;
    const userId = getIdStr(req.user._id);

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    const isConnected = await connectDB().catch(() => false);
    let booking = null;

    if (isConnected && isMongooseConnected && mongoose.Types.ObjectId.isValid(bookingId)) {
      try {
        booking = await Booking.findById(bookingId);
      } catch (dbErr) {
        booking = await memDb.findBookingById(bookingId);
      }
    }

    if (!booking) {
      booking = await memDb.findBookingById(bookingId);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const bookingOwnerId = getIdStr(booking.bookedBy);
    if (bookingOwnerId && userId && bookingOwnerId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized for this payment verification' });
    }

    const generatedTxn = transactionId || `KMG-PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (simulateOutcome === 'success') {
      let populatedBooking = null;

      if (isConnected && isMongooseConnected && mongoose.Types.ObjectId.isValid(bookingId) && mongoose.Types.ObjectId.isValid(userId)) {
        try {
          let payment = await Payment.findOne({ bookingId, userId });
          if (!payment) {
            payment = await Payment.create({
              userId,
              bookingId,
              amount: 499,
              paymentMethod: 'test_sandbox',
              transactionId: generatedTxn,
              status: 'paid',
            });
          } else {
            payment.status = 'paid';
            await payment.save();
          }

          booking.paymentStatus = 'paid';
          booking.bookingStatus = 'Confirmed';
          await booking.save();

          populatedBooking = await Booking.findById(booking._id).populate('profileId', 'fullName age city profileImage email gender');
        } catch (dbErr) {
          console.warn('MongoDB verifyPayment error, falling back to memDb:', dbErr.message);
        }
      }

      if (!populatedBooking) {
        populatedBooking = await memDb.updateBooking(bookingId, {
          paymentStatus: 'paid',
          bookingStatus: 'Confirmed',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully! Meeting booking confirmed.',
        paymentStatus: 'paid',
        bookingStatus: 'Confirmed',
        transactionId: generatedTxn,
        booking: populatedBooking,
      });
    } else {
      if (isConnected && isMongooseConnected && mongoose.Types.ObjectId.isValid(bookingId)) {
        try {
          booking.paymentStatus = 'failed';
          await booking.save();
        } catch (dbErr) {
          await memDb.updateBooking(bookingId, { paymentStatus: 'failed' });
        }
      } else {
        await memDb.updateBooking(bookingId, {
          paymentStatus: 'failed',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Payment transaction failed or declined. Please try again.',
        paymentStatus: 'failed',
        bookingStatus: booking.bookingStatus,
      });
    }
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return res.status(500).json({ success: false, message: 'Server error verifying payment' });
  }
};

module.exports = {
  createPayment,
  verifyPayment,
};



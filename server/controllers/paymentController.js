import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { isMongooseConnected } from '../config/db.js';
import { memDb } from '../config/memoryStore.js';

export const createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod = 'card', txHash } = req.body;
    const userId = req.user._id;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required for payment' });
    }

    let booking;
    if (isMongooseConnected) {
      booking = await Booking.findById(bookingId);
    } else {
      booking = await memDb.findBookingById(bookingId);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Associated booking not found' });
    }

    if (booking.bookedBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this payment' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'This meeting booking is already paid and confirmed' });
    }

    const transactionId = `KMG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let payment;
    if (isMongooseConnected) {
      payment = await Payment.create({
        userId,
        bookingId,
        amount: 499,
        paymentMethod,
        txHash: txHash || '',
        transactionId,
        status: 'pending',
      });
    } else {
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

export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, transactionId, simulateOutcome = 'success' } = req.body;
    const userId = req.user._id;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    let booking;
    if (isMongooseConnected) {
      booking = await Booking.findById(bookingId);
    } else {
      booking = await memDb.findBookingById(bookingId);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookedBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const generatedTxn = transactionId || `KMG-PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (simulateOutcome === 'success') {
      let populatedBooking;

      if (isMongooseConnected) {
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
      } else {
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
      if (isMongooseConnected) {
        booking.paymentStatus = 'failed';
        await booking.save();
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

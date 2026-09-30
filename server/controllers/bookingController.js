const Booking = require('../models/Booking.js');
const User = require('../models/User.js');
const { connectDB, isMongooseConnected } = require('../config/db.js');
const { memDb } = require('../config/memoryStore.js');

const createBooking = async (req, res) => {
  try {
    const { profileId, meetingDate, meetingTime, meetingLocation, message } = req.body;
    const bookedBy = req.user._id;

    if (!profileId || !meetingDate || !meetingTime || !meetingLocation) {
      return res.status(400).json({ success: false, message: 'Please provide profile ID, date, time, and location' });
    }

    if (profileId.toString() === bookedBy.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot book a meeting with yourself' });
    }

    const isConnected = await connectDB().catch(() => false);
    let populatedBooking = null;

    if (isConnected && isMongooseConnected) {
      try {
        const targetProfile = await User.findById(profileId);
        if (!targetProfile) {
          return res.status(404).json({ success: false, message: 'Profile to book not found' });
        }

        const booking = await Booking.create({
          bookedBy,
          profileId,
          meetingDate,
          meetingTime,
          meetingLocation,
          message: message || '',
          amount: 499,
          paymentStatus: 'pending',
          bookingStatus: 'Pending',
        });

        populatedBooking = await Booking.findById(booking._id).populate('profileId', 'fullName age city profileImage email gender');
      } catch (dbErr) {
        console.warn('MongoDB createBooking error, falling back to memDb:', dbErr.message);
      }
    }

    if (!populatedBooking) {
      populatedBooking = await memDb.createBooking({
        bookedBy,
        profileId,
        meetingDate,
        meetingTime,
        meetingLocation,
        message: message || '',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Booking created! Please complete payment to confirm.',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('Create Booking Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating meeting booking' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const isConnected = await connectDB().catch(() => false);
    let bookings = null;

    if (isConnected && isMongooseConnected) {
      try {
        bookings = await Booking.find({ bookedBy: req.user._id })
          .populate('profileId', 'fullName age city profileImage email gender bio')
          .sort({ createdAt: -1 });
      } catch (dbErr) {
        bookings = await memDb.findBookingsByUserId(req.user._id);
      }
    } else {
      bookings = await memDb.findBookingsByUserId(req.user._id);
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Get My Bookings Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving bookings' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = await connectDB().catch(() => false);
    let booking = null;

    if (isConnected && isMongooseConnected) {
      try {
        booking = await Booking.findById(id).populate('profileId', 'fullName age city profileImage email gender bio interests');
      } catch (dbErr) {
        booking = await memDb.findBookingById(id);
      }
    } else {
      booking = await memDb.findBookingById(id);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this booking' });
    }

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('Get Booking By Id Error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching booking details' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
};



import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { isMongooseConnected } from '../config/db.js';
import { memDb } from '../config/memoryStore.js';

export const createBooking = async (req, res) => {
  try {
    const { profileId, meetingDate, meetingTime, meetingLocation, message } = req.body;
    const bookedBy = req.user._id;

    if (!profileId || !meetingDate || !meetingTime || !meetingLocation) {
      return res.status(400).json({ success: false, message: 'Please provide profile ID, date, time, and location' });
    }

    if (profileId.toString() === bookedBy.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot book a meeting with yourself' });
    }

    let populatedBooking;

    if (isMongooseConnected) {
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
    } else {
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
      message: 'Booking created! Please complete PKR 499 payment to confirm.',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('Create Booking Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating meeting booking' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    let bookings;
    if (isMongooseConnected) {
      bookings = await Booking.find({ bookedBy: req.user._id })
        .populate('profileId', 'fullName age city profileImage email gender bio')
        .sort({ createdAt: -1 });
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

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    let booking;

    if (isMongooseConnected) {
      booking = await Booking.findById(id).populate('profileId', 'fullName age city profileImage email gender bio interests');
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

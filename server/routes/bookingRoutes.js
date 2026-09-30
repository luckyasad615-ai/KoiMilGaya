const express = require('express');
const { createBooking, getMyBookings, getBookingById } = require('../controllers/bookingController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);

module.exports = router;


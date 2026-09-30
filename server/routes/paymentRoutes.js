const express = require('express');
const { createPayment, verifyPayment } = require('../controllers/paymentController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.use(protect);

router.post('/create', createPayment);
router.post('/verify', verifyPayment);

module.exports = router;


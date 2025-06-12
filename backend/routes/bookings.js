const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// POST /api/bookings - Create a new booking (requires authentication)
router.post('/', auth, createBooking);

// GET /api/bookings - Get all bookings for the authenticated user
router.get('/', auth, getUserBookings);

module.exports = router; 
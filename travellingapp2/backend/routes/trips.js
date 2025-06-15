const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTripsByUser,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip
} = require('../controllers/tripController');
const auth = require('../middleware/auth');

// GET /api/trips - Get all trips
router.get('/', getTrips);

// GET /api/trips/user/:userId - Get trips by user
router.get('/user/:userId', getTripsByUser);

// GET /api/trips/:id - Get single trip
router.get('/:id', getTrip);

// POST /api/trips - Create new trip (protected)
router.post('/', auth, createTrip);

// PUT /api/trips/:id - Update trip (protected)
router.put('/:id', auth, updateTrip);

// DELETE /api/trips/:id - Delete trip (protected)
router.delete('/:id', auth, deleteTrip);

module.exports = router; 
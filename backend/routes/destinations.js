const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  searchDestinations
} = require('../controllers/destinationController');
const auth = require('../middleware/auth');

// GET /api/destinations - Get all destinations
router.get('/', getDestinations);

// GET /api/destinations/search - Search destinations
router.get('/search', searchDestinations);

// GET /api/destinations/:id - Get single destination
router.get('/:id', getDestination);

// POST /api/destinations - Create new destination (protected)
router.post('/', auth, createDestination);

// PUT /api/destinations/:id - Update destination (protected)
router.put('/:id', auth, updateDestination);

// DELETE /api/destinations/:id - Delete destination (protected)
router.delete('/:id', auth, deleteDestination);

module.exports = router; 
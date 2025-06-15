const Trip = require('../models/Trip');
const TripFactory = require('../factories/TripFactory');

// Get all trips
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('userId', 'name email')
      .populate('destinationId', 'name country imageUrl');
    
    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trips',
      error: error.message
    });
  }
};

// Get trips by user
const getTripsByUser = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId })
      .populate('destinationId', 'name country imageUrl');
    
    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user trips',
      error: error.message
    });
  }
};

// Get single trip
const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('destinationId', 'name country description imageUrl');
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trip',
      error: error.message
    });
  }
};

// Create trip using Factory pattern
const createTrip = async (req, res) => {
  try {
    const { tripType, ...tripData } = req.body;
    
    // Set userId from authenticated user
    tripData.userId = req.user.id;
    
    let trip;
    if (tripType) {
      trip = TripFactory.createTripByType(tripType, tripData);
    } else {
      trip = TripFactory.createTrip(tripData);
    }
    
    await trip.save();
    
    const populatedTrip = await Trip.findById(trip._id)
      .populate('userId', 'name email')
      .populate('destinationId', 'name country imageUrl');
    
    res.status(201).json({
      success: true,
      data: populatedTrip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating trip',
      error: error.message
    });
  }
};

// Update trip
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email')
     .populate('destinationId', 'name country imageUrl');
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating trip',
      error: error.message
    });
  }
};

// Delete trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting trip',
      error: error.message
    });
  }
};

module.exports = {
  getTrips,
  getTripsByUser,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip
}; 
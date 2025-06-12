const Booking = require('../models/Booking');
const Destination = require('../models/Destination');

// Factory pattern for creating booking objects
class BookingFactory {
  static createBooking(bookingData) {
    return new Booking(bookingData);
  }
}

// Singleton pattern for booking service
class BookingService {
  constructor() {
    if (BookingService.instance) {
      return BookingService.instance;
    }
    BookingService.instance = this;
  }

  // Calculate total price using destination's actual price
  calculateTotalPrice(destinationPrice, numTravelers) {
    return destinationPrice * numTravelers;
  }

  // Create a new booking
  async createBooking(bookingData) {
    try {
      // Get destination to get the actual price
      const destination = await Destination.findById(bookingData.destinationId);
      if (!destination) {
        return {
          success: false,
          message: 'Destination not found',
          error: 'Invalid destination ID'
        };
      }

      // Calculate total price using destination's actual price
      const totalPrice = this.calculateTotalPrice(destination.price, bookingData.numTravelers);
      
      // Create booking object using factory pattern
      const booking = BookingFactory.createBooking({
        ...bookingData,
        totalPrice,
        paymentStatus: 'Paid' // Set to paid for demo purposes
      });

      const savedBooking = await booking.save();
      
      // Populate destination details for response
      await savedBooking.populate('destinationId', 'name location price');
      
      return {
        success: true,
        message: `Trip to ${destination.name} booked for ${bookingData.numTravelers} traveler(s). Total: $${totalPrice}`,
        booking: savedBooking
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        message: 'Failed to create booking',
        error: error.message
      };
    }
  }

  // Get all bookings for a user
  async getUserBookings(userId) {
    try {
      const bookings = await Booking.find({ userId })
        .populate('destinationId', 'name location price imageUrl')
        .sort({ createdAt: -1 });
      
      return {
        success: true,
        bookings
      };
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return {
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      };
    }
  }
}

// Export singleton instance
const bookingService = new BookingService();

const validateCardInfo = (cardInfo) => {
  if (!cardInfo) return 'Card info is required';
  const { cardNumber, expiry, cvv } = cardInfo;
  if (!cardNumber || !/^[0-9]{16}$/.test(cardNumber)) return 'Please enter a valid card number (16 digits)';
  if (!expiry || !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) return 'Expiry must be in MM/YY format';
  if (!cvv || !/^[0-9]{3}$/.test(cvv)) return 'CVV must be 3 digits';
  return null;
};

// Controller functions
const createBooking = async (req, res) => {
  try {
    const { destinationId, tripDate, numTravelers, dummyCardInfo } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate required fields
    if (!destinationId || !tripDate || !numTravelers || !dummyCardInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Card validation
    const cardError = validateCardInfo(dummyCardInfo);
    if (cardError) {
      return res.status(400).json({
        success: false,
        message: cardError
      });
    }

    // Validate destination exists
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const bookingData = {
      userId,
      destinationId,
      tripDate: new Date(tripDate),
      numTravelers,
      dummyCardInfo
    };

    const result = await bookingService.createBooking(bookingData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Booking controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await bookingService.getUserBookings(userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  bookingService
}; 
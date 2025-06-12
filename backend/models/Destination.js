const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    maxlength: [100, 'Destination name cannot be more than 100 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [100, 'Country cannot be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    enum: ['beaches', 'mountains', 'cities', 'adventure', 'cultural', 'nature'],
    default: 'adventure'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5'],
    default: 4.5
  },
  imageUrl: {
    type: String,
    required: false,
    match: [/^https?:\/\/.+/, 'Please provide a valid image URL']
  }
}, {
  timestamps: true
});

// Index for better search performance
destinationSchema.index({ name: 'text', country: 'text', location: 'text' });

module.exports = mongoose.model('Destination', destinationSchema); 
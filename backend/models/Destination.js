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
    maxlength: [50, 'Country name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    match: [/^https?:\/\/.+/, 'Please provide a valid image URL']
  }
}, {
  timestamps: true
});

// Index for better search performance
destinationSchema.index({ name: 'text', country: 'text', description: 'text' });

module.exports = mongoose.model('Destination', destinationSchema); 
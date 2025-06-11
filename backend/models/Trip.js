const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: [true, 'Destination ID is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Validate that end date is after start date
tripSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

// Virtual for trip duration
tripSchema.virtual('duration').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Ensure virtual fields are serialized
tripSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Trip', tripSchema); 
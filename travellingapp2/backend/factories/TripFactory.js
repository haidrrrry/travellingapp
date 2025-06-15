const Trip = require('../models/Trip');

class TripFactory {
  static createTrip(tripData) {
    return new Trip(tripData);
  }

  static createBusinessTrip(tripData) {
    return new Trip({
      ...tripData,
      tripType: 'business',
      notes: tripData.notes || 'Business trip'
    });
  }

  static createVacationTrip(tripData) {
    return new Trip({
      ...tripData,
      tripType: 'vacation',
      notes: tripData.notes || 'Vacation trip'
    });
  }

  static createWeekendTrip(tripData) {
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2); // Weekend trip is 2 days

    return new Trip({
      ...tripData,
      endDate: endDate,
      tripType: 'weekend',
      notes: tripData.notes || 'Weekend getaway'
    });
  }

  static createLongTermTrip(tripData) {
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 30); // Long term trip is 30 days

    return new Trip({
      ...tripData,
      endDate: endDate,
      tripType: 'long-term',
      notes: tripData.notes || 'Long term travel'
    });
  }

  static createTripByType(tripType, tripData) {
    switch (tripType.toLowerCase()) {
      case 'business':
        return this.createBusinessTrip(tripData);
      case 'vacation':
        return this.createVacationTrip(tripData);
      case 'weekend':
        return this.createWeekendTrip(tripData);
      case 'long-term':
        return this.createLongTermTrip(tripData);
      default:
        return this.createTrip(tripData);
    }
  }
}

module.exports = TripFactory; 
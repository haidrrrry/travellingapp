import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TripForm = ({ auth, onSubmit, loading: parentLoading }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripData, setTripData] = useState({
    userId: auth?.user?.id || '',
    destinationId: '',
    startDate: '',
    endDate: '',
    tripType: 'vacation',
    notes: ''
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/api/destinations`);
        setDestinations(res.data.data);
      } catch (err) {
        setError('Failed to fetch destinations');
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const handleInputChange = (e) => {
    setTripData({
      ...tripData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(tripData);
    setTripData({
      userId: auth?.user?.id || '',
      destinationId: '',
      startDate: '',
      endDate: '',
      tripType: 'vacation',
      notes: ''
    });
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination Selection */}
        <div>
          <label htmlFor="destinationId" className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          {loading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Loading destinations...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            <select
              id="destinationId"
              name="destinationId"
              value={tripData.destinationId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a destination</option>
              {destinations.map((destination) => (
                <option key={destination._id} value={destination._id}>
                  {destination.name}, {destination.country}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Trip Type */}
        <div>
          <label htmlFor="tripType" className="block text-sm font-medium text-gray-700 mb-2">
            Trip Type
          </label>
          <select
            id="tripType"
            name="tripType"
            value={tripData.tripType}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="vacation">Vacation</option>
            <option value="business">Business</option>
            <option value="weekend">Weekend Getaway</option>
            <option value="long-term">Long Term Travel</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={tripData.startDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={tripData.endDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={tripData.notes}
            onChange={handleInputChange}
            placeholder="Add any notes about your trip..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={parentLoading || loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {parentLoading ? 'Creating Trip...' : 'Create Trip'}
          </button>
        </div>
      </form>

      {/* Trip Types Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Types Explained</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Vacation</p>
              <p className="text-sm text-gray-600">Standard vacation trip</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Business</p>
              <p className="text-sm text-gray-600">Business-related travel</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Weekend Getaway</p>
              <p className="text-sm text-gray-600">Short 2-day trip</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Long Term Travel</p>
              <p className="text-sm text-gray-600">Extended 30-day journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripForm; 
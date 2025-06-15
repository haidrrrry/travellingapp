import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationAPI, tripAPI } from '../services/api';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaPlaneDeparture, 
  FaStickyNote, 
  FaUsers, 
  FaDollarSign, 
  FaGlobe,
  FaBuilding,
  FaRoute,
  FaHeart,
  FaStar,
  FaSearch,
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa';

const CreateTrip = ({ auth }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    userId: auth?.user?.id || '',
    destinationId: '',
    startDate: '',
    endDate: '',
    tripType: 'leisure',
    notes: '',
    budget: '',
    travelers: 1
  });
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await destinationAPI.getAll();
      setDestinations(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch destinations');
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setTripData({
      ...tripData,
      [e.target.name]: e.target.value
    });
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
    setTripData({
      ...tripData,
      destinationId: destination._id
    });
    setCurrentStep(2);
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    
    if (!tripData.userId || !tripData.destinationId || !tripData.startDate || !tripData.endDate || !tripData.tripType) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await tripAPI.create(tripData, auth.token);
      setSuccess('Trip created successfully!');
      setError(null);
      
      setTimeout(() => {
        navigate('/my-trips');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
      setSuccess(null);
      console.error('Error creating trip:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTripTypeColor = (type) => {
    const colors = {
      'leisure': '#10b981',
      'business': '#3b82f6',
      'adventure': '#f59e0b',
      'romantic': '#ec4899',
      'family': '#8b5cf6',
      'cultural': '#06b6d4'
    };
    return colors[type] || '#6b7280';
  };

  const filteredDestinations = destinations.filter(destination =>
    destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTripDuration = () => {
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">Loading amazing destinations...</p>
    </div>
  );

  const SuccessMessage = () => (
    <div className="success-overlay">
      <div className="success-content">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h3 className="success-title">Trip Created Successfully!</h3>
        <p className="success-description">
          Your adventure to {selectedDestination?.name} has been planned. 
          Redirecting to your trips...
        </p>
      </div>
    </div>
  );

  return (
    <div className="createtrip-container">
      <header className="page-header">
        <div className="header-content">
          <button 
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <FaArrowLeft />
            Back
          </button>
          <div className="header-text">
            <h1 className="page-title">
              Plan Your Adventure
              <span className="title-accent">✨</span>
            </h1>
            <p className="page-subtitle">
              Create unforgettable memories with your perfect trip
            </p>
          </div>
        </div>
      </header>

      <div className="progress-section">
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span className="step-label">Choose Destination</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span className="step-label">Trip Details</span>
          </div>
        </div>
      </div>

      <main className="main-content">
        {loading && destinations.length === 0 && <LoadingSpinner />}
        
        {error && (
          <div className="error-message">
            <strong>Oops!</strong> {error}
          </div>
        )}

        {success && <SuccessMessage />}

        {!loading && !error && (
          <div className="content-wrapper">
            {currentStep === 1 && (
              <div className="step-content">
                <div className="step-header">
                  <h2 className="step-title">Choose Your Destination</h2>
                  <p className="step-description">
                    Select from our curated collection of amazing destinations
                  </p>
                </div>

                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="destinations-grid">
                  {filteredDestinations.map(destination => (
                    <div
                      key={destination._id}
                      className="destination-card"
                      onClick={() => handleDestinationSelect(destination)}
                    >
                      <div className="card-image-container">
                        <img
                          src={destination.imageUrl}
                          alt={destination.name}
                          className="card-image"
                        />
                        <div className="image-overlay">
                          <div className="overlay-actions">
                            <button className="action-btn favorite-btn">
                              <FaHeart />
                            </button>
                          </div>
                        </div>
                        <div className="rating-overlay">
                          <FaStar className="star-icon" />
                          <span>4.8</span>
                        </div>
                      </div>
                      
                      <div className="card-content">
                        <h3 className="destination-name">
                          {destination.name}
                        </h3>
                        <div className="destination-location">
                          <FaMapMarkerAlt className="location-icon" />
                          <span>{destination.country}</span>
                        </div>
                        <p className="destination-description">
                          {destination.description}
                        </p>
                        <div className="destination-meta">
                          <span className="price-range">
                            <FaDollarSign />
                            From ${destination.priceRange?.min || 500}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && selectedDestination && (
              <div className="step-content">
                <div className="step-header">
                  <h2 className="step-title">Plan Your Trip Details</h2>
                  <p className="step-description">
                    Customize your adventure to {selectedDestination.name}
                  </p>
                </div>

                <div className="selected-destination">
                  <div className="destination-preview">
                    <img
                      src={selectedDestination.imageUrl}
                      alt={selectedDestination.name}
                      className="preview-image"
                    />
                    <div className="preview-content">
                      <h3>{selectedDestination.name}</h3>
                      <p>{selectedDestination.country}</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreateTrip} className="trip-form">
                  <div className="form-grid">
                    <div className="form-section">
                      <label className="form-label">
                        <FaPlaneDeparture className="label-icon" />
                        Trip Type
                      </label>
                      <div className="trip-type-grid">
                        {[
                          { value: 'leisure', label: 'Leisure', icon: FaGlobe },
                          { value: 'business', label: 'Business', icon: FaBuilding },
                          { value: 'adventure', label: 'Adventure', icon: FaRoute },
                          { value: 'romantic', label: 'Romantic', icon: FaHeart },
                          { value: 'family', label: 'Family', icon: FaUsers },
                          { value: 'cultural', label: 'Cultural', icon: FaStar }
                        ].map(type => {
                          const IconComponent = type.icon;
                          return (
                            <div
                              key={type.value}
                              className={`trip-type-option ${tripData.tripType === type.value ? 'selected' : ''}`}
                              onClick={() => setTripData({ ...tripData, tripType: type.value })}
                            >
                              <IconComponent 
                                className="type-icon"
                                style={{ color: getTripTypeColor(type.value) }}
                              />
                              <span>{type.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-section">
                      <label className="form-label">
                        <FaCalendarAlt className="label-icon" />
                        Travel Dates
                      </label>
                      <div className="date-range-container">
                        <div className="date-input-group">
                          <label className="date-label">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            value={tripData.startDate}
                            onChange={handleInputChange}
                            required
                            className="date-input"
                          />
                        </div>
                        <div className="date-input-group">
                          <label className="date-label">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            value={tripData.endDate}
                            onChange={handleInputChange}
                            required
                            className="date-input"
                        />
                        </div>
                      </div>
                      {calculateTripDuration() > 0 && (
                        <div className="trip-duration">
                          <span className="duration-badge">
                            {calculateTripDuration()} day{calculateTripDuration() !== 1 ? 's' : ''} trip
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="form-section">
                      <label className="form-label">
                        <FaUsers className="label-icon" />
                        Trip Details
                      </label>
                      <div className="details-grid">
                        <div className="detail-input-group">
                          <label className="detail-label">Number of Travelers</label>
                          <input
                            type="number"
                            name="travelers"
                            value={tripData.travelers}
                            onChange={handleInputChange}
                            min="1"
                            max="10"
                            className="detail-input"
                          />
                        </div>
                        <div className="detail-input-group">
                          <label className="detail-label">Budget (Optional)</label>
                          <div className="budget-input-container">
                            <FaDollarSign className="budget-icon" />
                            <input
                              type="number"
                              name="budget"
                              value={tripData.budget}
                              onChange={handleInputChange}
                              placeholder="0"
                              className="budget-input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <label className="form-label">
                        <FaStickyNote className="label-icon" />
                        Trip Notes
                      </label>
                      <textarea
                        name="notes"
                        value={tripData.notes}
                        onChange={handleInputChange}
                        placeholder="Add any special requests, activities you'd like to do, or notes about your trip..."
                        rows="4"
                        className="notes-textarea"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="action-button secondary"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="action-button primary"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="spinner-icon" />
                          Creating Trip...
                        </>
                      ) : (
                        'Create Trip'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .createtrip-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          position: relative;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .header-text {
          color: white;
          flex: 1;
        }

        .page-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .title-accent {
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          font-weight: 300;
        }

        .progress-section {
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 0 2rem;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          background: white;
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        .step.active {
          background: #3b82f6;
          color: white;
          opacity: 1;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .step-number {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: currentColor;
          color: ${currentStep >= 1 ? 'white' : '#64748b'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .step-label {
          font-weight: 600;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 2rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
        }

        .loading-spinner {
          position: relative;
          width: 4rem;
          height: 4rem;
          margin-bottom: 1rem;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
        }

        .spinner-ring:nth-child(2) {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          border-top-color: #10b981;
          animation-delay: -0.4s;
        }

        .spinner-ring:nth-child(3) {
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          border-top-color: #f59e0b;
          animation-delay: -0.8s;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .error-message {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          border: 1px solid #f87171;
          color: #dc2626;
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          margin: 2rem 0;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
        }

        .success-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .success-content {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .success-icon {
          font-size: 4rem;
          color: #10b981;
          margin-bottom: 1rem;
          animation: bounce 0.6s ease-in-out;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .success-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .success-description {
          color: #64748b;
          line-height: 1.5;
        }

        .content-wrapper {
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .step-content {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
        }

        .step-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .step-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .step-description {
          color: #64748b;
          font-size: 1.1rem;
        }

        .search-container {
          position: relative;
          margin-bottom: 2rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.1rem;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .destination-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .destination-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .card-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
        }

        .destination-card:hover .card-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, 
            rgba(0, 0, 0, 0.1) 0%, 
            rgba(0, 0, 0, 0.4) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 1rem;
        }

        .destination-card:hover .image-overlay {
          opacity: 1;
        }

        .overlay-actions {
          display: flex;
          gap: 0.5rem;
          margin-left: auto;
        }

        .action-btn {
          width: 2.5rem;
          height: 2.5rem;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .action-btn:hover {
          background: white;
          color: #ec4899;
          transform: scale(1.1);
        }

        .rating-overlay {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          backdrop-filter: blur(10px);
        }

        .star-icon {
          color: #fbbf24;
        }

        .card-content {
          padding: 1.5rem;
        }

        .destination-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .destination-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .location-icon {
          color: #ef4444;
        }

        .destination-description {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .destination-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-range {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #10b981;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .selected-destination {
          margin-bottom: 2rem;
        }

        .destination-preview {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }

        .preview-image {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
        }

        .preview-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .preview-content p {
          color: #64748b;
        }

        .trip-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
        }

        .label-icon {
          color: #3b82f6;
        }

        .trip-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .trip-type-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .trip-type-option:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .trip-type-option.selected {
          border-color: #3b82f6;
          background: #eff6ff;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
        }

        .type-icon {
          font-size: 1.5rem;
        }

        .date-range-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .date-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .date-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .date-input {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .date-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .trip-duration {
          margin-top: 0.5rem;
        }

        .duration-badge {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .detail-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .detail-input {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .detail-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .budget-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .budget-icon {
          position: absolute;
          left: 0.75rem;
          color: #64748b;
        }

        .budget-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .budget-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .notes-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          resize: vertical;
          min-height: 100px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .notes-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          min-width: 150px;
        }

        .action-button.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .action-button.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .action-button.secondary {
          background: #f1f5f9;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .action-button.secondary:hover {
          background: #e2e8f0;
          color: #374151;
          transform: translateY(-2px);
        }

        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .spinner-icon {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .page-title {
            font-size: 2.5rem;
            flex-direction: column;
            gap: 0.25rem;
          }

          .progress-steps {
            flex-direction: column;
            gap: 0.5rem;
          }

          .step {
            justify-content: center;
          }

          .destinations-grid {
            grid-template-columns: 1fr;
          }

          .date-range-container {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .action-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 0 1rem 2rem;
          }

          .step-content {
            padding: 1.5rem;
          }

          .trip-type-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateTrip; 
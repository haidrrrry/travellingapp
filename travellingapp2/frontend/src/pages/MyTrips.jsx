import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStickyNote,
  FaPlaneDeparture,
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaEdit,
  FaGlobe,
  FaRoute,
  FaHotel,
  FaUtensils,
  FaSpinner,
  FaExclamationTriangle,
  FaMountain,
  FaUmbrellaBeach,
  FaCity,
  FaLandmark,
  FaTree
} from 'react-icons/fa';

// Mock data for demonstration
const mockAuth = {
  user: { id: '1' },
  token: 'mock-token'
};

const mockTrips = [
  {
    _id: '1',
    destinationId: {
      name: 'Bali Paradise',
      location: 'Bali, Indonesia',
      imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=500&fit=crop',
      rating: 4.8,
      reviews: 1247
    },
    tripType: 'leisure',
    startDate: '2024-07-15',
    endDate: '2024-07-22',
    notes: 'Perfect getaway to explore beautiful beaches and temples. Looking forward to the cultural experience!',
    status: 'upcoming',
    budget: 2500,
    travelers: 2,
    activities: ['beach', 'culture', 'spa'],
    accommodation: 'luxury_resort'
  },
  {
    _id: '2',
    destinationId: {
      name: 'Swiss Alps Adventure',
      location: 'Interlaken, Switzerland',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
      rating: 4.9,
      reviews: 892
    },
    tripType: 'adventure',
    startDate: '2024-08-10',
    endDate: '2024-08-17',
    notes: 'Mountain hiking and scenic train rides through the Alps',
    status: 'upcoming',
    budget: 3200,
    travelers: 3,
    activities: ['hiking', 'adventure', 'nature'],
    accommodation: 'mountain_lodge'
  },
  {
    _id: '3',
    destinationId: {
      name: 'Tokyo Explorer',
      location: 'Tokyo, Japan',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop',
      rating: 4.7,
      reviews: 2156
    },
    tripType: 'cultural',
    startDate: '2024-06-15',
    endDate: '2024-06-22',
    notes: 'Amazing cultural experience in the heart of Japan',
    status: 'completed',
    budget: 2800,
    travelers: 2,
    activities: ['culture', 'food', 'shopping'],
    accommodation: 'boutique_hotel'
  }
];

const mockBookings = [
  {
    _id: '1',
    destinationId: {
      name: 'Paris Romance',
      location: 'Paris, France',
      imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=500&fit=crop',
      rating: 4.6,
      reviews: 1893
    },
    paymentStatus: 'Paid',
    tripDate: '2024-10-12',
    numTravelers: 2,
    totalPrice: 3200,
    createdAt: '2024-06-10',
    bookingType: 'hotel',
    confirmationNumber: 'BK-2024-001'
  },
  {
    _id: '2',
    destinationId: {
      name: 'Santorini Sunset',
      location: 'Santorini, Greece',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=500&fit=crop',
      rating: 4.8,
      reviews: 1456
    },
    paymentStatus: 'Pending',
    tripDate: '2024-11-05',
    numTravelers: 2,
    totalPrice: 2800,
    createdAt: '2024-06-15',
    bookingType: 'flight',
    confirmationNumber: 'BK-2024-002'
  }
];

const MyTrips = ({ auth = mockAuth }) => {
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('trips');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTrips(mockTrips);
        setBookings(mockBookings);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTripTypeBadgeColor = (tripType) => {
    const colors = {
      'business': '#3b82f6',
      'leisure': '#10b981',
      'adventure': '#f59e0b',
      'romantic': '#ec4899',
      'family': '#8b5cf6',
      'cultural': '#06b6d4'
    };
    return colors[tripType?.toLowerCase()] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      'upcoming': '#3b82f6',
      'ongoing': '#10b981',
      'completed': '#6b7280',
      'cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getActivityIcon = (activity) => {
    const icons = {
      'beach': FaGlobe,
      'culture': FaRoute,
      'hiking': FaMountain,
      'spa': FaHotel,
      'food': FaUtensils,
      'shopping': FaEdit // Reusing FaEdit as a placeholder for shopping, you might want a different icon
    };
    return icons[activity] || FaEye;
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.destinationId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destinationId.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = bookings.filter(booking => {
    return booking.destinationId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           booking.destinationId.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">Loading your travel adventures...</p>
    </div>
  );

  const EmptyState = ({ type }) => (
    <div className="empty-state">
      <div className="empty-icon">
        {type === 'trips' ? '✈️' : '🎫'}
      </div>
      <h3 className="empty-title">
        {type === 'trips' ? 'No Trips Planned Yet' : 'No Bookings Found'}
      </h3>
      <p className="empty-description">
        {type === 'trips' 
          ? 'Start planning your next adventure and create unforgettable memories!' 
          : 'Ready to book your dream destination? Let\'s get started!'}
      </p>
      <button className="cta-button">
        <FaPlus className="button-icon" />
        {type === 'trips' ? 'Plan Your First Trip' : 'Book a Trip Now'}
      </button>
    </div>
  );

  const TripCard = ({ trip }) => (
    <div className={`trip-card ${viewMode}`}>
      <div className="card-image-container">
        <img
          src={trip.destinationId?.imageUrl}
          alt={trip.destinationId?.name}
          className="card-image"
        />
        <div className="image-overlay">
          <div className="overlay-actions">
            <button className="action-btn favorite-btn">
              <FaHeart />
            </button>
            <button className="action-btn view-btn">
              <FaEye />
            </button>
          </div>
        </div>
        <div className="card-badges">
          <div 
            className="trip-type-badge"
            style={{ backgroundColor: getTripTypeBadgeColor(trip.tripType) }}
          >
            {trip.tripType}
          </div>
          <div 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(trip.status) }}
          >
            {trip.status}
          </div>
        </div>
        <div className="rating-overlay">
          <FaStar className="star-icon" />
          <span>{trip.destinationId?.rating}</span>
          <span className="review-count">({trip.destinationId?.reviews})</span>
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="destination-name">
            {trip.destinationId?.name}
          </h3>
          <div className="destination-location">
            <FaMapMarkerAlt className="location-icon" />
            <span>{trip.destinationId?.location}</span>
          </div>
        </div>
        
        <div className="trip-details">
          <div className="detail-row">
            <div className="detail-item">
              <FaCalendarAlt className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Dates</span>
                <span className="detail-value">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <FaUsers className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Travelers</span>
                <span className="detail-value">{trip.travelers} people</span>
              </div>
            </div>
            <div className="detail-item">
              <FaDollarSign className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Budget</span>
                <span className="detail-value">${trip.budget?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {trip.activities && trip.activities.length > 0 && (
          <div className="activities-section">
            <h4 className="section-title">Activities</h4>
            <div className="activities-grid">
              {trip.activities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity);
                return (
                  <div key={index} className="activity-tag">
                    <ActivityIcon className="activity-icon" />
                    <span>{activity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {trip.notes && (
          <div className="trip-notes">
            <FaStickyNote className="notes-icon" />
            <p>{trip.notes}</p>
          </div>
        )}
        
        <div className="card-actions">
          <button className="action-button primary">
            <FaEye />
            View Details
          </button>
          <button className="action-button secondary">
            <FaEdit />
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  const BookingCard = ({ booking }) => (
    <div className="booking-card">
      <div className="card-image-container">
        <img
          src={booking.destinationId?.imageUrl}
          alt={booking.destinationId?.name}
          className="card-image"
        />
        <div className="image-overlay">
          <div className="overlay-actions">
            <button className="action-btn favorite-btn">
              <FaHeart />
            </button>
            <button className="action-btn view-btn">
              <FaEye />
            </button>
          </div>
        </div>
        <div className="card-badges">
          <div className={`payment-status ${booking.paymentStatus.toLowerCase()}`}>
            {booking.paymentStatus === 'Paid' ? (
              <FaCheckCircle className="status-icon" />
            ) : (
              <FaClock className="status-icon" />
            )}
            {booking.paymentStatus}
          </div>
          <div className="booking-type-badge">
            {booking.bookingType}
          </div>
        </div>
        <div className="rating-overlay">
          <FaStar className="star-icon" />
          <span>{booking.destinationId?.rating}</span>
          <span className="review-count">({booking.destinationId?.reviews})</span>
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="destination-name">
            {booking.destinationId?.name}
          </h3>
          <div className="destination-location">
            <FaMapMarkerAlt className="location-icon" />
            <span>{booking.destinationId?.location}</span>
          </div>
        </div>
        
        <div className="booking-details">
          <div className="detail-row">
            <div className="detail-item">
              <FaCalendarAlt className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Trip Date</span>
                <span className="detail-value">{formatDate(booking.tripDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <FaUsers className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Travelers</span>
                <span className="detail-value">{booking.numTravelers} people</span>
              </div>
            </div>
            <div className="detail-item">
              <FaDollarSign className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Total Price</span>
                <span className="detail-value price">${booking.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="booking-meta">
            <div className="meta-item">
              <span className="meta-label">Confirmation:</span>
              <span className="meta-value">{booking.confirmationNumber}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Booked:</span>
              <span className="meta-value">{formatDate(booking.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="card-actions">
          <button className="action-button primary">
            <FaEye />
            View Details
          </button>
          <button className="action-button secondary">
            <FaEdit />
            Modify
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mytrips-container">
      {/* Header Section */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              My Travel Journey
              <span className="title-accent">✨</span>
            </h1>
            <p className="page-subtitle">
              Manage your trips and bookings in one place
            </p>
          </div>
          <div className="header-actions">
            <button className="new-trip-btn">
              <FaPlus />
              New Trip
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
          >
            <FaPlaneDeparture className="tab-icon" />
            <span>My Trips</span>
            <span className="tab-count">{trips.length}</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <FaCreditCard className="tab-icon" />
            <span>My Bookings</span>
            <span className="tab-count">{bookings.length}</span>
          </button>
        </div>
      </nav>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
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
        
        {activeTab === 'trips' && (
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
        
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="error-message">
            <strong>Oops!</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <div className={`cards-container ${viewMode}`}>
            {activeTab === 'trips' && (
              <>
                {filteredTrips.length === 0 ? (
                  <EmptyState type="trips" />
                ) : (
                  filteredTrips.map(trip => (
                    <TripCard key={trip._id} trip={trip} />
                  ))
                )}
              </>
            )}

            {activeTab === 'bookings' && (
              <>
                {filteredBookings.length === 0 ? (
                  <EmptyState type="bookings" />
                ) : (
                  filteredBookings.map(booking => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))
                )}
              </>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .mytrips-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          position: relative;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 3rem 0;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-text {
          color: white;
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

        .new-trip-btn {
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

        .new-trip-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .tab-navigation {
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 0 2rem;
        }

        .tab-buttons {
          display: flex;
          background: white;
          border-radius: 16px;
          padding: 0.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-button:hover {
          color: #3b82f6;
          background: #f1f5f9;
        }

        .tab-button.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .tab-icon {
          font-size: 1.1rem;
        }

        .tab-count {
          background: currentColor;
          color: ${activeTab === 'trips' || activeTab === 'bookings' ? 'white' : 'rgba(59, 130, 246, 0.2)'};
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          min-width: 1.5rem;
          text-align: center;
        }

        .search-filter-section {
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 0 2rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          min-width: 300px;
          position: relative;
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
          padding: 0.75rem 1rem 0.75rem 2.5rem;
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

        .filter-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-icon {
          color: #64748b;
          font-size: 1.1rem;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .view-toggle {
          display: flex;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .view-btn {
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .view-btn.active {
          background: #3b82f6;
          color: white;
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

        .cards-container {
          display: grid;
          gap: 2rem;
        }

        .cards-container.grid {
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        }

        .cards-container.list {
          grid-template-columns: 1fr;
        }

        .trip-card, .booking-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .trip-card:hover, .booking-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .trip-card.list {
          display: flex;
          max-width: 100%;
        }

        .trip-card.list .card-image-container {
          width: 300px;
          flex-shrink: 0;
        }

        .trip-card.list .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-image-container {
          position: relative;
          height: 240px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
        }

        .trip-card:hover .card-image, .booking-card:hover .card-image {
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

        .trip-card:hover .image-overlay, .booking-card:hover .image-overlay {
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
          color: #3b82f6;
          transform: scale(1.1);
        }

        .favorite-btn:hover {
          color: #ec4899;
        }

        .card-badges {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .trip-type-badge, .status-badge {
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .payment-status {
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .payment-status.paid {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .payment-status.pending {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .booking-type-badge {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
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

        .review-count {
          opacity: 0.8;
          font-size: 0.8rem;
        }

        .card-content {
          padding: 2rem;
        }

        .card-header {
          margin-bottom: 1.5rem;
        }

        .destination-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .destination-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 1rem;
        }

        .location-icon {
          color: #ef4444;
          font-size: 1rem;
        }

        .trip-details, .booking-details {
          margin-bottom: 1.5rem;
        }

        .detail-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .detail-icon {
          font-size: 1.1rem;
          width: 1.2rem;
          flex-shrink: 0;
          color: #3b82f6;
        }

        .detail-text {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 1rem;
          color: #1f2937;
          font-weight: 600;
        }

        .price {
          color: #10b981;
          font-weight: 700;
        }

        .activities-section {
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
        }

        .activities-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .activity-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          color: #374151;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .activity-icon {
          color: #3b82f6;
          font-size: 0.9rem;
        }

        .trip-notes {
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          padding: 1rem;
          border-radius: 12px;
          border-left: 4px solid #8b5cf6;
          margin-bottom: 1.5rem;
        }

        .notes-icon {
          color: #8b5cf6;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .trip-notes p {
          color: #4c1d95;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
          font-style: italic;
        }

        .booking-meta {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .meta-item:last-child {
          margin-bottom: 0;
        }

        .meta-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .meta-value {
          font-size: 0.9rem;
          color: #1f2937;
          font-weight: 600;
        }

        .card-actions {
          display: flex;
          gap: 1rem;
          margin-top: auto;
        }

        .action-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .action-button.primary {
          background: #3b82f6;
          color: white;
        }

        .action-button.primary:hover {
          background: #2563eb;
          transform: translateY(-2px);
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

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 20px;
          border: 2px dashed #e2e8f0;
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          opacity: 0.6;
        }

        .empty-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #374151;
        }

        .empty-description {
          font-size: 1.1rem;
          opacity: 0.8;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .cta-button {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .button-icon {
          font-size: 1rem;
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

          .search-filter-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            min-width: auto;
          }

          .filter-container {
            justify-content: center;
          }

          .view-toggle {
            align-self: center;
          }

          .cards-container.grid {
            grid-template-columns: 1fr;
          }

          .trip-card.list {
            flex-direction: column;
          }

          .trip-card.list .card-image-container {
            width: 100%;
          }

          .detail-row {
            flex-direction: column;
            gap: 0.5rem;
          }

          .card-actions {
            flex-direction: column;
          }

          .empty-state {
            padding: 3rem 1.5rem;
          }

          .empty-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 0 1rem 2rem;
          }

          .tab-navigation {
            padding: 0 1rem;
          }

          .search-filter-section {
            padding: 0 1rem;
          }

          .card-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyTrips; 
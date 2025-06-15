import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaDollarSign, 
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaGlobe,
  FaMountain,
  FaUmbrellaBeach,
  FaCity,
  FaRoute,
  FaLandmark,
  FaTree
} from 'react-icons/fa';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MyBookings = ({ auth }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tripTypeIcons = {
    adventure: FaRoute,
    beach: FaUmbrellaBeach,
    city: FaCity,
    mountain: FaMountain,
    cultural: FaLandmark,
    nature: FaTree,
    default: FaGlobe
  };

  const tripTypeColors = {
    adventure: '#ec4899',
    beach: '#f59e0b',
    city: '#8b5cf6',
    mountain: '#10b981',
    cultural: '#06b6d4',
    nature: '#059669',
    default: '#3b82f6'
  };

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/trips/user/${auth.user.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setTrips(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch trips');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user?.id) return;
    fetchTrips();
  }, [auth, fetchTrips]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner">
        <FaSpinner className="spinner-icon" />
      </div>
      <p className="loading-text">Loading your trips...</p>
    </div>
  );

  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">📋</div>
      <h3 className="empty-title">No trips found</h3>
      <p className="empty-description">
        You haven't created any trips yet. Start exploring destinations and plan your next adventure!
      </p>
    </div>
  );

  const TripCard = ({ trip }) => {
    const IconComponent = tripTypeIcons[trip.tripType] || tripTypeIcons.default;
    const iconColor = tripTypeColors[trip.tripType] || tripTypeColors.default;
    
    return (
      <div className="booking-card">
        <div className="booking-header">
          <div className="booking-info">
            <div 
              className="trip-type-badge"
              style={{ backgroundColor: iconColor }}
            >
              <IconComponent className="type-icon" />
              <span>{trip.tripType ? trip.tripType.charAt(0).toUpperCase() + trip.tripType.slice(1) : 'Trip'}</span>
            </div>
            <h3 className="booking-title">{trip.destinationId?.name || 'Unknown Destination'}</h3>
            <div className="booking-location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{trip.destinationId?.country || 'Unknown Location'}</span>
            </div>
          </div>
          <div className="booking-status">
            <FaCheckCircle className="status-icon confirmed" />
            <span>Planned</span>
          </div>
        </div>
        
        <div className="booking-details">
          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <div>
              <span className="detail-label">Trip Dates</span>
              <span className="detail-value">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <FaUsers className="detail-icon" />
            <div>
              <span className="detail-label">Travelers</span>
              <span className="detail-value">{trip.numTravelers || 1} {(trip.numTravelers || 1) === 1 ? 'person' : 'people'}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <FaDollarSign className="detail-icon" />
            <div>
              <span className="detail-label">Budget</span>
              <span className="detail-value">${trip.budget || 'Not set'}</span>
            </div>
          </div>
        </div>
        
        <div className="booking-footer">
          <div className="booking-date">
            <FaCalendarAlt className="footer-icon" />
            <span>Created on {formatDate(trip.createdAt)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bookings-container">
      <header className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              My Trips
              <span className="title-accent">📋</span>
            </h1>
            <p className="page-subtitle">
              View and manage all your planned trips
            </p>
          </div>
        </div>
      </header>

      <main className="main-content">
        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="error-alert">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="content-wrapper">
            {trips.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="bookings-grid">
                {trips.map(trip => (
                  <TripCard key={trip._id} trip={trip} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .bookings-container {
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
          text-align: center;
          color: white;
        }

        .page-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
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
          margin-bottom: 1rem;
        }

        .spinner-icon {
          font-size: 3rem;
          color: #3b82f6;
          animation: spin 1s linear infinite;
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

        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          border: 1px solid #f87171;
          color: #dc2626;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin: 2rem 0;
          font-weight: 600;
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

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .booking-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .booking-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .booking-header {
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .booking-info {
          flex: 1;
        }

        .trip-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          width: fit-content;
          margin-bottom: 1rem;
        }

        .type-icon {
          font-size: 1rem;
        }

        .booking-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .booking-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .location-icon {
          color: #3b82f6;
        }

        .booking-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #059669;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .status-icon.confirmed {
          color: #059669;
        }

        .booking-details {
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .detail-icon {
          color: #3b82f6;
          font-size: 1.1rem;
          min-width: 1.1rem;
        }

        .detail-item div {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .detail-value {
          font-size: 1rem;
          color: #1f2937;
          font-weight: 600;
        }

        .booking-footer {
          padding: 1rem 2rem 2rem;
          border-top: 1px solid #f1f5f9;
        }

        .booking-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .footer-icon {
          color: #3b82f6;
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
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .bookings-grid {
            grid-template-columns: 1fr;
          }

          .booking-header {
            flex-direction: column;
            gap: 1rem;
          }

          .booking-status {
            align-self: flex-start;
          }

          .main-content {
            padding: 0 1rem 2rem;
          }

          .empty-state {
            padding: 3rem 1.5rem;
          }

          .empty-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .booking-header {
            padding: 1.5rem 1.5rem 1rem;
          }

          .booking-details {
            padding: 1.5rem;
          }

          .booking-footer {
            padding: 1rem 1.5rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookings; 
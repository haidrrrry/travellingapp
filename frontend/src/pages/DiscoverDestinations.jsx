import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaStar, 
  FaHeart, 
  FaPlus,
  FaEye,
  FaDollarSign,
  FaUsers,
  FaCalendarAlt,
  FaBookmark,
  FaExclamationTriangle,
  FaSync
} from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DiscoverDestinations = ({ auth }) => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    country: '', 
    location: '',
    description: '', 
    imageUrl: '',
    price: '',
    category: 'adventure'
  });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());

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

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    
    // Validate price
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      setFormError('Please enter a valid price (must be a positive number)');
      setFormLoading(false);
      return;
    }
    
    try {
      // Convert price to number
      const formData = {
        ...form,
        price: price
      };
      
      console.log('Sending destination data:', formData);
      console.log('Auth token:', auth?.token ? 'Present' : 'Missing');
      
      await axios.post(`${API_URL}/api/destinations`, formData, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      setShowForm(false);
      setForm({ name: '', country: '', location: '', description: '', imageUrl: '', price: '', category: 'adventure' });
      fetchDestinations();
    } catch (err) {
      console.error('Destination creation error:', err);
      if (err.response?.data?.errors) {
        setFormError(err.response.data.errors.join(', '));
      } else {
        setFormError(err.response?.data?.message || 'Failed to add destination. Please check all required fields.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const toggleFavorite = (destinationId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(destinationId)) {
        newFavorites.delete(destinationId);
      } else {
        newFavorites.add(destinationId);
      }
      return newFavorites;
    });
  };

  const handleBookTrip = (destination) => {
    navigate('/book', { state: { destination } });
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = !searchQuery || 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.country && dest.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dest.location && dest.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

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

  const DestinationCard = ({ destination }) => {
    return (
      <div className="destination-card">
        <div className="card-image-container">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="card-image"
            onError={e => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available'}
          />
          <div className="image-overlay">
            <div className="overlay-actions">
              <button 
                className={`action-btn favorite-btn ${favorites.has(destination._id) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(destination._id);
                }}
              >
                <FaHeart />
              </button>
              <button 
                className="action-btn bookmark-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add bookmark functionality
                }}
              >
                <FaBookmark />
              </button>
            </div>
          </div>
          <div className="card-badges">
            <div className="rating-overlay">
              <FaStar className="star-icon" />
              <span>{destination.rating || 4.5}</span>
            </div>
          </div>
        </div>
        
        <div className="card-content">
          <div className="card-header">
            <h3 className="destination-name">
              {destination.name}
            </h3>
            <div className="destination-location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{destination.country || destination.location || 'Unknown Location'}</span>
            </div>
          </div>
          
          <p className="destination-description">
            {destination.description || 'Experience the beauty and adventure of this amazing destination.'}
          </p>
          
          <div className="destination-meta">
            <div className="meta-item">
              <FaDollarSign className="meta-icon" />
              <span className="price">From ${destination.price || 299}</span>
            </div>
            <div className="meta-item">
              <FaUsers className="meta-icon" />
              <span>Perfect for all travelers</span>
            </div>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-button secondary"
              onClick={() => navigate(`/destinations/${destination._id}`)}
            >
              <FaEye />
              View Details
            </button>
            <button 
              className="action-button primary"
              onClick={() => handleBookTrip(destination)}
            >
              <FaCalendarAlt />
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="destinations-container">
      {/* Header Section */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              Discover Amazing Destinations
              <span className="title-accent">✨</span>
            </h1>
            <p className="page-subtitle">
              Explore breathtaking places around the world and plan your next adventure
            </p>
          </div>
          <div className="header-actions">
            {auth?.user && (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="new-trip-btn"
              >
                <FaPlus />
                Add Destination
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search destinations by name, country, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Add Destination Form */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h2>Add New Destination</h2>
              <button onClick={() => setShowForm(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="destination-form">
              <div className="form-group">
                <label>Destination Name</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleFormChange} 
                  required 
                  placeholder="Enter destination name"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input 
                  name="country" 
                  value={form.country} 
                  onChange={handleFormChange} 
                  required 
                  placeholder="Enter country name"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  name="location" 
                  value={form.location} 
                  onChange={handleFormChange} 
                  required 
                  placeholder="Enter location"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleFormChange} 
                  required 
                  rows="4"
                  placeholder="Describe this amazing destination"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input 
                  name="imageUrl" 
                  value={form.imageUrl} 
                  onChange={handleFormChange} 
                  required 
                  placeholder="Enter image URL"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input 
                  name="price" 
                  value={form.price} 
                  onChange={handleFormChange} 
                  required 
                  placeholder="Enter price"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={handleFormChange} 
                  required
                >
                  <option value="adventure">Adventure</option>
                  <option value="cultural">Cultural</option>
                  <option value="beaches">Beaches</option>
                  <option value="cities">Cities</option>
                  <option value="mountains">Mountains</option>
                  <option value="nature">Nature</option>
                </select>
              </div>
              {formError && (
                <div className="error-message">
                  {formError}
                </div>
              )}
              <div className="form-actions">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="action-btn secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="action-btn primary"
                  disabled={formLoading}
                >
                  {formLoading ? 'Adding...' : 'Add Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
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
            {filteredDestinations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🗺️</div>
                <h3 className="empty-title">No destinations found</h3>
                <p className="empty-description">
                  Try adjusting your search criteria or browse all destinations
                </p>
                <button onClick={() => setSearchQuery('')} className="cta-button">
                  <FaSync />
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="destinations-grid">
                {filteredDestinations.map(destination => (
                  <DestinationCard key={destination._id} destination={destination} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .destinations-container {
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

        .search-section {
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 0 2rem;
        }

        .search-container {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.2rem;
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

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .destination-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .destination-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .card-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
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
          background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .destination-card:hover .image-overlay {
          opacity: 1;
        }

        .overlay-actions {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .action-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        .action-btn.active {
          color: #ec4899;
        }

        .card-badges {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rating-overlay {
          background: rgba(255, 255, 255, 0.9);
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .star-icon {
          color: #f59e0b;
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-header {
          margin-bottom: 1rem;
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
          font-size: 0.9rem;
        }

        .location-icon {
          color: #3b82f6;
        }

        .destination-description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .destination-meta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .meta-icon {
          color: #3b82f6;
        }

        .price {
          font-weight: 600;
          color: #059669;
        }

        .card-actions {
          display: flex;
          gap: 0.75rem;
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

        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .form-modal {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .form-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #64748b;
        }

        .destination-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: #3b82f6;
          color: white;
        }

        .action-btn.primary:hover {
          background: #2563eb;
        }

        .action-btn.secondary {
          background: #f1f5f9;
          color: #64748b;
        }

        .action-btn.secondary:hover {
          background: #e2e8f0;
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

          .main-content {
            padding: 0 1rem 2rem;
          }

          .destinations-grid {
            grid-template-columns: 1fr;
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
          .card-content {
            padding: 1rem;
          }

          .destination-name {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DiscoverDestinations; 
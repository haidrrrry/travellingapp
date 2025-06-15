import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationAPI } from '../services/api';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaStar, 
  FaHeart, 
  FaGlobe,
  FaMountain,
  FaCity,
  FaTree,
  FaUmbrellaBeach,
  FaRoute,
  FaLandmark,
  FaPlus,
  FaSync,
  FaEye,
  FaDollarSign,
  FaUsers,
  FaCalendarAlt,
  FaArrowLeft
} from 'react-icons/fa';

const Destinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Destinations', icon: FaGlobe, color: '#3b82f6' },
    { id: 'beaches', name: 'Beaches', icon: FaUmbrellaBeach, color: '#f59e0b' },
    { id: 'mountains', name: 'Mountains', icon: FaMountain, color: '#10b981' },
    { id: 'cities', name: 'Cities', icon: FaCity, color: '#8b5cf6' },
    { id: 'adventure', name: 'Adventure', icon: FaRoute, color: '#ec4899' },
    { id: 'cultural', name: 'Cultural', icon: FaLandmark, color: '#06b6d4' },
    { id: 'nature', name: 'Nature', icon: FaTree, color: '#059669' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Alphabetical' }
  ];

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await destinationAPI.getAll();
      setDestinations(response.data?.data || []);
    } catch (err) {
      if (retryCount < 2) {
        setTimeout(() => fetchDestinations(retryCount + 1), 1000);
        return;
      }
      setError('Failed to fetch destinations. Please try again.');
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchDestinations();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await destinationAPI.search(searchQuery);
      setDestinations(response.data?.data || []);
    } catch (err) {
      setError('Failed to search destinations. Please try again.');
      console.error('Error searching destinations:', err);
    } finally {
      setLoading(false);
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

  const handleViewDetails = (destination) => {
    navigate(`/destinations/${destination._id}`, { state: { destination } });
  };

  // Filter and sort destinations
  const filteredAndSortedDestinations = useMemo(() => {
    let filtered = destinations.filter(dest => {
      const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
      const matchesPrice = dest.price >= priceRange.min && dest.price <= priceRange.max;
      const matchesSearch = !searchQuery || 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesSearch;
    });

    // Sort destinations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    return filtered;
  }, [destinations, selectedCategory, priceRange, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 5000 });
    setSortBy('popular');
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

  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">🗺️</div>
      <h3 className="empty-title">No destinations found</h3>
      <p className="empty-description">
        Try adjusting your search criteria or browse all destinations
      </p>
      <button onClick={clearFilters} className="cta-button">
        <FaSync className="button-icon" />
        Clear Filters
      </button>
    </div>
  );

  const DestinationCard = ({ destination }) => {
    const category = categories.find(cat => cat.id === destination.category) || categories[0];
    const IconComponent = category.icon;
    
    return (
      <div className="destination-card">
        <div className="card-image-container">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="card-image"
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
                className="action-btn view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(destination);
                }}
              >
                <FaEye />
              </button>
            </div>
          </div>
          <div className="card-badges">
            <div 
              className="category-badge"
              style={{ backgroundColor: category.color }}
            >
              <IconComponent className="category-icon" />
              <span>{category.name}</span>
            </div>
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
              <span>{destination.location}</span>
            </div>
          </div>
          
          <p className="destination-description">
            {destination.description}
          </p>
          
          <div className="destination-meta">
            <div className="meta-item">
              <FaDollarSign className="meta-icon" />
              <span className="price">From ${destination.price?.toLocaleString()}</span>
            </div>
            <div className="meta-item">
              <FaUsers className="meta-icon" />
              <span>Perfect for {destination.idealFor || 'all travelers'}</span>
            </div>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-button secondary"
              onClick={() => handleViewDetails(destination)}
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
            <button 
              onClick={() => navigate('/create-trip')}
              className="new-trip-btn"
            >
              <FaPlus />
              Plan Trip
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <form onSubmit={handleSearch} className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Where would you like to go?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
        
        <div className="filter-controls">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle"
          >
            <FaFilter />
            Filters
          </button>
          
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
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-content">
            <div className="filter-group">
              <h3 className="filter-title">Categories</h3>
              <div className="category-filters">
                {categories.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <IconComponent 
                        className="category-icon"
                        style={{ color: category.color }}
                      />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Price Range</h3>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>$0</span>
                  <span>${priceRange.max}</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                <FaSync />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="error-message">
            <strong>Oops!</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <div className="content-wrapper">
            {filteredAndSortedDestinations.length === 0 ? (
              <EmptyState />
            ) : (
              <div className={`destinations-grid ${viewMode}`}>
                {filteredAndSortedDestinations.map(destination => (
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
          min-width: 400px;
          position: relative;
          display: flex;
          gap: 0.5rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.1rem;
          z-index: 2;
        }

        .search-input {
          flex: 1;
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

        .search-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }

        .filter-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 2px solid #e2e8f0;
          color: #64748b;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-toggle:hover {
          border-color: #3b82f6;
          color: #3b82f6;
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

        .filters-panel {
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 0 2rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filters-content {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
        }

        .filter-group {
          margin-bottom: 2rem;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .category-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .category-filter:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .category-filter.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #3b82f6;
        }

        .category-icon {
          font-size: 1.1rem;
        }

        .price-range {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .price-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e2e8f0;
          outline: none;
          -webkit-appearance: none;
        }

        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }

        .price-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #64748b;
        }

        .sort-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sort-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .filter-actions {
          display: flex;
          justify-content: flex-end;
        }

        .clear-filters-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          color: #64748b;
          border: 2px solid #e2e8f0;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-filters-btn:hover {
          background: #e2e8f0;
          color: #374151;
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
          gap: 2rem;
        }

        .destinations-grid.grid {
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }

        .destinations-grid.list {
          grid-template-columns: 1fr;
        }

        .destination-card {
          background: white;
          border-radius: 20px;
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

        .destination-card.list {
          display: flex;
          max-width: 100%;
        }

        .destination-card.list .card-image-container {
          width: 300px;
          flex-shrink: 0;
        }

        .destination-card.list .card-content {
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
          color: #3b82f6;
          transform: scale(1.1);
        }

        .favorite-btn.active {
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

        .category-badge {
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

        .category-icon {
          font-size: 0.9rem;
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
          padding: 2rem;
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
          font-size: 1rem;
        }

        .location-icon {
          color: #ef4444;
        }

        .destination-description {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
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
          font-size: 1rem;
        }

        .price {
          color: #10b981;
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
            flex-direction: column;
          }

          .filter-controls {
            justify-content: center;
          }

          .destinations-grid.grid {
            grid-template-columns: 1fr;
          }

          .destination-card.list {
            flex-direction: column;
          }

          .destination-card.list .card-image-container {
            width: 100%;
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

          .search-filter-section {
            padding: 0 1rem;
          }

          .filters-panel {
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

export default Destinations; 
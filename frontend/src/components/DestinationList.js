import React, { useState } from 'react';
import './DestinationList.css';

const DestinationList = ({ destinations, onAddDestination, onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: '',
    country: '',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddDestination(newDestination);
    setNewDestination({ name: '', country: '', description: '', imageUrl: '' });
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    setNewDestination({
      ...newDestination,
      [e.target.name]: e.target.value
    });
  };

  if (destinations.length === 0) {
    return (
      <div className="destination-list">
        <div className="no-destinations">
          <p>No destinations found.</p>
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
            Add First Destination
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-list">
      <div className="list-header">
        <h2>Found {destinations.length} destination(s)</h2>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
          Add Destination
        </button>
      </div>

      {showAddForm && (
        <div className="add-destination-form">
          <h3>Add New Destination</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newDestination.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                value={newDestination.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newDestination.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL:</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={newDestination.imageUrl}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add Destination
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="destinations-grid">
        {destinations.map((destination) => (
          <div key={destination._id} className="destination-card">
            <div className="destination-image">
              <img 
                src={destination.imageUrl} 
                alt={destination.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>
            <div className="destination-content">
              <h3>{destination.name}</h3>
              <p className="country">🇺🇳 {destination.country}</p>
              <p className="description">{destination.description}</p>
              <div className="destination-meta">
                <span className="created-at">
                  Added: {new Date(destination.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationList; 
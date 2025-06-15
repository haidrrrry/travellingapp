import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStickyNote,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaSpinner,
  FaExclamationTriangle,
  FaPlus,
  FaTrash,
  FaHeart,
  FaStar,
  FaGlobe,
  FaMountain,
  FaUmbrellaBeach,
  FaCity,
  FaRoute,
  FaLandmark,
  FaTree
} from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MyNotes = ({ auth }) => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);

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
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/trips/user/${auth.user.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setTrips(res.data.data);
    } catch (err) {
      setError('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user?.id) return;
    fetchTrips();
  }, [auth, fetchTrips]);

  const handleEdit = (trip) => {
    setEditId(trip._id);
    setEditNote(trip.notes || '');
  };

  const handleSave = async (tripId) => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/api/trips/${tripId}`, { notes: editNote }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setTrips(trips.map(t => t._id === tripId ? { ...t, notes: editNote } : t));
      setEditId(null);
    } catch {
      setError('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setEditNote('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const TripCard = ({ trip }) => {
    const IconComponent = tripTypeIcons[trip.tripType] || tripTypeIcons.default;
    const iconColor = tripTypeColors[trip.tripType] || tripTypeColors.default;
    
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold w-fit"
              style={{ backgroundColor: iconColor }}
            >
              <IconComponent className="text-sm" />
              <span>{trip.tripType ? trip.tripType.charAt(0).toUpperCase() + trip.tripType.slice(1) : 'Trip'}</span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {trip.destinationId?.name || 'Unknown Destination'}
            </h3>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FaCalendarAlt className="text-blue-500" />
                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>
              {trip.destinationId?.country && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span>{trip.destinationId.country}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {editId === trip._id ? (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                  <FaStickyNote className="text-blue-500" />
                  Trip Notes
                </label>
                <textarea 
                  value={editNote} 
                  onChange={e => setEditNote(e.target.value)} 
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  placeholder="Add your trip notes here... Share your memories, plans, and experiences!"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <FaTimes />
                  Cancel
                </button>
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200"
                  onClick={() => handleSave(trip._id)}
                  disabled={saving}
                >
                  <FaSave />
                  {saving ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaStickyNote className="text-blue-500" />
                  Trip Notes
                </h4>
                {trip.notes ? (
                  <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                    {trip.notes}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No notes for this trip yet. Click 'Edit Notes' to add them.
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-all duration-200"
                  onClick={() => handleEdit(trip)}
                >
                  <FaEdit />
                  Edit Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="notes-container">
      <header className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              My Trip Notes
              <span className="title-accent">📝</span>
            </h1>
            <p className="page-subtitle">
              Capture and manage your thoughts for each trip
            </p>
          </div>
        </div>
      </header>

      <main className="main-content">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Loading your trip notes...</p>
          </div>
        )}
        
        {error && (
          <div className="error-alert">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="content-wrapper">
            {trips.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3 className="empty-title">No Trips Found</h3>
                <p className="empty-description">
                  You haven't created any trips yet. Start planning your next adventure!
                </p>
                <button 
                  onClick={() => navigate('/create-trip')}
                  className="cta-button"
                >
                  <FaPlus />
                  Create Your First Trip
                </button>
              </div>
            ) : (
              <div className="notes-grid">
                {trips.map(trip => (
                  <TripCard key={trip._id} trip={trip} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyNotes; 
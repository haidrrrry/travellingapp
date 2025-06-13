import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser,
  FaEnvelope,
  FaSave,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaShieldAlt,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaCamera,
  FaGlobe,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserProfile = ({ auth, setAuth }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(auth?.user?.name || '');
  const [email, setEmail] = useState(auth?.user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.put(`${API_URL}/api/users/${auth.user.id}`, { name, email }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setSuccess('Profile updated successfully!');
      setAuth(a => ({ ...a, user: { ...a.user, name, email } }));
      localStorage.setItem('user', JSON.stringify({ ...auth.user, name, email }));
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/users/${auth.user.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setAuth({ user: null, token: null });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mb-8 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2 flex items-center gap-3">
                User Profile
                <span className="text-3xl">👤</span>
              </h1>
              <p className="text-xl opacity-90">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleLogout}
                className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white px-4 py-2 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {auth?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg">
                    <FaCamera className="text-sm" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{auth?.user?.name}</h2>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  {auth?.user?.email}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaGlobe className="text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Member Since</p>
                    <p className="text-sm text-gray-600">
                      {auth?.user?.createdAt ? formatDate(auth.user.createdAt) : 'Recently'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaShieldAlt className="text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Account Status</p>
                    <p className="text-sm text-green-600 font-medium">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <FaCog className="text-2xl text-blue-500" />
                <h3 className="text-2xl font-bold text-gray-900">Account Settings</h3>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                  <FaExclamationTriangle />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
                  <FaCheckCircle />
                  <span className="font-semibold">{success}</span>
                </div>
              )}

              {/* Profile Form */}
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaUser className="text-blue-500" />
                      Full Name
                    </label>
                    <input 
                      id="name"
                      type="text"
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaEnvelope className="text-blue-500" />
                      Email Address
                    </label>
                    <input 
                      id="email"
                      type="email"
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </form>

              {/* Danger Zone */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <FaExclamationTriangle className="text-red-500 text-xl mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
                      <p className="text-red-700">
                        Once you delete your account, there is no going back. All your data, trips, and preferences will be permanently removed.
                      </p>
                    </div>
                  </div>
                  
                  {!showDeleteConfirm ? (
                    <button 
                      className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                      onClick={() => setShowDeleteConfirm(true)} 
                      disabled={loading}
                    >
                      <FaTrash />
                      Delete Account
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-red-700 font-semibold">
                        Are you absolutely sure? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button 
                          className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                          onClick={handleDelete} 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FaTrash />
                              Yes, Delete My Account
                            </>
                          )}
                        </button>
                        <button 
                          className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const userAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (userData) => api.post('/api/users', userData),
  update: (id, userData) => api.put(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
};

export const destinationAPI = {
  getAll: () => api.get('/api/destinations'),
  getById: (id) => api.get(`/api/destinations/${id}`),
  create: (destinationData) => api.post('/api/destinations', destinationData),
  update: (id, destinationData) => api.put(`/api/destinations/${id}`, destinationData),
  delete: (id) => api.delete(`/api/destinations/${id}`),
  search: (query) => api.get(`/api/destinations/search?q=${encodeURIComponent(query)}`),
};

export const tripAPI = {
  getAll: () => api.get('/api/trips'),
  getById: (id) => api.get(`/api/trips/${id}`),
  getByUser: (userId) => api.get(`/api/trips/user/${userId}`),
  create: (tripData, token) => api.post('/api/trips', tripData, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  update: (id, tripData) => api.put(`/api/trips/${id}`, tripData),
  delete: (id) => api.delete(`/api/trips/${id}`),
};

export default api; 
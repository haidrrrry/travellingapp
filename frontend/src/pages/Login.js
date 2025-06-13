import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaPlane, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaHeart,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      setAuth({ user: res.data.data, token: res.data.token });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Left Side - Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-icon">
              <FaPlane className="plane-icon" />
            </div>
            <h1 className="hero-title">
              Welcome to <span className="accent-text">TravelApp</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing destinations, plan your perfect trip, and create unforgettable memories around the world.
            </p>
            
            <div className="hero-features">
              <div className="feature-item">
                <FaGlobe className="feature-icon" />
                <span>Explore Global Destinations</span>
              </div>
              <div className="feature-item">
                <FaMapMarkerAlt className="feature-icon" />
                <span>Plan Your Perfect Trip</span>
              </div>
              <div className="feature-item">
                <FaHeart className="feature-icon" />
                <span>Save Your Favorites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="form-section">
          <div className="form-container">
            {/* Header */}
            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to continue your journey</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="success-message">
                <FaCheckCircle className="success-icon" />
                <div className="success-content">
                  <h3>Login Successful!</h3>
                  <p>Redirecting you to your dashboard...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                <div className="error-content">
                  <h3>Login Failed</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <FaEnvelope className="label-icon" />
                    Email Address
                  </label>
                  <input 
                    id="email"
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="form-input"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <FaLock className="label-icon" />
                    Password
                  </label>
                  <div className="password-input-container">
                    <input 
                      id="password"
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                      className="form-input password-input"
                      placeholder="Enter your password"
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <button 
                  className="submit-button"
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="loading-content">
                      <div className="loading-spinner"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            )}

            {/* Sign Up Link */}
            {!success && (
              <div className="signup-link">
                <p className="link-text">
                  Don't have an account?{' '}
                  <RouterLink to="/signup" className="link-accent">
                    Create one now
                  </RouterLink>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 
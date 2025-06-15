import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaPlane, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaHeart,
  FaExclamationTriangle,
  FaCheckCircle,
  FaShieldAlt,
  FaRocket
} from 'react-icons/fa';
import './Signup.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Signup = ({ setAuth }) => {
  const [name, setName] = useState('');
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
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      setAuth({ user: res.data.data, token: res.data.token });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
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
      <div className="signup-content">
        {/* Left Side - Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-icon">
              <FaRocket className="rocket-icon" />
            </div>
            <h1 className="hero-title">
              Start Your <span className="accent-text">Journey</span>
            </h1>
            <p className="hero-subtitle">
              Join thousands of travelers and begin your adventure today. Create your account and unlock a world of possibilities.
            </p>
            
            <div className="hero-features">
              <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <span>Secure & Private</span>
              </div>
              <div className="feature-item">
                <FaGlobe className="feature-icon" />
                <span>Global Community</span>
              </div>
              <div className="feature-item">
                <FaHeart className="feature-icon" />
                <span>Personalized Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="form-section">
          <div className="form-container">
            {/* Header */}
            <div className="form-header">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Join us and start your adventure</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="success-message">
                <FaCheckCircle className="success-icon" />
                <div className="success-content">
                  <h3>Account Created!</h3>
                  <p>Welcome aboard! Redirecting you to your dashboard...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                <div className="error-content">
                  <h3>Signup Failed</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Signup Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <FaUser className="label-icon" />
                    Full Name
                  </label>
                  <input 
                    id="name"
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>
                
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
                      placeholder="Create a strong password"
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="password-requirements">
                    <p className="requirement-text">Password must be at least 6 characters long</p>
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
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>
            )}

            {/* Login Link */}
            {!success && (
              <div className="login-link">
                <p className="link-text">
                  Already have an account?{' '}
                  <RouterLink to="/login" className="link-accent">
                    Sign in here
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

export default Signup; 
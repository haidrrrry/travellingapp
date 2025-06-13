import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Welcome to Traveling App
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Plan your next adventure with ease. Discover amazing destinations, create unforgettable trips, and make memories that last a lifetime.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/destinations" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Explore Destinations
            </Link>
            <Link to="/create-trip" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Plan a Trip
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '4rem 0', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>What You Can Do</h2>
            <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to plan and manage your perfect trip
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            <Link to="/destinations" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '10px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>Discover Destinations</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>Browse through amazing destinations from around the world with detailed information and stunning images.</p>
              </div>
            </Link>
            
            <Link to="/create-trip" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '10px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>Plan Trips</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>Create and manage your travel itineraries with custom dates, trip types, and personal notes.</p>
              </div>
            </Link>
            
            <Link to="/my-notes" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '10px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>Add Notes</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>Keep track of your travel plans and memories with personal notes for each trip.</p>
              </div>
            </Link>
            
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '10px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>User Management</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>Manage your profile and view your complete travel history in one place.</p>
              </div>
            </Link>
            
            <Link to="/my-trips" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '10px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>My Trips</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>View all your planned trips with detailed information and easy management options.</p>
              </div>
            </Link>
            
            <Link to="/book" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '10px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>Book Trips</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>Book your dream trips with secure payment processing and instant confirmation.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* API Info Section */}
      <div style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>API Endpoints</h2>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Comprehensive API for developers</p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '2rem', 
              borderRadius: '10px', 
              border: '1px solid #e9ecef' 
            }}>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '1rem', textAlign: 'center', color: '#333' }}>Users</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>GET</span>
                  /api/users - Get all users
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#cce7ff', color: '#004085', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>POST</span>
                  /api/users - Create user
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>PUT</span>
                  /api/users/:id - Update user
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>DELETE</span>
                  /api/users/:id - Delete user
                </li>
              </ul>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '2rem', 
              borderRadius: '10px', 
              border: '1px solid #e9ecef' 
            }}>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '1rem', textAlign: 'center', color: '#333' }}>Destinations</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>GET</span>
                  /api/destinations - Get all destinations
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>GET</span>
                  /api/destinations/search - Search destinations
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#cce7ff', color: '#004085', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>POST</span>
                  /api/destinations - Create destination
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>PUT</span>
                  /api/destinations/:id - Update destination
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>DELETE</span>
                  /api/destinations/:id - Delete destination
                </li>
              </ul>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '2rem', 
              borderRadius: '10px', 
              border: '1px solid #e9ecef' 
            }}>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '1rem', textAlign: 'center', color: '#333' }}>Trips</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>GET</span>
                  /api/trips - Get all trips
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>GET</span>
                  /api/trips/user/:userId - Get user trips
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#cce7ff', color: '#004085', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>POST</span>
                  /api/trips - Create trip
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>PUT</span>
                  /api/trips/:id - Update trip
                </li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', marginRight: '0.5rem' }}>DELETE</span>
                  /api/trips/:id - Delete trip
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: '#333', 
        color: 'white', 
        padding: '3rem 0', 
        textAlign: 'center' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1rem' }}>
            "The world is a book, and those who do not travel read only one page."
          </div>
          <div style={{ color: '#ccc' }}>
            © 2024 Traveling App. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
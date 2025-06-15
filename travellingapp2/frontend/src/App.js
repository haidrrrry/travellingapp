import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import BookTripForm from './pages/BookTripForm';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DiscoverDestinations from './pages/DiscoverDestinations';
import MyNotes from './pages/MyNotes';
import MyTrips from './pages/MyTrips';
import MyBookings from './pages/MyBookings';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  const [auth, setAuth] = useState({ user: null, token: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuth({ user: JSON.parse(user), token });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ user: null, token: null });
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <span>✈️</span>
              <span>Traveling App</span>
            </Link>
            
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/destinations" className="nav-link">Destinations</Link>
              </li>
              {auth.user && (
                <>
                  <li className="nav-item">
                    <Link to="/create-trip" className="nav-link">Create Trip</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/book" className="nav-link">Book Trip</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/my-trips" className="nav-link">My Trips</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/my-notes" className="nav-link">My Notes</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">Profile</Link>
                  </li>
                </>
              )}
              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<DiscoverDestinations auth={auth} />} />
            <Route path="/create-trip" element={auth.user ? <CreateTrip auth={auth} /> : <Navigate to="/login" />} />
            <Route path="/book" element={auth.user ? <BookTripForm auth={auth} /> : <Navigate to="/login" />} />
            <Route path="/my-trips" element={auth.user ? <MyTrips auth={auth} /> : <Navigate to="/login" />} />
            <Route path="/my-bookings" element={auth.user ? <MyBookings auth={auth} /> : <Navigate to="/login" />} />
            <Route path="/my-notes" element={auth.user ? <MyNotes auth={auth} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={auth.user ? <UserProfile auth={auth} setAuth={setAuth} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/signup" element={<Signup setAuth={setAuth} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

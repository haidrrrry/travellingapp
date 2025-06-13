import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPlane, 
  FaCalendarAlt, 
  FaUsers, 
  FaCreditCard, 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaPlus, 
  FaMinus,
  FaExclamationTriangle,
  FaArrowLeft,
  FaShieldAlt,
  FaStar,
  FaUserTie,
  FaUserFriends,
  FaUserGraduate,
  FaUserNinja
} from 'react-icons/fa';

const initialCard = { cardNumber: '', expiry: '', cvv: '' };

const validateCard = (card) => {
  const errors = {};
  // Remove spaces for validation - check for exactly 16 digits
  const cleanCardNumber = card.cardNumber.replace(/\s/g, '');
  if (!/^[0-9]{16}$/.test(cleanCardNumber)) errors.cardNumber = 'Card number must be 16 digits';
  if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(card.expiry)) errors.expiry = 'Expiry must be MM/YY';
  if (!/^[0-9]{3}$/.test(card.cvv)) errors.cvv = 'CVV must be 3 digits';
  return errors;
};

const BookTripForm = ({ auth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(location.state?.destination || null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [form, setForm] = useState({
    destinationId: location.state?.destination?._id || '',
    tripDate: '',
    numTravelers: 1,
    travelerType: 'adult',
    dummyCardInfo: { ...initialCard }
  });
  const [cardErrors, setCardErrors] = useState({});

  const travelerTypes = [
    { id: 'adult', label: 'Adult', icon: FaUserTie, color: '#3b82f6' },
    { id: 'student', label: 'Student', icon: FaUserGraduate, color: '#10b981' },
    { id: 'senior', label: 'Senior', icon: FaUserFriends, color: '#f59e0b' },
    { id: 'child', label: 'Child', icon: FaUserNinja, color: '#ec4899' }
  ];

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/destinations`);
      setDestinations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setError('Failed to load destinations');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'destinationId') {
      const destination = destinations.find(d => d._id === value);
      setSelectedDestination(destination);
    }
  };

  // Smooth card input handling with better UX
  const handleCardInput = (e, fieldName) => {
    const { value } = e.target;
    const input = e.target;
    const cursorPosition = input.selectionStart;
    
    let formattedValue = value;
    let newCursorPosition = cursorPosition;
    
    if (fieldName === 'cardNumber') {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 16 digits
      const limitedDigits = digitsOnly.slice(0, 16);
      // Format with spaces every 4 digits
      formattedValue = limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
      
      // Calculate new cursor position based on actual digits
      const digitsBeforeCursor = value.slice(0, cursorPosition).replace(/\D/g, '').length;
      const spacesBeforeCursor = Math.floor(digitsBeforeCursor / 4);
      newCursorPosition = Math.min(digitsBeforeCursor + spacesBeforeCursor, formattedValue.length);
    }
    
    if (fieldName === 'expiry') {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 4 digits
      const limitedDigits = digitsOnly.slice(0, 4);
      
      if (limitedDigits.length >= 2) {
        formattedValue = limitedDigits.slice(0, 2) + '/' + limitedDigits.slice(2);
        // Adjust cursor position for slash
        const digitsBeforeCursor = value.slice(0, cursorPosition).replace(/\D/g, '').length;
        newCursorPosition = digitsBeforeCursor + (digitsBeforeCursor >= 2 ? 1 : 0);
      } else {
        formattedValue = limitedDigits;
        newCursorPosition = limitedDigits.length;
      }
    }
    
    if (fieldName === 'cvv') {
      // Only allow digits, limit to 3
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
      newCursorPosition = formattedValue.length;
    }
    
    // Update state immediately
    setForm(prev => ({
      ...prev,
      dummyCardInfo: {
        ...prev.dummyCardInfo,
        [fieldName]: formattedValue
      }
    }));
    
    // Use setTimeout with 0 delay for better timing
    setTimeout(() => {
      if (input && document.activeElement === input) {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handleTravelers = (delta) => {
    setForm(f => ({ ...f, numTravelers: Math.max(1, Math.min(10, f.numTravelers + delta)) }));
  };

  const validateAll = () => {
    const errs = validateCard(form.dummyCardInfo);
    if (!form.destinationId) errs.destinationId = 'Please select a destination';
    if (!form.tripDate) errs.tripDate = 'Please select a date';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validateAll();
    setCardErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to create a trip');
        setLoading(false);
        return;
      }

      // Create trip data from form
      const tripData = {
        destinationId: form.destinationId,
        startDate: form.tripDate,
        endDate: new Date(new Date(form.tripDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One day after start date
        numTravelers: form.numTravelers,
        tripType: 'adventure', // Default trip type
        budget: getFinalPrice(),
        notes: `Created trip to ${selectedDestination?.name} for ${form.numTravelers} traveler(s)`
      };

      console.log('Trip data being sent:', tripData);
      console.log('API URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000');
      console.log('Token:', token ? 'Present' : 'Missing');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/trips`,
        tripData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response received:', response.data);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-trips');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to create trip');
      }
    } catch (error) {
      console.error('Trip creation error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (selectedDestination && form.numTravelers) {
      return selectedDestination.price * form.numTravelers;
    }
    return 0;
  };

  const getDiscountPercentage = () => {
    if (form.numTravelers >= 4) return 15;
    if (form.numTravelers >= 2) return 10;
    return 0;
  };

  const getFinalPrice = () => {
    const basePrice = calculateTotalPrice();
    const discount = (basePrice * getDiscountPercentage()) / 100;
    return basePrice - discount;
  };

  if (success) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2 className="success-title">Trip Created Successfully!</h2>
          <p className="success-description">
            Trip created for <span className="highlight">{selectedDestination?.name}</span>.<br />
            <span className="total-price">Budget: ${getFinalPrice()}</span>
          </p>
          <div className="success-info">
            <FaCheckCircle className="check-icon" />
            <span>Redirecting to My Trips...</span>
          </div>
        </div>
      </div>
    );
  }

  const ProgressSteps = () => (
    <div className="progress-steps">
      {[1, 2, 3].map(step => (
        <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && 'Destination'}
            {step === 2 && 'Details'}
            {step === 3 && 'Payment'}
          </div>
        </div>
      ))}
    </div>
  );

  const DestinationSelection = () => (
    <div className="form-section">
      <div className="section-header">
        <FaMapMarkerAlt className="section-icon" />
        <h3>Choose Your Destination</h3>
        <p>Select from our curated collection of amazing destinations</p>
      </div>
      
      <div className="destination-grid">
        {destinations.map(destination => (
          <div
            key={destination._id}
            className={`destination-option ${form.destinationId === destination._id ? 'selected' : ''}`}
            onClick={() => {
              setForm(prev => ({ ...prev, destinationId: destination._id }));
              setSelectedDestination(destination);
              setCurrentStep(2);
            }}
          >
            <img src={destination.imageUrl} alt={destination.name} className="option-image" />
            <div className="option-content">
              <h4>{destination.name}</h4>
              <p className="option-location">
                <FaMapMarkerAlt />
                {destination.country}
              </p>
              <div className="option-meta">
                <span className="option-price">${destination.price || 299}</span>
                <span className="option-rating">
                  <FaStar />
                  {destination.rating || 4.5}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TripDetails = () => (
    <div className="form-section">
      <div className="section-header">
        <FaCalendarAlt className="section-icon" />
        <h3>Trip Details</h3>
        <p>Customize your travel experience</p>
      </div>
      
      <div className="details-grid">
        <div className="detail-group">
          <label className="form-label">
            <FaCalendarAlt className="label-icon" />
            Trip Date
          </label>
          <input
            type="date"
            name="tripDate"
            value={form.tripDate}
            onChange={handleChange}
            className="form-input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="detail-group">
          <label className="form-label">
            <FaUsers className="label-icon" />
            Number of Travelers
          </label>
          <div className="traveler-counter">
            <button
              type="button"
              onClick={() => handleTravelers(-1)}
              className="counter-btn"
              disabled={form.numTravelers <= 1}
            >
              <FaMinus />
            </button>
            <span className="counter-value">{form.numTravelers}</span>
            <button
              type="button"
              onClick={() => handleTravelers(1)}
              className="counter-btn"
              disabled={form.numTravelers >= 10}
            >
              <FaPlus />
            </button>
          </div>
        </div>

        <div className="detail-group">
          <label className="form-label">
            <FaUserTie className="label-icon" />
            Traveler Type
          </label>
          <div className="traveler-types">
            {travelerTypes.map(type => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  className={`type-btn ${form.travelerType === type.id ? 'active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, travelerType: type.id }))}
                >
                  <IconComponent style={{ color: type.color }} />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDestination && (
        <div className="trip-summary">
          <h4>Trip Summary</h4>
          <div className="summary-content">
            <div className="summary-item">
              <img src={selectedDestination.imageUrl} alt={selectedDestination.name} />
              <div>
                <h5>{selectedDestination.name}</h5>
                <p>{selectedDestination.country}</p>
              </div>
            </div>
            <div className="summary-details">
              <div className="detail-row">
                <span>Base Price:</span>
                <span>${selectedDestination.price || 299}</span>
              </div>
              <div className="detail-row">
                <span>Travelers:</span>
                <span>{form.numTravelers}</span>
              </div>
              {getDiscountPercentage() > 0 && (
                <div className="detail-row discount">
                  <span>Discount ({getDiscountPercentage()}%):</span>
                  <span>-${(calculateTotalPrice() * getDiscountPercentage()) / 100}</span>
                </div>
              )}
              <div className="detail-row total">
                <span>Total:</span>
                <span>${getFinalPrice()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const PaymentSection = () => (
    <div className="form-section">
      <div className="section-header">
        <FaCreditCard className="section-icon" />
        <h3>Payment Information</h3>
        <p>Secure payment powered by industry-leading encryption</p>
      </div>
      
      <div className="payment-grid">
        <div className="payment-group">
          <label className="form-label">
            <FaCreditCard className="label-icon" />
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={form.dummyCardInfo.cardNumber}
            onChange={e => handleCardInput(e, 'cardNumber')}
            placeholder="1234 5678 9012 3456"
            className={`form-input ${cardErrors.cardNumber ? 'error' : ''}`}
            autoComplete="cc-number"
            inputMode="numeric"
            pattern="[0-9\s]{16,19}"
            maxLength={19}
          />
          {cardErrors.cardNumber && (
            <span className="error-message">{cardErrors.cardNumber}</span>
          )}
        </div>

        <div className="payment-row">
          <div className="payment-group">
            <label className="form-label">
              <FaCalendarAlt className="label-icon" />
              Expiry Date
            </label>
            <input
              type="text"
              name="expiry"
              value={form.dummyCardInfo.expiry}
              onChange={e => handleCardInput(e, 'expiry')}
              placeholder="MM/YY"
              className={`form-input ${cardErrors.expiry ? 'error' : ''}`}
              autoComplete="cc-exp"
              inputMode="numeric"
              pattern="[0-9/]{5}"
              maxLength={5}
            />
            {cardErrors.expiry && (
              <span className="error-message">{cardErrors.expiry}</span>
            )}
          </div>

          <div className="payment-group">
            <label className="form-label">
              <FaShieldAlt className="label-icon" />
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              value={form.dummyCardInfo.cvv}
              onChange={e => handleCardInput(e, 'cvv')}
              placeholder="123"
              className={`form-input ${cardErrors.cvv ? 'error' : ''}`}
              autoComplete="cc-csc"
              inputMode="numeric"
              pattern="[0-9]{3}"
              maxLength={3}
            />
            {cardErrors.cvv && (
              <span className="error-message">{cardErrors.cvv}</span>
            )}
          </div>
        </div>
      </div>

      <div className="security-notice">
        <FaShieldAlt className="security-icon" />
        <div>
          <h5>Your payment is secure</h5>
          <p>We use industry-standard encryption to protect your payment information</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="booking-container">
      <div className="booking-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft />
          Back
        </button>
        <div className="header-content">
          <h1 className="page-title">
            <FaPlane className="title-icon" />
            Book Your Dream Trip
          </h1>
          <p className="page-subtitle">
            Choose from our selection of amazing destinations worldwide
          </p>
        </div>
      </div>

      <div className="booking-content">
        <ProgressSteps />
        
        <form onSubmit={handleSubmit} className="booking-form">
          {currentStep === 1 && <DestinationSelection />}
          {currentStep === 2 && <TripDetails />}
          {currentStep === 3 && <PaymentSection />}

          {error && (
            <div className="error-alert">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="action-btn secondary"
              >
                <FaArrowLeft />
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="action-btn primary"
                disabled={!form.destinationId || (currentStep === 2 && !form.tripDate)}
              >
                Next
                <FaArrowLeft style={{ transform: 'rotate(180deg)' }} />
              </button>
            ) : (
              <button
                type="submit"
                className="action-btn primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Book Now - ${getFinalPrice()}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        .booking-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding-bottom: 2rem;
        }

        .booking-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .back-btn {
          position: absolute;
          top: 2rem;
          left: 2rem;
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

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
          text-align: center;
          color: white;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .title-icon {
          font-size: 2rem;
          color: #fbbf24;
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .booking-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
          gap: 2rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .step.active {
          opacity: 1;
        }

        .step-number {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: #3b82f6;
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .step-label {
          font-weight: 600;
          color: #64748b;
          font-size: 0.9rem;
        }

        .step.active .step-label {
          color: #3b82f6;
        }

        .booking-form {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          margin-top: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-icon {
          font-size: 2.5rem;
          color: #3b82f6;
          margin-bottom: 1rem;
        }

        .section-header h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: #64748b;
          font-size: 1.1rem;
        }

        .destination-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .destination-option {
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .destination-option:hover {
          border-color: #3b82f6;
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
        }

        .destination-option.selected {
          border-color: #3b82f6;
          background: #eff6ff;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
        }

        .option-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }

        .option-content {
          padding: 1.5rem;
        }

        .option-content h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .option-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .option-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .option-price {
          font-weight: 700;
          color: #10b981;
          font-size: 1.1rem;
        }

        .option-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #f59e0b;
          font-weight: 600;
        }

        .details-grid {
          display: grid;
          gap: 2rem;
        }

        .detail-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .label-icon {
          color: #3b82f6;
          font-size: 1rem;
        }

        .form-input {
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f9fafb;
          width: 100%;
          box-sizing: border-box;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          transform: translateY(-1px);
        }

        .form-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
          font-family: inherit;
          letter-spacing: normal;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .traveler-counter {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.5rem;
        }

        .counter-btn {
          width: 2.5rem;
          height: 2.5rem;
          border: none;
          border-radius: 8px;
          background: white;
          color: #3b82f6;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .counter-btn:hover:not(:disabled) {
          background: #3b82f6;
          color: white;
        }

        .counter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .counter-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1f2937;
          min-width: 2rem;
          text-align: center;
        }

        .traveler-types {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .type-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .type-btn:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .type-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .trip-summary {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 2rem;
          margin-top: 2rem;
        }

        .trip-summary h4 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .summary-content {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .summary-item {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex: 1;
        }

        .summary-item img {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
        }

        .summary-item h5 {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .summary-item p {
          color: #64748b;
        }

        .summary-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row.discount {
          color: #10b981;
          font-weight: 600;
        }

        .detail-row.total {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1f2937;
          border-top: 2px solid #e2e8f0;
          padding-top: 1rem;
        }

        .payment-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .payment-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .payment-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .security-notice {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #0ea5e9;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .security-icon {
          font-size: 1.5rem;
          color: #0ea5e9;
          flex-shrink: 0;
        }

        .security-notice h5 {
          font-weight: 600;
          color: #0c4a6e;
          margin-bottom: 0.25rem;
        }

        .security-notice p {
          color: #0369a1;
          font-size: 0.9rem;
          margin: 0;
        }

        .error-alert {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 1px solid #ef4444;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: #dc2626;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          gap: 1rem;
        }

        .action-btn {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: none;
          min-width: 140px;
          justify-content: center;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .action-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
        }

        .action-btn.secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .success-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .success-card {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
          animation: slideInUp 0.6s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .success-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .success-description {
          color: #64748b;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .highlight {
          color: #3b82f6;
          font-weight: 700;
        }

        .total-price {
          color: #10b981;
          font-weight: 800;
          font-size: 1.3rem;
        }

        .success-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .check-icon {
          color: #10b981;
        }

        @media (max-width: 768px) {
          .booking-header {
            padding: 1.5rem 0;
          }

          .back-btn {
            position: relative;
            top: auto;
            left: auto;
            margin-bottom: 1rem;
          }

          .header-content {
            padding: 0 1rem;
          }

          .booking-content {
            padding: 0 1rem;
          }

          .booking-form {
            padding: 1.5rem;
          }

          .progress-steps {
            gap: 1rem;
          }

          .destination-grid {
            grid-template-columns: 1fr;
          }

          .payment-row {
            grid-template-columns: 1fr;
          }

          .summary-content {
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .success-card {
            padding: 2rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .booking-form {
            padding: 1.5rem 1rem;
          }

          .step {
            font-size: 0.8rem;
          }

          .step-number {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1rem;
          }
        }

        .card-input {
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
          padding-right: 3rem;
          transition: all 0.2s ease;
          border: 2px solid #e5e7eb;
          background: #f9fafb;
        }

        .card-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          transform: translateY(-1px);
        }

        .card-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};

export default BookTripForm; 
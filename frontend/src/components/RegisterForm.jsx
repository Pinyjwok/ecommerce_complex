import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: 1000,
        backgroundColor: type === 'success' ? '#4CAF50' : '#F44336',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {message}
    </div>
  );
};

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return false;
    }

    // Password strength check
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare user data (exclude confirmPassword)
      const { confirmPassword, ...userData } = formData;
      
      console.log('Attempting to register user:', userData);
      const response = await registerUser(userData);
      
      console.log('Registration successful:', response);
      
      // Show success message and redirect to login
      showToast('Registration successful! Please log in.', 'success');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Full registration error:', err);
      
      // Handle specific error types
      if (err.response) {
        // Server responded with an error
        showToast(err.response.data.error || 'Registration failed', 'error');
      } else if (err.request) {
        // Request made but no response received
        showToast('No response from server. Please check your network connection.', 'error');
      } else {
        // Something else went wrong
        showToast('An unexpected error occurred', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={clearToast} 
        />
      )}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          color: '#333'
        }}>
          Create New Account
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '15px' }}>
            <label 
              htmlFor="username" 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#555' 
              }}
            >
              Username
            </label>
            <input 
              type="text" 
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required 
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
              placeholder="Choose a username"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#555' 
              }}
            >
              Email
            </label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label 
              htmlFor="password"
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#555' 
              }}
            >
              Password
            </label>
            <input 
              type="password" 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
              placeholder="Create a password"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="confirmPassword"
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#555' 
              }}
            >
              Confirm Password
            </label>
            <input 
              type="password" 
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
              placeholder="Confirm your password"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#A0AEC0' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <div style={{ 
            marginTop: '15px', 
            textAlign: 'center', 
            color: '#666' 
          }}>
            Already have an account? 
            <span 
              onClick={handleLoginClick} 
              style={{ 
                color: '#4CAF50', 
                marginLeft: '5px', 
                cursor: 'pointer' 
              }}
            >
              Login
            </span>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes slideIn {
          from { 
            transform: translateX(100%); 
            opacity: 0;
          }
          to { 
            transform: translateX(0); 
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default RegisterForm;

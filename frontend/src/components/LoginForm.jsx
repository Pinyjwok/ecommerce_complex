import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
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

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Login attempt', { email, password });
      
      // Clear any existing local storage to ensure clean state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const response = await login({ email, password });
      
      // Log the entire response for debugging
      console.log('Full login response:', response);
      
      // Verify token and user details are stored
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('Stored token:', storedToken);
      console.log('Stored user:', storedUser);
      
      // Validate stored data
      if (!storedToken || !storedUser) {
        throw new Error('Failed to store login credentials');
      }
      
      // Parse and log stored user
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed stored user:', parsedUser);
      
      showToast(`Welcome back, ${parsedUser?.name || parsedUser?.username || 'User'}!`, 'success');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Login failed', error);
      
      // Clear any partial/invalid storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      showToast(
        error.message || "Unable to log in. Please check your credentials.", 
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
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
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div style={{ marginBottom: '20px' }}>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
              placeholder="Enter your password"
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
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
          <div style={{ 
            marginTop: '15px', 
            textAlign: 'center', 
            color: '#666' 
          }}>
            Don't have an account? 
            <span 
              onClick={handleRegisterClick} 
              style={{ 
                color: '#4CAF50', 
                marginLeft: '5px', 
                cursor: 'pointer' 
              }}
            >
              Register
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
}

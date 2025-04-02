import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';

const DashboardCard = ({ title, value, icon }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '10px',
    transition: 'transform 0.3s ease'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <div>
      <h3 style={{ 
        margin: 0, 
        color: '#333', 
        fontSize: '1.2rem',
        marginBottom: '10px'
      }}>
        {title}
      </h3>
      <p style={{ 
        margin: 0, 
        color: '#4CAF50', 
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        {value}
      </p>
    </div>
    <div style={{ 
      fontSize: '2rem', 
      color: '#4CAF50',
      opacity: 0.7 
    }}>
      {icon}
    </div>
  </div>
);

export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to get current user
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        throw new Error('No user found');
      }

      setUserData(currentUser);
    } catch (error) {
      console.error('Error retrieving user data', error);
      
      // Clear local storage and redirect to login
      logout();
      
      setError('Invalid user session. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If there's an error or no user data, don't render the page
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#F44336', marginBottom: '20px' }}>
            Session Error
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {error}
          </p>
          <button 
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f4',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          color: '#333', 
          margin: 0 
        }}>
          Welcome, {userData.name || userData.username || 'User'}
        </h1>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#F44336',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D32F2F'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
        >
          Logout
        </button>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <DashboardCard 
          title="Total Orders" 
          value="24" 
          icon="🛒" 
        />
        <DashboardCard 
          title="Pending Shipments" 
          value="3" 
          icon="🚚" 
        />
        <DashboardCard 
          title="Account Balance" 
          value="$1,245.50" 
          icon="💰" 
        />
        <DashboardCard 
          title="Reward Points" 
          value="350" 
          icon="🏆" 
        />
      </div>

      <section style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          color: '#333', 
          marginBottom: '20px' 
        }}>
          Recent Activity
        </h2>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0 
        }}>
          <li style={{
            borderBottom: '1px solid #eee',
            padding: '10px 0',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Order #1234 Shipped</span>
            <span style={{ color: '#666' }}>2 hours ago</span>
          </li>
          <li style={{
            borderBottom: '1px solid #eee',
            padding: '10px 0',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>New Product Added to Cart</span>
            <span style={{ color: '#666' }}>Yesterday</span>
          </li>
          <li style={{
            padding: '10px 0',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Account Details Updated</span>
            <span style={{ color: '#666' }}>3 days ago</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

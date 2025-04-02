import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000/api';

console.log('Auth service loaded');

export const register = async (userData) => {
    console.log('Registering user', userData);
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        console.log('Registration response', response.data);
        
        // Ensure token and user are stored
        if (response.data.token && response.data.user) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            console.log('Stored token:', localStorage.getItem('token'));
            console.log('Stored user:', localStorage.getItem('user'));
        } else {
            console.error('Missing token or user data in registration response');
        }
        
        return response.data;
    } catch (error) {
        console.error('Registration error', error);
        throw error.response?.data || { error: 'An error occurred during registration' };
    }
};

export const login = async (credentials) => {
    console.log('Logging in', credentials);
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        console.log('Login response', response.data);
        
        // Ensure token and user are stored
        if (response.data.token && response.data.user) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            console.log('Stored token:', localStorage.getItem('token'));
            console.log('Stored user:', localStorage.getItem('user'));
        } else {
            console.error('Missing token or user data in login response');
            throw new Error('Invalid login response');
        }
        
        return {
            token: response.data.token,
            user: response.data.user,
            message: 'Login successful'
        };
    } catch (error) {
        console.error('Login error', error);
        
        // Extract meaningful error message
        const errorMessage = error.response?.data?.message || 
                             error.response?.data?.error || 
                             'An error occurred during login';
        
        throw new Error(errorMessage);
    }
};

export const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('Getting token:', token ? 'Token exists' : 'No token');
    return token;
};

export const getCurrentUser = () => {
    console.log('Getting current user');
    
    try {
        const token = getToken();
        if (!token) {
            console.log('No token found');
            return null;
        }
        
        const userStr = localStorage.getItem('user');
        console.log('Raw user string:', userStr);
        
        if (!userStr) {
            console.log('No user data found in local storage');
            return null;
        }
        
        // Additional validation for user data
        const user = JSON.parse(userStr);
        
        // Validate user object has essential properties
        if (!user || typeof user !== 'object' || !user.email) {
            console.error('Invalid user data structure');
            throw new Error('Invalid user data');
        }
        
        console.log('Parsed user:', user);
        
        return user;
    } catch (error) {
        console.error('Error parsing user data:', error);
        
        // Clear invalid local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        return null;
    }
};

export const isAuthenticated = () => {
    console.log('Checking authentication');
    const token = getToken();
    return !!token; 
};

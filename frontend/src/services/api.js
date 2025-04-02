import axios from 'axios';

// Explicitly define full base URL with protocol
const API_URL = 'http://127.0.0.1:3000/api';

// Create an axios instance with robust configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 seconds timeout
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  validateStatus: function (status) {
    // Accept all status codes for more detailed error handling
    return status >= 200 && status < 600;
  },
  // Network error handling
  transformRequest: [function (data, headers) {
    try {
      console.log('🔍 Transforming request data:', data);
      return JSON.stringify(data);
    } catch (error) {
      console.error('❌ Request transformation error:', error);
      throw error;
    }
  }]
});

// Detailed request logging interceptor
api.interceptors.request.use(
  config => {
    console.group('📤 Network Request');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Base URL:', config.baseURL);
    console.log('Full URL:', config.baseURL + config.url);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    console.groupEnd();
    return config;
  },
  error => {
    console.error('❌ Request Setup Error:', error);
    return Promise.reject(error);
  }
);

// Comprehensive response and error handling interceptor
api.interceptors.response.use(
  response => {
    console.group('📥 Network Response');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.groupEnd();
    return response;
  },
  error => {
    console.group('❌ Detailed Network Error');
    console.error('Error Type:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);

    if (error.config) {
      console.log('Request Details:', {
        method: error.config.method,
        url: error.config.url,
        baseURL: error.config.baseURL
      });
    }

    if (error.response) {
      console.error('Server Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }

    console.error('Stack:', error.stack);
    console.groupEnd();

    // Enhanced error handling
    if (error.response) {
      const serverError = new Error(
        error.response.data.message || 
        error.response.data.error || 
        'Unexpected server error'
      );
      serverError.response = error.response;
      serverError.name = 'ServerError';
      throw serverError;
    } else if (error.request) {
      const networkError = new Error('No server response. Check network connection.');
      networkError.name = 'NetworkError';
      networkError.request = error.request;
      
      // Additional network diagnostics
      console.error('Network Error Diagnostics:', {
        readyState: error.request.readyState,
        status: error.request.status,
        responseURL: error.request.responseURL,
        responseText: error.request.responseText
      });
      
      throw networkError;
    } else {
      const setupError = new Error('Request setup failed');
      setupError.name = 'RequestSetupError';
      throw setupError;
    }
  }
);

export const registerUser = async (userData) => {
  try {
    console.log('🚀 Registering User:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('✅ Registration Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Registration Failed:', error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    console.log('🚀 Logging In:', { username: userData.username });
    const response = await api.post('/auth/login', userData);
    console.log('✅ Login Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login Failed:', error);
    throw error;
  }
};

export default api;

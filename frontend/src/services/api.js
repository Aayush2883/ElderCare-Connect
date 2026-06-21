import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Dynamic baseURL for production vs local proxy
  timeout: 15000,
});

// Request Interceptor: Inject JWT token into headers if available in localStorage
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error response formatting
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error response has a message from our backend express server error middleware
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
        
    console.error('API Error Response:', message);
    return Promise.reject(message);
  }
);

export default API;

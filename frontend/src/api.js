import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ghostwrite_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept response to handle unauthorized sessions gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth/login') && !error.config.url.includes('/reports/track')) {
      // Clear token if invalid or expired
      localStorage.removeItem('ghostwrite_token');
      localStorage.removeItem('ghostwrite_user');
    }
    return Promise.reject(error);
  }
);

export default api;

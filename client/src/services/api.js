import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('kmg_auth_token') || localStorage.getItem('heartsync_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Extract data or handle standard errors
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default API;

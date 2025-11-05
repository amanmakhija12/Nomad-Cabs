import axios from 'axios';

// Create an 'instance' of axios
const api = axios.create({
  baseURL: 'http://localhost:3030/api/v1',
});

// Add an interceptor to automatically attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
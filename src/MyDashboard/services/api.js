import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    // Mock login by simulating a delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = { token: 'mock-token-123', user: { email, id: 'mock-user-1' } };
    
    // Actually the Login.js using authAPI expects response.data
    // since it does: const { token, user } = response.data;
    toast.success('Login successful!');
    return { data };
  },
  register: async (email, password) => {
    // Mock register by simulating a delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = { token: 'mock-token-123', user: { email, id: 'mock-user-1' }, message: 'Registration successful' };
    
    toast.success('Registration successful! Redirecting to dashboard...');
    return { data };
  },
};

export const usersAPI = {
  getUsers: async () => {
    // Mock user fetch to prevent backend error
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { id: '1', email: 'john@example.com' },
      { id: '2', email: 'jane@example.com' },
      { id: '3', email: 'admin@system.com' },
    ];
  },
};

export default api;

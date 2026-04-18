import axios from 'axios';

// Create a pre-configured axios instance pointing to our Spring Boot backend
const api = axios.create({
  baseURL: 'https://banking-app-lfky.onrender.com',  // Backend URL
});

// Request interceptor — adds JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  // Read token from storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Attach as Bearer header
  }
  return config;
});

export default api;
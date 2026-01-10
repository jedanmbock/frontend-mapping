import axios from 'axios';
import Cookies from 'js-cookie';

// Instance pour l'API Backend (Auth, User)
export const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Instance pour l'API Cartographique (Python)
export const mapApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MAP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur pour ajouter le token
backendApi.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = { backendApi, mapApi };

export default api;

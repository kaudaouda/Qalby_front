import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { User } from '../types';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important pour les cookies HTTP-only
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer silencieusement les erreurs 401 sur /me
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne pas afficher les erreurs 401 sur l'endpoint /me (utilisateur non connecté)
    if (error.response?.status === 401 && error.config?.url?.includes('/me/')) {
      // Erreur attendue - utilisateur non connecté
      return Promise.reject(error);
    }
    // Pour les autres erreurs, afficher dans la console
    if (error.response?.status !== 401) {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
      username: credentials.email, // Le backend utilise 'username' mais on accepte l'email
      password: credentials.password,
    });
    return response.data;
  },

  async register(userData: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    phone: string;
    country?: string;
  }) {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  async logout() {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get(API_ENDPOINTS.USER_ME);
    return response.data;
  },
};

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

// Variable pour éviter les appels multiples de refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Intercepteur pour gérer automatiquement le refresh du token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si c'est une erreur 401 sur /me, ne pas afficher d'erreur (utilisateur non connecté)
    if (error.response?.status === 401 && originalRequest?.url?.includes('/me/')) {
      return Promise.reject(error);
    }

    // Si c'est une erreur 401 et qu'on n'a pas encore essayé de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, ajouter à la queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Appeler l'endpoint de refresh
        await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN);
        processQueue(null, null);
        isRefreshing = false;
        // Réessayer la requête originale
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        // Le refresh a échoué, supprimer la session
        localStorage.removeItem('hasSession');
        // Rediriger vers login si nécessaire
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
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

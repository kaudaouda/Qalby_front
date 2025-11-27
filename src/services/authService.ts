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

    console.log('[AUTH-INTERCEPTOR] Erreur détectée:', {
      status: error.response?.status,
      url: originalRequest?.url,
      hasRetried: originalRequest?._retry
    });

    // Si c'est une erreur 401 sur /me, ne pas afficher d'erreur (utilisateur non connecté)
    if (error.response?.status === 401 && originalRequest?.url?.includes('/me/')) {
      console.log('[AUTH-INTERCEPTOR] 401 sur /me/ - Utilisateur non connecté (normal)');
      return Promise.reject(error);
    }

    // Si c'est une erreur 401 et qu'on n'a pas encore essayé de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[AUTH-INTERCEPTOR] 401 détecté, tentative de refresh du token...');
      
      if (isRefreshing) {
        console.log('[AUTH-INTERCEPTOR] Refresh déjà en cours, ajout à la queue');
        // Si un refresh est déjà en cours, ajouter à la queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            console.log('[AUTH-INTERCEPTOR] Refresh terminé, réessai de la requête');
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            console.error('[AUTH-INTERCEPTOR] Erreur après refresh:', err);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('[AUTH-INTERCEPTOR] Appel de /api/users/refresh/...');
        // Appeler l'endpoint de refresh
        await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN);
        console.log('[AUTH-INTERCEPTOR] ✅ Token rafraîchi avec succès !');
        
        processQueue(null, null);
        isRefreshing = false;
        
        // Réessayer la requête originale
        console.log('[AUTH-INTERCEPTOR] Réessai de la requête originale...');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('[AUTH-INTERCEPTOR] ❌ Échec du refresh:', refreshError);
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Le refresh a échoué, supprimer la session
        localStorage.removeItem('hasSession');
        
        // Rediriger vers login si nécessaire
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          console.log('[AUTH-INTERCEPTOR] Redirection vers /login');
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
    try {
      console.log('[AUTH-SERVICE] Appel getCurrentUser...');
      const response = await axiosInstance.get(API_ENDPOINTS.USER_ME);
      console.log('[AUTH-SERVICE] ✅ getCurrentUser réussi:', response.data.email);
      return response.data;
    } catch (error: any) {
      console.error('[AUTH-SERVICE] ❌ getCurrentUser échoué:', error.response?.status, error.message);
      throw error;
    }
  },
};

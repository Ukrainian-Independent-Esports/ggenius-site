/**
 * Axios Instance with Interceptors
 * Інстанс Axios з перехоплювачами для JWT автентифікації
 *
 * Features:
 * - Request interceptor: Attaches Access Token to Authorization header
 * - Response interceptor: Handles 401 errors, attempts token refresh, retries request
 * - Automatic logout redirect on refresh failure
 */

import axios from 'axios';

// ============================================
// Configuration / Конфігурація
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// ============================================
// Token Storage Functions / Функції збереження токенів
// ============================================

/**
 * Get access token from localStorage
 * @returns {string|null} Access token or null
 */
export const getAccessToken = () => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

/**
 * Save tokens to localStorage
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token (optional)
 */
export const saveTokens = (accessToken, refreshToken = null) => {
  try {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error('Failed to save tokens:', error);
  }
};

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};

// ============================================
// Axios Instance / Інстанс Axios
// ============================================

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// ============================================
// Request Interceptor / Перехоплювач запитів
// ============================================

api.interceptors.request.use(
  (config) => {
    // Отримуємо токен з localStorage
    const token = getAccessToken();

    // Якщо токен є, додаємо до header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor / Перехоплювач відповідей
// ============================================

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Queue of failed requests to retry after refresh
let failedQueue = [];

/**
 * Process queue of failed requests after token refresh
 * @param {Error|null} error - Error if refresh failed
 * @param {string|null} token - New access token if refresh succeeded
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Redirect to login page
 */
const redirectToLogin = () => {
  // Очищаємо токени
  clearTokens();

  // Редирект на сторінку логіну
  // Для Telegram Mini App — можна закрити або показати повідомлення
  if (window.Telegram?.WebApp) {
    // Telegram Mini App context
    window.Telegram.WebApp.showAlert('Session expired. Please restart the app.');
    window.Telegram.WebApp.close();
  } else {
    // Regular web context
    window.location.href = '/login';
  }
};

api.interceptors.response.use(
  (response) => {
    // Успішна відповідь — повертаємо як є
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Якщо помилка 401 і це не повторний запит
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Перевіряємо тип помилки
      const errorType = error.response?.data?.error;

      // Якщо токен прострочений — спробуємо оновити
      if (errorType === 'token_expired') {
        if (isRefreshing) {
          // Якщо вже оновлюємо токен — додаємо запит до черги
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Спробуємо оновити токен
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const { access_token, refresh_token: newRefreshToken } = response.data;

          // Зберігаємо нові токени
          saveTokens(access_token, newRefreshToken);

          // Оновлюємо header для оригінального запиту
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          // Обробляємо чергу запитів
          processQueue(null, access_token);

          // Повторюємо оригінальний запит
          return api(originalRequest);
        } catch (refreshError) {
          // Оновлення не вдалося — обробляємо чергу з помилкою
          processQueue(refreshError, null);

          // Редирект на логін
          redirectToLogin();

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Інший тип 401 помилки (невалідний токен, відсутній токен)
        // Редирект на логін
        redirectToLogin();
      }
    }

    // Інші помилки — повертаємо як є
    return Promise.reject(error);
  }
);

// ============================================
// Export / Експорт
// ============================================

export default api;

// Named exports for direct use
export { api, API_BASE_URL };

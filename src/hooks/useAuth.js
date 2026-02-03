/**
 * useAuth Hook — React Hook for Authentication
 * Хук автентифікації для React
 *
 * Features:
 * - Store/retrieve tokens from localStorage
 * - Provide authentication state
 * - Handle login/logout flows
 * - Telegram WebApp integration
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import api, { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../api/axios';

// ============================================
// Auth Context / Контекст автентифікації
// ============================================

const AuthContext = createContext(null);

// ============================================
// Auth Provider Component / Провайдер автентифікації
// ============================================

/**
 * AuthProvider component that wraps the app and provides auth context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from stored tokens
   * Ініціалізація стану з збережених токенів
   */
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Спробуємо отримати профіль користувача
      const response = await api.get('/api/user/profile');

      if (response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        // Токен валідний, але немає даних користувача
        setIsAuthenticated(true);
        setUser(response.data);
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);

      // Якщо помилка 401 — очищаємо токени
      if (err.response?.status === 401) {
        clearTokens();
      }

      setIsAuthenticated(false);
      setUser(null);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with Telegram WebApp initData
   * Вхід з initData Telegram WebApp
   * @param {string} initData - Telegram WebApp initData
   */
  const loginWithTelegram = useCallback(async (initData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/telegram', {
        init_data: initData,
      });

      const { access_token, refresh_token, user: userData } = response.data;

      // Зберігаємо токени
      saveTokens(access_token, refresh_token);

      // Оновлюємо стан
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (err) {
      console.error('Telegram login failed:', err);
      setError(err.response?.data?.message || err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with Telegram Login Widget data
   * @param {Object} data - Data from Telegram Login Widget
   */
  const loginWithTelegramWidget = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/telegram-widget', data);

      const { access_token, refresh_token, user: userData } = response.data;

      saveTokens(access_token, refresh_token);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (err) {
      console.error('Telegram Widget login failed:', err);
      setError(err.response?.data?.message || err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout — clear tokens and reset state
   * Вихід — очистка токенів та скидання стану
   */
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      // Опціонально — повідомляємо сервер про вихід
      await api.post('/auth/logout').catch(() => {
        // Ігноруємо помилки logout endpoint
      });
    } finally {
      // Очищаємо токени
      clearTokens();

      // Скидаємо стан
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);

      // Для Telegram Mini App
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
      }
    }
  }, []);

  /**
   * Refresh access token
   * Оновлення access токена
   */
  const refreshToken = useCallback(async () => {
    try {
      const refresh = getRefreshToken();

      if (!refresh) {
        throw new Error('No refresh token');
      }

      const response = await api.post('/auth/refresh', {
        refresh_token: refresh,
      });

      const { access_token, refresh_token: newRefresh } = response.data;

      saveTokens(access_token, newRefresh);

      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
      return false;
    }
  }, [logout]);

  /**
   * Update user data
   * @param {Object} userData - New user data
   */
  const updateUser = useCallback((userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Auto-login for Telegram Mini App
  useEffect(() => {
    const initTelegramAuth = async () => {
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready();

        // Якщо є initData і ще не автентифіковані
        if (webApp.initData && !isAuthenticated && !isLoading) {
          await loginWithTelegram(webApp.initData);
        }
      }
    };

    // Чекаємо завершення ініціалізації
    if (!isLoading) {
      initTelegramAuth();
    }
  }, [isLoading, isAuthenticated, loginWithTelegram]);

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithTelegram,
    loginWithTelegramWidget,
    logout,
    refreshToken,
    updateUser,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// useAuth Hook / Хук useAuth
// ============================================

/**
 * Custom hook to access auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// ============================================
// Additional Hooks / Додаткові хуки
// ============================================

/**
 * Hook to check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * Hook to get current user
 * @returns {Object|null} Current user or null
 */
export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

/**
 * Hook to get auth loading state
 * @returns {boolean} True if auth is loading
 */
export const useAuthLoading = () => {
  const { isLoading } = useAuth();
  return isLoading;
};

export default useAuth;

import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [access, setAccess] = useState(localStorage.getItem('access') || null);
  const [refresh, setRefresh] = useState(localStorage.getItem('refresh') || null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessFromUrl = params.get('access');
    const refreshFromUrl = params.get('refresh');

    if (accessFromUrl && refreshFromUrl) {
      localStorage.setItem('access', accessFromUrl);
      localStorage.setItem('refresh', refreshFromUrl);

      setAccess(accessFromUrl);
      setRefresh(refreshFromUrl);

      // чистим URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  // Функция получения данных пользователя
  const fetchUser = async (token) => {
    if (!token) return;
    try {
      const res = await fetch('https://ggenius-api.onrender.com/bots/user.php', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Не авторизован');
      const data = await res.json();
      setUsers(data.user);
    } catch (e) {
      console.error(e);
      setUsers(null);
    }
  };

  // Функция обновления токена
  const refreshToken = async () => {
    if (!refresh) return;
    try {
      const res = await fetch('https://ggenius-api.onrender.com/bots/refresh.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) throw new Error('Не удалось обновить токен');
      const data = await res.json();
      setAccess(data.access);
      localStorage.setItem('access', data.access);
      await fetchUser(data.access);
    } catch (e) {
      console.error(e);
      setAccess(null);
      setUsers(null);
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
  };

  // Авто-обновление каждые 30 минут
  useEffect(() => {
    fetchUser(access);

    const interval = setInterval(() => {
      refreshToken();
    }, 30 * 60 * 1000); // 30 минут

    return () => clearInterval(interval);
  }, [access]);

  // Функция выхода
  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUsers(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  };
  console.log('AuthProvider render', { access, refresh, users });

  return (
    <AuthContext.Provider value={{ access, refresh, users, setAccess, setRefresh, setUsers, refreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );

};
console.log('AuthProvider render');

export const useAuth = () => {
  return useContext(AuthContext);
};

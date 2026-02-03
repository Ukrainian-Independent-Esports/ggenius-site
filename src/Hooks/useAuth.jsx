import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Получаем токены из URL при редиректе с Telegram
  const params = new URLSearchParams(window.location.search);
  const accessFromUrl = params.get("access");
  const refreshFromUrl = params.get("refresh");

  if (accessFromUrl && refreshFromUrl) {
    localStorage.setItem("access", accessFromUrl);
    localStorage.setItem("refresh", refreshFromUrl);
    // чистим URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const [access, setAccess] = useState(localStorage.getItem("access") || null);
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("tg_user")) || null);

  // -------------------- Функция получения пользователя --------------------
  const fetchUser = async (token) => {
    if (!token) return;

    try {
      const res = await fetch("https://ggenius-api.onrender.com/bots/user.php", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("Токен недействителен или истек");
        } else {
          throw new Error(`Ошибка: ${res.status}`);
        }
        setUser(null);
        localStorage.removeItem("tg_user");
        return;
      }

      const data = await res.json();
      if (!data.user) {
        console.warn("Пользователь не найден");
        setUser(null);
        localStorage.removeItem("tg_user");
        return;
      }

      setUser(data.user);
      localStorage.setItem("tg_user", JSON.stringify(data.user));
    } catch (err) {
      console.error("fetchUser error:", err);
      setUser(null);
      localStorage.removeItem("tg_user");
    }
  };

  // -------------------- Функция обновления токена --------------------
  const refreshToken = async () => {
    if (!refresh) return;

    try {
      const res = await fetch("https://ggenius-api.onrender.com/bots/refresh.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) throw new Error("Не удалось обновить токен");

      const data = await res.json();
      setAccess(data.access);
      localStorage.setItem("access", data.access);

      // Обновляем пользователя после обновления токена
      await fetchUser(data.access);
    } catch (e) {
      console.error("refreshToken error:", e);
      logout();
    }
  };

  // -------------------- Функция выхода --------------------
  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("tg_user");
  };

  // -------------------- Функция входа --------------------
  const login = async (data) => {
    if (!data) return;
    setAccess(data.access);
    setRefresh(data.refresh);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    await fetchUser(data.access);
  };

  // -------------------- useEffect для fetchUser --------------------
  useEffect(() => {
    if (!access) return;
    let isMounted = true;

    const initUser = async () => {
      await fetchUser(access);
    };

    if (isMounted) initUser();

    return () => {
      isMounted = false;
    };
  }, [access]);

  // -------------------- Автообновление токена каждые 30 минут --------------------
  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 30 * 60 * 1000); // 30 минут

    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ access, refresh, user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

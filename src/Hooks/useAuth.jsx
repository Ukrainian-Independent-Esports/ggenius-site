import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [access, setAccess] = useState(localStorage.getItem("access") || null);
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("tg_user")) || null
  );

  // Функция получения данных пользователя
  const fetchUser = async (token) => {
    if (!token) return;
    try {
      const res = await fetch(
        "https://ggenius-api.onrender.com/bots/user.php",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Не авторизован");
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("tg_user", JSON.stringify(data.user));
    } catch (e) {
      console.error("fetchUser error:", e);
      setUser(null);
      localStorage.removeItem("tg_user");
    }
  };

  // Функция обновления токена
  const refreshToken = async () => {
    if (!refresh) return;
    try {
      const res = await fetch(
        "https://ggenius-api.onrender.com/bots/refresh.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        }
      );
      if (!res.ok) throw new Error("Не удалось обновить токен");
      const data = await res.json();
      setAccess(data.access);
      localStorage.setItem("access", data.access);
      await fetchUser(data.access);
    } catch (e) {
      console.error("refreshToken error:", e);
      logout();
    }
  };

  // Функция выхода
  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("tg_user");
  };

  // Функция входа (при редиректе с Telegram)
  const login = async (data) => {
    if (!data) return;
    setAccess(data.access);
    setRefresh(data.refresh);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    await fetchUser(data.access);
  };

  // Проверка URL на ?id=... после редиректа с бота
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("id")) {
      fetch(`https://ggenius-api.onrender.com/bots/auth.php?${params.toString()}`)
        .then((res) => res.json())
        .then(async (data) => {
          await login(data); // сохраняем токены и user
          window.history.replaceState({}, document.title, "/"); // чистим URL
        });
    }
  }, []);

  // Автообновление токена каждые 30 минут
  useEffect(() => {
    if (access) fetchUser(access);

    const interval = setInterval(() => {
      refreshToken();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [access]);

  return (
    <AuthContext.Provider value={{ access, refresh, user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

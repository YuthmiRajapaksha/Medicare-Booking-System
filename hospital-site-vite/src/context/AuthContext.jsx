import { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null,
    token: null,
    user: null,
    doctor: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token) {
      setAuth({
        isLoggedIn: true,
        role: role || "user",
        token,
        user: user || null,
      });
    }
  }, []);

  const login = useCallback(({ token, role, user, doctor }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role || "user"); // fallback
    if (user) localStorage.setItem("user", JSON.stringify(user));
    if (doctor) localStorage.setItem("doctor", JSON.stringify(doctor));

    setAuth({
      isLoggedIn: true,
      token,
      role: role || "user",
      user: user || null,
      doctor: doctor || null,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setAuth({
      isLoggedIn: false,
      role: null,
      token: null,
      user: null,
      doctor: null,
    });
  }, []);

  const value = useMemo(() => ({ auth, login, logout }), [auth, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

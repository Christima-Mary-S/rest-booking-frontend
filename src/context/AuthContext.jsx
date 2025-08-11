import React, { createContext, useState, useEffect } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("authToken");

    if (
      storedToken &&
      (storedToken.startsWith("{") || storedToken === "[object Object]")
    ) {
      localStorage.removeItem("authToken");
      return null;
    }

    return storedToken;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      validateToken();
    }
  }, [token, user]);

  const validateToken = async () => {
    try {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      logout();
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);

      if (response.token) {
        const tokenString = response.token.access_token || response.token;
        const userData = { email, ...response.user };

        setToken(tokenString);
        setUser(userData);
        localStorage.setItem("authToken", tokenString);
        localStorage.setItem("userData", JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      return { success: false, error: "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

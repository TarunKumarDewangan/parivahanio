import React, { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../api/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Token exists, so we verify it by fetching the user profile
    apiClient
      .get("/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        // If token is invalid or expired, clear it
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        // Auth check is complete
        setLoading(false);
      });
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    // Invalidate token on the server
    apiClient.post('/logout').catch(() => {});
    localStorage.removeItem("token");
    setUser(null);
  };

  // The value provided to consuming components
  const value = { user, login, logout, loading };

  // Render children only after the initial loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access the auth context in any component
export const useAuth = () => {
  return useContext(AuthContext);
};

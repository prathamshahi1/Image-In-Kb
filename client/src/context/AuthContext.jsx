import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('imageinkb_token') || localStorage.getItem('imageforge_token'));
  const [loading, setLoading] = useState(true);

  // Configure Axios default header whenever token changes
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('imageinkb_token', token);
      fetchUserProfile();
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('imageinkb_token');
      localStorage.removeItem('imageforge_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.warn('Session expired or invalid token');
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('imageforge_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('heartsync_token') || null);
  const [loading, setLoading] = useState(true);

  // Load profile on initial load if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get('/auth/me');
        if (response.success) {
          setUser(response.user);
        }
      } catch (err) {
        console.warn('Failed to verify token:', err.message);
        localStorage.removeItem('heartsync_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    if (response.success) {
      localStorage.setItem('heartsync_token', response.token);
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  };

  const signup = async (formData) => {
    const response = await API.post('/auth/register', formData);
    if (response.success) {
      localStorage.setItem('heartsync_token', response.token);
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem('heartsync_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (updatedData) => {
    const response = await API.put('/users/profile', updatedData);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
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

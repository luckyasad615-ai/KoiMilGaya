import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

const getInitialUser = () => {
  try {
    const cached = localStorage.getItem('kmg_user');
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    return null;
  }
};

const getInitialToken = () => {
  return localStorage.getItem('kmg_auth_token') || localStorage.getItem('heartsync_token') || null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser());
  const [token, setToken] = useState(getInitialToken());
  const [loading, setLoading] = useState(!user);

  // Synchronize state to localStorage helper
  const saveAuthSession = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem('kmg_auth_token', newToken);
      localStorage.setItem('heartsync_token', newToken);
      setToken(newToken);
    }
    if (newUser) {
      localStorage.setItem('kmg_user', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const clearAuthSession = () => {
    localStorage.removeItem('kmg_auth_token');
    localStorage.removeItem('heartsync_token');
    localStorage.removeItem('kmg_user');
    setToken(null);
    setUser(null);
  };

  // Verify and sync profile with server
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get('/auth/me');
        if (response.success && response.user) {
          saveAuthSession(null, response.user);
        }
      } catch (err) {
        console.warn('Failed to verify token with server:', err.message);
        // Only clear session if token itself is explicitly invalid or expired
        const msg = (err.message || '').toLowerCase();
        if (msg.includes('token invalid') || msg.includes('token expired') || msg.includes('no token provided')) {
          clearAuthSession();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);


  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    if (response.success && response.token && response.user) {
      saveAuthSession(response.token, response.user);
    }
    return response;
  };

  const signup = async (formData) => {
    const response = await API.post('/auth/register', formData);
    if (response.success && response.token && response.user) {
      saveAuthSession(response.token, response.user);
    }
    return response;
  };

  const logout = () => {
    clearAuthSession();
  };

  const updateUserProfile = async (updatedData) => {
    const response = await API.put('/users/profile', updatedData);
    if (response.success && response.user) {
      saveAuthSession(null, response.user);
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
        isAuthenticated: !!user || !!token,
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

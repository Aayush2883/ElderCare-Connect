import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state with localStorage on load
  useEffect(() => {
    const checkUserSession = async () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const parsed = JSON.parse(storedUserInfo);
          // Verify token by loading full profile
          const { data } = await API.get('/api/auth/profile');
          // Update profile details with latest data from DB
          const updatedUser = { ...parsed, ...data };
          setUser(updatedUser);
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        } catch (err) {
          console.warn('Session expired or invalid, logging out.', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  // Register handler
  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/api/auth/register', payload);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  // Update caregiver profile locally in context
  const updateCaregiverProfileInContext = (profileData) => {
    if (user) {
      const updatedUser = { ...user, caregiverProfile: profileData };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateCaregiverProfileInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ghostwrite_user');
    const token = localStorage.getItem('ghostwrite_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ghostwrite_user');
        localStorage.removeItem('ghostwrite_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success && res.data.data) {
      const authData = res.data.data;
      const userData = {
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role,
        department: authData.department,
      };
      localStorage.setItem('ghostwrite_token', authData.token);
      localStorage.setItem('ghostwrite_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('ghostwrite_token');
    localStorage.removeItem('ghostwrite_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

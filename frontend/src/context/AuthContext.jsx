// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      AuthService.setAuthHeader();
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const userData = await AuthService.login(username, password);
      setCurrentUser(userData);
      showToast('Successfully logged in!', 'success');
      navigate('/dashboard');
      return true;
    } catch (error) {
      showToast('Login failed: ' + (error.response?.data?.detail || 'Invalid credentials'), 'danger');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, role) => {
    try {
      setLoading(true);
      await AuthService.register(username, email, password, role);
      showToast('Registration successful! Please log in.', 'success');
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.username || 
                       error.response?.data?.email || 
                       error.response?.data?.password ||
                       'Registration failed';
      showToast(errorMsg, 'danger');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    showToast('You have been logged out', 'info');
    navigate('/');
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    isLoggedIn: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('farmora_user') || localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('farmora_token') || localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('farmora_token') || localStorage.getItem('token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.get('/auth/me');
      const currentUser = res.user || res.data?.user;
      if (currentUser) {
        // Ensure consistent role case
        currentUser.fullName = currentUser.name || currentUser.fullName;
        setUser(currentUser);
        localStorage.setItem('farmora_user', JSON.stringify(currentUser));
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        logout();
      }
    } catch (err) {
      console.warn('[Auth] Verification failed:', err.message);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (identifier, password) => {
    const email = identifier;
    const res = await apiClient.post('/auth/login', { email, identifier, password });

    const receivedToken = res.token || res.data?.token;
    const receivedUser = res.user || res.data?.user;

    if (receivedToken && receivedUser) {
      receivedUser.fullName = receivedUser.name || receivedUser.fullName;
      localStorage.setItem('farmora_token', receivedToken);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('farmora_user', JSON.stringify(receivedUser));
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    }
    throw new Error(res.message || 'Authentication failed');
  };

  const register = async (farmerData) => {
    const res = await apiClient.post('/auth/register', farmerData);

    const receivedToken = res.token || res.data?.token;
    const receivedUser = res.user || res.data?.user;

    if (receivedToken && receivedUser) {
      receivedUser.fullName = receivedUser.name || receivedUser.fullName;
      localStorage.setItem('farmora_token', receivedToken);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('farmora_user', JSON.stringify(receivedUser));
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('farmora_token');
    localStorage.removeItem('token');
    localStorage.removeItem('farmora_user');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role?.toUpperCase(),
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
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

export default AuthContext;

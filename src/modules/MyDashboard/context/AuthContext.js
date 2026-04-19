import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const bootstrapAuth = async () => {
      const storedUser = authService.getStoredAdmin();

      if (storedUser && !ignore) {
        setUser(storedUser);
      }

      if (!authService.isAuthenticated()) {
        if (!ignore) {
          setLoading(false);
        }
        return;
      }

      try {
        const currentUser = await authService.getCurrentAdmin();
        if (!ignore) {
          setUser(currentUser);
        }
      } catch (error) {
        authService.logout();
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    return result;
  };

  const register = async (name, email, password) => {
    const result = await authService.register(name, email, password);
    setUser(result.user);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user) || authService.isAuthenticated(),
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

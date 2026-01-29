import { useEffect, useState } from 'react';
import { store } from '../store';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(store.auth.isAuthenticated);
  }, []);

  const login = (user: any, token: string) => {
    store.auth.login(user, token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    store.auth.logout();
    setIsAuthenticated(false);
  };

  return {
    user: store.auth.user,
    isAuthenticated,
    login,
    logout,
  };
};

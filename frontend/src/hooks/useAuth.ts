import { useCallback } from 'react';
import { store } from '../store';

export const useAuth = () => {
  const login = useCallback((user: any, token: string) => {
    store.auth.login(user, token);
  }, []);

  const logout = useCallback(() => {
    store.auth.logout();
  }, []);

  return {
    user: store.auth.user,
    isAuthenticated: store.auth.isAuthenticated,
    login,
    logout,
  };
};

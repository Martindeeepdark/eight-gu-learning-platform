import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const getUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const authStore = {
  state: {
    ...initialState,
    user: getUserFromStorage(),
  } as AuthState,

  // 登录
  login(user: User, token: string) {
    this.state.user = user;
    this.state.token = token;
    this.state.isAuthenticated = true;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // 登出
  logout() {
    this.state.user = null;
    this.state.token = null;
    this.state.isAuthenticated = false;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // 更新用户信息
  updateUser(user: User) {
    this.state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  },
};

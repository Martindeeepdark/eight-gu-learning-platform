import api from './api';
import { ApiResponse, AuthResponse, User } from '../types';

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  // 用户注册
  register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return api.post('/api/v1/auth/register', data);
  },

  // 用户登录
  login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return api.post('/api/v1/auth/login', data);
  },

  // 获取当前用户信息
  getMe(): Promise<ApiResponse<User>> {
    return api.get('/api/v1/auth/me');
  },
};

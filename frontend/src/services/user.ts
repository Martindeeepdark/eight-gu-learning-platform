import api from './api';
import { ApiResponse, User } from '../types';

export interface UpdateUserRequest {
  username?: string;
  avatar?: string;
}

export const userService = {
  // 获取用户信息
  getById(id: number): Promise<ApiResponse<User>> {
    return api.get(`/api/v1/users/${id}`);
  },

  // 更新用户信息
  update(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return api.put(`/api/v1/users/${id}`, data);
  },
};

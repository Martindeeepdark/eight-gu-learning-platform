import api from './api';
import { ApiResponse, Exercise, PageResponse, WrongExercise } from '../types';

export const exerciseService = {
  // 获取练习题列表
  getList(params: {
    page?: number;
    page_size?: number;
    knowledge_id?: number;
    difficulty?: string;
  }): Promise<ApiResponse<PageResponse<Exercise>>> {
    return api.get('/api/v1/exercises', { params });
  },

  // 获取练习题详情
  getById(id: number): Promise<ApiResponse<Exercise>> {
    return api.get(`/api/v1/exercises/${id}`);
  },

  // 提交答案
  submitAnswer(id: number, answer: string[]): Promise<ApiResponse<{
    is_correct: boolean;
    correct_answer: string;
    explanation: string;
    record_id: number;
  }>> {
    return api.post(`/api/v1/exercises/${id}/submit`, { answer });
  },

  // 获取错题列表
  getWrongList(params?: {
    page?: number;
    page_size?: number;
  }): Promise<ApiResponse<PageResponse<WrongExercise>>> {
    return api.get('/api/v1/exercises/wrong', { params });
  },
};

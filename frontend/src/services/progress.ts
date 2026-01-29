import api from './api';
import { ApiResponse, LearningProgress, LearningStats } from '../types';

export interface UpdateProgressRequest {
  knowledge_point_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  mastery_level: number;
}

export const progressService = {
  // 获取学习进度
  getProgress(params: {
    knowledge_id?: number;
    category_id?: number;
  }): Promise<ApiResponse<LearningProgress[]>> {
    return api.get('/api/v1/learning/progress', { params });
  },

  // 更新学习进度
  updateProgress(data: UpdateProgressRequest): Promise<ApiResponse<LearningProgress>> {
    return api.post('/api/v1/learning/progress', data);
  },

  // 获取学习统计
  getStats(): Promise<ApiResponse<LearningStats>> {
    return api.get('/api/v1/learning/stats');
  },
};

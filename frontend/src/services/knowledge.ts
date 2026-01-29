import api from './api';
import { ApiResponse, KnowledgePoint, GraphData, PageResponse, Category } from '../types';

export const knowledgeService = {
  // 获取分类列表
  getCategories(): Promise<ApiResponse<Category[]>> {
    return api.get('/api/v1/categories');
  },

  // 获取知识点列表
  getList(params: {
    page?: number;
    page_size?: number;
    category_id?: number;
    difficulty?: string;
    frequency?: string;
    search?: string;
  }): Promise<ApiResponse<PageResponse<KnowledgePoint>>> {
    return api.get('/api/v1/knowledge', { params });
  },

  // 获取知识点详情
  getById(id: number): Promise<ApiResponse<KnowledgePoint>> {
    return api.get(`/api/v1/knowledge/${id}`);
  },

  // 获取知识图谱数据
  getGraph(categoryId?: number): Promise<ApiResponse<GraphData>> {
    const params = categoryId ? { category_id: categoryId } : {};
    return api.get('/api/v1/knowledge/graph', { params });
  },
};

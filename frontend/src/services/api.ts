import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response;

          // 401 未授权，清除 token
          if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }

          return Promise.reject({
            code: data?.code || status,
            message: data?.message || '请求失败',
          });
        }

        return Promise.reject({
          code: -1,
          message: error.message || '网络错误',
        });
      }
    );
  }

  get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.get(url, config);
  }

  post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.post(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.put(url, data, config);
  }

  delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.delete(url, config);
  }
}

export default new ApiClient();

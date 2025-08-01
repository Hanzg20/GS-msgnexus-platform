import axios from 'axios';
import { message } from 'antd';

// API 配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030';

// 创建 axios 实例
const apiClient: any = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: any) => {
    // 添加认证 token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: any) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: any) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: any) => {
    console.error('❌ Response Error:', error);
    
    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          message.error('认证失败，请重新登录');
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('权限不足');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 429:
          message.error('请求过于频繁，请稍后再试');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(data?.message || '请求失败');
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络设置');
    } else {
      message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// 通用 API 方法
export const api = {
  // GET 请求
  get: <T = any>(url: string, config?: any): Promise<ApiResponse<T>> => {
    return apiClient.get(url, config).then((response: any) => response.data);
  },

  // POST 请求
  post: <T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
    return apiClient.post(url, data, config).then((response: any) => response.data);
  },

  // PUT 请求
  put: <T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
    return apiClient.put(url, data, config).then((response: any) => response.data);
  },

  // DELETE 请求
  delete: <T = any>(url: string, config?: any): Promise<ApiResponse<T>> => {
    return apiClient.delete(url, config).then((response: any) => response.data);
  },

  // PATCH 请求
  patch: <T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
    return apiClient.patch(url, data, config).then((response: any) => response.data);
  },
};

// 租户相关 API
export const tenantApi = {
  // 获取租户列表
  getTenants: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => api.get('/api/tenants', { params }),

  // 获取租户详情
  getTenant: (id: string) => api.get(`/api/tenants/${id}`),

  // 创建租户
  createTenant: (data: any) => api.post('/api/tenants', data),

  // 更新租户
  updateTenant: (id: string, data: any) => api.put(`/api/tenants/${id}`, data),

  // 删除租户
  deleteTenant: (id: string) => api.delete(`/api/tenants/${id}`),

  // 获取租户统计
  getTenantStats: (id: string) => api.get(`/api/tenants/${id}/stats`),
};

// 用户相关 API
export const userApi = {
  // 获取用户列表
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) => api.get('/api/users', { params }),

  // 获取用户详情
  getUser: (id: string) => api.get(`/api/users/${id}`),

  // 创建用户
  createUser: (data: any) => api.post('/api/users', data),

  // 更新用户
  updateUser: (id: string, data: any) => api.put(`/api/users/${id}`, data),

  // 删除用户
  deleteUser: (id: string) => api.delete(`/api/users/${id}`),

  // 用户登录
  login: (credentials: { email: string; password: string }) => 
    api.post('/api/users/login', credentials),

  // 用户登出
  logout: () => api.post('/api/users/logout'),

  // 重置密码
  resetPassword: (email: string) => api.post('/api/users/reset-password', { email }),
};

// 消息相关 API
export const messageApi = {
  // 获取消息列表
  getMessages: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
  }) => api.get('/api/messages', { params }),

  // 获取消息详情
  getMessage: (id: string) => api.get(`/api/messages/${id}`),

  // 发送消息
  sendMessage: (data: any) => api.post('/api/messages', data),

  // 更新消息
  updateMessage: (id: string, data: any) => api.put(`/api/messages/${id}`, data),

  // 删除消息
  deleteMessage: (id: string) => api.delete(`/api/messages/${id}`),

  // 标记消息为已读
  markAsRead: (id: string) => api.post(`/api/messages/${id}/read`),

  // 获取消息统计
  getMessageStats: () => api.get('/api/messages/stats/overview'),
};

// 系统相关 API
export const systemApi = {
  // 获取系统概览
  getOverview: () => api.get('/api/system/overview'),

  // 获取性能指标
  getPerformance: () => api.get('/api/system/performance'),

  // 获取系统日志
  getLogs: (params?: {
    level?: string;
    startTime?: string;
    endTime?: string;
    limit?: number;
  }) => api.get('/api/system/logs', { params }),

  // 获取错误日志
  getErrors: () => api.get('/api/system/errors'),

  // 获取系统配置
  getConfig: () => api.get('/api/system/config'),

  // 更新系统配置
  updateConfig: (data: any) => api.put('/api/system/config', data),
};

// AI 相关 API
export const aiApi = {
  // AI 聊天
  chat: (message: string, context?: any) => 
    api.post('/api/ai/chat', { message, context }),

  // 数据分析
  analyze: (data: any) => api.post('/api/ai/analyze', data),

  // 获取建议
  getSuggestions: (context: any) => api.post('/api/ai/suggestions', context),

  // 内容审核
  moderate: (content: string) => api.post('/api/ai/moderate', { content }),

  // 翻译
  translate: (text: string, targetLang: string) => 
    api.post('/api/ai/translate', { text, targetLang }),

  // 摘要
  summarize: (content: string) => api.post('/api/ai/summarize', { content }),

  // 获取 AI 配置
  getConfig: () => api.get('/api/ai/config'),

  // 更新 AI 配置
  updateConfig: (data: any) => api.put('/api/ai/config', data),

  // 获取 AI 统计
  getStats: () => api.get('/api/ai/stats'),

  // 获取可用模型
  getModels: () => api.get('/api/ai/models'),
};

export default apiClient; 
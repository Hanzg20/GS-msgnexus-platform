import axios from 'axios';

// API 配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// 通用 API 函数
export const api = {
  // 租户管理
  tenants: {
    getAll: () => apiClient.get('/api/v1/tenants'),
    getById: (id: string) => apiClient.get(`/api/v1/tenants/${id}`),
    create: (data: any) => apiClient.post('/api/v1/tenants', data),
    update: (id: string, data: any) => apiClient.put(`/api/v1/tenants/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/v1/tenants/${id}`),
    updateStatus: (id: string, status: string) => apiClient.patch(`/api/v1/tenants/${id}/status`, { status }),
    getStats: () => apiClient.get('/api/v1/tenants/stats'),
  },

  // 消息管理
  messages: {
    getAll: () => apiClient.get('/api/v1/messages'),
    getById: (id: string) => apiClient.get(`/api/v1/messages/${id}`),
    create: (data: any) => apiClient.post('/api/v1/messages', data),
    update: (id: string, data: any) => apiClient.put(`/api/v1/messages/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/v1/messages/${id}`),
    updateStatus: (id: string, status: string) => apiClient.patch(`/api/v1/messages/${id}/status`, { status }),
    retry: (id: string) => apiClient.post(`/api/v1/messages/${id}/retry`),
    getStats: () => apiClient.get('/api/v1/messages/stats'),
    getTrends: () => apiClient.get('/api/v1/messages/trends'),
  },

  // 系统监控
  system: {
    getOverview: () => apiClient.get('/api/v1/system/overview'),
    getCpu: () => apiClient.get('/api/v1/system/cpu'),
    getMemory: () => apiClient.get('/api/v1/system/memory'),
    getDisk: () => apiClient.get('/api/v1/system/disk'),
    getNetwork: () => apiClient.get('/api/v1/system/network'),
    getProcesses: () => apiClient.get('/api/v1/system/processes'),
    getLogs: () => apiClient.get('/api/v1/system/logs'),
    getPerformance: () => apiClient.get('/api/v1/system/performance'),
    getAlerts: () => apiClient.get('/api/v1/system/alerts'),
    acknowledgeAlert: (id: string) => apiClient.post(`/api/v1/system/alerts/${id}/acknowledge`),
    getHealth: () => apiClient.get('/api/v1/system/health'),
  },

  // 备份管理
  backup: {
    getJobs: () => apiClient.get('/api/v1/backup/jobs'),
    getSchedules: () => apiClient.get('/api/v1/backup/schedules'),
    getStats: () => apiClient.get('/api/v1/backup/stats'),
    restore: (id: string) => apiClient.post(`/api/v1/backup/restore/${id}`),
    cleanup: () => apiClient.post('/api/v1/backup/cleanup'),
  },

  // 用户权限管理
  users: {
    getAll: () => apiClient.get('/api/v1/users'),
    getById: (id: string) => apiClient.get(`/api/v1/users/${id}`),
    create: (data: any) => apiClient.post('/api/v1/users', data),
    update: (id: string, data: any) => apiClient.put(`/api/v1/users/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/v1/users/${id}`),
    getRoles: () => apiClient.get('/api/v1/users/roles'),
    getPermissions: () => apiClient.get('/api/v1/users/permissions'),
    getStats: () => apiClient.get('/api/v1/users/stats'),
  },

  // 健康检查
  health: () => apiClient.get('/health'),
};

export default apiClient; 
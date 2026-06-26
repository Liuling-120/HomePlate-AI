import axios from 'axios';
import toast from 'react-hot-toast';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
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
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转登录
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('登录已过期，请重新登录');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('没有权限访问');
          break;
        case 404:
          toast.error('请求的资源不存在');
          break;
        case 500:
          toast.error('服务器错误，请稍后重试');
          break;
        default:
          toast.error(data?.message || '请求失败');
      }
    } else {
      toast.error('网络连接失败，请检查网络');
    }
    
    return Promise.reject(error);
  }
);

// API请求方法封装
export const request = {
  // GET请求
  get: (url, params = {}) => api.get(url, { params }),
  
  // POST请求
  post: (url, data = {}) => api.post(url, data),
  
  // PUT请求
  put: (url, data = {}) => api.put(url, data),
  
  // DELETE请求
  delete: (url, params = {}) => api.delete(url, { params }),
};

export default api;
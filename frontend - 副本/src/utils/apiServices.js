import api from './api';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
};

export const recipeAPI = {
  getRecipes: (params) => api.get('/recipes', params),
  getRecommended: (params) => api.get('/recipes/recommended', params),
  getHot: (params) => api.get('/recipes/hot', params),
  getCategories: () => api.get('/recipes/categories'),
  getRecipeById: (id) => api.get(`/recipes/${id}`),
  addFavorite: (recipeId) => api.post(`/recipes/${recipeId}/favorite`),
  removeFavorite: (recipeId) => api.delete(`/recipes/${recipeId}/favorite`),
  getFavorites: (params) => api.get('/recipes/favorites/list', params),
  checkFavorites: (recipeIds) => api.post('/recipes/favorites/check', { recipeIds }),
};

export const fridgeAPI = {
  getItems: (params) => api.get('/fridge', params),
  getExpiring: (params) => api.get('/fridge/expiring', params),
  getStats: () => api.get('/fridge/stats'),
  addItem: (data) => api.post('/fridge', data),
  addItemsBatch: (items) => api.post('/fridge/batch', { items }),
  updateItem: (id, data) => api.put(`/fridge/${id}`, data),
  deleteItem: (id) => api.delete(`/fridge/${id}`),
  deleteItemsBatch: (ids) => api.delete('/fridge/batch/delete', { ids }),
};

export const shoppingAPI = {
  getList: (params) => api.get('/shopping', params),
  getSuggestions: () => api.get('/shopping/suggestions'),
  generateFromRecipe: (recipeId) => api.post(`/shopping/generate/${recipeId}`),
  generateFromMultiple: (recipeIds) => api.post('/shopping/generate-multiple', { recipeIds }),
  addItem: (data) => api.post('/shopping', data),
  updateStatus: (id, status) => api.put(`/shopping/${id}/status`, { status }),
  updateStatusBatch: (ids, status) => api.put('/shopping/batch/status', { ids, status }),
  deleteItem: (id) => api.delete(`/shopping/${id}`),
  clearPurchased: () => api.delete('/shopping/purchased/clear'),
  clearAll: () => api.delete('/shopping/all/clear'),
};

export const aiAPI = {
  checkStatus: () => api.get('/ai/status'),
  recommendRecipes: (data) => api.post('/ai/recommend', data),
  generateDescription: (data) => api.post('/ai/description', data),
  analyzeNutrition: (data) => api.post('/ai/nutrition', data),
  generateSteps: (data) => api.post('/ai/steps', data),
  conversation: (data) => api.post('/ai/conversation', data),
};
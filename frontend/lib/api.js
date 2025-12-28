import axios from 'axios';

const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  : (process.env.NEXT_PUBLIC_API_URL || 'https://track-stock.vercel.app/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Materials endpoints
export const materialsAPI = {
  getAll: () => api.get('/materials'),
  getById: (id) => api.get(`/materials/${id}`),
  getBySku: (sku) => api.get(`/materials/sku/${sku}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`),
};

// Stock movements endpoints
export const stockMovementsAPI = {
  getAll: (limit) => api.get('/stock-movements', { params: { limit } }),
  getByMaterial: (materialId) => api.get(`/stock-movements/material/${materialId}`),
  getByDateRange: (startDate, endDate) =>
    api.get('/stock-movements/range/', { params: { startDate, endDate } }),
  record: (data) => api.post('/stock-movements', data),
  recordDamage: (data) => api.post('/stock-movements/damage', data),
};

// Insights endpoints
export const insightsAPI = {
  getDashboard: () => api.get('/insights/dashboard'),
  getLowStock: () => api.get('/insights/low-stock'),
  getDeadStock: () => api.get('/insights/dead-stock'),
  getFastMoving: (days = 30) => api.get('/insights/fast-moving', { params: { days } }),
  getComprehensiveInsights: () => api.get('/insights/comprehensive'),
  getTopSkus: (limit) => api.get('/insights/top-skus', { params: { limit } }),
  getDamagedInventory: () => api.get('/insights/damaged-inventory'),
  getCategoryBreakdown: () => api.get('/insights/category-breakdown'),
};

export default api;

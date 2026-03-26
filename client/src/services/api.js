import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const requestService = {
  getAll: (status) => api.get('/requests', { params: { status } }),
  getOne: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  updateStatus: (id, status) => api.patch(`/requests/${id}/status`, { status })
};

export default api;

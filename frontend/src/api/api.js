import axios from 'axios';

// Базовый экземпляр axios с базовым URL вашего Spring Boot API
const api = axios.create({ baseURL: '/api' });

// API для работы с преподавателями
export const prepodApi = {
  list:    () => api.get('/prepods'),
  get:     id => api.get(`/prepods/${id}`),
  create:  data => api.post('/prepods', data),
  update:  (id, data) => api.put(`/prepods/${id}`, data),
  remove:  id => api.delete(`/prepods/${id}`),
};

// API для работы с курсами
export const courseApi = {
  list:    () => api.get('/courses'),
  get:     id => api.get(`/courses/${id}`),
  create:  data => api.post('/courses', data),
  update:  (id, data) => api.put(`/courses/${id}`, data),
  remove:  id => api.delete(`/courses/${id}`),
};

// API для работы с отзывами
export const reviewApi = {
  list:    () => api.get('/reviews'),
  get:     id => api.get(`/reviews/${id}`),
  create:  data => api.post('/reviews', data),
  update:  (id, data) => api.put(`/reviews/${id}`, data),
  remove:  id => api.delete(`/reviews/${id}`),
};

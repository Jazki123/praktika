import axios from 'axios';


const api = axios.create({ baseURL: '/api' });


export const prepodApi = {
  list:    () => api.get('/prepods'),
  get:     id => api.get(`/prepods/${id}`),
  create:  data => api.post('/prepods', data),
  update:  (id, data) => api.put(`/prepods/${id}`, data),
  remove:  id => api.delete(`/prepods/${id}`),
};


export const courseApi = {
  list:    () => api.get('/courses'),
  get:     id => api.get(`/courses/${id}`),
  create:  data => api.post('/courses', data),
  update:  (id, data) => api.put(`/courses/${id}`, data),
  remove:  id => api.delete(`/courses/${id}`),
};


export const reviewApi = {
  list:    () => api.get('/reviews'),
  get:     id => api.get(`/reviews/${id}`),
  create:  data => api.post('/reviews', data),
  update:  (id, data) => api.put(`/reviews/${id}`, data),
  remove:  id => api.delete(`/reviews/${id}`),
};

import api from './api';

const categoryService = {
  async getAll() {
    const { data } = await api.get('/categories');
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/categories', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/categories/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/categories/${id}`);
  },
};

export default categoryService;

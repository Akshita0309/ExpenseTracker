import api from './api';

const transactionService = {
  async getAll(filters = {}) {
    const { data } = await api.get('/transactions', { params: filters });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/transactions/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/transactions', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/transactions/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/transactions/${id}`);
  },
};

export default transactionService;

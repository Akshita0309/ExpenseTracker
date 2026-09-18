import api from './api';

const budgetService = {
  async getAll(month, year) {
    const { data } = await api.get('/budgets', { params: { month, year } });
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/budgets', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/budgets/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/budgets/${id}`);
  },

  async getAlerts() {
    const { data } = await api.get('/alerts');
    return data;
  },

  async markAlertRead(id) {
    const { data } = await api.patch(`/alerts/${id}/read`);
    return data;
  },
};

export default budgetService;

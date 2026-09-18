import api from './api';

const reportService = {
  async getMonthly(month, year) {
    const { data } = await api.get('/reports/monthly', { params: { month, year } });
    return data;
  },

  async downloadPdf(month, year) {
    const response = await api.get('/reports/export/pdf', {
      params: { month, year },
      responseType: 'blob',
    });
    return response.data;
  },

  async downloadExcel(month, year) {
    const response = await api.get('/reports/export/excel', {
      params: { month, year },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default reportService;


import api from './api';

export const financeService = {
  // Get financial records with optional filtering
  getFinances: (filters = {}) => api.get('/finances', { params: filters }).then(res => res.data),
  
  // Get financial summary (total income, expenses, profit)
  getFinanceSummary: (filters = {}) => api.get('/finances/summary', { params: filters }).then(res => res.data),
  
  // Get finance data categorized
  getFinanceCategories: (filters = {}) => api.get('/finances/categories', { params: filters }).then(res => res.data),
  
  // Create a new finance record
  createFinance: (financeData) => api.post('/finances', financeData).then(res => res.data),
  
  // Update an existing finance record
  updateFinance: (id, financeData) => api.put(`/finances/${id}`, financeData).then(res => res.data),
  
  // Delete a finance record
  deleteFinance: (id) => api.delete(`/finances/${id}`).then(res => res.data)
};

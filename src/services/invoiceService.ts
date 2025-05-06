
import api from './api';

export const invoiceService = {
  // Get all invoices
  getInvoices: () => api.get('/invoices').then(res => res.data),
  
  // Get invoice by ID
  getInvoiceById: (id: string) => api.get(`/invoices/${id}`).then(res => res.data),
  
  // Generate invoice data from trips
  generateFromTrips: (params: { 
    startDate: string; 
    endDate: string; 
    clientName: string;
  }) => api.get('/invoices/generate-from-trips', { params }).then(res => res.data),
  
  // Create a new invoice
  createInvoice: (invoiceData: any) => api.post('/invoices', invoiceData).then(res => res.data),
  
  // Update an existing invoice
  updateInvoice: (id: string, invoiceData: any) => api.put(`/invoices/${id}`, invoiceData).then(res => res.data),
  
  // Delete an invoice
  deleteInvoice: (id: string) => api.delete(`/invoices/${id}`).then(res => res.data)
};

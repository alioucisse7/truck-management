
import api from './api';
import { TruckData } from '@/store/trucksSlice';

export const trucksService = {
  getAll: () => api.get('/trucks').then(res => {
    // Map MongoDB _id to id if needed and ensure proper driver representation
    return res.data.map((truck: any) => ({
      ...truck,
      id: truck.id || truck._id,
      // Handle assigned driver ID appropriately
      assignedDriverId: truck.assignedDriverId ? 
        (typeof truck.assignedDriverId === 'object' ? 
          truck.assignedDriverId._id || truck.assignedDriverId.id : 
          truck.assignedDriverId) :
        null
    }));
  }),
  getById: (id: string) => api.get(`/trucks/${id}`).then(res => {
    // Ensure the response has an id field
    const truck = res.data;
    return {
      ...truck,
      id: truck.id || truck._id,
      // Handle assigned driver ID appropriately
      assignedDriverId: truck.assignedDriverId ? 
        (typeof truck.assignedDriverId === 'object' ? 
          truck.assignedDriverId._id || truck.assignedDriverId.id : 
          truck.assignedDriverId) :
        null
    };
  }),
  create: (data: Omit<TruckData, 'id'>) => api.post('/trucks', data).then(res => {
    const truck = res.data;
    return {
      ...truck,
      id: truck.id || truck._id,
    };
  }),
  update: (id: string, data: Partial<TruckData>) => api.put(`/trucks/${id}`, data).then(res => {
    const truck = res.data;
    return {
      ...truck,
      id: truck.id || truck._id,
    };
  }),
  delete: (id: string) => api.delete(`/trucks/${id}`).then(res => res.data),
};

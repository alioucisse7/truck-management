
import api from './api';
import { DriverData } from '@/store/driversSlice';

export const driversService = {
  getAll: () => api.get('/drivers').then(res => {
    // Map MongoDB _id to id if needed
    return res.data.map((driver: any) => ({
      ...driver,
      id: driver.id || driver._id,
    }));
  }),
  getById: (id: string) => api.get(`/drivers/${id}`).then(res => {
    // Ensure the response has an id field
    const driver = res.data;
    return {
      ...driver,
      id: driver.id || driver._id,
    };
  }),
  create: (data: Omit<DriverData, 'id'>) => api.post('/drivers', data).then(res => {
    const driver = res.data;
    return {
      ...driver,
      id: driver.id || driver._id,
    };
  }),
  update: (id: string, data: Partial<DriverData>) => api.put(`/drivers/${id}`, data).then(res => {
    const driver = res.data;
    return {
      ...driver,
      id: driver.id || driver._id,
    };
  }),
  delete: (id: string) => api.delete(`/drivers/${id}`).then(res => res.data),
  getTrips: (id: string) => api.get(`/drivers/${id}/trips`).then(res => {
    // Map MongoDB _id to id for trips if needed
    return res.data.map((trip: any) => ({
      ...trip,
      id: trip.id || trip._id,
    }));
  }),
};

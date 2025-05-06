
import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats').then(res => res.data),
  getRecentTrips: () => api.get('/dashboard/recent-trips').then(res => {
    // Ensure consistent ID format for frontend components
    return res.data.map((trip: any) => ({
      ...trip,
      id: trip.id || trip._id,
    }));
  }),
  getRevenueOverview: (year?: number) => api.get('/dashboard/revenue-overview', { params: { year } }).then(res => res.data),
  getFuelData: () => api.get('/dashboard/fuel-data').then(res => res.data),
};

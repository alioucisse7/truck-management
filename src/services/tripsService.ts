
import api from './api';
import { TripData } from '@/store/tripsSlice';

export const tripsService = {
  getAll: () => api.get('/trips').then(res => {
    // Map MongoDB _id to id if needed
    return res.data.map((trip: any) => ({
      ...trip,
      id: trip.id || trip._id,
    }));
  }),
  getById: (id: string) => api.get(`/trips/${id}`).then(res => {
    // Ensure the response has an id field
    const trip = res.data;
    return {
      ...trip,
      id: trip.id || trip._id,
    };
  }),
  create: (data: Omit<TripData, 'id'>) => {
    console.log("Sending trip data to API:", data);
    
    // Ensure all required fields are present with proper types
    const tripData = {
      ...data,
      truckId: data.truckId || undefined,
      driverId: data.driverId || undefined,
      expenses: {
        fuel: Number(data.expenses.fuel) || 0,
        tolls: Number(data.expenses.tolls) || 0,
        maintenance: Number(data.expenses.maintenance) || 0,
        other: Number(data.expenses.other) || 0,
      },
      distance: Number(data.distance) || 0,
      revenue: Number(data.revenue) || 0,
      numBL: Number(data.numBL) || 0,
      equalization: Number(data.equalization) || 0,
      amountET: Number(data.amountET) || 0,
      mtqs: Number(data.mtqs) || 0,
      pricePerLiter: Number(data.pricePerLiter) || 0,
      mtqsLiters: Number(data.mtqsLiters) || 0,
      missionFees: Number(data.missionFees) || 0,
      managementFeesPercent: Number(data.managementFeesPercent) || 0,
      observ: data.observ || "",
    };
    
    console.log("Sending trip Tripdata to API:", tripData);
    
    return api.post('/trips', tripData).then(res => {
      console.log("API response:", res.data);
      const trip = res.data;
      
      // After creating a trip, update the truck status to 'on-trip' if the trip status is 'in-progress'
      if (data.status === 'in-progress' && data.truckId) {
        api.put(`/trucks/${data.truckId}`, { status: 'on-trip' })
          .catch(err => console.error("Failed to update truck status:", err));
        
        // Also update the driver status to 'on-trip'
        if (data.driverId) {
          api.put(`/drivers/${data.driverId}`, { status: 'on-trip' })
            .catch(err => console.error("Failed to update driver status:", err));
        }
      }
      
      return {
        ...trip,
        id: trip.id || trip._id,
      };
    });
  },
  update: (id: string, data: Partial<TripData>) => {
    console.log("Updating trip data:", id, data);
    
    // Ensure all fields have proper types
    const tripData = {
      ...data,
      truckId: data.truckId || undefined,
      driverId: data.driverId || undefined,
      expenses: data.expenses ? {
        fuel: Number(data.expenses.fuel) || 0,
        tolls: Number(data.expenses.tolls) || 0,
        maintenance: Number(data.expenses.maintenance) || 0,
        other: Number(data.expenses.other) || 0,
      } : undefined,
      distance: data.distance !== undefined ? Number(data.distance) : undefined,
      revenue: data.revenue !== undefined ? Number(data.revenue) : undefined,
      numBL: data.numBL !== undefined ? Number(data.numBL) : undefined,
      equalization: data.equalization !== undefined ? Number(data.equalization) : undefined,
      amountET: data.amountET !== undefined ? Number(data.amountET) : undefined,
      mtqs: data.mtqs !== undefined ? Number(data.mtqs) : undefined,
      pricePerLiter: data.pricePerLiter !== undefined ? Number(data.pricePerLiter) : undefined,
      mtqsLiters: data.mtqsLiters !== undefined ? Number(data.mtqsLiters) : undefined,
      missionFees: data.missionFees !== undefined ? Number(data.missionFees) : undefined,
      managementFeesPercent: data.managementFeesPercent !== undefined ? Number(data.managementFeesPercent) : undefined,
      observ: data.observ || undefined,
    };
    console.log("Sending trip Tripdata to API:", tripData);
    return api.put(`/trips/${id}`, tripData).then(res => {
      console.log("API update response:", res.data);
      const trip = res.data;
      
      // Update truck and driver status based on trip status change
      if (data.status === 'in-progress' && data.truckId) {
        api.put(`/trucks/${data.truckId}`, { status: 'on-trip' })
          .catch(err => console.error("Failed to update truck status:", err));
          
        // Also update the driver status to 'on-trip'
        if (data.driverId) {
          api.put(`/drivers/${data.driverId}`, { status: 'on-trip' })
            .catch(err => console.error("Failed to update driver status:", err));
        }
      } else if ((data.status === 'completed' || data.status === 'cancelled') && data.truckId) {
        api.put(`/trucks/${data.truckId}`, { status: 'available' })
          .catch(err => console.error("Failed to update truck status:", err));
          
        // Also update the driver status to 'available'
        if (data.driverId) {
          api.put(`/drivers/${data.driverId}`, { status: 'available' })
            .catch(err => console.error("Failed to update driver status:", err));
        }
      }
      
      return {
        ...trip,
        id: trip.id || trip._id,
      };
    });
  },
  delete: (id: string) => api.delete(`/trips/${id}`).then(res => res.data),
};

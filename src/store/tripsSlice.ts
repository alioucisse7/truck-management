
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tripsService } from '../services/tripsService';

export interface TripData {
  id: string;
  startLocation: string;
  destination: string;
  startDate: string;
  endDate?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  truckId: any;
  driverId: string;
  distance: number;
  cargoType: 'fuel' | 'diesel' | 'mazout';
  revenue: number;  // Changed from optional to required
  expenses: {
    fuel: number;
    tolls: number;
    maintenance: number;
    other: number;
  };
  numBL?: number;
  equalization?: number;
  amountET?: number;
  mtqs?: number;
  pricePerLiter?: number;
  mtqsLiters?: number;
  missionFees?: number;
  managementFeesPercent?: number;
  observ?: string; // Adding this to match the Trip interface
  notes?: string;
  // Add populated fields for truck and driver info
  truck?: {
    plateNumber: string;
    model: string;
  };
  driver?: {
    name: string;
  };
}

interface TripsState {
  trips: TripData[];
  selectedTrip: TripData | null;
  loading: boolean;
  error: string | null;
}

const initialState: TripsState = {
  trips: [],
  selectedTrip: null,
  loading: false,
  error: null,
};

// Helper function to transform API response to our TripData format
const transformApiTrip = (apiTrip: any): TripData => {
  return {
    id: apiTrip.id || '',
    startLocation: apiTrip.startLocation || '',
    destination: apiTrip.destination || '',
    startDate: apiTrip.startDate || '',
    endDate: apiTrip.endDate,
    // Keep status as is from API response, assuming backend uses 'planned'
    status: apiTrip.status,
    truckId: apiTrip.truckId || '',
    driverId: apiTrip.driverId || '',
    distance: apiTrip.distance || 0,
    cargoType: apiTrip.cargoType || 'fuel',
    revenue: apiTrip.revenue || 0,
    expenses: {
      fuel: apiTrip.expenses?.fuel || 0,
      tolls: apiTrip.expenses?.tolls || 0,
      maintenance: apiTrip.expenses?.maintenance || 0,
      other: apiTrip.expenses?.other || 0,
    },
    numBL: apiTrip.numBL || 0,
    equalization: apiTrip.equalization || 0,
    amountET: apiTrip.amountET || 0,
    mtqs: apiTrip.mtqs || 0,
    pricePerLiter: apiTrip.pricePerLiter || 0,
    mtqsLiters: apiTrip.mtqsLiters || 0,
    missionFees: apiTrip.missionFees || 0,
    managementFeesPercent: apiTrip.managementFeesPercent || 0,
    observ: apiTrip.observ || '',
    notes: apiTrip.notes || '',
    // Include populated truck and driver info if available
    truck: apiTrip.truckId && typeof apiTrip.truckId === 'object' ? {
      plateNumber: apiTrip.truckId.plateNumber,
      model: apiTrip.truckId.model
    } : undefined,
    driver: apiTrip.driverId && typeof apiTrip.driverId === 'object' ? {
      name: apiTrip.driverId.name
    } : undefined
  };
};

// We don't need to transform status for API anymore
const transformToApiTrip = (tripData: any) => {
  return tripData;
};

export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await tripsService.getAll();
      return apiResponse.map(transformApiTrip);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trips');
    }
  }
);

export const fetchTripById = createAsyncThunk(
  'trips/fetchTripById',
  async (id: string, { rejectWithValue }) => {
    try {
      const apiResponse = await tripsService.getById(id);
      return transformApiTrip(apiResponse);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trip');
    }
  }
);

export const createTrip = createAsyncThunk(
  'trips/createTrip',
  async (tripData: Omit<TripData, 'id'>, { rejectWithValue }) => {
    try {
      const apiTripData = transformToApiTrip(tripData);
      const apiResponse = await tripsService.create(apiTripData);
      return transformApiTrip(apiResponse);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create trip');
    }
  }
);

export const updateTrip = createAsyncThunk(
  'trips/updateTrip',
  async ({ id, ...tripData }: TripData, { rejectWithValue }) => {
    try {
      const apiTripData = transformToApiTrip(tripData);
      const apiResponse = await tripsService.update(id, apiTripData);
      return transformApiTrip(apiResponse);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update trip');
    }
  }
);

export const deleteTrip = createAsyncThunk(
  'trips/deleteTrip',
  async (id: string, { rejectWithValue }) => {
    try {
      await tripsService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete trip');
    }
  }
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setSelectedTrip: (state, action: PayloadAction<TripData | null>) => {
      state.selectedTrip = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.trips = action.payload;
        state.loading = false;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.selectedTrip = action.payload;
        state.loading = false;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload);
        state.loading = false;
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(updateTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        const index = state.trips.findIndex(trip => trip.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
        if (state.selectedTrip?.id === action.payload.id) {
          state.selectedTrip = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(deleteTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter(trip => trip.id !== action.payload);
        if (state.selectedTrip?.id === action.payload) {
          state.selectedTrip = null;
        }
        state.loading = false;
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTrip, clearError } = tripsSlice.actions;
export default tripsSlice.reducer;

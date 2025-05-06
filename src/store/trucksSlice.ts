
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { trucksService } from '../services/trucksService';

export interface TruckData {
  id: string;
  model: string;
  plateNumber: string;
  status: 'available' | 'on-trip' | 'maintenance';
  lastMaintenance?: string;
  fuelLevel?: number;
  capacity: number;  // Added capacity property
  currentLocation?: {
    lat: number;
    lng: number;
  };
  monthlyExtraCosts: {
    loadingCosts: number;
    challenge: number;
    otherManagementFees: number;
    otherFees: number;
  };
  assignedDriverId?: string; // Added assignedDriverId property

}

interface TrucksState {
  trucks: TruckData[];
  selectedTruck: TruckData | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrucksState = {
  trucks: [],
  selectedTruck: null,
  loading: false,
  error: null,
};

export const fetchTrucks = createAsyncThunk(
  'trucks/fetchTrucks',
  async (_, { rejectWithValue }) => {
    try {
      return await trucksService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trucks');
    }
  }
);

export const fetchTruckById = createAsyncThunk(
  'trucks/fetchTruckById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await trucksService.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch truck');
    }
  }
);

export const createTruck = createAsyncThunk(
  'trucks/createTruck',
  async (truckData: Omit<TruckData, 'id'>, { rejectWithValue }) => {
    try {
      return await trucksService.create(truckData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create truck');
    }
  }
);

export const updateTruck = createAsyncThunk(
  'trucks/updateTruck',
  async ({ id, ...truckData }: TruckData, { rejectWithValue }) => {
    try {
      return await trucksService.update(id, truckData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update truck');
    }
  }
);

export const deleteTruck = createAsyncThunk(
  'trucks/deleteTruck',
  async (id: string, { rejectWithValue }) => {
    try {
      await trucksService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete truck');
    }
  }
);

const trucksSlice = createSlice({
  name: 'trucks',
  initialState,
  reducers: {
    setSelectedTruck: (state, action: PayloadAction<TruckData | null>) => {
      state.selectedTruck = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrucks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrucks.fulfilled, (state, action) => {
        state.trucks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTrucks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchTruckById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTruckById.fulfilled, (state, action) => {
        state.selectedTruck = action.payload;
        state.loading = false;
      })
      .addCase(fetchTruckById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(createTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTruck.fulfilled, (state, action) => {
        state.trucks.push(action.payload);
        state.loading = false;
      })
      .addCase(createTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(updateTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTruck.fulfilled, (state, action) => {
        const index = state.trucks.findIndex(truck => truck.id === action.payload.id);
        if (index !== -1) {
          state.trucks[index] = action.payload;
        }
        if (state.selectedTruck?.id === action.payload.id) {
          state.selectedTruck = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(deleteTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTruck.fulfilled, (state, action) => {
        state.trucks = state.trucks.filter(truck => truck.id !== action.payload);
        if (state.selectedTruck?.id === action.payload) {
          state.selectedTruck = null;
        }
        state.loading = false;
      })
      .addCase(deleteTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTruck, clearError } = trucksSlice.actions;
export default trucksSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { driversService } from '../services/driversService';

export interface DriverData {
  id: string;
  name: string;
  phone: string;
  license: string;
  experience: number;
  status: 'available' | 'on-trip' | 'off-duty';
  avatar?: string;
  salary?: number;
}

interface DriversState {
  drivers: DriverData[];
  selectedDriver: DriverData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DriversState = {
  drivers: [],
  selectedDriver: null,
  loading: false,
  error: null,
};

export const fetchDrivers = createAsyncThunk(
  'drivers/fetchDrivers',
  async (_, { rejectWithValue }) => {
    try {
      return await driversService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch drivers');
    }
  }
);

export const fetchDriverById = createAsyncThunk(
  'drivers/fetchDriverById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await driversService.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch driver');
    }
  }
);

export const createDriver = createAsyncThunk(
  'drivers/createDriver',
  async (driverData: Omit<DriverData, 'id'>, { rejectWithValue }) => {
    try {
      return await driversService.create(driverData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create driver');
    }
  }
);

export const updateDriver = createAsyncThunk(
  'drivers/updateDriver',
  async ({ id, ...driverData }: DriverData, { rejectWithValue }) => {
    try {
      return await driversService.update(id, driverData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update driver');
    }
  }
);

export const deleteDriver = createAsyncThunk(
  'drivers/deleteDriver',
  async (id: string, { rejectWithValue }) => {
    try {
      await driversService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete driver');
    }
  }
);

const driversSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    setSelectedDriver: (state, action: PayloadAction<DriverData | null>) => {
      state.selectedDriver = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.drivers = action.payload;
        state.loading = false;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchDriverById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverById.fulfilled, (state, action) => {
        state.selectedDriver = action.payload;
        state.loading = false;
      })
      .addCase(fetchDriverById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(createDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.drivers.push(action.payload);
        state.loading = false;
      })
      .addCase(createDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(driver => driver.id === action.payload.id);
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
        if (state.selectedDriver?.id === action.payload.id) {
          state.selectedDriver = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(deleteDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter(driver => driver.id !== action.payload);
        if (state.selectedDriver?.id === action.payload) {
          state.selectedDriver = null;
        }
        state.loading = false;
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedDriver, clearError } = driversSlice.actions;
export default driversSlice.reducer;


import { configureStore } from '@reduxjs/toolkit';
import trucksReducer from './trucksSlice';
import driversReducer from './driversSlice';
import tripsReducer from './tripsSlice';
import authReducer from './authSlice';
import invoicesReducer from './invoicesSlice';

export const store = configureStore({
  reducer: {
    trucks: trucksReducer,
    drivers: driversReducer,
    trips: tripsReducer,
    auth: authReducer,
    invoices: invoicesReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredActions: ['payload'],
        ignoredPaths: ['some.path.to.ignore'],
      },
    }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

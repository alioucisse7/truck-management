
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invoiceService } from '@/services/invoiceService';

export interface InvoiceItem {
  tripId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  _id?: string,
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientAddress?: string;
  clientEmail?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  notes?: string;
  createdAt: string;
}

interface InvoicesState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
}

const initialState: InvoicesState = {
  invoices: [],
  selectedInvoice: null,
  loading: false,
  error: null
};

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      return await invoiceService.getInvoices();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await invoiceService.getInvoiceById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const generateInvoiceFromTrips = createAsyncThunk(
  'invoices/generateFromTrips',
  async (params: { startDate: string; endDate: string; clientName: string }, { rejectWithValue }) => {
    try {
      return await invoiceService.generateFromTrips(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData: any, { rejectWithValue }) => {
    try {
      return await invoiceService.createInvoice(invoiceData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, ...invoiceData }: { id: string; [key: string]: any }, { rejectWithValue }) => {
    try {
      return await invoiceService.updateInvoice(id, invoiceData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id: string, { rejectWithValue }) => {
    try {
      await invoiceService.deleteInvoice(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
    clearInvoiceErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.selectedInvoice = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.map(invoice => 
          invoice.id === action.payload.id ? action.payload : invoice
        );
        state.selectedInvoice = action.payload;
        state.loading = false;
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(invoice => invoice.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearSelectedInvoice, clearInvoiceErrors } = invoicesSlice.actions;
export default invoicesSlice.reducer;

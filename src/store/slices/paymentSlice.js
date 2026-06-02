import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as mediosPagoApi from '../../api/mediosPagoApi';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchMediosPago = createAsyncThunk(
  'payment/fetchMediosPago',
  async (_, { rejectWithValue }) => {
    try {
      return await mediosPagoApi.getMediosPago();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const crearMedioPago = createAsyncThunk(
  'payment/crearMedioPago',
  async (payload, { rejectWithValue }) => {
    try {
      return await mediosPagoApi.crearMedioPago(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const eliminarMedioPago = createAsyncThunk(
  'payment/eliminarMedioPago',
  async (id, { rejectWithValue }) => {
    try {
      await mediosPagoApi.eliminarMedioPago(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  methods: [], // { id, tipo, descripcion, montoGarantia, verificado, moneda }
  status: 'idle',
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediosPago.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchMediosPago.fulfilled, (state, action) => {
        state.status = 'idle';
        state.methods = action.payload;
      })
      .addCase(fetchMediosPago.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; });

    builder
      .addCase(crearMedioPago.fulfilled, (state, action) => {
        state.methods.push(action.payload);
      })
      .addCase(crearMedioPago.rejected, (state, action) => { state.error = action.payload; });

    builder
      .addCase(eliminarMedioPago.fulfilled, (state, action) => {
        state.methods = state.methods.filter(m => m.id !== action.payload);
      })
      .addCase(eliminarMedioPago.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default paymentSlice.reducer;


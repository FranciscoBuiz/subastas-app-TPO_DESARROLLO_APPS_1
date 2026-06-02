import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as articulosApi from '../../api/articulosApi';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchMisSolicitudes = createAsyncThunk(
  'seller/fetchMisSolicitudes',
  async (_, { rejectWithValue }) => {
    try {
      return await articulosApi.getMisSolicitudes();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const crearNuevaSolicitud = createAsyncThunk(
  'seller/crearNuevaSolicitud',
  async (formData, { rejectWithValue }) => {
    try {
      return await articulosApi.crearSolicitud(formData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  myConsignments: [], // { id, productoId, duenioId, estado, motivoRechazo, descripcion }
  status: 'idle',
  error: null,
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMisSolicitudes.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchMisSolicitudes.fulfilled, (state, action) => {
        state.status = 'idle';
        state.myConsignments = action.payload;
      })
      .addCase(fetchMisSolicitudes.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; });

    builder
      .addCase(crearNuevaSolicitud.pending, (state) => { state.status = 'loading'; })
      .addCase(crearNuevaSolicitud.fulfilled, (state, action) => {
        state.status = 'idle';
        state.myConsignments.push(action.payload);
      })
      .addCase(crearNuevaSolicitud.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; });
  },
});

export default sellerSlice.reducer;

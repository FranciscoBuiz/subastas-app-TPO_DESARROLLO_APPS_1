import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as subastasApi from '../../api/subastasApi';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchSubastas = createAsyncThunk(
  'auctions/fetchSubastas',
  async (estado = 'abierta', { rejectWithValue }) => {
    try {
      return await subastasApi.getSubastas(estado);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCatalogo = createAsyncThunk(
  'auctions/fetchCatalogo',
  async (subastaId, { rejectWithValue }) => {
    try {
      const items = await subastasApi.getCatalogo(subastaId);
      return { subastaId, items };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const ingresarSubasta = createAsyncThunk(
  'auctions/ingresarSubasta',
  async (subastaId, { rejectWithValue }) => {
    try {
      const data = await subastasApi.ingresarSubasta(subastaId);
      return { subastaId, ...data }; // { subastaId, asistenteId, numeroPostor }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  activeAuctions: [],
  selectedAuction: null,
  catalogoItems: [],
  asistenteId: null,
  status: 'idle',
  error: null,
};

const auctionsSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    selectAuction: (state, action) => {
      state.selectedAuction = state.activeAuctions.find(a => a.id === action.payload)
        ?? state.activeAuctions.find(a => String(a.id) === String(action.payload))
        ?? null;
      state.catalogoItems = [];
      state.asistenteId = null;
    },
    setSelectedAuction: (state, action) => {
      state.selectedAuction = action.payload;
    },
    clearSelectedAuction: (state) => {
      state.selectedAuction = null;
      state.catalogoItems = [];
      state.asistenteId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubastas.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchSubastas.fulfilled, (state, action) => {
        state.status = 'idle';
        state.activeAuctions = action.payload.map(s => ({
          id: s.id,
          title: `Subasta ${s.categoria?.toUpperCase()} — ${s.ubicacion ?? ''}`,
          fecha: s.fecha,
          hora: s.hora,
          estado: s.estado,
          category: s.categoria?.toUpperCase(),
          ubicacion: s.ubicacion,
          moneda: s.moneda,
          currency: s.moneda,
          endTime: `${s.fecha} ${s.hora}`,
          image: null,
          items: [],
        }));
      })
      .addCase(fetchSubastas.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; });

    builder
      .addCase(fetchCatalogo.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCatalogo.fulfilled, (state, action) => {
        state.status = 'idle';
        state.catalogoItems = action.payload.items;
        if (state.selectedAuction) {
          state.selectedAuction.items = action.payload.items.map(item => ({
            id: item.id,
            description: item.descripcionCatalogo || 'Sin descripción',
            basePrice: item.precioBase,
            currentOwner: item.duenio,
            images: [],
          }));
        }
      })
      .addCase(fetchCatalogo.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; });

    builder
      .addCase(ingresarSubasta.fulfilled, (state, action) => {
        state.asistenteId = action.payload.asistenteId;
      })
      .addCase(ingresarSubasta.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectAuction, setSelectedAuction, clearSelectedAuction } = auctionsSlice.actions;
export default auctionsSlice.reducer;


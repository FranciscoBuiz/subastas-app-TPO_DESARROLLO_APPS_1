import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as pujasApi from '../../api/pujasApi';
import * as subastasApi from '../../api/subastasApi';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchEstadoActual = createAsyncThunk(
  'liveAuction/fetchEstadoActual',
  async (subastaId, { rejectWithValue }) => {
    try {
      return await subastasApi.getEstadoActual(subastaId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const placeBid = createAsyncThunk(
  'liveAuction/placeBid',
  async ({ itemId, importe }, { rejectWithValue }) => {
    try {
      const data = await pujasApi.pujar(itemId, importe);
      return { importe, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  currentItem: null,
  currentHighestBid: 0,
  highestBidder: null,
  status: 'idle', // 'idle' | 'loading' | 'bidding' | 'success' | 'error'
  errorMessage: '',
  subastaTerminada: false,
};

const liveAuctionSlice = createSlice({
  name: 'liveAuction',
  initialState,
  reducers: {
    receiveNewBid: (state, action) => {
      state.currentHighestBid = action.payload.amount;
      state.highestBidder = action.payload.bidder;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.errorMessage = '';
    },
    resetRoom: () => initialState,
    subastaTerminada: (state) => {
      state.subastaTerminada = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstadoActual.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchEstadoActual.fulfilled, (state, action) => {
        state.status = 'idle';
        // El servidor devuelve { itemActual, mejorOferta (number|null), pujaMinima, pujaMaxima }
        const { itemActual, mejorOferta } = action.payload;
        if (itemActual) {
          state.currentItem = {
            id:          itemActual.id,
            description: itemActual.descripcionCatalogo || 'Sin descripción',
            basePrice:   itemActual.precioBase ?? 0,
          };
        }
        if (mejorOferta !== null && mejorOferta !== undefined) {
          state.currentHighestBid = mejorOferta;
          // Solo sobreescribir el postor si no era "Vos" (evita flickering al refrescar)
          if (state.highestBidder !== 'Vos') {
            state.highestBidder = 'Otro postor';
          }
        } else if (itemActual) {
          state.currentHighestBid = itemActual.precioBase ?? 0;
          state.highestBidder = null;
        }
      })
      .addCase(fetchEstadoActual.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload;
      });

    builder
      .addCase(placeBid.pending, (state) => {
        state.status = 'bidding';
        state.errorMessage = '';
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.status = 'success';
        state.currentHighestBid = action.payload.importe;
        state.highestBidder = 'Vos';
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload || action.error.message;
      });
  },
});

export const { receiveNewBid, resetStatus, resetRoom, subastaTerminada } = liveAuctionSlice.actions;
export default liveAuctionSlice.reducer;


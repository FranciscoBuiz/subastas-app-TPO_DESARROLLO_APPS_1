import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simular el backend confirmando una puja
export const placeBid = createAsyncThunk(
  'liveAuction/placeBid',
  async (bidAmount, { getState, rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const state = getState().liveAuction;
        // Validaciones del lado del servidor (simuladas)
        const minBid = state.currentHighestBid + (state.currentItem.basePrice * 0.01);
        const maxBid = state.currentHighestBid + (state.currentItem.basePrice * 0.20);
        
        if (bidAmount < minBid) {
          rejectWithValue('La puja debe ser al menos 1% mayor al valor base sobre la oferta actual.');
        } else if (bidAmount > maxBid && state.userCategory !== 'ORO' && state.userCategory !== 'PLATINO') {
          rejectWithValue('La puja no puede superar el 20% del valor base.');
        } else {
          resolve(bidAmount);
        }
      }, 1000); // Simulamos 1 segundo de delay de red
    });
  }
);

const initialState = {
  // Datos mock de la sala activa
  currentItem: {
    id: 'i1',
    description: 'BMW M3 Competition',
    basePrice: 85000,
  },
  currentHighestBid: 90000,
  highestBidder: 'Otro Usuario',
  userCategory: 'COMUN', // Mockeamos la categoría del usuario actual para validar las reglas
  status: 'idle', // 'idle' | 'bidding' | 'success' | 'error'
  errorMessage: '',
};

const liveAuctionSlice = createSlice({
  name: 'liveAuction',
  initialState,
  reducers: {
    // Para simular que otro usuario pujó mediante websocket
    receiveNewBid: (state, action) => {
      state.currentHighestBid = action.payload.amount;
      state.highestBidder = action.payload.bidder;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.errorMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeBid.pending, (state) => {
        state.status = 'bidding';
        state.errorMessage = '';
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.status = 'success';
        state.currentHighestBid = action.payload;
        state.highestBidder = 'Tú';
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload || action.error.message;
      });
  },
});

export const { receiveNewBid, resetStatus } = liveAuctionSlice.actions;

export default liveAuctionSlice.reducer;

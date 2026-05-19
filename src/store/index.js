import { configureStore } from '@reduxjs/toolkit';
import auctionsReducer from './slices/auctionsSlice';
import liveAuctionReducer from './slices/liveAuctionSlice';
import authReducer from './slices/authSlice';
import sellerReducer from './slices/sellerSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    auctions: auctionsReducer,
    liveAuction: liveAuctionReducer,
    seller: sellerReducer,
    payment: paymentReducer,
  },
});

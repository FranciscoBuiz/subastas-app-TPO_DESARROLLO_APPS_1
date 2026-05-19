import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  methods: [], // { id, type, last4, bank, isInternational, limitAssigned }
  totalLimit: 0, // Límite de puja total disponible (0 si no hay métodos válidos)
};

const calculateTotalLimit = (methods) => {
  return methods.reduce((acc, curr) => acc + (curr.limitAssigned || 0), 0);
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    addPaymentMethod: (state, action) => {
      const newMethod = {
        ...action.payload,
        id: `pm_${Date.now()}`,
        // Simulamos que el backend asigna un límite según el tipo de método
        limitAssigned: action.payload.isInternational ? 50000 : 5000,
      };
      
      state.methods.push(newMethod);
      state.totalLimit = calculateTotalLimit(state.methods);
    },
    removePaymentMethod: (state, action) => {
      state.methods = state.methods.filter(m => m.id !== action.payload);
      state.totalLimit = calculateTotalLimit(state.methods);
    }
  },
});

export const { addPaymentMethod, removePaymentMethod } = paymentSlice.actions;
export default paymentSlice.reducer;

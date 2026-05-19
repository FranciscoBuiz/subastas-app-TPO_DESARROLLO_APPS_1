import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null, // { name, email, category, paymentMethodsVerified }
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    simulateApproval: (state) => {
      // Útil para mockear el registro y loguear automáticamente después del Step 2
      state.isAuthenticated = true;
      state.user = {
        name: 'Usuario Nuevo',
        email: 'test@subastas.com',
        category: 'COMUN',
        paymentMethodsVerified: false,
      };
    }
  },
});

export const { loginSuccess, logout, simulateApproval } = authSlice.actions;
export default authSlice.reducer;

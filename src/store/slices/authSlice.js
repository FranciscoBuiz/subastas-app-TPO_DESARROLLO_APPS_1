import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../../api/authApi';
import { TOKEN_KEY } from '../../api/client';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, clave }, { rejectWithValue }) => {
    try {
      const data = await authApi.login(email, clave);
      // data = { token, usuario: { id, nombre, email, categoria, admitido } }
      return data.usuario;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const preRegistroThunk = createAsyncThunk(
  'auth/preRegistro',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await authApi.preRegistro(formData);
      return data; // { mensaje, clienteId }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registroFinalThunk = createAsyncThunk(
  'auth/registroFinal',
  async ({ clienteId, email, clave }, { rejectWithValue }) => {
    try {
      await authApi.registroFinal(clienteId, email, clave);
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

// Restaurar sesión desde AsyncStorage al arrancar la app
export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return !!token; // si hay token, se considera autenticado hasta que expire
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  isAuthenticated: false,
  user: null, // { id, nombre, email, categoria, admitido }
  pendingClienteId: null, // guardado tras el pre-registro
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Mantener para compatibilidad con código legado que aún la llame
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isAuthenticated = true;
        state.user = {
          id:        action.payload.id,
          name:      action.payload.nombre,
          email:     action.payload.email,
          category:  action.payload.categoria?.toUpperCase(),
          admitido:  action.payload.admitido,
          paymentMethodsVerified: false,
        };
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });

    // preRegistro
    builder
      .addCase(preRegistroThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(preRegistroThunk.fulfilled, (state, action) => {
        state.status = 'idle';
        state.pendingClienteId = action.payload.clienteId;
      })
      .addCase(preRegistroThunk.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });

    // registroFinal
    builder
      .addCase(registroFinalThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registroFinalThunk.fulfilled, (state) => {
        state.status = 'idle';
        state.pendingClienteId = null;
      })
      .addCase(registroFinalThunk.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });

    // logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });

    // restoreSession
    builder.addCase(restoreSession.fulfilled, (state, action) => {
      if (!action.payload) {
        state.isAuthenticated = false;
        state.user = null;
      }
    });
  },
});

export const { loginSuccess, logout, clearError } = authSlice.actions;
export default authSlice.reducer;


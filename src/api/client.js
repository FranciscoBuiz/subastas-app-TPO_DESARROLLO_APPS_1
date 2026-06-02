import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cambiar por la IP/dominio real del servidor en desarrollo
// Si usas Expo Go en tu teléfono, reemplazá 'localhost' por la IP de tu PC en la red local
export const API_BASE_URL = 'https://asignia.app/tpo-desarrollo/api';

export const TOKEN_KEY = '@subastapp_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Adjuntar el token JWT en cada request automáticamente
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Normalizar errores del servidor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensaje =
      error.response?.data?.mensaje ||
      error.response?.data?.message ||
      error.message ||
      'Error de conexión';
    return Promise.reject(new Error(mensaje));
  },
);

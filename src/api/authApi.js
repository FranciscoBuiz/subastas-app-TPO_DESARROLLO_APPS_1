import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, TOKEN_KEY } from './client';

export async function login(email, clave) {
  const { data } = await apiClient.post('/auth/login', { email, clave });
  await AsyncStorage.setItem(TOKEN_KEY, data.token);
  return data; // { token, usuario }
}

export async function preRegistro(formData) {
  const { data } = await apiClient.post('/auth/pre-registro', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { mensaje, clienteId }
}

export async function registroFinal(clienteId, email, clave) {
  const { data } = await apiClient.post('/auth/registro-final', {
    clienteId,
    email,
    clave,
  });
  return data; // { mensaje }
}

export async function logout() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

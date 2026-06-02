import { apiClient } from './client';

export async function getMe() {
  const { data } = await apiClient.get('/usuarios/me');
  return data; // { id, nombre, email, categoria, admitido }
}

export async function getMisSubastas() {
  const { data } = await apiClient.get('/usuarios/me/subastas');
  return data;
}

export async function getMisMultas() {
  const { data } = await apiClient.get('/usuarios/me/multas');
  return data;
}

export async function getMetricasMe() {
  const { data } = await apiClient.get('/metricas/me');
  return data; // { usuarioId, cantidadSubastasAsistidas, cantidadSubastasGanadas, importeTotalOfertado, importeTotalPagado }
}

export async function getMetricas(usuarioId) {
  const { data } = await apiClient.get(`/metricas/usuario/${usuarioId}`);
  return data;
}

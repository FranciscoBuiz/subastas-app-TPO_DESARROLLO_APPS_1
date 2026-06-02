import { apiClient } from './client';

export async function getNotificaciones() {
  const { data } = await apiClient.get('/notificaciones');
  return data;
}

export async function marcarLeida(id) {
  const { data } = await apiClient.patch(`/notificaciones/${id}/leer`);
  return data;
}

export async function marcarTodasLeidas() {
  const { data } = await apiClient.patch('/notificaciones/leer-todas');
  return data;
}

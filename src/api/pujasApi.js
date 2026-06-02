import { apiClient } from './client';

export async function getHistorialPujas(itemId) {
  const { data } = await apiClient.get(`/items/${itemId}/pujas`);
  return data; // array de { id, asistenteId, itemId, importe, ganador, fechaHora }
}

// asistenteId ya no se envía al backend; el servidor lo deriva del JWT
export async function pujar(itemId, importe) {
  const { data } = await apiClient.post(`/items/${itemId}/pujas`, { importe });
  return data;
}

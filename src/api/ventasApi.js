import { apiClient } from './client';

export async function getMisVentas() {
  const { data } = await apiClient.get('/ventas/mis-ventas');
  return data;
}

export async function pagar(ventaId, medioPagoId) {
  const { data } = await apiClient.post(`/ventas/${ventaId}/pagar`, { medioPagoId });
  return data;
}

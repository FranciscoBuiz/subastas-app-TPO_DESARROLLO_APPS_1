import { apiClient } from './client';

export async function getMediosPago() {
  const { data } = await apiClient.get('/medios-pago');
  return data; // array de { id, tipo, descripcion, montoGarantia, verificado, moneda }
}

export async function crearMedioPago(payload) {
  // payload: { tipo, descripcion, moneda, montoGarantia? }
  const { data } = await apiClient.post('/medios-pago', payload);
  return data;
}

export async function actualizarMedioPago(id, payload) {
  const { data } = await apiClient.patch(`/medios-pago/${id}`, payload);
  return data;
}

export async function eliminarMedioPago(id) {
  await apiClient.delete(`/medios-pago/${id}`);
}

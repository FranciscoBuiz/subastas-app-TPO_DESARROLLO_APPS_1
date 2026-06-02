import { apiClient } from './client';

export async function getMisPiezas() {
  const { data } = await apiClient.get('/duenios/me/piezas');
  return data;
}

export async function getUbicacionSeguro(productoId) {
  const { data } = await apiClient.get(`/duenios/me/piezas/${productoId}/ubicacion-seguro`);
  return data;
}

export async function getCuentas() {
  const { data } = await apiClient.get('/duenios/me/cuentas');
  return data;
}

export async function crearCuenta(payload) {
  // payload: { descripcion, esExterior, moneda }
  const { data } = await apiClient.post('/duenios/me/cuentas', payload);
  return data;
}

export async function eliminarCuenta(cuentaId) {
  await apiClient.delete(`/duenios/me/cuentas/${cuentaId}`);
}

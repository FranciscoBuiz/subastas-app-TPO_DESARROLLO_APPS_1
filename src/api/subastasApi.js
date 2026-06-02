import { apiClient } from './client';

export async function getSubastas(estado = 'abierta') {
  const { data } = await apiClient.get('/subastas', { params: { estado } });
  return data; // array de { id, fecha, hora, estado, categoria, ubicacion, moneda }
}

export async function getSubasta(id) {
  const { data } = await apiClient.get(`/subastas/${id}`);
  return data;
}

export async function getCatalogo(subastaId) {
  const { data } = await apiClient.get(`/subastas/${subastaId}/catalogo`);
  return data; // array de { id, numeroPieza, descripcionCatalogo, duenio, precioBase }
}

export async function getEstadoActual(subastaId) {
  const { data } = await apiClient.get(`/subastas/${subastaId}/estado-actual`);
  return data; // { itemActual, mejorOferta (number|null), pujaMinima, pujaMaxima, categoriaSubasta, moneda }
}

export async function ingresarSubasta(subastaId) {
  const { data } = await apiClient.post(`/subastas/${subastaId}/ingresar`);
  return data; // { asistenteId, numeroPostor }
}

export async function salirSubasta(subastaId) {
  const { data } = await apiClient.post(`/subastas/${subastaId}/salir`);
  return data;
}

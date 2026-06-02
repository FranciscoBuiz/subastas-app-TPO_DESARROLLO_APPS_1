import { apiClient } from './client';

export async function getMisSolicitudes() {
  const { data } = await apiClient.get('/articulos/mis-solicitudes');
  return data; // array de { id, productoId, duenioId, estado, motivoRechazo, descripcion }
}

export async function getSolicitud(id) {
  const { data } = await apiClient.get(`/articulos/solicitudes/${id}`);
  return data;
}

export async function crearSolicitud(formData) {
  // formData es un FormData con fotos y campos del artículo
  const { data } = await apiClient.post('/articulos/solicitudes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

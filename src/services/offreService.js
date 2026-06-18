import apiClient from './apiClient';

export async function rechercherOffres(filtres = {}) {
  const params = {};

  if (filtres.type) params.type = filtres.type;
  if (filtres.domaineId) params.domaineId = filtres.domaineId;
  if (filtres.lieu) params.lieu = filtres.lieu;
  if (filtres.motsCles) params.motsCles = filtres.motsCles;

  const response = await apiClient.get('/Offres', { params });
  return response.data;
}

export async function getOffre(id) {
  const response = await apiClient.get(`/Offres/${id}`);
  return response.data;
}

export async function getStatutOffre(id) {
  const response = await apiClient.get(`/Offres/${id}/statut`);
  return response.data;
}

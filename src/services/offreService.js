import apiClient from './apiClient';

// US-07 : Lister toutes les offres
export async function getOffres(type, statut) {
  const params = {};
  if (type) params.type = type;
  if (statut) params.statut = statut;
  const { data } = await apiClient.get('/offres', { params });
  return data;
}

// Detail d'une offre
export async function getOffreById(idOffre) {
  const { data } = await apiClient.get(`/offres/${idOffre}`);
  return data;
}

// US-07 : Creer une offre d'emploi
export async function creerOffreEmploi(payload) {
  const { data } = await apiClient.post('/offres/emploi', payload);
  return data;
}

// US-07 : Creer une offre de stage
export async function creerOffreStage(payload) {
  const { data } = await apiClient.post('/offres/stage', payload);
  return data;
}

// US-08 : Modifier une offre d'emploi
export async function modifierOffreEmploi(idOffre, payload) {
  const { data } = await apiClient.put(`/offres/emploi/${idOffre}`, payload);
  return data;
}

// US-09 : Modifier une offre de stage
export async function modifierOffreStage(idOffre, payload) {
  const { data } = await apiClient.put(`/offres/stage/${idOffre}`, payload);
  return data;
}

// Supprimer une offre
export async function supprimerOffre(idOffre) {
  await apiClient.delete(`/offres/${idOffre}`);
}

export async function rechercherOffres(filtres = {}) {
  const params = { statut: 'Active' };
  if (filtres.type) params.type = filtres.type;
  if (filtres.idDomaine) params.idDomaine = filtres.idDomaine;
  if (filtres.lieu) params.lieu = filtres.lieu;
  if (filtres.motsCles) params.motsCles = filtres.motsCles;
  const { data } = await apiClient.get('/offres', { params });
  return data;
}

export async function getStatutOffre(idOffre) {
  const offre = await getOffreById(idOffre);
  return { idOffre, statut: offre.statut };
}

import apiClient from './apiClient';

// US-10 : candidatures recues pour une offre
export async function getCandidaturesOffre(idOffre) {
  const { data } = await apiClient.get(`/offres/${idOffre}/candidatures`);
  return data;
}

// Detail d'une candidature
export async function getCandidatureDetail(idCandidature) {
  const { data } = await apiClient.get(`/candidatures/${idCandidature}`);
  return data;
}

// US-10 : changer le statut
export async function changerStatutCandidature(idCandidature, statut) {
  await apiClient.patch(`/candidatures/${idCandidature}/statut`, { statut });
}

// US-12 : URL de telechargement d'un document
export function getUrlTelechargementDocument(idDocument) {
  const base = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7266/api';
  return `${base}/candidatures/documents/${idDocument}/telecharger`;
}

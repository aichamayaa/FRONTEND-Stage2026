import apiClient from './apiClient';

// US-10 : candidatures recues pour une offre
export async function getCandidaturesOffre(idOffre) {
  const { data } = await apiClient.get(`/offres/${idOffre}/candidatures`);
  return data;
}

// Detail d'une candidature
export async function getCandidatureDetail(idCandidature) {
  const { data } = await apiClient.get(`/candidatures/${idCandidature}/detail`);
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

export async function postuler(payload) {
  const { data } = await apiClient.post('/candidatures', payload);
  return data;
}

export async function uploadCv(fichier) {
  const formData = new FormData();
  formData.append('fichier', fichier);
  const base = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7266/api';
  const token = localStorage.getItem('token');
  const response = await fetch(`${base}/candidatures/cv`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  if (!response.ok) {
    throw new Error('Upload du CV échoué.');
  }
  const data = await response.json();
  return data.url;
}

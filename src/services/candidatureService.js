import apiClient from './apiClient';

export async function uploadCv(fichier) {
  const formData = new FormData();
  formData.append('fichier', fichier);
  const response = await apiClient.post('/Candidatures/cv', formData, {
    headers: { 'Content-Type': undefined }
  });
  return response.data.url;
}

export async function postuler(payload) {
  const response = await apiClient.post('/Candidatures', payload);
  return response.data;
}

export async function getCandidaturesParOffre(offreId) {
  const response = await apiClient.get(`/Candidatures/offre/${offreId}`);
  return response.data;
}

export async function changerStatutCandidature(id, statut) {
  await apiClient.put(`/Candidatures/${id}/statut`, { statut });
}

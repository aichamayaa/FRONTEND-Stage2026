import apiClient from './apiClient';

// US-10 : candidatures recues pour une offre
export async function getCandidaturesOffre(idOffre) {
  const { data } = await apiClient.get(`/offres/${idOffre}/candidatures`);
  return data;
}

// Candidatures de l'etudiant connecte
export async function getMesCandidatures() {
  const { data } = await apiClient.get('/candidatures/mes');
  return data;
}

// US-13 : mettre a jour le message de sa candidature
export async function mettreAJourCandidature(idCandidature, message) {
  await apiClient.put(`/candidatures/${idCandidature}/mes`, { message });
}

// US-13 : retirer sa candidature
export async function retirerCandidature(idCandidature) {
  await apiClient.post(`/candidatures/${idCandidature}/retirer`);
}

// US-11 : candidatures pour un domaine (employeur)
export async function getCandidaturesParDomaine(idDomaine) {
  const { data } = await apiClient.get(`/candidatures/domaine/${idDomaine}`);
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

// US-16 : confirmer un emploi
export async function confirmerEmploi(idCandidature, message) {
    await apiClient.post(`/candidatures/${idCandidature}/confirmer-emploi`, { message });
}

// US-12 : URL de telechargement d'un document
export function getUrlTelechargementDocument(idDocument) {
  const base = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7266/api';
  return `${base}/candidatures/documents/${idDocument}/telecharger`;
}

export async function telechargerDocument(idDocument, nomFichier) {
  const base = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7266/api';
  const token = localStorage.getItem('token');
  const response = await fetch(`${base}/candidatures/documents/${idDocument}/telecharger`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!response.ok) {
    throw new Error('Telechargement echoue.');
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomFichier ?? 'document';
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(url);
}

export async function postuler(payload) {
  const { data } = await apiClient.post('/candidatures', payload);
  return data;
}

export async function uploadDocument(fichier) {
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

import apiClient from './apiClient';

export async function envoyerRecommandation(
  idEtudiant,
  idEmployeurDestinataire,
  commentaire,
  lettre
) {
  const formData = new FormData();

  formData.append('idEtudiant', idEtudiant);
  formData.append('idEmployeurDestinataire', idEmployeurDestinataire);

  if (commentaire) {
    formData.append('commentaire', commentaire);
  }

  if (lettre) {
    formData.append('lettre', lettre);
  }

  const { data } = await apiClient.post('/recommandations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return data;
}

export async function getRecommandationsEtudiant(idEtudiant) {
  const { data } = await apiClient.get(`/recommandations/etudiant/${idEtudiant}`);
  return data;
}

export async function getRecommandationsRecues() {
  const { data } = await apiClient.get('/recommandations/recues');
  return data;
}
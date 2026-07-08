import apiClient from './apiClient';

// US-21 : offres de stage directes reçues par l'étudiant
export async function getMesOffresRecues() {
  const { data } = await apiClient.get('/offres-stage-directes/recues');
  return data;
}

// US-21 : accepter ou refuser une offre de stage directe
export async function repondreOffreDirecte(idOffreDirecte, accepte, reponse) {
  await apiClient.post(`/offres-stage-directes/${idOffreDirecte}/repondre`, { accepte, reponse });
}

import apiClient from './apiClient';

// US-19 : formuler une demande de stage
export async function creerDemandeStage(payload) {
  const { data } = await apiClient.post('/demandes-stage', payload);
  return data;
}

// Demandes de stage de l'etudiant connecte
export async function getMesDemandesStage() {
  const { data } = await apiClient.get('/demandes-stage/mes');
  return data;
}

// Reception employeur : demandes de stage d'un domaine
export async function getDemandesParDomaine(idDomaine) {
  const { data } = await apiClient.get(`/demandes-stage/domaine/${idDomaine}`);
  return data;
}

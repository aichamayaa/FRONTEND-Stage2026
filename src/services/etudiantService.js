import apiClient from './apiClient';

export async function getEtudiants() {
  const response = await apiClient.get('/etudiants');
  return response.data;
}

export async function getEtudiantById(idEtudiant) {
  const response = await apiClient.get(`/etudiants/${idEtudiant}`);
  return response.data;
}
import apiClient from './apiClient';

export const suiviService = {
  getEtudiantsSuivis: async () => {
    const response = await apiClient.get('/demarches-suivi/etudiants');
    return response.data;
  },

  getEtudiantDetail: async (idEtudiant) => {
    const response = await apiClient.get(`/demarches-suivi/etudiants/${idEtudiant}`);
    return response.data;
  },

  ajouterDemarche: async (idEtudiant, data) => {
    const response = await apiClient.post(
      `/demarches-suivi/etudiants/${idEtudiant}/demarches`,
      data
    );
    return response.data;
  },

  getMesDemarches: async () => {
    const response = await apiClient.get('/demarches-suivi/mes-demarches');
    return response.data;
  }
};
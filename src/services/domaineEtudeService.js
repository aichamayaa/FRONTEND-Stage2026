import apiClient from './apiClient';

export async function getDomainesEtudes() {
  const response = await apiClient.get('/domaines-etudes');
  return response.data;
}

export async function getDomaineEtudeById(id) {
  const response = await apiClient.get(`/domaines-etudes/${id}`);
  return response.data;
}

export async function createDomaineEtude(domaineEtude) {
  // Le backend attend maintenant :
  // { nom, code, actif, colleges: [{ idCollege, accepteStagiaires, actif }] }
  const response = await apiClient.post('/domaines-etudes', domaineEtude);
  return response.data;
}

export async function updateDomaineEtude(id, domaineEtude) {
  // Modifie seulement le domaine global : nom, code, actif.
  await apiClient.put(`/domaines-etudes/${id}`, domaineEtude);
}

export async function deleteDomaineEtude(id) {
  // SuperAdmin : desactive le domaine global.
  // Admin : desactive le domaine seulement pour son college.
  await apiClient.delete(`/domaines-etudes/${id}`);
}

export async function ajouterCollegeAuDomaine(idDomaine, idCollege, payload) {
  // SuperAdmin : ajoute un college a un domaine existant.
  await apiClient.post(`/domaines-etudes/${idDomaine}/colleges/${idCollege}`, payload);
}

export async function modifierLienCollegeDomaine(idDomaine, idCollege, payload) {
  // Modifie accepteStagiaires / actif pour un college donne.
  await apiClient.put(`/domaines-etudes/${idDomaine}/colleges/${idCollege}`, payload);
}
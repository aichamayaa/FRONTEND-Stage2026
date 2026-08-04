import apiClient from './apiClient';

export async function getDomainesEtudes(includeInactive = false) {
  const response = await apiClient.get('/domaines-etudes', {
    params: { includeInactive }
  });

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
  // SuperAdmin : désactive le domaine global.
  // Admin : désactive le domaine seulement pour son collège.
  await apiClient.delete(`/domaines-etudes/${id}`);
}

export async function ajouterCollegeAuDomaine(idDomaine, idCollege, payload) {
  // SuperAdmin : ajoute un collège à un domaine existant.
  await apiClient.post(`/domaines-etudes/${idDomaine}/colleges/${idCollege}`, payload);
}

export async function modifierLienCollegeDomaine(idDomaine, idCollege, payload) {
  // Modifie accepteStagiaires / actif pour un collège donné.
  await apiClient.put(`/domaines-etudes/${idDomaine}/colleges/${idCollege}`, payload);
}
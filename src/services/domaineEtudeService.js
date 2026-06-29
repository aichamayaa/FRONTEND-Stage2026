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
    const response = await apiClient.post('/domaines-etudes', domaineEtude);
    return response.data;
}

export async function updateDomaineEtude(id, domaineEtude) {
    await apiClient.put(`/domaines-etudes/${id}`, domaineEtude);
}

export async function deleteDomaineEtude(id) {
    await apiClient.delete(`/domaines-etudes/${id}`);
}

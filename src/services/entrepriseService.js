import apiClient from './apiClient';

export async function getMonProfilEntreprise() {
    const response = await apiClient.get('/entreprises/mon-profil');
    return response.data;
}

export async function createMonProfilEntreprise(entreprise) {
    const response = await apiClient.post('/entreprises/mon-profil', entreprise);
    return response.data;
}

export async function updateMonProfilEntreprise(entreprise) {
    await apiClient.put('/entreprises/mon-profil', entreprise);
}

import apiClient from './apiClient';

// US-15 : offres de stage directes envoyées par l'employeur
export async function getMesOffresDirectesEnvoyees() {
    const { data } = await apiClient.get('/offres-stage-directes/mes');
    return data;
}

// US-15 : detail d'une offre de stage directe
export async function getOffreStageDirecte(idOffreDirecte) {
    const { data } = await apiClient.get(`/offres-stage-directes/${idOffreDirecte}`);
    return data;
}

// US-15 : créer une offre de stage directe
export async function creerOffreStageDirecte(payload) {
    const { data } = await apiClient.post('/offres-stage-directes', payload);
    return data;
}


// US-21 : offres de stage directes recues par l'etudiant
export async function getMesOffresRecues() {
    const { data } = await apiClient.get('/offres-stage-directes/recues');
    return data;
}

// US-21 : accepter ou refuser une offre de stage directe
export async function repondreOffreDirecte(idOffreDirecte, accepte, reponse) {
    await apiClient.post(`/offres-stage-directes/${idOffreDirecte}/repondre`, {
        accepte,
        reponse,
    });
}

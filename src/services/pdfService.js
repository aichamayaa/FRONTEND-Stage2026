import apiClient from './apiClient';

export async function getPdfOffreBlob(idOffre) {
  const { data } = await apiClient.get(`/pdf/offre/${idOffre}`, {
    responseType: 'blob'
  });

  return data;
}

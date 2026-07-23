import apiClient from './apiClient';

export async function getPdfOffreBlob(idOffre) {
  const { data } = await apiClient.get(`/pdf/offres/${idOffre}`, {
    responseType: 'blob'
  });

  return data;
}

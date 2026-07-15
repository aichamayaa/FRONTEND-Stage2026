import apiClient from './apiClient';

export async function getColleges() {
  const { data } = await apiClient.get('/colleges');
  return data;
}

export async function getCollegeById(idCollege) {
  const { data } = await apiClient.get(`/colleges/${idCollege}`);
  return data;
}

export async function createCollege(payload) {
  const { data } = await apiClient.post('/colleges', payload);
  return data;
}

export async function updateCollege(idCollege, payload) {
  const { data } = await apiClient.put(`/colleges/${idCollege}`, payload);
  return data;
}

export async function deleteCollege(idCollege) {
  await apiClient.delete(`/colleges/${idCollege}`);
}

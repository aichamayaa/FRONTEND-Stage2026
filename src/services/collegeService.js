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

    const response = await apiClient.get('/colleges');
    return response.data;
}

export async function getCollegeById(id) {
    const response = await apiClient.get(`/colleges/${id}`);
    return response.data;
}

export async function createCollege(college) {
    const response = await apiClient.post('/colleges', college);
    return response.data;
}

export async function updateCollege(id, college) {
    await apiClient.put(`/colleges/${id}`, college);
}

export async function deleteCollege(id) {
    await apiClient.delete(`/colleges/${id}`);

}

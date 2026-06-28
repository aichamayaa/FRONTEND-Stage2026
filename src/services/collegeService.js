import apiClient from './apiClient';

export async function getColleges() {
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

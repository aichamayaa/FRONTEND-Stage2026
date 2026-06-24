import apiClient from './apiClient';

export async function getRoles() {
  const response = await apiClient.get('/Roles');
  return response.data;
}
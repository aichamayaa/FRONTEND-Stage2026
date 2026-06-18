import apiClient from './apiClient';

export async function getUsers() {
  const response = await apiClient.get('/Users');
  return response.data;
}

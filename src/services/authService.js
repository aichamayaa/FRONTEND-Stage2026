import apiClient from './apiClient';

export async function login(credentials) {
  const response = await apiClient.post('/Auth/login', credentials);
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get('/Auth/me');
  return response.data;
}

export async function logout() {
  await apiClient.post('/Auth/logout');
}

import apiClient from './apiClient';

export async function getUsers() {
  const response = await apiClient.get('/Users');
  return response.data;
}

export async function getUserById(idUtilisateur) {
  const response = await apiClient.get(`/Users/${idUtilisateur}`);
  return response.data;
}

export async function createUser(user) {
  const response = await apiClient.post('/Users', user);
  return response.data;
}

export async function updateUser(idUtilisateur, user) {
  await apiClient.put(`/Users/${idUtilisateur}`, user);
}

export async function activerUser(idUtilisateur) {
  await apiClient.patch(`/Users/${idUtilisateur}/activer`);
}

export async function desactiverUser(idUtilisateur) {
  await apiClient.patch(`/Users/${idUtilisateur}/desactiver`);
}
import apiClient from './apiClient';

// US-20 : notifications de l'utilisateur connecté
export async function getMesNotifications() {
  const { data } = await apiClient.get('/notifications/mes');
  return data;
}

export async function compterNonLues() {
  const { data } = await apiClient.get('/notifications/non-lues');
  return data.nonLues;
}

export async function marquerLue(idNotification) {
  await apiClient.post(`/notifications/${idNotification}/lue`);
}

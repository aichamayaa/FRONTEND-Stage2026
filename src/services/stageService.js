import apiClient from './apiClient';

export const stageService = {
  getStages: async () => {
    const response = await apiClient.get('/stages');
    return response.data;
  },

  getStageById: async (idStage) => {
    const response = await apiClient.get(`/stages/${idStage}`);
    return response.data;
  },

  creerStage: async (data) => {
    const response = await apiClient.post('/stages', data);
    return response.data;
  },

  confirmerStage: async (idStage, data) => {
    const response = await apiClient.post(`/stages/${idStage}/confirmations`, data);
    return response.data;
  }
};
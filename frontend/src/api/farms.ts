import { apiFetch, API_BASE_URL } from './client';
import { Farm, EnvData, PlantedCropData } from '../types';

export const farmApi = {
  // Get all farms
  getAllFarms: () => apiFetch<Farm[]>('/api/farms/'),

  // Get single farm
  getFarm: (id: string) => apiFetch<Farm>(`/api/farms/${id}`),

  // Update environmental sensor data
  updateEnv: (id: string, data: EnvData) => 
    apiFetch<Farm>(`/api/farms/${id}/env`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Update farm name & area
  updateInfo: (id: string, name: string, areaSqM: number) =>
    apiFetch<Farm>(`/api/farms/${id}/info`, {
      method: 'PUT',
      body: JSON.stringify({ name, areaSqM })
    }),

  // Plant crop
  plantCrop: (id: string, crop: { cropId: string; cropName: string; yieldAmount?: number; cycleDays?: number }) =>
    apiFetch<Farm>(`/api/farms/${id}/plant`, {
      method: 'POST',
      body: JSON.stringify(crop)
    }),

  // Cancel planting
  cancelPlanting: (id: string) =>
    apiFetch<Farm>(`/api/farms/${id}/cancel-planting`, {
      method: 'POST'
    }),

  // Upload CSV and Train AI model
  trainAI: async (farmId: string, file: File, type: 'reco' | 'yield'): Promise<Farm> => {
    const formData = new FormData();
    formData.append('model_type', type);
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/api/farms/${farmId}/train-ai`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      throw new Error('Training AI model failed');
    }
    return res.json();
  }
};

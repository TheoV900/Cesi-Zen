// frontend/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ex: "http://localhost:3001"
});

// Envoi automatique du token JWT si présent
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Fonction fetcher pour SWR
export const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default api;

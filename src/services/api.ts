import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

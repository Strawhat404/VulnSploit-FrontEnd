import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 — try refresh, else logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/token/refresh/`,
            { refresh: refreshToken }
          );
          setTokens(res.data.access, refreshToken);
          original.headers.Authorization = `Bearer ${res.data.access}`;
          return api(original);
        } catch {
          logout();
        }
      } else {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;

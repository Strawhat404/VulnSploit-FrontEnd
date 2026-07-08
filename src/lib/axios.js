import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Single source of truth for the API base URL.
// In dev:  pulled from .env          → VITE_API_URL=http://localhost:8001
// In prod: pulled from .env.production → VITE_API_URL=https://your-api.onrender.com
// Vite bakes this value in at build time — it is NOT a runtime variable.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to every request
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

// Handle 401 — try token refresh once, then logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (refreshToken) {
        try {
          // Use BASE_URL (not import.meta.env inline) so it's consistent
          const res = await axios.post(
            `${BASE_URL}/api/token/refresh/`,
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
export { BASE_URL };

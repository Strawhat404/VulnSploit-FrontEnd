import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load .env file for the current mode (development / production)
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_URL || 'http://localhost:8001';

  return {
    plugins: [react()],

    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        // In dev, proxy /api/* calls to the backend so the browser
        // never needs to deal with CORS during local development.
        // In production the built app calls the backend URL directly.
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/media': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor:  ['react', 'react-dom'],
            router:  ['react-router-dom'],
            query:   ['@tanstack/react-query'],
            motion:  ['framer-motion'],
            charts:  ['recharts'],
          },
        },
      },
    },
  };
});

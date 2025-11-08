import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ensures correct asset paths in production
  build: {
    outDir: 'dist', // output folder for production build
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend in dev
        changeOrigin: true,
      },
    },
  },
});

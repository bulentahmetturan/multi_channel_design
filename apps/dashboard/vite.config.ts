import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Content Operations UI dev server. Proxies /api to the channel-content-os
// Worker (wrangler dev, default port 8787) -- this app owns presentation
// and human interaction only, never canonical candidate/channel truth.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5183,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
});

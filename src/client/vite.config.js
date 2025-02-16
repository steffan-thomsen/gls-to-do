import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  root: path.resolve(__dirname, ''), // Root is the Vue source folder
  build: {
    outDir: path.resolve(__dirname, '../wwwroot'), // Output to .NET wwwroot
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Correct input path for index.html
    },
  },
  server: {
    port: 3000, // Vue app running on port 3000
    proxy: {
      '/api': 'http://localhost:8080', // Proxy /api calls to .NET backend on port 8080
    },
  },
});

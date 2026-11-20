import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps the build deployable on GitHub Pages / static hosts
export default defineConfig({
  plugins: [react()],
  base: './',
});

import { defineConfig } from '@tanstack/start/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    preset: 'cloudflare-pages',
  },
  vite: {
    plugins: [
      tsconfigPaths(),
    ],
  },
});
import { defineConfig } from '@tanstack/react-start/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    // O preset 'cloudflare-pages' configura automaticamente o runtime para o Cloudflare
    preset: 'cloudflare-pages',
  },
  vite: {
    plugins: [
      tsconfigPaths(),
    ],
  },
});
import { defineConfig } from '@tanstack/react-start/config';
import { cloudflareAdapter } from '@tanstack/start-adapter-cloudflare';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    preset: 'cloudflare-pages',
    adapter: cloudflareAdapter,
  },
  vite: {
    plugins: [
      tsconfigPaths(),
    ],
  },
});
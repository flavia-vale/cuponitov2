import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import cloudflare from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      autoCodeSplitting: false,
      quoteStyle: 'single',
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    // Ativando o plugin da Cloudflare para integração com o runtime
    cloudflare(),
  ],
  server: {
    fs: {
      allow: ['.', './node_modules', './src'],
    },
    // Força o redirecionamento de 404 para o index.html no dev server
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/admin\/?.*/, to: '/index.html' },
        { from: /^\/desconto\/?.*/, to: '/index.html' },
        { from: /^\/blog\/?.*/, to: '/index.html' },
      ],
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Garante que o build seja compatível com SPA tradicional se o SSR falhar
    ssr: false,
  }
});
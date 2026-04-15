import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

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
  ],
  server: {
    fs: {
      allow: ['.', './node_modules', './src'],
    },
    port: 32111,
    strictPort: true,
    // Habilita o fallback para SPA para evitar 404 em F5/acesso direto
    historyApiFallback: true,
  },
  optimizeDeps: {
    // Evita erros de pre-bundling com react-start em modo SPA
    exclude: ['@tanstack/react-start'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
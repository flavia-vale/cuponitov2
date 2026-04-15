import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
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
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        desconto: resolve(__dirname, 'desconto/index.html'),
        'desconto-amazon': resolve(__dirname, 'desconto/amazon/index.html'),
        'desconto-shopee': resolve(__dirname, 'desconto/shopee/index.html'),
        'desconto-mercado-livre': resolve(__dirname, 'desconto/mercado-livre/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
  }
});
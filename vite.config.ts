import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
// @ts-ignore
import PrerenderSpy from 'vite-plugin-prerender';

const Renderer = PrerenderSpy.PuppeteerRenderer;

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    PrerenderSpy({
      // Caminho para a pasta de saída do build
      staticDir: path.join(__dirname, 'dist'),
      // Rotas que queremos gerar arquivos index.html físicos
      routes: [
        '/', 
        '/blog', 
        '/admin', 
        '/desconto/cupom-desconto-amazon',
        '/desconto/cupom-desconto-shopee',
        '/desconto/cupom-desconto-mercado-livre'
      ],
      renderer: new Renderer({
        renderAfterDocumentEvent: 'render-event',
        headless: true
      }),
    }),
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
    copyPublicDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
  }
});
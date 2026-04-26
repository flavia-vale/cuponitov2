import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@tiptap') || id.includes('prosemirror')) return 'vendor-tiptap';
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) return 'vendor-charts';
          if (id.includes('@radix-ui')) return 'vendor-radix';
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('/zod/')) return 'vendor-forms';
          if (id.includes('lucide-react')) return 'vendor-lucide';
          if (id.includes('@supabase')) return 'vendor-supabase';
          if (id.includes('@tanstack/react-query') || id.includes('@tanstack/react-router') || id.includes('@tanstack/router')) return 'vendor-tanstack';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('scheduler')) return 'vendor-react';
        },
      },
    },
  },
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});

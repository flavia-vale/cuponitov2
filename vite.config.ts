import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import sitemap from 'vite-plugin-sitemap';

// Configurações do Supabase
const SUPABASE_URL = "https://jyvmrkykukialdbcebei.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dm1ya3lrdWtpYWxkYmNlYmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTAwOTgsImV4cCI6MjA5MTY4NjA5OH0.F7cTOv6Z5cEEPWzQT9gSb2drsZksdY6Xc7erAyXB_K8";

/**
 * Busca as lojas do banco de dados e já as formata com prioridade 0.7
 */
async function getSitemapRoutes() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/stores?select=slug&active=eq.true&limit=1000`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    
    // Mapeia as lojas para o formato de objeto que o plugin de sitemap exige
    const storeRoutes = data.map((s: { slug: string }) => ({
      url: `/desconto/${s.slug}`,
      changefreq: 'weekly',
      priority: 0.7
    }));

    console.log(`\n[Sitemap Build] ${storeRoutes.length} lojas carregadas com prioridade 0.7`);
    return storeRoutes;
  } catch (e) {
    console.error("Erro ao buscar lojas para o sitemap:", e);
    return [];
  }
}

export default defineConfig(async () => {
  const dynamicStoreRoutes = await getSitemapRoutes();

  return {
    base: '/',
    plugins: [
      TanStackRouterVite({
        routesDirectory: './src/routes',
        generatedRouteTree: './src/routeTree.gen.ts',
      }),
      react(),
      tailwindcss(),
      tsconfigPaths(),
      sitemap({
        hostname: 'https://cuponito.com.br',
        exclude: ['/404', '/admin', '/admin/login'],
        readable: true,
        generateRobotsTxt: true,
        // Injetamos todas as rotas (estáticas + dinâmicas) com suas configurações explícitas
        routes: [
          { url: '/', changefreq: 'daily', priority: 1.0 },
          { url: '/lojas', changefreq: 'weekly', priority: 0.8 },
          { url: '/cupons', changefreq: 'weekly', priority: 0.8 },
          { url: '/blog', changefreq: 'monthly', priority: 0.5 },
          ...dynamicStoreRoutes // Aqui entram as lojas com prioridade 0.7
        ],
        robots: [{
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/404']
        }]
      }),
    ],
  };
});
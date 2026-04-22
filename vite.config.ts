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
 * Busca apenas os slugs (strings) das lojas
 */
async function getStoreSlugs() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/stores?select=slug&active=eq.true&limit=1000`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const slugs = data.map((s: { slug: string }) => `/desconto/${s.slug}`);
    
    console.log(`\n[Sitemap] ${slugs.length} lojas encontradas.`);
    return slugs;
  } catch (e) {
    console.error("Erro ao buscar lojas:", e);
    return [];
  }
}

export default defineConfig(async () => {
  const storeSlugs = await getStoreSlugs();

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
        // Voltamos para array de STRINGS simples
        routes: [
          '/lojas',
          '/cupons',
          '/blog',
        ],
        dynamicRoutes: storeSlugs,
        // Agora aplicamos a prioridade baseada no texto da URL final
        modifyRouteData: (data) => {
          const url = data.url;

          if (url.endsWith('.com.br/')) {
            data.priority = 1.0;
            data.changefreq = 'daily';
          } 
          else if (url.includes('/lojas') || url.includes('/cupons')) {
            data.priority = 0.8;
            data.changefreq = 'weekly';
          } 
          else if (url.includes('/desconto/')) {
            data.priority = 0.7;
            data.changefreq = 'weekly';
          } 
          else if (url.includes('/blog')) {
            data.priority = 0.5;
            data.changefreq = 'monthly';
          }

          return data;
        },
        robots: [{
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/404']
        }]
      }),
    ],
  };
});
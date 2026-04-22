import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import sitemap from 'vite-plugin-sitemap';

// Configurações do Supabase para busca em tempo de build
const SUPABASE_URL = "https://jyvmrkykukialdbcebei.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dm1ya3lrdWtpYWxkYmNlYmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTAwOTgsImV4cCI6MjA5MTY4NjA5OH0.F7cTOv6Z5cEEPWzQT9gSb2drsZksdY6Xc7erAyXB_K8";

/**
 * Busca os slugs das lojas diretamente da API do Supabase
 */
async function getStoreSlugs() {
  try {
    // Buscamos todas as lojas ativas com limite de 1000 para garantir que pegamos tudo
    const response = await fetch(`${SUPABASE_URL}/rest/v1/stores?select=slug&active=eq.true&limit=1000`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const slugs = data.map((s: { slug: string }) => `/desconto/${s.slug}`);
    
    console.log(`\n[Sitemap Build] Total de lojas encontradas: ${slugs.length}`);
    return slugs;
  } catch (e) {
    console.error("Erro ao buscar slugs para o sitemap:", e);
    return [];
  }
}

export default defineConfig(async () => {
  const storeRoutes = await getStoreSlugs();

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
        // Rotas estáticas base
        routes: [
          '/',
          '/lojas',
          '/cupons',
          '/blog',
        ],
        dynamicRoutes: storeRoutes,
        modifyRouteData: (data) => {
          // Extrai o caminho da URL (ex: /desconto/loja) independente do domínio
          const urlObj = new URL(data.url);
          const path = urlObj.pathname;

          // Regras de Prioridade e Frequência
          if (path === '/' || path === '/index.html') {
            data.priority = 1.0;
            data.changefreq = 'daily';
          } 
          else if (path === '/lojas' || path === '/cupons') {
            data.priority = 0.8;
            data.changefreq = 'weekly';
          } 
          else if (path.includes('/desconto/')) {
            data.priority = 0.7;
            data.changefreq = 'weekly';
          } 
          else if (path === '/blog' || path.includes('/blog')) {
            data.priority = 0.5;
            data.changefreq = 'monthly';
          }
          
          return data;
        },
        generateRobotsTxt: true,
        robots: [{
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/404']
        }]
      }),
    ],
  };
});
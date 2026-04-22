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
    // Buscamos todas as lojas ativas sem limite restritivo (limit=1000)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/stores?select=slug&active=eq.true&limit=1000`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const slugs = data.map((s: { slug: string }) => `/desconto/${s.slug}`);
    
    // 1. Mostra quantas lojas estão sendo passadas para o plugin
    console.log(`\n[Sitemap Build] Total de lojas encontradas: ${slugs.length}`);
    if (slugs.length < 20) {
      console.warn(`[Sitemap Build] ALERTA: Menos de 20 lojas encontradas (${slugs.length}). Verifique a fonte de dados.`);
    }
    
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
        // 4. Rotas estáticas base
        routes: [
          '/',
          '/lojas',
          '/cupons',
          '/blog',
        ],
        dynamicRoutes: storeRoutes,
        modifyRouteData: (data) => {
          const url = data.url;
          
          // Configuração de Prioridades e Frequências
          if (url === '/') {
            data.priority = 1.0;
            data.changefreq = 'daily';
          } else if (url === '/lojas' || url === '/cupons') {
            // 4. Prioridade 0.8 e changefreq weekly
            data.priority = 0.8;
            data.changefreq = 'weekly';
          } else if (url.startsWith('/desconto/')) {
            // 2. Prioridade 0.7 para lojas
            // 3. Changefreq weekly para lojas
            data.priority = 0.7;
            data.changefreq = 'weekly';
          } else if (url === '/blog') {
            // 4. Prioridade 0.5 e changefreq monthly
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
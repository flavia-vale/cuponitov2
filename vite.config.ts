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
    const response = await fetch(`${SUPABASE_URL}/rest/v1/stores?select=slug&active=eq.true`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((s: { slug: string }) => `/desconto/${s.slug}`);
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
        // Removemos a duplicata da home e a página de erro
        exclude: ['/404', '/admin', '/admin/login'],
        // Rotas base do site
        routes: [
          '/',
          '/lojas',
          '/cupons',
          '/blog',
        ],
        // Adicionamos as rotas dinâmicas das lojas buscadas no banco
        dynamicRoutes: [
          ...storeRoutes
        ],
        // Configurações de robôs e sitemap
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
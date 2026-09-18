// Vercel Edge Middleware — entrega HTML real (status 200 + <h1>/<article>/JSON-LD)
// nas rotas com parâmetro do SPA.
//
// Por que existe: as rotas `/blog/:slug`, `/desconto/:slug` e `/categoria/:slug`
// não têm arquivo no build, então o fallback da SPA respondia 404 e o corpo era
// só a casca com o <title> — Google e Bing descartam 404 antes de renderizar
// JavaScript, e os robôs da OpenAI, Anthropic e Perplexity não executam
// JavaScript nenhum. Aqui o conteúdo do Supabase é montado no servidor.
//
// O MESMO HTML vai para todo mundo (navegador, bingbot, OAI-SearchBot,
// PerplexityBot): não é dynamic rendering nem cloaking. O React monta com
// `createRoot().render()`, que substitui o conteúdo de `#root`, então o corpo
// prerenderizado não conflita com a hidratação.

import {
  fetchAuthorName,
  fetchCategory,
  fetchCategoryCoupons,
  fetchFeaturedPosts,
  fetchFeaturedStores,
  fetchPost,
  fetchStore,
  fetchStoreByLegacySlug,
  fetchStoreCoupons,
} from './prerender/data';
import { injectIntoShell, SITE_URL } from './prerender/html';
import {
  renderAboutPage,
  renderBlogPost,
  renderCategoryPage,
  renderStorePage,
  type RenderedPage,
} from './prerender/render';

export const config = {
  matcher: [
    '/blog/:slug',
    '/desconto/:slug',
    '/categoria/:slug',
    '/quem-somos',
    '/store/:path*',
    '/stores-2/:path*',
  ],
};

const SHELL_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
  'X-Prerendered': 'true',
};

let cachedShell: string | null = null;

/** Casca do SPA (com os caminhos dos assets do build) buscada da própria origem. */
async function loadShell(requestUrl: string): Promise<string | null> {
  if (cachedShell) return cachedShell;
  try {
    const response = await fetch(new URL('/index.html', requestUrl).toString(), {
      headers: { 'X-Prerender-Shell': '1' },
    });
    if (!response.ok) return null;
    const html = await response.text();
    if (!html.includes('<div id="root">')) return null;
    cachedShell = html;
    return html;
  } catch {
    return null;
  }
}

function respond(shell: string, page: RenderedPage, status = 200): Response {
  return new Response(injectIntoShell(shell, page.head, page.body), {
    status,
    headers: SHELL_HEADERS,
  });
}

function movedPermanently(location: string): Response {
  return new Response(null, {
    status: 301,
    headers: { Location: location, 'Cache-Control': 'public, max-age=86400' },
  });
}

async function renderRoute(pathname: string): Promise<RenderedPage | null> {
  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    const slug = decodeURIComponent(blogMatch[1]);
    const [post, stores, posts] = await Promise.all([
      fetchPost(slug),
      fetchFeaturedStores(3),
      fetchFeaturedPosts(4),
    ]);
    if (!post) return null;
    const authorName = await fetchAuthorName(post.author_id);
    return renderBlogPost(post, authorName, { stores, posts });
  }

  const storeMatch = pathname.match(/^\/desconto\/([^/]+)\/?$/);
  if (storeMatch) {
    const slug = decodeURIComponent(storeMatch[1]);
    const store = await fetchStore(slug);
    if (!store) return null;
    const [coupons, stores, posts] = await Promise.all([
      fetchStoreCoupons(store),
      fetchFeaturedStores(8),
      fetchFeaturedPosts(3),
    ]);
    return renderStorePage(store, coupons, { stores, posts });
  }

  const categoryMatch = pathname.match(/^\/categoria\/([^/]+)\/?$/);
  if (categoryMatch) {
    const slug = decodeURIComponent(categoryMatch[1]);
    const category = await fetchCategory(slug);
    if (!category) return null;
    const [coupons, stores, posts] = await Promise.all([
      fetchCategoryCoupons(category.name),
      fetchFeaturedStores(3),
      fetchFeaturedPosts(3),
    ]);
    return renderCategoryPage(category, coupons, { stores, posts });
  }

  if (/^\/quem-somos\/?$/.test(pathname)) {
    const [stores, posts] = await Promise.all([fetchFeaturedStores(3), fetchFeaturedPosts(3)]);
    return renderAboutPage({ stores, posts });
  }

  return null;
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  const { pathname } = url;

  // 301 das URLs do site antigo (WordPress) — é o que o Bing ainda tem indexado.
  if (/^\/stores-2\/?/.test(pathname)) {
    return movedPermanently(`${SITE_URL}/lojas`);
  }

  const legacyStore = pathname.match(/^\/store\/([^/]+)\/?$/);
  if (legacyStore) {
    const store = await fetchStoreByLegacySlug(decodeURIComponent(legacyStore[1]));
    return movedPermanently(store ? `${SITE_URL}/desconto/${store.slug}` : `${SITE_URL}/lojas`);
  }
  if (/^\/store\/?$/.test(pathname)) {
    return movedPermanently(`${SITE_URL}/lojas`);
  }

  try {
    const page = await renderRoute(pathname);
    const shell = await loadShell(request.url);
    // Sem casca não há como injetar: deixa o SPA responder como antes.
    if (!shell) return undefined;

    if (!page) {
      // Slug inexistente: 404 de verdade, não soft 404. A SPA ainda monta por
      // cima e mostra a tela de "não encontrado" para quem está no navegador.
      return new Response(shell, { status: 404, headers: SHELL_HEADERS });
    }

    return respond(shell, page);
  } catch {
    return undefined;
  }
}

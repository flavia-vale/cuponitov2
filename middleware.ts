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
  fetchAllStores,
  fetchAuthor,
  fetchAuthorByName,
  fetchCategories,
  fetchCategory,
  fetchCategoryCoupons,
  fetchFeaturedPosts,
  fetchFeaturedStores,
  fetchGroupOffers,
  fetchGroupPage,
  fetchGroupPages,
  fetchGroupSettings,
  recordGroupJoinClick,
  fetchPost,
  fetchStore,
  fetchPublishedPosts,
  fetchRenamedPostSlug,
  fetchStoreByLegacySlug,
  fetchStoreCoupons,
  fetchTopCoupons,
} from './prerender/data';
import { injectIntoShell, SITE_URL } from './prerender/html';
import {
  GROUP_HUB_SLUG,
  groupInfoForPage,
  groupPageForNiche,
  groupPageForStore,
  groupPagePath,
  isOffersPage,
  nicheGroupSlug,
  pagePath,
  resolveJoinUrl,
} from './src/lib/whatsappGroup';
import {
  buildJoinTrackingHref,
  isLikelyBot,
  JOIN_TRACKING_PATH,
  parseJoinTrackingQuery,
  sanitizeToken,
} from './src/lib/groupJoinTracking';
import { ACHADINHOS_FEED_PATH, ACHADINHOS_PATH, filterOffersByTerms, parseOfferTerms } from './src/lib/groupOfferFeed';
import { FLAVIA_VALE_NAME } from './src/lib/authors';
import {
  renderAboutPage,
  renderAchadinhosPage,
  renderBlogListPage,
  renderBlogPost,
  renderCategoryPage,
  renderCouponsPage,
  renderGroupPage,
  renderHomePage,
  renderInstitutionalPage,
  renderOffersPage,
  renderStorePage,
  renderStoresPage,
  type InstitutionalPage,
  type RenderedPage,
} from './prerender/render';

export const config = {
  matcher: [
    '/',
    '/cupons',
    '/lojas',
    '/blog',
    '/blog/:slug',
    '/desconto/:slug',
    '/categoria/:slug',
    '/grupo-whatsapp',
    '/grupo-whatsapp/:slug',
    '/ofertas/:slug',
    '/quem-somos',
    '/como-funciona',
    '/perguntas-frequentes',
    '/fale-conosco',
    '/termos-de-uso',
    '/entrar',
    '/achadinhos-hoje',
    '/achadinhos-hoje.json',
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

function temporarilyUnavailable(): Response {
  return new Response('Serviço temporariamente indisponível.', {
    status: 503,
    headers: { 'Retry-After': '120', 'Cache-Control': 'no-store' },
  });
}

/** `decodeURIComponent` lança em `%` malformado — e erro no middleware vira 500. */
function safeDecode(segment: string): string | null {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

async function findRenamedPost(pathname: string): Promise<string | null> {
  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!blogMatch) return null;
  const slug = safeDecode(blogMatch[1]);
  return slug ? fetchRenamedPostSlug(slug) : null;
}

const INSTITUTIONAL_ROUTES: Record<string, InstitutionalPage> = {
  '/como-funciona': 'howItWorks',
  '/perguntas-frequentes': 'faq',
  '/fale-conosco': 'contact',
  '/termos-de-uso': 'terms',
};

async function renderRoute(pathname: string): Promise<RenderedPage | null> {
  if (pathname === ACHADINHOS_PATH) {
    const [groupSettings, stores, posts] = await Promise.all([
      fetchGroupSettings(),
      fetchFeaturedStores(6),
      fetchFeaturedPosts(3),
    ]);
    const offers = await fetchGroupOffers(resolveJoinUrl(null, groupSettings.globalJoinUrl));
    return renderAchadinhosPage(
      {
        offers,
        info: groupSettings.info,
        joinUrl: buildJoinTrackingHref({ origin: 'html_achadinhos', pagePath: ACHADINHOS_PATH }),
      },
      { stores, posts }
    );
  }

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    const slug = decodeURIComponent(blogMatch[1]);
    const [post, stores, posts] = await Promise.all([
      fetchPost(slug),
      fetchFeaturedStores(3),
      fetchFeaturedPosts(4),
    ]);
    if (!post) return null;
    const author = await fetchAuthor(post.author_id);
    return renderBlogPost(post, author, { stores, posts });
  }

  const storeMatch = pathname.match(/^\/desconto\/([^/]+)\/?$/);
  if (storeMatch) {
    const slug = decodeURIComponent(storeMatch[1]);
    const store = await fetchStore(slug);
    if (!store) return null;
    const [coupons, stores, posts, groupPages, groupSettings, categories] = await Promise.all([
      fetchStoreCoupons(store),
      fetchFeaturedStores(8),
      fetchFeaturedPosts(3),
      fetchGroupPages(),
      fetchGroupSettings(),
      fetchCategories(),
    ]);
    const groupPage = groupPageForStore(groupPages, store.slug, nicheGroupSlug(coupons, categories));
    return renderStorePage(store, coupons, { stores, posts }, {
      page: groupPage,
      // O botão passa pelo /entrar (mede a página); o destino é resolvido lá, com a mesma regra.
      joinUrl: buildJoinTrackingHref({ origin: 'html_store', groupSlug: groupPage?.slug, pagePath: `/desconto/${store.slug}` }),
      info: groupInfoForPage(groupSettings.info, groupPage),
    });
  }

  const groupMatch = pathname.match(/^\/grupo-whatsapp(?:\/([^/]+))?\/?$/);
  if (groupMatch) {
    const slug = groupMatch[1] ? safeDecode(groupMatch[1]) : GROUP_HUB_SLUG;
    // /grupo-whatsapp/principal duplicaria /grupo-whatsapp: só existe sem sufixo.
    if (!slug || (groupMatch[1] && slug === GROUP_HUB_SLUG)) return null;
    const page = await fetchGroupPage(slug);
    // Supabase fora: lança para o middleware devolver a SPA em vez de um 404 falso.
    if (page === undefined) throw new Error('whatsapp_group_pages indisponível');
    // Página de ofertas só existe em /ofertas/<slug>: aqui seria conteúdo duplicado.
    if (!page || isOffersPage(page)) return null;
    const [groupSettings, siblings, stores, posts, author] = await Promise.all([
      fetchGroupSettings(),
      fetchGroupPages(),
      fetchFeaturedStores(6),
      fetchFeaturedPosts(3),
      fetchAuthorByName(FLAVIA_VALE_NAME),
    ]);
    // Página de nicho mostra as ofertas do grupo dela (o link dela decide o feed).
    const offers = await fetchGroupOffers(resolveJoinUrl(page, groupSettings.globalJoinUrl));
    return renderGroupPage(
      page,
      {
        info: groupInfoForPage(groupSettings.info, page),
        joinUrl: buildJoinTrackingHref({ origin: 'html_group_page', groupSlug: page.slug, pagePath: groupPagePath(page.slug) }),
        siblings,
        author,
        offers,
      },
      { stores, posts }
    );
  }

  const offersMatch = pathname.match(/^\/ofertas\/([^/]+)\/?$/);
  if (offersMatch) {
    const slug = safeDecode(offersMatch[1]);
    if (!slug) return null;
    const page = await fetchGroupPage(slug);
    // Supabase fora: lança para o middleware devolver a SPA em vez de um 404 falso.
    if (page === undefined) throw new Error('whatsapp_group_pages indisponível');
    if (!page || !isOffersPage(page)) return null;
    const [groupSettings, siblings, stores, posts, author] = await Promise.all([
      fetchGroupSettings(),
      fetchGroupPages(),
      fetchFeaturedStores(6),
      fetchFeaturedPosts(3),
      fetchAuthorByName(FLAVIA_VALE_NAME),
    ]);
    const offers = filterOffersByTerms(
      await fetchGroupOffers(resolveJoinUrl(page, groupSettings.globalJoinUrl)),
      parseOfferTerms(page.offer_terms)
    );
    return renderOffersPage(
      page,
      {
        info: groupInfoForPage(groupSettings.info, page),
        joinUrl: buildJoinTrackingHref({ origin: 'html_offers_page', groupSlug: page.slug, pagePath: pagePath(page) }),
        siblings,
        author,
        offers,
      },
      { stores, posts }
    );
  }

  const categoryMatch = pathname.match(/^\/categoria\/([^/]+)\/?$/);
  if (categoryMatch) {
    const slug = decodeURIComponent(categoryMatch[1]);
    const category = await fetchCategory(slug);
    if (!category) return null;
    const [coupons, stores, posts, groupPages, groupSettings] = await Promise.all([
      fetchCategoryCoupons(category.name),
      fetchFeaturedStores(3),
      fetchFeaturedPosts(3),
      fetchGroupPages(),
      fetchGroupSettings(),
    ]);
    const groupPage = groupPageForNiche(groupPages, category.group_slug);
    return renderCategoryPage(category, coupons, { stores, posts }, {
      page: groupPage,
      joinUrl: buildJoinTrackingHref({ origin: 'html_category', groupSlug: groupPage?.slug, pagePath: `/categoria/${category.slug}` }),
      info: groupInfoForPage(groupSettings.info, groupPage),
    });
  }

  if (/^\/$/.test(pathname)) {
    const [coupons, stores, categories, posts] = await Promise.all([
      fetchTopCoupons(20),
      fetchAllStores(12),
      fetchCategories(12),
      fetchPublishedPosts(5),
    ]);
    return renderHomePage({ coupons, stores, categories, posts });
  }

  if (/^\/cupons\/?$/.test(pathname)) {
    const [coupons, categories, stores, posts] = await Promise.all([
      fetchTopCoupons(60),
      fetchCategories(),
      fetchFeaturedStores(6),
      fetchFeaturedPosts(3),
    ]);
    return renderCouponsPage(coupons, categories, { stores, posts });
  }

  if (/^\/lojas\/?$/.test(pathname)) {
    const [stores, posts] = await Promise.all([fetchAllStores(), fetchFeaturedPosts(3)]);
    return renderStoresPage(stores, { stores: [], posts });
  }

  if (/^\/blog\/?$/.test(pathname)) {
    const [posts, stores] = await Promise.all([fetchPublishedPosts(), fetchFeaturedStores(3)]);
    return renderBlogListPage(posts, { stores, posts: [] });
  }

  if (/^\/quem-somos\/?$/.test(pathname)) {
    const [stores, posts] = await Promise.all([fetchFeaturedStores(3), fetchFeaturedPosts(3)]);
    return renderAboutPage({ stores, posts });
  }

  const institutional = INSTITUTIONAL_ROUTES[pathname.replace(/\/$/, '')];
  if (institutional) {
    const [stores, posts] = await Promise.all([fetchFeaturedStores(3), fetchFeaturedPosts(3)]);
    return renderInstitutionalPage(institutional, { stores, posts });
  }

  return null;
}

interface MiddlewareContext {
  waitUntil?(promise: Promise<unknown>): void;
}

/**
 * /entrar: grava de onde veio o clique no botão do grupo e redireciona para o
 * link do grupo. O destino sai da página do grupo (`g`) ou do link global,
 * nunca da URL. Supabase fora do ar → link padrão: o botão nunca quebra.
 */
async function handleJoinClick(url: URL, request: Request, context?: MiddlewareContext): Promise<Response> {
  const row = parseJoinTrackingQuery(url.searchParams, request.headers.get('user-agent'));
  const [page, settings] = await Promise.all([
    row.group_slug ? fetchGroupPage(row.group_slug) : Promise.resolve(null),
    fetchGroupSettings(),
  ]);
  const destination = resolveJoinUrl(page ?? null, settings.globalJoinUrl);

  if (!isLikelyBot(request.headers.get('user-agent'))) {
    const recording = recordGroupJoinClick(row);
    if (context?.waitUntil) context.waitUntil(recording);
    else await recording;
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export default async function middleware(request: Request, context?: MiddlewareContext): Promise<Response | undefined> {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === JOIN_TRACKING_PATH) {
    return handleJoinClick(url, request, context);
  }

  // Ofertas do grupo para o React (mesma origem: o feed do Link Inteligente não libera CORS).
  if (pathname === ACHADINHOS_FEED_PATH) {
    // `g` = página do grupo (nicho): o link dela decide o feed. Nunca uma URL vinda de fora.
    const groupSlug = sanitizeToken(url.searchParams.get('g'));
    const [{ globalJoinUrl }, page] = await Promise.all([
      fetchGroupSettings(),
      groupSlug ? fetchGroupPage(groupSlug) : Promise.resolve(null),
    ]);
    const items = await fetchGroupOffers(resolveJoinUrl(page ?? null, globalJoinUrl));
    return new Response(JSON.stringify({ items }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  // 301 das URLs do site antigo (WordPress) — é o que o Bing ainda tem indexado.
  if (/^\/stores-2\/?/.test(pathname)) {
    return movedPermanently(`${SITE_URL}/lojas`);
  }

  const legacyStore = pathname.match(/^\/store\/([^/]+)\/?$/);
  if (legacyStore) {
    const slug = safeDecode(legacyStore[1]);
    if (slug === null) return movedPermanently(`${SITE_URL}/lojas`);
    const store = await fetchStoreByLegacySlug(slug);
    // Falha do Supabase: 301 para /lojas seria cravar o destino errado (o
    // robô e o navegador guardam o 301). 503 manda o robô voltar depois.
    if (store === undefined) return temporarilyUnavailable();
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
      const renamed = await findRenamedPost(pathname);
      if (renamed) return movedPermanently(`${SITE_URL}/blog/${renamed}`);

      // Slug inexistente: 404 de verdade, não soft 404. A SPA ainda monta por
      // cima e mostra a tela de "não encontrado" para quem está no navegador.
      return new Response(shell, { status: 404, headers: SHELL_HEADERS });
    }

    return respond(shell, page);
  } catch {
    return undefined;
  }
}

// Leitura do Supabase pela REST pública, direto do Edge Middleware.
// A URL e a chave anônima são as mesmas que o navegador já usa (estão no
// bundle do cliente), então servem de fallback quando o env não está setado.

import {
  mergeGroupInfo,
  type WhatsappGroupInfo,
  type WhatsappGroupPageData,
} from '../src/lib/whatsappGroup';
import { notExpiredFilter } from '../src/lib/couponValidity';
import type { JoinClickRow } from '../src/lib/groupJoinTracking';
import { offerFeedUrl, parseGroupOffers, type GroupOffer } from '../src/lib/groupOfferFeed';

const FALLBACK_SUPABASE_URL ='https://jyvmrkykukialdbcebei.supabase.co';
const FALLBACK_SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dm1ya3lrdWtpYWxkYmNlYmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTAwOTgsImV4cCI6MjA5MTY4NjA5OH0.F7cTOv6Z5cEEPWzQT9gSb2drsZksdY6Xc7erAyXB_K8';

function credentials() {
  return {
    url: process.env.SUPABASE_URL || FALLBACK_SUPABASE_URL,
    key: process.env.SUPABASE_PUBLISHABLE_KEY || FALLBACK_SUPABASE_KEY,
  };
}

// Supabase lento não pode segurar a resposta do Edge: o robô desiste da URL
// (e, se ela veio de um redirect, o Search Console marca "Erro de redirecionamento").
const QUERY_TIMEOUT_MS = 5000;

/** `null` = a requisição falhou; `[]` = respondeu, sem registros. */
async function tryQuery<T>(path: string): Promise<T[] | null> {
  const { url, key } = credentials();
  try {
    const response = await fetch(`${url}/rest/v1/${path}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(QUERY_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as T[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return null;
  }
}

async function query<T>(path: string): Promise<T[]> {
  return (await tryQuery<T>(path)) ?? [];
}

export interface PrerenderPost {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  schema_json: unknown;
  /** Página do grupo do post (botão do WhatsApp); ausente antes da migration 20261023150000. */
  group_slug?: string | null;
  published_at: string | null;
  updated_at: string | null;
  created_at: string | null;
  author_id: string | null;
}

export interface PrerenderStore {
  /** UUID da loja: é o que `coupons.store_id` guarda. */
  id: string;
  slug: string;
  name: string;
  description: string | null;
  meta_description: string | null;
  logo_url: string | null;
  store_id: string | null;
  website_url: string | null;
}

export interface PrerenderCoupon {
  id: string;
  code: string | null;
  title: string;
  description: string | null;
  discount: string | null;
  link: string | null;
  store: string | null;
  store_id: string | null;
  category: string | null;
  expiry: string | null;
  expiry_text: string | null;
  status: boolean | null;
  updated_at: string | null;
}

export interface PrerenderCategory {
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  updated_at: string | null;
  /** Página do grupo de nicho (migration 20261022150000; ausente antes dela). */
  group_slug?: string | null;
}

const CATEGORY_COLUMNS = 'name,slug,description,icon,updated_at';

/** Categorias com o grupo de nicho; coluna ainda não migrada = sem nicho, nunca 400. */
async function tryCategories(filter: string): Promise<PrerenderCategory[] | null> {
  const path = (columns: string) => `coupon_categories?${filter}&select=${columns}`;
  return (
    (await tryQuery<PrerenderCategory>(path(`${CATEGORY_COLUMNS},group_slug`))) ??
    (await tryQuery<PrerenderCategory>(path(CATEGORY_COLUMNS)))
  );
}

const POST_COLUMNS_BASE =
  'title,slug,excerpt,content,cover_image,meta_title,meta_description,published_at,updated_at,created_at,author_id';

export async function fetchPost(slug: string): Promise<PrerenderPost | null> {
  const path = (columns: string) =>
    `blog_posts?slug=${encodeURIComponent(`eq.${slug}`)}&status=eq.published&select=${columns}&limit=1`;

  // `schema_json` é recente: antes da migration rodar, pedi-lo devolve 400 e
  // levaria o post inteiro a virar 404. Sem a coluna, segue sem o schema extra.
  // `group_slug` (grupo do post) é ainda mais recente: mesma lógica, uma camada a mais.
  const withGroup = await tryQuery<PrerenderPost>(path(`${POST_COLUMNS_BASE},schema_json,group_slug`));
  if (withGroup) return withGroup[0] ?? null;

  const withSchema = await tryQuery<PrerenderPost>(path(`${POST_COLUMNS_BASE},schema_json`));
  if (withSchema) return withSchema[0] ?? null;

  const rows = await query<PrerenderPost>(path(POST_COLUMNS_BASE));
  return rows[0] ?? null;
}

// Slug encurtado depois de publicado (`cupom-shopee-hoje-o-passo-a-passo-...`
// virou `cupom-shopee-hoje`): a URL antiga já estava no Google e virou 404.
// Candidatos = prefixos do slug pedido; vence o mais longo publicado. Mínimo de
// 3 palavras para não mandar um slug qualquer para um post genérico.
const MIN_RENAMED_SLUG_WORDS = 3;

export async function fetchRenamedPostSlug(requestedSlug: string): Promise<string | null> {
  const words = requestedSlug.split('-');
  const candidates: string[] = [];
  for (let size = words.length - 1; size >= MIN_RENAMED_SLUG_WORDS; size--) {
    candidates.push(words.slice(0, size).join('-'));
  }
  if (candidates.length === 0) return null;

  const list = candidates.map(slug => `"${slug}"`).join(',');
  const rows = await query<{ slug: string }>(
    `blog_posts?slug=in.(${encodeURIComponent(list)})&status=eq.published&select=slug`
  );
  const published = new Set(rows.map(row => row.slug));
  return candidates.find(slug => published.has(slug)) ?? null;
}

export interface PrerenderAuthor {
  name: string;
  bio: string | null;
  linkedin_url: string | null;
  job_title: string | null;
  avatar_url: string | null;
}

/**
 * Autora com perfil público (EEAT). `linkedin_url`/`job_title` entraram depois
 * (migration 20261009150000): se ainda não existirem no banco, a REST devolve
 * 400 e cai para só o nome — a página nunca vira 404 por causa de coluna nova.
 */
async function fetchAuthorBy(filter: string): Promise<PrerenderAuthor | null> {
  const full = await tryQuery<PrerenderAuthor>(
    `blog_authors?${filter}&select=name,bio,linkedin_url,job_title,avatar_url&limit=1`
  );
  if (full) return full[0] ?? null;
  const basic = await query<{ name: string; bio: string | null; avatar_url: string | null }>(
    `blog_authors?${filter}&select=name,bio,avatar_url&limit=1`
  );
  return basic[0] ? { ...basic[0], linkedin_url: null, job_title: null } : null;
}

export async function fetchAuthor(authorId: string | null): Promise<PrerenderAuthor | null> {
  if (!authorId) return null;
  return fetchAuthorBy(`id=eq.${encodeURIComponent(authorId)}`);
}

export async function fetchAuthorByName(name: string): Promise<PrerenderAuthor | null> {
  return fetchAuthorBy(`name=eq.${encodeURIComponent(name)}`);
}

/**
 * Posts marcados como destaque. São eles que aparecem como link real no rodapé
 * de todas as páginas prerenderizadas: o `FeaturedGuidesLinks` do React só
 * existe depois do JavaScript, e link que só existe depois do JavaScript não
 * conta como link para o crawler nem para os robôs das IAs.
 */
export async function fetchFeaturedPosts(limit = 3): Promise<Array<Pick<PrerenderPost, 'title' | 'slug'>>> {
  return query<Pick<PrerenderPost, 'title' | 'slug'>>(
    `blog_posts?status=eq.published&featured=is.true&select=title,slug&order=published_at.desc&limit=${limit}`
  );
}

export async function fetchRecentPosts(limit = 6): Promise<Array<Pick<PrerenderPost, 'title' | 'slug' | 'excerpt'>>> {
  return query<Pick<PrerenderPost, 'title' | 'slug' | 'excerpt'>>(
    `blog_posts?status=eq.published&select=title,slug,excerpt&order=published_at.desc&limit=${limit}`
  );
}

export async function fetchStore(slug: string): Promise<PrerenderStore | null> {
  const rows = await query<PrerenderStore>(
    `stores?slug=eq.${encodeURIComponent(slug)}&select=id,slug,name,description,meta_description,logo_url,store_id,website_url&limit=1`
  );
  return rows[0] ?? null;
}

// Sem join com `stores` de propósito — a tabela não tem coluna `color` e o
// join quebra em produção (erro 42703). Ver CLAUDE.md.
/** Vencido não entra no HTML, igual ao React (`notExpiredFilter`). */
function notExpired(): string {
  return `or=(${encodeURIComponent(notExpiredFilter())})`;
}

const COUPON_COLUMNS =
  'id,code,title,description,discount,link,store,store_id,category,expiry,expiry_text,status,updated_at';

export async function fetchStoreCoupons(store: PrerenderStore, limit = 40): Promise<PrerenderCoupon[]> {
  // `coupons.store_id` é o UUID da loja (`stores.id`), não o `stores.store_id` (ID da rede
  // de afiliados, ex.: "17729"): comparar com ele dava 400 e a loja saía sem cupom no HTML.
  const filters = [`store.eq.${store.name}`];
  if (store.id) filters.push(`store_id.eq.${store.id}`);
  return query<PrerenderCoupon>(
    `coupons?or=(${filters.map(f => encodeURIComponent(f)).join(',')})&status=is.true&${notExpired()}&select=${COUPON_COLUMNS}&order=updated_at.desc&limit=${limit}`
  );
}

export async function fetchCategory(slug: string): Promise<PrerenderCategory | null> {
  const rows = (await tryCategories(`slug=eq.${encodeURIComponent(slug)}&limit=1`)) ?? [];
  return rows[0] ?? null;
}

export async function fetchCategoryCoupons(categoryName: string, limit = 40): Promise<PrerenderCoupon[]> {
  return query<PrerenderCoupon>(
    `coupons?category=eq.${encodeURIComponent(categoryName)}&status=is.true&${notExpired()}&select=${COUPON_COLUMNS}&order=updated_at.desc&limit=${limit}`
  );
}

export async function fetchFeaturedStores(limit = 12): Promise<PrerenderStore[]> {
  return query<PrerenderStore>(
    `stores?active=is.true&select=id,slug,name,description,meta_description,logo_url,store_id,website_url&order=is_featured.desc&order=name&limit=${limit}`
  );
}

/**
 * Busca a loja aceitando o slug antigo (WordPress: `/store/casas-bahia/`) ou o
 * novo (`cupom-desconto-casas-bahia`). Usado no 301 das URLs do site antigo.
 */
/**
 * `undefined` = o Supabase falhou (quem chama não pode cravar um 301);
 * `null` = respondeu e não há loja com esse slug.
 */
export async function fetchStoreByLegacySlug(
  legacySlug: string
): Promise<PrerenderStore | null | undefined> {
  const normalized = legacySlug.replace(/^cupom-desconto-/, '');
  // O slug novo pode ter sufixo de país (`kabum` → `cupom-desconto-kabum-br`),
  // daí o terceiro candidato por prefixo. Sem correspondência, quem chama
  // manda para /lojas — redirecionar para a loja errada é pior que para a lista.
  const candidates = [
    `slug.eq.cupom-desconto-${normalized}`,
    `slug.eq.${normalized}`,
    `slug.like.cupom-desconto-${normalized}-*`,
  ];
  const filter = candidates.map(condition => encodeURIComponent(condition)).join(',');
  const rows = await tryQuery<PrerenderStore>(
    `stores?or=(${filter})&select=id,slug,name,description,meta_description,logo_url,store_id,website_url&order=slug&limit=1`
  );
  if (!rows) return undefined;
  return rows[0] ?? null;
}

// ── Home e listagens ─────────────────────────────────────────────────────────

const STORE_COLUMNS =
  'slug,name,description,meta_description,logo_url,store_id,website_url';

export async function fetchAllStores(limit = 80): Promise<PrerenderStore[]> {
  return query<PrerenderStore>(
    `stores?active=is.true&select=${STORE_COLUMNS}&order=name&limit=${limit}`
  );
}

export async function fetchCategories(limit = 40): Promise<PrerenderCategory[]> {
  return (await tryCategories(`order=sort_order&order=name&limit=${limit}`)) ?? [];
}

export async function fetchTopCoupons(limit = 40): Promise<PrerenderCoupon[]> {
  return query<PrerenderCoupon>(
    `coupons?status=is.true&${notExpired()}&select=${COUPON_COLUMNS}&order=is_featured.desc&order=updated_at.desc&limit=${limit}`
  );
}

export interface PrerenderPostSummary {
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  updated_at: string | null;
}

const GROUP_PAGE_COLUMNS =
  'slug,store_slug,title,h1,meta_description,intro,content,faq,join_url,sort_order,updated_at';
// Colunas novas entram por camadas (migrations 20261022150000 e 20261023120000): antes
// de elas rodarem, pedir a coluna devolve 400 e a página viraria 404. Por isso as
// tentativas seguintes sem elas.
// Da mais nova para a mais antiga: a primeira que o banco aceitar vale.
const GROUP_PAGE_COLUMN_TIERS = [
  `${GROUP_PAGE_COLUMNS},group_name,topics,page_type,offer_terms,offer_volume`,
  `${GROUP_PAGE_COLUMNS},group_name,topics,page_type,offer_terms`,
  `${GROUP_PAGE_COLUMNS},group_name,topics`,
  GROUP_PAGE_COLUMNS,
];

async function tryGroupPages(filter: string): Promise<WhatsappGroupPageData[] | null> {
  for (const columns of GROUP_PAGE_COLUMN_TIERS) {
    const rows = await tryQuery<WhatsappGroupPageData>(`whatsapp_group_pages?${filter}&select=${columns}`);
    if (rows) return rows;
  }
  return null;
}

/** `undefined` = o Supabase falhou (não confundir com "página não existe"). */
export async function fetchGroupPage(slug: string): Promise<WhatsappGroupPageData | null | undefined> {
  const rows = await tryGroupPages(`slug=eq.${encodeURIComponent(slug)}&is_published=is.true&limit=1`);
  if (rows === null) return undefined;
  return rows[0] ?? null;
}

/**
 * Página que guarda o link de um grupo, publicada ou não: o /entrar e o botão de
 * um post usam o link de uma página despublicada (ex.: festas, cujo endereço
 * redireciona para o post de ano novo).
 */
export async function fetchJoinPage(slug: string): Promise<WhatsappGroupPageData | null> {
  const rows = await tryGroupPages(`slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows?.[0] ?? null;
}

export async function fetchGroupPages(): Promise<WhatsappGroupPageData[]> {
  return (await tryGroupPages('is_published=is.true&order=sort_order&order=slug')) ?? [];
}

/** Fatos do grupo (`whatsapp_group_info`) e link global, numa leitura só. */
export async function fetchGroupSettings(): Promise<{ info: WhatsappGroupInfo; globalJoinUrl: string | null }> {
  const rows = await query<{ key: string; value: unknown }>(
    'site_settings?key=in.(whatsapp_group_info,global_links)&select=key,value'
  );
  const byKey = new Map(rows.map(row => [row.key, row.value]));
  const globalLinks = byKey.get('global_links') as { whatsapp_group?: unknown } | undefined;
  return {
    info: mergeGroupInfo(byKey.get('whatsapp_group_info')),
    globalJoinUrl: typeof globalLinks?.whatsapp_group === 'string' ? globalLinks.whatsapp_group : null,
  };
}

export async function fetchPublishedPosts(limit = 30): Promise<PrerenderPostSummary[]> {
  return query<PrerenderPostSummary>(
    `blog_posts?status=eq.published&select=title,slug,excerpt,published_at,updated_at&order=published_at.desc&limit=${limit}`
  );
}

/** Grava um clique no botão do grupo (tabela `group_join_clicks`). Falha não impede o redirecionamento. */
export async function recordGroupJoinClick(row: JoinClickRow): Promise<boolean> {
  const { url, key } = credentials();
  try {
    const response = await fetch(`${url}/rest/v1/group_join_clicks`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(QUERY_TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    return false;
  }
}

const OFFER_FEED_TIMEOUT_MS = 3000;

/**
 * Ofertas reais do grupo (feed público do Link Inteligente). Qualquer falha ou
 * feed desligado = lista vazia: a página sai sem o bloco, nunca quebra.
 */
export async function fetchGroupOffers(joinUrl: string | null): Promise<GroupOffer[]> {
  const feedUrl = offerFeedUrl(joinUrl);
  if (!feedUrl) return [];
  try {
    const response = await fetch(feedUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(OFFER_FEED_TIMEOUT_MS),
    });
    if (!response.ok) return [];
    return parseGroupOffers(await response.json());
  } catch {
    return [];
  }
}

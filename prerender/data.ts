// Leitura do Supabase pela REST pública, direto do Edge Middleware.
// A URL e a chave anônima são as mesmas que o navegador já usa (estão no
// bundle do cliente), então servem de fallback quando o env não está setado.

const FALLBACK_SUPABASE_URL = 'https://jyvmrkykukialdbcebei.supabase.co';
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
  published_at: string | null;
  updated_at: string | null;
  created_at: string | null;
  author_id: string | null;
}

export interface PrerenderStore {
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
}

const POST_COLUMNS_BASE =
  'title,slug,excerpt,content,cover_image,meta_title,meta_description,published_at,updated_at,created_at,author_id';

export async function fetchPost(slug: string): Promise<PrerenderPost | null> {
  const path = (columns: string) =>
    `blog_posts?slug=${encodeURIComponent(`eq.${slug}`)}&status=eq.published&select=${columns}&limit=1`;

  // `schema_json` é recente: antes da migration rodar, pedi-lo devolve 400 e
  // levaria o post inteiro a virar 404. Sem a coluna, segue sem o schema extra.
  const withSchema = await tryQuery<PrerenderPost>(path(`${POST_COLUMNS_BASE},schema_json`));
  if (withSchema) return withSchema[0] ?? null;

  const rows = await query<PrerenderPost>(path(POST_COLUMNS_BASE));
  return rows[0] ?? null;
}

export async function fetchAuthorName(authorId: string | null): Promise<string | null> {
  if (!authorId) return null;
  const rows = await query<{ name: string }>(
    `blog_authors?id=eq.${encodeURIComponent(authorId)}&select=name&limit=1`
  );
  return rows[0]?.name ?? null;
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
    `stores?slug=eq.${encodeURIComponent(slug)}&select=slug,name,description,meta_description,logo_url,store_id,website_url&limit=1`
  );
  return rows[0] ?? null;
}

// Sem join com `stores` de propósito — a tabela não tem coluna `color` e o
// join quebra em produção (erro 42703). Ver CLAUDE.md.
const COUPON_COLUMNS =
  'id,code,title,description,discount,link,store,store_id,category,expiry,expiry_text,status,updated_at';

export async function fetchStoreCoupons(store: PrerenderStore, limit = 40): Promise<PrerenderCoupon[]> {
  const filters = [`store.eq.${store.name}`];
  if (store.store_id) filters.push(`store_id.eq.${store.store_id}`);
  return query<PrerenderCoupon>(
    `coupons?or=(${filters.map(f => encodeURIComponent(f)).join(',')})&status=is.true&select=${COUPON_COLUMNS}&order=updated_at.desc&limit=${limit}`
  );
}

export async function fetchCategory(slug: string): Promise<PrerenderCategory | null> {
  const rows = await query<PrerenderCategory>(
    `coupon_categories?slug=eq.${encodeURIComponent(slug)}&select=name,slug,description,icon,updated_at&limit=1`
  );
  return rows[0] ?? null;
}

export async function fetchCategoryCoupons(categoryName: string, limit = 40): Promise<PrerenderCoupon[]> {
  return query<PrerenderCoupon>(
    `coupons?category=eq.${encodeURIComponent(categoryName)}&status=is.true&select=${COUPON_COLUMNS}&order=updated_at.desc&limit=${limit}`
  );
}

export async function fetchFeaturedStores(limit = 12): Promise<PrerenderStore[]> {
  return query<PrerenderStore>(
    `stores?active=is.true&select=slug,name,description,meta_description,logo_url,store_id,website_url&order=is_featured.desc&order=name&limit=${limit}`
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
    `stores?or=(${filter})&select=slug,name,description,meta_description,logo_url,store_id,website_url&order=slug&limit=1`
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
  return query<PrerenderCategory>(
    `coupon_categories?select=name,slug,description,icon,updated_at&order=sort_order&order=name&limit=${limit}`
  );
}

export async function fetchTopCoupons(limit = 40): Promise<PrerenderCoupon[]> {
  return query<PrerenderCoupon>(
    `coupons?status=is.true&select=${COUPON_COLUMNS}&order=is_featured.desc&order=updated_at.desc&limit=${limit}`
  );
}

export interface PrerenderPostSummary {
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  updated_at: string | null;
}

export async function fetchPublishedPosts(limit = 30): Promise<PrerenderPostSummary[]> {
  return query<PrerenderPostSummary>(
    `blog_posts?status=eq.published&select=title,slug,excerpt,published_at,updated_at&order=published_at.desc&limit=${limit}`
  );
}

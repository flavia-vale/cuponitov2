// Medição das entradas no grupo de ofertas: todo botão "Entrar no grupo" aponta
// para /entrar, que registra de onde veio o clique e redireciona para o link do
// grupo. Módulo puro (sem Supabase nem React): o middleware do Edge e o React
// montam o MESMO endereço.
//
// O destino NUNCA vem da URL (seria um redirecionamento aberto): o /entrar
// resolve o link pela página do grupo (`g`) ou pelo link global, como o botão
// fazia antes.

import type { JoinChannel } from './whatsappGroup';

export const JOIN_TRACKING_PATH = '/entrar';

/** Sufixo da origem para os cliques que vão ao Telegram: a aba Captação separa sem coluna nova. */
const TELEGRAM_ORIGIN_SUFFIX = '_telegram';

const TOKEN_MAX = 60;
const PATH_MAX = 200;

/** Origem e slug: minúsculas, letras, números, `-` e `_`. Vazio vira null. */
export function sanitizeToken(value: string | null | undefined, max = TOKEN_MAX): string | null {
  const token = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, max);
  return token || null;
}

const GCLID_MAX = 200;

/** Identificador do clique no anúncio do Google (`gclid`): só letras, números, `-` e `_`. Outra coisa vira null. */
export function sanitizeGclid(value: string | null | undefined): string | null {
  const raw = String(value ?? '').trim();
  return /^[A-Za-z0-9_-]{10,200}$/.test(raw) ? raw.slice(0, GCLID_MAX) : null;
}

/** Caminho interno do site, sem query nem domínio. Qualquer outra coisa vira null. */
export function sanitizePagePath(value: string | null | undefined): string | null {
  const raw = String(value ?? '').split(/[?#]/)[0];
  if (!raw.startsWith('/') || raw.startsWith('//')) return null;
  const path = raw.replace(/[^A-Za-z0-9/_.-]/g, '').slice(0, PATH_MAX);
  return path || null;
}

export interface JoinTrackingParams {
  /** Onde fica o botão: `store`, `group_page`, `blog_post`… */
  origin: string;
  /** Página do grupo cujo link vale (`whatsapp_group_pages.slug`); sem ela, o link global. */
  groupSlug?: string | null;
  /** Página do site em que o botão estava. */
  pagePath?: string | null;
  /** `telegram` = o canal do Telegram da página do grupo. Padrão: WhatsApp. */
  channel?: JoinChannel;
  /** Clique de anúncio do Google que trouxe a pessoa ao site (vira conversão importada no Google Ads). */
  gclid?: string | null;
}

export function buildJoinTrackingHref({ origin, groupSlug, pagePath, channel = 'whatsapp', gclid }: JoinTrackingParams): string {
  const params = new URLSearchParams();
  const o = sanitizeToken(origin);
  const g = sanitizeToken(groupSlug);
  const p = sanitizePagePath(pagePath);
  if (o) params.set('o', o);
  if (g) params.set('g', g);
  if (p) params.set('p', p);
  if (channel === 'telegram') params.set('d', 'telegram');
  const gc = sanitizeGclid(gclid);
  if (gc) params.set('gc', gc);
  const query = params.toString();
  return query ? `${JOIN_TRACKING_PATH}?${query}` : JOIN_TRACKING_PATH;
}

export interface JoinClickRow {
  origin: string | null;
  group_slug: string | null;
  page_path: string | null;
  device: 'mobile' | 'desktop';
  /** Só presente quando o clique veio de um anúncio do Google. */
  gclid?: string;
}

/** Canal pedido no /entrar (`d`). Qualquer outro valor é WhatsApp. */
export function parseJoinChannel(search: URLSearchParams): JoinChannel {
  return search.get('d') === 'telegram' ? 'telegram' : 'whatsapp';
}

export function parseJoinTrackingQuery(search: URLSearchParams, userAgent: string | null): JoinClickRow {
  const origin = sanitizeToken(search.get('o'), TOKEN_MAX - TELEGRAM_ORIGIN_SUFFIX.length);
  return {
    origin: origin && parseJoinChannel(search) === 'telegram' ? `${origin}${TELEGRAM_ORIGIN_SUFFIX}` : origin,
    group_slug: sanitizeToken(search.get('g')),
    page_path: sanitizePagePath(search.get('p')),
    device: /mobi|android|iphone|ipad/i.test(userAgent ?? '') ? 'mobile' : 'desktop',
    ...(sanitizeGclid(search.get('gc')) ? { gclid: sanitizeGclid(search.get('gc'))! } : {}),
  };
}

export interface AdsConversionClick {
  created_at: string;
  gclid: string | null;
}

const CSV_TIME = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/**
 * CSV de conversões offline do Google Ads (modelo "Google Click ID"): um clique no
 * botão do grupo vindo de anúncio = uma conversão. Fuso de São Paulo, como declarado
 * na primeira linha. Cliques sem gclid ficam fora.
 */
export function buildAdsConversionsCsv(clicks: AdsConversionClick[], conversionName: string): string {
  const lines = clicks
    .filter(click => sanitizeGclid(click.gclid))
    .map(click => `${click.gclid},${conversionName},${CSV_TIME.format(new Date(click.created_at))},,`);
  return [
    'Parameters:TimeZone=America/Sao_Paulo',
    'Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency',
    ...lines,
  ].join('\n');
}

/** Robô de busca, prévia de link e ferramenta não contam como pessoa entrando. */
export function isLikelyBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|headless|lighthouse/i.test(
    userAgent
  );
}

export interface JoinClickSummaryRow {
  key: string;
  clicks: number;
}

export interface JoinClickSummary {
  total: number;
  mobile: number;
  /** Dia (AAAA-MM-DD, fuso de São Paulo) → cliques, do mais recente ao mais antigo, com zeros. */
  byDay: JoinClickSummaryRow[];
  byPage: JoinClickSummaryRow[];
  byOrigin: JoinClickSummaryRow[];
}

const SAO_PAULO_DAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' });

function ranked(counts: Map<string, number>): JoinClickSummaryRow[] {
  return [...counts.entries()]
    .map(([key, clicks]) => ({ key, clicks }))
    .sort((a, b) => b.clicks - a.clicks || a.key.localeCompare(b.key));
}

/** Resumo para a aba Captação: total, por dia (com os dias sem clique), por página e por origem. */
export function summarizeJoinClicks(
  rows: Array<Pick<JoinClickRow, 'origin' | 'page_path'> & { device: string; created_at: string }>,
  days: number,
  now: Date = new Date()
): JoinClickSummary {
  const byDay = new Map<string, number>();
  for (let i = 0; i < days; i += 1) {
    byDay.set(SAO_PAULO_DAY.format(new Date(now.getTime() - i * 86_400_000)), 0);
  }
  const byPage = new Map<string, number>();
  const byOrigin = new Map<string, number>();
  let total = 0;
  let mobile = 0;
  for (const row of rows) {
    const day = SAO_PAULO_DAY.format(new Date(row.created_at));
    if (!byDay.has(day)) continue;
    total += 1;
    if (row.device === 'mobile') mobile += 1;
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
    const page = row.page_path ?? '(sem página)';
    byPage.set(page, (byPage.get(page) ?? 0) + 1);
    const origin = row.origin ?? '(sem origem)';
    byOrigin.set(origin, (byOrigin.get(origin) ?? 0) + 1);
  }
  return {
    total,
    mobile,
    byDay: [...byDay.entries()].map(([key, clicks]) => ({ key, clicks })),
    byPage: ranked(byPage),
    byOrigin: ranked(byOrigin),
  };
}

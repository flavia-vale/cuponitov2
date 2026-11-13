// Medição do clique no cupom (prioridade 3 do plano de 12/11): todo botão de cupom aponta
// para /ir, que registra loja, página, origem e fonte da visita e redireciona para o link
// de afiliado do cupom. Mesmo modelo do /entrar (groupJoinTracking.ts).
//
// O destino NUNCA vem da URL (seria um redirecionamento aberto): o /ir lê o link do cupom
// no banco pelo id. Módulo puro: o middleware do Edge e o React montam o MESMO endereço.

import {
  readVisitSourceCookie,
  sanitizePagePath,
  sanitizeToken,
  sanitizeVisitSource,
  visitSourceLabel,
  type JoinClickSummaryRow,
} from './groupJoinTracking';

export const COUPON_CLICK_PATH = '/ir';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function sanitizeCouponId(value: string | null | undefined): string | null {
  const id = String(value ?? '').trim().toLowerCase();
  return UUID.test(id) ? id : null;
}

export interface CouponClickParams {
  couponId: string;
  /** Onde fica o botão: `coupon_card`, `store_coupon_card`, `popular_coupon_item`… */
  origin: string;
  /** Página do site em que o botão estava. */
  pagePath?: string | null;
}

/** Endereço do botão do cupom. Id inválido → null (quem chama usa o link direto, o botão nunca quebra). */
export function buildCouponClickHref({ couponId, origin, pagePath }: CouponClickParams): string | null {
  const id = sanitizeCouponId(couponId);
  if (!id) return null;
  const params = new URLSearchParams({ c: id });
  const o = sanitizeToken(origin);
  const p = sanitizePagePath(pagePath);
  if (o) params.set('o', o);
  if (p) params.set('p', p);
  return `${COUPON_CLICK_PATH}?${params.toString()}`;
}

export interface CouponClickRow {
  coupon_id: string;
  /** Nome da loja no momento do clique (coupons.store): a aba agrupa por ele. */
  store: string | null;
  origin: string | null;
  page_path: string | null;
  device: 'mobile' | 'desktop';
  /** De onde a pessoa chegou ao site (cookie `cpn_src`). Ausente = JavaScript não rodou. */
  source?: string;
}

export function parseCouponClickQuery(
  search: URLSearchParams,
  userAgent: string | null,
  cookieHeader: string | null = null
): Omit<CouponClickRow, 'store' | 'coupon_id'> & { coupon_id: string | null } {
  const source = readVisitSourceCookie(cookieHeader);
  return {
    coupon_id: sanitizeCouponId(search.get('c')),
    origin: sanitizeToken(search.get('o')),
    page_path: sanitizePagePath(search.get('p')),
    device: /mobi|android|iphone|ipad/i.test(userAgent ?? '') ? 'mobile' : 'desktop',
    ...(source ? { source } : {}),
  };
}

/** Link de afiliado salvo no cupom: só http(s). Outra coisa não é destino válido. */
export function safeAffiliateUrl(link: string | null | undefined): string | null {
  try {
    const url = new URL(String(link ?? '').trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export interface CouponClickSummary {
  total: number;
  mobile: number;
  byDay: JoinClickSummaryRow[];
  byStore: JoinClickSummaryRow[];
  byPage: JoinClickSummaryRow[];
  byOrigin: JoinClickSummaryRow[];
  bySource: JoinClickSummaryRow[];
}

const SAO_PAULO_DAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' });

function ranked(counts: Map<string, number>): JoinClickSummaryRow[] {
  return [...counts.entries()]
    .map(([key, clicks]) => ({ key, clicks }))
    .sort((a, b) => b.clicks - a.clicks || a.key.localeCompare(b.key));
}

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

/** Resumo para a aba "Cliques em cupom": total, por dia (com zeros), loja, página, botão e fonte. */
export function summarizeCouponClicks(
  rows: Array<{
    store: string | null;
    origin: string | null;
    page_path: string | null;
    device: string;
    source?: string | null;
    created_at: string;
  }>,
  days: number,
  now: Date = new Date()
): CouponClickSummary {
  const byDay = new Map<string, number>();
  for (let i = 0; i < days; i += 1) {
    byDay.set(SAO_PAULO_DAY.format(new Date(now.getTime() - i * 86_400_000)), 0);
  }
  const byStore = new Map<string, number>();
  const byPage = new Map<string, number>();
  const byOrigin = new Map<string, number>();
  const bySource = new Map<string, number>();
  let total = 0;
  let mobile = 0;
  for (const row of rows) {
    const day = SAO_PAULO_DAY.format(new Date(row.created_at));
    if (!byDay.has(day)) continue;
    total += 1;
    if (row.device === 'mobile') mobile += 1;
    bump(byDay, day);
    bump(byStore, row.store?.trim() || '(sem loja)');
    bump(byPage, row.page_path ?? '(sem página)');
    bump(byOrigin, row.origin ?? '(sem origem)');
    bump(bySource, visitSourceLabel(sanitizeVisitSource(row.source)));
  }
  return {
    total,
    mobile,
    byDay: [...byDay.entries()].map(([key, clicks]) => ({ key, clicks })),
    byStore: ranked(byStore),
    byPage: ranked(byPage),
    byOrigin: ranked(byOrigin),
    bySource: ranked(bySource),
  };
}

/** Endereço que o botão do cupom abre: o /ir medido, ou o link direto se o id não servir. */
export function couponOutboundHref(
  coupon: { id: string; link: string | null },
  origin: string,
  pagePath: string | null
): string {
  return buildCouponClickHref({ couponId: coupon.id, origin, pagePath }) ?? coupon.link ?? '/cupons';
}

// Medição do clique numa oferta do grupo ("Ver oferta" nas listas "Saiu no grupo"): o botão
// aponta para /ir?u=<link>, que grava loja, grupo, página, botão e fonte da visita e
// redireciona para o link de afiliado da oferta (docs/plano-leads-que-compram-2026-11-22.md, 1.2).
//
// O link vem na URL, então o /ir SÓ redireciona se ele for de uma oferta que saiu no grupo:
// no arquivo `group_offers` ou no feed ao vivo do grupo `g`. Qualquer outro link volta para a
// página (sem redirecionamento aberto). Módulo puro: o middleware do Edge e o React montam o
// MESMO endereço.

import { COUPON_CLICK_PATH } from './couponClickTracking';
import { readVisitSourceCookie, sanitizePagePath, sanitizeToken } from './groupJoinTracking';

export const OFFER_CLICK_PATH = COUPON_CLICK_PATH;
const LINK_MAX = 2000;

/** Link de oferta que pode ir na URL do /ir: só http(s), até 2000 caracteres. */
export function sanitizeOfferLink(value: string | null | undefined): string | null {
  const raw = String(value ?? '').trim();
  if (!raw || raw.length > LINK_MAX) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export interface OfferClickParams {
  link: string;
  /** Página do grupo cujo feed tem a oferta (`celular`, `racao`…); sem ela, o grupo geral. */
  groupSlug?: string | null;
  /** Onde fica o botão: `group_page_offer`, `offers_page_offer`, `achadinhos_offer`… */
  origin: string;
  pagePath?: string | null;
}

/** Endereço do "Ver oferta". Link inválido → null (quem chama usa o link direto: o botão nunca quebra). */
export function buildOfferClickHref({ link, groupSlug, origin, pagePath }: OfferClickParams): string | null {
  const safe = sanitizeOfferLink(link);
  if (!safe) return null;
  const params = new URLSearchParams({ u: safe });
  const g = sanitizeToken(groupSlug);
  const o = sanitizeToken(origin);
  const p = sanitizePagePath(pagePath);
  if (g) params.set('g', g);
  if (o) params.set('o', o);
  if (p) params.set('p', p);
  return `${OFFER_CLICK_PATH}?${params.toString()}`;
}

export interface OfferClickRow {
  /** Loja da oferta (`mercadolivre`, `amazon`…), a do feed. */
  store: string | null;
  group_slug: string | null;
  origin: string | null;
  page_path: string | null;
  device: 'mobile' | 'desktop';
  /** De onde a pessoa chegou ao site (cookie `cpn_src`). Ausente = JavaScript não rodou. */
  source?: string;
}

export function parseOfferClickQuery(
  search: URLSearchParams,
  userAgent: string | null,
  cookieHeader: string | null = null
): Omit<OfferClickRow, 'store'> & { link: string | null } {
  const source = readVisitSourceCookie(cookieHeader);
  return {
    link: sanitizeOfferLink(search.get('u')),
    group_slug: sanitizeToken(search.get('g')),
    origin: sanitizeToken(search.get('o')),
    page_path: sanitizePagePath(search.get('p')),
    device: /mobi|android|iphone|ipad/i.test(userAgent ?? '') ? 'mobile' : 'desktop',
    ...(source ? { source } : {}),
  };
}

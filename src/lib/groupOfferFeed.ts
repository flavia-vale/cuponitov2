// Ofertas reais que saíram no grupo, lidas do feed público do Link Inteligente
// (`<link do grupo>/ofertas.json`, servido pelo Espelha Grupos). Usadas na página
// /achadinhos-hoje e no bloco "Saiu no grupo hoje" das páginas do grupo.
// Módulo puro: o prerender do Edge e o React chegam à MESMA lista.

import { safeExternalUrl } from './whatsappGroup';

export const ACHADINHOS_PATH = '/achadinhos-hoje';
/** Mesma origem do site: o navegador lê por aqui (o feed do Link Inteligente não libera CORS). */
export const ACHADINHOS_FEED_PATH = '/achadinhos-hoje.json';

/** Feed de uma página de grupo (`?g=<slug>`): o link dela decide qual grupo. Sem slug, o grupo geral. */
export function groupOffersFeedPath(groupSlug?: string | null): string {
  return groupSlug ? `${ACHADINHOS_FEED_PATH}?g=${encodeURIComponent(groupSlug)}` : ACHADINHOS_FEED_PATH;
}

export interface GroupOffer {
  text: string;
  link: string;
  store: string | null;
  sentAt: string | null;
}

const FEED_HOSTS = new Set(['linkdivulgador.com.br', 'www.linkdivulgador.com.br', 'espelhagrupos.com.br', 'www.espelhagrupos.com.br']);

/** Link Inteligente (`https://linkdivulgador.com.br/g/<slug>`) → endereço do feed; outro link → null. */
export function offerFeedUrl(joinUrl: string | null | undefined): string | null {
  const safe = safeExternalUrl(joinUrl);
  if (!safe) return null;
  const url = new URL(safe);
  const match = url.pathname.match(/^\/g\/([a-z0-9-]{3,40})\/?$/);
  if (!FEED_HOSTS.has(url.host) || !match) return null;
  return `https://${url.host}/g/${match[1]}/ofertas.json`;
}

function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/** Termos da página de ofertas ("fralda, fraldas") → lista normalizada, sem vazios. */
export function parseOfferTerms(raw: string | null | undefined): string[] {
  return String(raw ?? '')
    .split(',')
    .map(term => normalizeText(term.trim()))
    .filter(Boolean);
}

/** Ofertas cujo texto contém algum dos termos (sem acento, sem caixa). Sem termos = todas. */
export function filterOffersByTerms(offers: GroupOffer[], terms: string[]): GroupOffer[] {
  if (terms.length === 0) return offers;
  return offers.filter(offer => {
    const text = normalizeText(offer.text);
    return terms.some(term => text.includes(term));
  });
}

/** Resposta do feed (dado de fora) → só itens com texto e link http(s). */
export function parseGroupOffers(raw: unknown, max = 40): GroupOffer[] {
  const items = (raw as { items?: unknown } | null)?.items;
  if (!Array.isArray(items)) return [];
  const offers: GroupOffer[] = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const value = item as Record<string, unknown>;
    const text = typeof value.text === 'string' ? value.text.trim().slice(0, 200) : '';
    const link = safeExternalUrl(typeof value.link === 'string' ? value.link : null);
    if (!text || !link) continue;
    const sentAt = typeof value.sentAt === 'string' && !Number.isNaN(Date.parse(value.sentAt)) ? value.sentAt : null;
    offers.push({ text, link, store: typeof value.store === 'string' ? value.store : null, sentAt });
    if (offers.length >= max) break;
  }
  return offers;
}

const STORE_LABELS: Record<string, string> = {
  shopee: 'Shopee',
  mercadolivre: 'Mercado Livre',
  'mercado-livre': 'Mercado Livre',
  amazon: 'Amazon',
  magalu: 'Magalu',
  magazineluiza: 'Magalu',
  shein: 'Shein',
  aliexpress: 'AliExpress',
  awin: 'Loja parceira',
  rakuten: 'Loja parceira',
  lomadee: 'Loja parceira',
};

export function storeLabel(store: string | null | undefined): string {
  const key = String(store ?? '').trim().toLowerCase();
  if (!key || key === 'unknown' || key === 'nolink') return 'Oferta';
  return STORE_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

const SAO_PAULO_DAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' });

/**
 * Página de ofertas de grupo com pouco volume (iPhone: ~2 por semana) mostra
 * ofertas de dias atrás; passado deste prazo o preço já não vale.
 */
export const OFFER_MAX_AGE_DAYS = 30;

/** Ofertas dos últimos `days` dias; sem data, fica (o feed só traz as recentes). */
export function recentOffers(offers: GroupOffer[], days = OFFER_MAX_AGE_DAYS, now: Date = new Date()): GroupOffer[] {
  const limit = now.getTime() - days * 86_400_000;
  return offers.filter(offer => !offer.sentAt || Date.parse(offer.sentAt) >= limit);
}

/** "14h05" se saiu hoje; "21/10 · 14h05" se saiu antes (horário de São Paulo). */
export function offerWhen(iso: string | null | undefined, now: Date = new Date()): string | null {
  const time = offerTime(iso);
  if (!time || !iso) return null;
  const date = new Date(iso);
  if (SAO_PAULO_DAY.format(date) === SAO_PAULO_DAY.format(now)) return time;
  const day = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' });
  return `${day} · ${time}`;
}

/** "14h05", no horário de São Paulo. */
export function offerTime(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
    .replace(':', 'h');
}

/** "19 de outubro de 2026", no fuso de São Paulo. */
export function todayLabel(now: Date = new Date()): string {
  return now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
}

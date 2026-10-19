// Ofertas reais que saíram no grupo, lidas do feed público do Link Inteligente
// (`<link do grupo>/ofertas.json`, servido pelo Espelha Grupos). Usadas na página
// /achadinhos-hoje e no bloco "Saiu no grupo hoje" das páginas do grupo.
// Módulo puro: o prerender do Edge e o React chegam à MESMA lista.

import { safeExternalUrl } from './whatsappGroup';

export const ACHADINHOS_PATH = '/achadinhos-hoje';
/** Mesma origem do site: o navegador lê por aqui (o feed do Link Inteligente não libera CORS). */
export const ACHADINHOS_FEED_PATH = '/achadinhos-hoje.json';

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

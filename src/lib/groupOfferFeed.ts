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
  /** Foto do produto na loja (feed do Espelha Grupos, `image`); só https. */
  image?: string | null;
}

/** Endereço de foto que pode ir para `<img src>`: só https, sem usuário/senha na URL. */
export function safeOfferImage(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

const FEED_HOSTS = new Set(['linkdivulgador.com.br', 'www.linkdivulgador.com.br', 'espelhagrupos.com.br', 'www.espelhagrupos.com.br']);

/**
 * Caminho do grupo depois de `/g/`: `promo-tech` (link antigo) ou `262/promo-pet` (link novo, com o
 * número da conta). Mesmo padrão do coletor `collect_group_offers()` no banco.
 */
const FEED_PATH = /^\/g\/((?:[0-9]{1,10}\/)?[a-z0-9-]{3,40})\/?$/;

/** Link Inteligente (`https://linkdivulgador.com.br/g/<slug>` ou `/g/<conta>/<slug>`) → endereço do feed; outro link → null. */
export function offerFeedUrl(joinUrl: string | null | undefined): string | null {
  const safe = safeExternalUrl(joinUrl);
  if (!safe) return null;
  const url = new URL(safe);
  const match = url.pathname.match(FEED_PATH);
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

/** Link Inteligente → grupo no feed (`promo-tech` ou `262/promo-pet`); outro link → null. O arquivo de ofertas usa este valor. */
export function offerFeedSlug(joinUrl: string | null | undefined): string | null {
  const feedUrl = offerFeedUrl(joinUrl);
  return feedUrl ? (feedUrl.match(/\/g\/((?:[0-9]+\/)?[a-z0-9-]+)\/ofertas\.json$/)?.[1] ?? null) : null;
}

/**
 * Termo da página → padrão do filtro `ilike` no arquivo (`text_norm`): só letras, números e `-`,
 * espaços viram `*`. Sem caractere reservado do PostgREST. Termo vazio → null.
 */
export function archiveTermPattern(term: string): string | null {
  const words = normalizeText(term)
    .split(/[^a-z0-9-]+/)
    .filter(Boolean);
  return words.length ? `*${words.join('*')}*` : null;
}

/**
 * Feed ao vivo + arquivo: sem repetir link, do mais novo ao mais antigo (sem data vai para o fim),
 * no máximo `max`.
 */
export function mergeOffers(live: GroupOffer[], archived: GroupOffer[], max = 40): GroupOffer[] {
  const seen = new Set<string>();
  const merged: GroupOffer[] = [];
  for (const offer of [...live, ...archived]) {
    if (seen.has(offer.link)) continue;
    seen.add(offer.link);
    merged.push(offer);
  }
  const time = (offer: GroupOffer) => (offer.sentAt ? Date.parse(offer.sentAt) : 0);
  return merged.sort((a, b) => time(b) - time(a)).slice(0, max);
}

/** Resposta do feed (dado de fora) → só itens com texto e link http(s). */
export function parseGroupOffers(raw: unknown, max = 40): GroupOffer[] {
  const items = (raw as { items?: unknown } | null)?.items;
  if (!Array.isArray(items)) return [];
  const offers: GroupOffer[] = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const value = item as Record<string, unknown>;
    const text = typeof value.text === 'string' ? value.text.trim().slice(0, 240) : '';
    const link = safeExternalUrl(typeof value.link === 'string' ? value.link : null);
    if (!text || !link) continue;
    const sentAt = typeof value.sentAt === 'string' && !Number.isNaN(Date.parse(value.sentAt)) ? value.sentAt : null;
    offers.push({ text, link, store: typeof value.store === 'string' ? value.store : null, sentAt, image: safeOfferImage(value.image) });
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
  // "amazon+amazon" (mensagem com dois links): vale a loja do primeiro.
  const key = String(store ?? '').split('+')[0].trim().toLowerCase();
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

/** Oferta pronta para mostrar: nome do produto, preço "de → por" e o resto em letra menor. */
export interface OfferDisplay {
  title: string;
  oldPrice: string | null;
  price: string | null;
  priceNote: string | null;
  details: string | null;
}

// Emojis de enfeite das mensagens (🔥 ✅ 🎟️ 👉…): somem da página, a informação fica no texto.
const DECOR_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;
// "anúncio"/"#anúncio" que o grupo põe no fim: a página já avisa dos links de afiliado.
const AD_TAG_RE = /\s*#an[uú]ncio\b|\s+an[uú]ncio\s*$/gi;
const ANY_PRICE_RE = new RegExp(String.raw`R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?`);
// Cupom cortado no fim ("Cupom:…"): sem o código, não serve para nada.
const CUT_COUPON_RE = /\s*(?:🎟️\s*)?cupom:?\s*…\s*$/i;
// "R$ 1.100,00", "R$49" ou, depois de "De:"/"Por:", só "499,00" (grupos que não escrevem o R$).
const PRICE = String.raw`(?:R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d{1,3}(?:\.\d{3})*,\d{2})`;
const OLD_PRICE_RE = new RegExp(String.raw`\bDe:?\s*(${PRICE})`, 'i');
const NEW_PRICE_RE = new RegExp(String.raw`\bPOR:?\s*(${PRICE})((?:\s+(?:no|à|a)\s+(?:Pix|vista|prazo))?(?:\s*\([^)]{1,30}\))?)`, 'i');
// "Link para comprar:" e parecidos, que sobram quando o link sai do texto.
const LINK_CALL_RE = /\s*(?:link\s+(?:para|pra)\s+comprar|compre\s+aqui|link)\s*:?\s*$/i;
const asReais = (value: string) => (value.startsWith('R$') ? value.replace(/^R\$\s?/, 'R$ ') : `R$ ${value}`);
// Siglas e marcas que ficam como estão quando o texto vem em CAIXA ALTA.
const KEEP_UPPER = new Set(['TV', 'LED', 'USB', 'SSD', 'HD', 'LG', 'JBL', 'PC', 'RGB', 'HDMI', 'NFC', 'GPS', 'DVD', 'UV', 'BT', 'XL', 'XG', 'GG', 'PP']);
const FIXED_CASE: Record<string, string> = { pix: 'Pix', iphone: 'iPhone', ipad: 'iPad', 'wi-fi': 'Wi-Fi', wifi: 'Wi-Fi', airpods: 'AirPods', ps5: 'PS5', ps4: 'PS4' };

/** Texto quase todo em CAIXA ALTA → só a primeira letra maiúscula; siglas e medidas (1080P, 16A) ficam. */
export function tidyOfferCase(text: string): string {
  const letters = text.replace(/[^A-Za-zÀ-ÿ]/g, '');
  const upper = letters.replace(/[^A-ZÀ-Þ]/g, '').length;
  if (letters.length < 8 || upper / letters.length < 0.6) return text;
  let first = true;
  return text.replace(/[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9'’-]*/g, word => {
    const lower = word.toLocaleLowerCase('pt-BR');
    let out: string;
    if (FIXED_CASE[lower]) out = FIXED_CASE[lower];
    else if (/\d/.test(word) || KEEP_UPPER.has(word)) out = word;
    else out = lower;
    if (first && /^[a-zà-ÿ]/.test(out)) out = out.charAt(0).toLocaleUpperCase('pt-BR') + out.slice(1);
    first = false;
    return out;
  }).replace(/([.!?]\s+)([a-zà-ÿ])/g, (_m, sep: string, ch: string) => sep + ch.toLocaleUpperCase('pt-BR'));
}

const clean = (value: string) => value.replace(/\s+/g, ' ').replace(/^[\s,;:.\-–—|]+|[\s,;:.\-–—|]+$/g, '').trim();

/**
 * Texto do grupo ("CORRE, PREÇÃO ✅ BIKE ERGOMÉTRICA De R$ 1.100,00 🔥POR R$ 489,90 no Pix🔥 Loja Oficial")
 * → { title: "Bike ergométrica", oldPrice: "R$ 1.100,00", price: "R$ 489,90", priceNote: "no Pix",
 * details: "Loja oficial" }. Sem preço reconhecido, o texto inteiro vira o título. Só exibição:
 * o texto guardado não muda.
 */
export function formatOfferText(raw: string): OfferDisplay {
  const base = String(raw ?? '').replace(AD_TAG_RE, ' ');
  // O gancho ("CORRE, PREÇÃO NA…") vem antes do primeiro ✅; o produto, depois.
  const check = base.indexOf('✅');
  const body = (check > 0 && check < base.length - 10 ? base.slice(check + 1) : base).replace(DECOR_RE, ' ');
  const plain = clean(body.replace(/\s+/g, ' ').replace(LINK_CALL_RE, ''));
  const newMatch = NEW_PRICE_RE.exec(plain);
  const oldMatch = OLD_PRICE_RE.exec(plain);
  if (!newMatch) {
    // Preço solto, sem "POR" ("Perfume X 200 ml R$169,20 Cupom: ABC"): o primeiro preço vale.
    // "… De R$ 500,99 POR R$…" (texto cortado antes do preço novo): o único preço é o ANTIGO.
    // Mostrar como preço atual enganaria; sai só o nome do produto.
    if (oldMatch) {
      return { title: tidyOfferCase(clean(plain.slice(0, oldMatch.index))) || tidyOfferCase(clean(plain)), oldPrice: null, price: null, priceNote: null, details: null };
    }
    const loose = ANY_PRICE_RE.exec(plain);
    if (!loose || loose.index < 3) {
      return { title: tidyOfferCase(clean(plain)), oldPrice: null, price: null, priceNote: null, details: null };
    }
    const rest = clean(plain.slice(loose.index + loose[0].length).replace(CUT_COUPON_RE, ''));
    return {
      title: tidyOfferCase(clean(plain.slice(0, loose.index))),
      oldPrice: null,
      price: loose[0].replace(/^R\$\s?/, 'R$ '),
      priceNote: null,
      details: rest ? tidyOfferCase(rest) : null,
    };
  }
  const cutAt = Math.min(oldMatch && oldMatch.index < newMatch.index ? oldMatch.index : newMatch.index, newMatch.index);
  const title = tidyOfferCase(clean(plain.slice(0, cutAt))) || tidyOfferCase(clean(plain));
  const after = plain.slice(newMatch.index + newMatch[0].length);
  const details = clean(tidyOfferCase(after.replace(CUT_COUPON_RE, '')));
  const note = clean(newMatch[2] ?? '');
  return {
    title,
    oldPrice: oldMatch && oldMatch.index < newMatch.index ? asReais(oldMatch[1]) : null,
    price: asReais(newMatch[1]),
    priceNote: note ? tidyOfferCase(note).replace(/^No pix$/i, 'no Pix').replace(/^À vista$/i, 'à vista') : null,
    details: details || null,
  };
}

/** Linha da view `group_offers_latest`: a oferta mais recente de cada feed. */
export interface LatestOfferRow {
  feed_slug: string;
  text: string;
  link: string;
  store: string | null;
  sent_at: string | null;
  image_url?: string | null;
}

/**
 * Diretório: grupo (página) → última oferta dele. O feed de cada grupo sai do link da página
 * (`join_url`); sem link próprio, o do grupo geral. Grupo sem oferta nos últimos 7 dias fica de fora.
 */
export function latestOffersByGroup(
  groups: Array<{ slug: string; join_url?: string | null }>,
  globalJoinUrl: string | null,
  rows: LatestOfferRow[]
): Record<string, GroupOffer> {
  const byFeed = new Map<string, GroupOffer>();
  for (const row of rows) {
    const [offer] = parseGroupOffers({ items: [{ text: row.text, link: row.link, store: row.store, sentAt: row.sent_at, image: row.image_url ?? null }] }, 1);
    if (offer && row.feed_slug) byFeed.set(row.feed_slug, offer);
  }
  const out: Record<string, GroupOffer> = {};
  for (const group of groups) {
    const feed = offerFeedSlug(safeExternalUrl(group.join_url) ?? globalJoinUrl);
    const offer = feed ? byFeed.get(feed) : undefined;
    if (offer) out[group.slug] = offer;
  }
  return out;
}

/** O mais recente entre as datas (ISO); nenhuma válida → null. */
export function newestDate(...dates: Array<string | null | undefined>): string | null {
  const valid = dates.filter((date): date is string => Boolean(date) && !Number.isNaN(Date.parse(String(date))));
  return valid.sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? null;
}

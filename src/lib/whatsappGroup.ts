// Regras das páginas do grupo de ofertas no WhatsApp (/grupo-whatsapp).
// Módulo puro (sem Supabase nem React) porque o prerender do Edge e o React
// precisam chegar ao MESMO texto e ao MESMO link — o HTML do servidor e a
// página montada no navegador não podem divergir.

/** Linha da tabela servida em /grupo-whatsapp (sem sufixo). */
export const GROUP_HUB_SLUG = 'principal';

export const GROUP_BASE_PATH = '/grupo-whatsapp';

/** Páginas de ofertas do dia por nicho (mesma tabela das páginas do grupo, `page_type = 'offers'`). */
export const OFFERS_BASE_PATH = '/ofertas';

export interface GroupFaqItem {
  question: string;
  answer: string;
}

export interface WhatsappGroupInfo {
  group_name: string;
  offers_per_day: string;
  stores: string;
  admins_only: boolean;
  channel_url: string;
  /** Grupo de nicho: volume em frase pronta ("cerca de 5 ofertas por dia"). Vazio = não informado. */
  volume?: string;
}

export interface WhatsappGroupPageData {
  slug: string;
  store_slug: string | null;
  title: string;
  h1: string;
  meta_description: string;
  intro: string;
  content: string;
  faq: unknown;
  join_url: string | null;
  sort_order: number;
  updated_at: string | null;
  /** Grupo de nicho: nome do grupo no WhatsApp (vazio = o grupo geral). */
  group_name?: string | null;
  /** Grupo de nicho: o que chega nele (ex.: "tecnologia, games e informática"). */
  topics?: string | null;
  /** `offers` = página de ofertas (/ofertas/<slug>); vazio ou `group` = página do grupo. */
  page_type?: string | null;
  /** Página de ofertas: termos que filtram as ofertas do grupo (separados por vírgula). */
  offer_terms?: string | null;
  /** Grupo de nicho: quantas ofertas chegam, em frase pronta ("cerca de 2 ofertas por semana"). */
  offer_volume?: string | null;
}

/**
 * Link Inteligente (linkdivulgador.com.br): troca de grupo quando um lota e conta
 * clique por dia. Convite direto (chat.whatsapp.com) morre quando o grupo enche
 * ou o convite é revogado — foi o que quebrou os botões antigos do site.
 * Só vale como padrão: o link em uso vem de `site_settings.global_links`.
 */
export const DEFAULT_JOIN_URL = 'https://linkdivulgador.com.br/g/ofertas-fafaciane';

export const DEFAULT_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb7lYdN30LKPIIWG2i2O';

export const DEFAULT_GROUP_INFO: WhatsappGroupInfo = {
  group_name: 'Grupo de Ofertas Fafaciane',
  offers_per_day: 'cerca de 200',
  stores: 'Shopee, Mercado Livre, Amazon, Magalu e Shein',
  admins_only: true,
  channel_url: DEFAULT_CHANNEL_URL,
};

export function groupPagePath(slug: string): string {
  return slug === GROUP_HUB_SLUG ? GROUP_BASE_PATH : `${GROUP_BASE_PATH}/${slug}`;
}

export function isOffersPage(page: Pick<WhatsappGroupPageData, 'page_type'> | null | undefined): boolean {
  return page?.page_type === 'offers';
}

/** Endereço da página pelo tipo: /ofertas/<slug> ou /grupo-whatsapp/<slug>. */
export function pagePath(page: Pick<WhatsappGroupPageData, 'slug' | 'page_type'>): string {
  return isOffersPage(page) ? `${OFFERS_BASE_PATH}/${page.slug}` : groupPagePath(page.slug);
}

/** Valor do `site_settings` mesclado com o padrão: chave faltando não pode sumir da página. */
export function mergeGroupInfo(raw: unknown): WhatsappGroupInfo {
  if (!raw || typeof raw !== 'object') return DEFAULT_GROUP_INFO;
  const value = raw as Partial<Record<keyof WhatsappGroupInfo, unknown>>;
  const text = (key: 'group_name' | 'offers_per_day' | 'stores' | 'channel_url') =>
    typeof value[key] === 'string' ? (value[key] as string).trim() : DEFAULT_GROUP_INFO[key];
  return {
    group_name: text('group_name') || DEFAULT_GROUP_INFO.group_name,
    offers_per_day: text('offers_per_day') || DEFAULT_GROUP_INFO.offers_per_day,
    stores: text('stores') || DEFAULT_GROUP_INFO.stores,
    admins_only: typeof value.admins_only === 'boolean' ? value.admins_only : DEFAULT_GROUP_INFO.admins_only,
    channel_url: safeExternalUrl(text('channel_url')) ?? '',
  };
}

/** FAQ vem de JSONB editável no painel: item sem pergunta ou resposta fica fora (FAQPage inválido derruba o rich result). */
export function parseGroupFaq(raw: unknown): GroupFaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(item => {
      if (!item || typeof item !== 'object') return null;
      const { question, answer } = item as Record<string, unknown>;
      if (typeof question !== 'string' || typeof answer !== 'string') return null;
      const q = question.trim();
      const a = answer.trim();
      return q && a ? { question: q, answer: a } : null;
    })
    .filter((item): item is GroupFaqItem => item !== null);
}

/** Só http(s): o link vai para `href` e um `javascript:` salvo no painel viraria XSS. */
export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  try {
    return new URL(trimmed).toString();
  } catch {
    return null;
  }
}

/**
 * Primeira imagem `![alt](url)` do conteúdo da página: vira o og:image, para o
 * link compartilhado no WhatsApp sair com a ilustração da página.
 */
export function firstContentImage(content: string | null | undefined): string | null {
  const match = /!\[[^\]]*\]\(\s*([^)\s]+)/.exec(content ?? '');
  return safeExternalUrl(match?.[1]);
}

/**
 * Link do botão "Entrar no grupo": o Link Inteligente da página, senão o link
 * global do site. Nunca `#`: botão que não leva a lugar nenhum perde o lead.
 */
export function resolveJoinUrl(
  page: Pick<WhatsappGroupPageData, 'join_url'> | null | undefined,
  globalUrl: string | null | undefined
): string {
  return safeExternalUrl(page?.join_url) ?? safeExternalUrl(globalUrl) ?? DEFAULT_JOIN_URL;
}

/** Página de grupo de nicho: tem nome de grupo ou assuntos próprios. */
export function isNichePage(page: Pick<WhatsappGroupPageData, 'group_name' | 'topics'> | null | undefined): boolean {
  return Boolean(page?.group_name?.trim() || page?.topics?.trim());
}

/**
 * Fatos do grupo que valem nesta página. Grupo de nicho troca o nome e o que
 * chega; "ofertas por dia" é do grupo geral e sai, para não prometer volume
 * que o nicho não tem.
 */
export function groupInfoForPage(
  info: WhatsappGroupInfo,
  page: Pick<WhatsappGroupPageData, 'group_name' | 'topics' | 'offer_volume'> | null | undefined
): WhatsappGroupInfo {
  if (!isNichePage(page)) return info;
  return {
    ...info,
    group_name: page?.group_name?.trim() || info.group_name,
    stores: page?.topics?.trim() || info.stores,
    offers_per_day: '',
    volume: page?.offer_volume?.trim() || '',
  };
}

/** Fato "quantas ofertas" para listas: o do grupo geral ou o volume do nicho. */
export function groupVolumeFact(info: WhatsappGroupInfo): string | null {
  if (info.offers_per_day) return `${info.offers_per_day} ofertas por dia`;
  return info.volume || null;
}

/** Rótulo do fato "lojas": no nicho, o que chega é assunto, não loja. */
export function groupTopicsLabel(page: Pick<WhatsappGroupPageData, 'group_name' | 'topics'> | null | undefined): string {
  return isNichePage(page) ? 'Ofertas de' : 'Lojas';
}

/** Título da chamada do grupo: no nicho, o assunto dele; fora, o texto da página. */
export function groupCtaTitle(
  page: Pick<WhatsappGroupPageData, 'group_name' | 'topics'> | null | undefined,
  info: WhatsappGroupInfo,
  fallback: string
): string {
  return isNichePage(page) ? `Receba ofertas de ${info.stores} no WhatsApp` : fallback;
}

/**
 * Grupo de nicho de uma lista de cupons: a categoria mais frequente decide
 * (`coupon_categories.group_slug`, editável no painel). Sem nicho = null.
 */
export function nicheGroupSlug(
  coupons: Array<{ category: string | null }>,
  categories: Array<{ name: string; group_slug?: string | null }>
): string | null {
  const counts = new Map<string, number>();
  for (const coupon of coupons) {
    if (coupon.category) counts.set(coupon.category, (counts.get(coupon.category) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!top) return null;
  return categories.find(category => category.name === top)?.group_slug?.trim() || null;
}

/**
 * Página do grupo para uma loja: a ligada a ela no painel; senão a do nicho
 * dos cupons dela; senão a principal.
 */
export function groupPageForStore<T extends Pick<WhatsappGroupPageData, 'slug' | 'store_slug'>>(
  pages: T[],
  storeSlug: string,
  nicheSlug: string | null = null
): T | null {
  return (
    pages.find(page => page.store_slug === storeSlug) ??
    (nicheSlug ? pages.find(page => page.slug === nicheSlug) : undefined) ??
    pages.find(page => page.slug === GROUP_HUB_SLUG) ??
    null
  );
}

/** Página do grupo de um nicho (categoria); sem nicho publicado, a principal. */
export function groupPageForNiche<T extends Pick<WhatsappGroupPageData, 'slug'>>(
  pages: T[],
  nicheSlug: string | null | undefined
): T | null {
  return (
    (nicheSlug ? pages.find(page => page.slug === nicheSlug) : undefined) ??
    pages.find(page => page.slug === GROUP_HUB_SLUG) ??
    null
  );
}

/** Frase de resumo com os fatos do grupo — é o trecho que a IA tende a citar. */
export function groupFactsSentence(info: WhatsappGroupInfo): string {
  const parts = [
    `${info.group_name}: grátis`,
    info.offers_per_day ? `${info.offers_per_day} ofertas por dia de ${info.stores}` : `ofertas de ${info.stores}`,
    ...(!info.offers_per_day && info.volume ? [info.volume] : []),
  ];
  if (info.admins_only) parts.push('só os administradores postam');
  return `${parts.join(', ')}.`;
}

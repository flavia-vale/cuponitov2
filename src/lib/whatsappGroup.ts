// Regras das páginas do grupo de ofertas no WhatsApp (/grupo-whatsapp).
// Módulo puro (sem Supabase nem React) porque o prerender do Edge e o React
// precisam chegar ao MESMO texto e ao MESMO link — o HTML do servidor e a
// página montada no navegador não podem divergir.

/** Linha da tabela servida em /grupo-whatsapp (sem sufixo). */
export const GROUP_HUB_SLUG = 'principal';

export const GROUP_BASE_PATH = '/grupo-whatsapp';

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
}

/**
 * Link Inteligente do Espelha Grupos: troca de grupo quando um lota e conta
 * clique por dia. Convite direto (chat.whatsapp.com) morre quando o grupo enche
 * ou o convite é revogado — foi o que quebrou os botões antigos do site.
 * Só vale como padrão: o link em uso vem de `site_settings.global_links`.
 */
export const DEFAULT_JOIN_URL = 'https://espelhagrupos.com.br/g/ofertas-fafaciane';

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
 * Link do botão "Entrar no grupo": o Link Inteligente da página, senão o link
 * global do site. Nunca `#`: botão que não leva a lugar nenhum perde o lead.
 */
export function resolveJoinUrl(
  page: Pick<WhatsappGroupPageData, 'join_url'> | null | undefined,
  globalUrl: string | null | undefined
): string {
  return safeExternalUrl(page?.join_url) ?? safeExternalUrl(globalUrl) ?? DEFAULT_JOIN_URL;
}

/** Página do grupo ligada à loja; sem página própria, a principal. */
export function groupPageForStore<T extends Pick<WhatsappGroupPageData, 'slug' | 'store_slug'>>(
  pages: T[],
  storeSlug: string
): T | null {
  return (
    pages.find(page => page.store_slug === storeSlug) ??
    pages.find(page => page.slug === GROUP_HUB_SLUG) ??
    null
  );
}

/** Frase de resumo com os fatos do grupo — é o trecho que a IA tende a citar. */
export function groupFactsSentence(info: WhatsappGroupInfo): string {
  const parts = [
    `${info.group_name}: grátis`,
    `${info.offers_per_day} ofertas por dia de ${info.stores}`,
  ];
  if (info.admins_only) parts.push('só os administradores postam');
  return `${parts.join(', ')}.`;
}

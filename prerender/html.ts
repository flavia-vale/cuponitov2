import { escapeHtml } from './markdown';

export const SITE_URL = 'https://www.cuponito.com.br';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export interface HeadMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  robots?: string;
}

/** Tags de <head> que precisam existir no HTML do servidor (sem JavaScript). */
export function renderHead(meta: HeadMeta, jsonLd: unknown[]): string {
  const image = meta.ogImage || DEFAULT_OG_IMAGE;
  const ogType = meta.ogType || 'website';

  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    meta.robots ? `<meta name="robots" content="${escapeHtml(meta.robots)}" />` : '',
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:site_name" content="Cuponito" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    meta.publishedTime
      ? `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}" />`
      : '',
    meta.modifiedTime
      ? `<meta property="article:modified_time" content="${escapeHtml(meta.modifiedTime)}" />`
      : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
  ].filter(Boolean);

  for (const schema of jsonLd) {
    // `</script>` dentro do JSON encerraria a tag antes da hora
    const json = JSON.stringify(schema).replace(/<\/script/gi, '<\\/script');
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }

  return tags.join('\n    ');
}

/**
 * Injeta head e corpo prerenderizados na casca do SPA.
 *
 * O React monta com `createRoot().render()`, que substitui o conteúdo do
 * container — por isso o corpo prerenderizado pode ir dentro de `#root` sem
 * risco de erro de hidratação. O mesmo HTML é servido para todo mundo
 * (navegador, Googlebot, OAI-SearchBot), então não é dynamic rendering.
 */
export function injectIntoShell(shell: string, head: string, body: string): string {
  let html = shell;

  // A casca traz título, description, canonical e og:* padrão da home. Sem
  // remover, a página sairia com DOIS canonicals apontando para URLs
  // diferentes — o Google ignora os dois — e com og:title da home.
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
  html = html.replace(/<meta\s[^>]*name="description"[^>]*>/gi, '');
  html = html.replace(/<link\s[^>]*rel="canonical"[^>]*>/gi, '');
  html = html.replace(/<meta\s[^>]*property="og:[^"]*"[^>]*>/gi, '');
  html = html.replace(/<meta\s[^>]*name="twitter:[^"]*"[^>]*>/gi, '');

  html = html.replace('</head>', `  ${head}\n  </head>`);

  const rootOpen = html.match(/<div id="root">/i);
  if (rootOpen) {
    const start = html.indexOf(rootOpen[0]);
    const contentStart = start + rootOpen[0].length;
    const end = html.indexOf('<noscript>', contentStart);
    if (end > contentStart) {
      html = `${html.slice(0, contentStart)}${body}${html.slice(end)}`;
    } else {
      html = `${html.slice(0, contentStart)}${body}${html.slice(contentStart)}`;
    }
  }

  return html;
}

export function breadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, position) => ({
      '@type': 'ListItem',
      position: position + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export const CUPONITO_ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Cuponito',
  url: `${SITE_URL}/`,
  logo: DEFAULT_OG_IMAGE,
};

/**
 * Autora usada nos dois domínios com a MESMA descrição — é o que amarra a
 * entidade "Flávia Vale" entre o Cuponito e o Espelha Grupos.
 */
export const FLAVIA_VALE_PERSON = {
  '@type': 'Person',
  '@id': 'https://espelhagrupos.com.br/quem-somos#person',
  name: 'Flávia Vale',
  description:
    'Fundadora do Espelha Grupos, trabalha com tecnologia e opera grupos de ofertas desde 2023.',
  url: 'https://espelhagrupos.com.br/quem-somos',
  sameAs: ['https://espelhagrupos.com.br/quem-somos', `${SITE_URL}/quem-somos`],
};

/** Formata data ISO como "18 de setembro de 2026" sem depender de Intl no Edge. */
const MONTHS_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

export function formatDatePtBr(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${String(date.getUTCDate()).padStart(2, '0')} de ${MONTHS_PT[date.getUTCMonth()]} de ${date.getUTCFullYear()}`;
}

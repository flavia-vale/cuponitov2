import { escapeHtml, markdownToHtml, markdownToPlainText } from './markdown';
import {
  CUPONITO_ORGANIZATION,
  DEFAULT_OG_IMAGE,
  FLAVIA_VALE_PERSON,
  SITE_URL,
  breadcrumb,
  formatDatePtBr,
  renderHead,
  type HeadMeta,
} from './html';
import type {
  PrerenderCategory,
  PrerenderCoupon,
  PrerenderPost,
  PrerenderPostSummary,
  PrerenderStore,
} from './data';

export interface FeaturedPost {
  title: string;
  slug: string;
}

export interface RenderedPage {
  head: string;
  body: string;
}

export interface ChromeLinks {
  stores: PrerenderStore[];
  posts: FeaturedPost[];
}

/** Navegação e rodapé em `<a href>` reais: link que só existe depois do JavaScript não conta. */
function chrome(
  inner: string,
  breadcrumbTrail: Array<{ name: string; url: string }>,
  links: ChromeLinks
): string {
  const { stores, posts } = links;
  const trail = breadcrumbTrail
    .map((item, index) =>
      index === breadcrumbTrail.length - 1
        ? `<span>${escapeHtml(item.name)}</span>`
        : `<a href="${item.url}">${escapeHtml(item.name)}</a> › `
    )
    .join('');

  const storeLinks = stores
    .map(store => `<li><a href="${SITE_URL}/desconto/${store.slug}">Cupom ${escapeHtml(store.name)}</a></li>`)
    .join('');

  // Sem isto o post fica órfão no HTML do servidor: nenhuma página apontaria
  // para ele sem JavaScript, e o crawler não o descobre.
  const postLinks = posts
    .map(post => `<li><a href="${SITE_URL}/blog/${post.slug}">${escapeHtml(post.title)}</a></li>`)
    .join('');

  return `
    <div class="pr">
      <header>
        <a href="${SITE_URL}/">Cuponito</a>
        <nav>
          <a href="${SITE_URL}/cupons">Cupons</a>
          <a href="${SITE_URL}/lojas">Lojas</a>
          <a href="${SITE_URL}/blog">Blog</a>
          <a href="${SITE_URL}/quem-somos">Quem somos</a>
        </nav>
        <nav aria-label="Trilha de navegação">${trail}</nav>
      </header>
      ${inner}
      <footer>
        ${storeLinks ? `<nav aria-label="Lojas em destaque"><ul>${storeLinks}</ul></nav>` : ''}
        ${postLinks ? `<nav aria-label="Guias do Cuponito"><ul>${postLinks}</ul></nav>` : ''}
        <nav>
          <a href="${SITE_URL}/como-funciona">Como funciona</a>
          <a href="${SITE_URL}/perguntas-frequentes">Perguntas frequentes</a>
          <a href="${SITE_URL}/termos-de-uso">Termos de uso</a>
          <a href="${SITE_URL}/fale-conosco">Fale conosco</a>
        </nav>
      </footer>
    </div>`;
}

function parseExtraSchema(raw: unknown): unknown[] {
  if (!raw) return [];
  const value = typeof raw === 'string' ? safeJsonParse(raw) : raw;
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Post do blog ─────────────────────────────────────────────────────────────

export function renderBlogPost(
  post: PrerenderPost,
  authorName: string | null,
  links: ChromeLinks
): RenderedPage {
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const publishedIso = post.published_at || post.created_at || null;
  const modifiedIso = post.updated_at || publishedIso;
  const description =
    post.meta_description || post.excerpt || markdownToPlainText(post.content || '');
  const author = authorName || 'Equipe Cuponito';
  const isFlavia = author.trim().toLowerCase() === 'flávia vale';

  const meta: HeadMeta = {
    title: post.meta_title || `${post.title} | Blog Cuponito`,
    description,
    canonical,
    ogType: 'article',
    ogImage: post.cover_image || DEFAULT_OG_IMAGE,
    publishedTime: publishedIso,
    modifiedTime: modifiedIso,
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${canonical}#article`,
        headline: post.title,
        description,
        inLanguage: 'pt-BR',
        url: canonical,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        datePublished: publishedIso,
        dateModified: modifiedIso,
        author: isFlavia ? FLAVIA_VALE_PERSON : { '@type': 'Person', name: author },
        publisher: CUPONITO_ORGANIZATION,
        ...(post.cover_image ? { image: post.cover_image } : {}),
      },
      breadcrumb([
        { name: 'Página Inicial', url: `${SITE_URL}/` },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: post.title, url: canonical },
      ]),
    ],
  };

  const publishedLabel = formatDatePtBr(publishedIso);
  const modifiedLabel = formatDatePtBr(modifiedIso);

  const body = chrome(
    `
      <main>
        <article>
          <h1>${escapeHtml(post.title)}</h1>
          <p>
            Por ${escapeHtml(author)}
            ${publishedIso ? `· Publicado em <time datetime="${escapeHtml(publishedIso)}">${publishedLabel}</time>` : ''}
            ${modifiedIso ? `· Atualizado em <time datetime="${escapeHtml(modifiedIso)}">${modifiedLabel}</time>` : ''}
          </p>
          ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ''}
          ${post.cover_image ? `<img src="${escapeHtml(post.cover_image)}" alt="${escapeHtml(post.title)}" />` : ''}
          ${markdownToHtml(post.content || '', { demoteHeadings: 1 })}
        </article>
      </main>`,
    [
      { name: 'Cuponito', url: `${SITE_URL}/` },
      { name: 'Blog', url: `${SITE_URL}/blog` },
      { name: post.title, url: canonical },
    ],
    // o próprio post nunca se autolinka no rodapé
    { ...links, posts: links.posts.filter(other => other.slug !== post.slug) }
  );

  return {
    head: renderHead(meta, [articleSchema, ...parseExtraSchema(post.schema_json)]),
    body,
  };
}

// ── Página de loja ───────────────────────────────────────────────────────────

const DATE_LIKE = /^\s*\d{1,2}\/\d{1,2}\/\d{2,4}\s*$/;

function sameText(a?: string | null, b?: string | null): boolean {
  return (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase();
}

function couponListItems(coupons: PrerenderCoupon[], withStore = false): string {
  return coupons
    .map(coupon => {
      // Muitos cupons vêm do feed com a descrição igual ao título e com
      // `expiry_text` ora data, ora texto de desconto. Repetir a mesma frase e
      // largar uma data sem rótulo deixa a lista ilegível para gente e para IA.
      const expiry = coupon.expiry_text?.trim();
      const parts = [
        `<strong>${escapeHtml(coupon.title)}</strong>`,
        withStore && coupon.store ? `<span>${escapeHtml(coupon.store)}</span>` : '',
        coupon.discount && !sameText(coupon.discount, coupon.title)
          ? `<span>${escapeHtml(coupon.discount)}</span>`
          : '',
        coupon.code ? `<span>Código: <code>${escapeHtml(coupon.code)}</code></span>` : '',
        coupon.description && !sameText(coupon.description, coupon.title)
          ? `<span>${escapeHtml(coupon.description)}</span>`
          : '',
        expiry
          ? DATE_LIKE.test(expiry)
            ? `<span>Válido até ${escapeHtml(expiry)}</span>`
            : `<span>${escapeHtml(expiry)}</span>`
          : '',
      ].filter(Boolean);
      return `<li>${parts.join(' — ')}</li>`;
    })
    .join('');
}

function couponOfferList(listName: string, coupons: PrerenderCoupon[]) {
  return {
    '@type': 'ItemList',
    name: listName,
    itemListElement: coupons.map((coupon, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Offer',
        name: `${coupon.title}${coupon.code ? ` — Código: ${coupon.code}` : ''}`,
        ...(coupon.link ? { url: coupon.link } : {}),
        priceCurrency: 'BRL',
        price: '0',
        availability: 'https://schema.org/InStock',
        ...(coupon.expiry ? { validThrough: coupon.expiry } : {}),
        seller: { '@type': 'Organization', name: coupon.store || 'Cuponito' },
      },
    })),
  };
}

export function renderStorePage(
  store: PrerenderStore,
  coupons: PrerenderCoupon[],
  links: ChromeLinks
): RenderedPage {
  const canonical = `${SITE_URL}/desconto/${store.slug}`;
  const description =
    store.meta_description ||
    store.description ||
    `Cupons de desconto ${store.name} verificados e atualizados pela equipe do Cuponito.`;

  // dateModified = cupom mais recente da loja
  const latestUpdate = coupons.reduce<string | null>((acc, coupon) => {
    if (!coupon.updated_at) return acc;
    if (!acc || coupon.updated_at > acc) return coupon.updated_at;
    return acc;
  }, null);

  const meta: HeadMeta = {
    title: `Cupom de Desconto ${store.name} | Cuponito`,
    description,
    canonical,
    ogImage: store.logo_url || DEFAULT_OG_IMAGE,
    modifiedTime: latestUpdate,
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#page`,
        name: `Cupons de Desconto ${store.name}`,
        description,
        url: canonical,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${SITE_URL}/#organization` },
        ...(latestUpdate ? { dateModified: latestUpdate } : {}),
      },
      CUPONITO_ORGANIZATION,
      breadcrumb([
        { name: 'Página Inicial', url: `${SITE_URL}/` },
        { name: 'Lojas', url: `${SITE_URL}/lojas` },
        { name: `Cupons de Desconto ${store.name}`, url: canonical },
      ]),
      ...(coupons.length > 0 ? [couponOfferList(`Cupons de Desconto ${store.name}`, coupons)] : []),
    ],
  };

  const body = chrome(
    `
      <main>
        <article>
          <h1>Cupom de Desconto ${escapeHtml(store.name)}</h1>
          ${latestUpdate ? `<p>Atualizado em <time datetime="${escapeHtml(latestUpdate)}">${formatDatePtBr(latestUpdate)}</time></p>` : ''}
          <p>${escapeHtml(description)}</p>
          ${
            coupons.length > 0
              ? `<h2>Cupons ${escapeHtml(store.name)} ativos</h2><ul>${couponListItems(coupons)}</ul>`
              : `<p>Não há cupons ativos da ${escapeHtml(store.name)} neste momento. Veja <a href="${SITE_URL}/cupons">todos os cupons</a> ou <a href="${SITE_URL}/lojas">as outras lojas</a>.</p>`
          }
        </article>
      </main>`,
    [
      { name: 'Cuponito', url: `${SITE_URL}/` },
      { name: 'Lojas', url: `${SITE_URL}/lojas` },
      { name: store.name, url: canonical },
    ],
    { ...links, stores: links.stores.filter(other => other.slug !== store.slug).slice(0, 6) }
  );

  return { head: renderHead(meta, [schema]), body };
}

// ── Página de categoria ──────────────────────────────────────────────────────

export function renderCategoryPage(
  category: PrerenderCategory,
  coupons: PrerenderCoupon[],
  links: ChromeLinks
): RenderedPage {
  const canonical = `${SITE_URL}/categoria/${category.slug}`;
  const description =
    category.description || `Cupons de desconto da categoria ${category.name} verificados pelo Cuponito.`;

  const meta: HeadMeta = {
    title: `Cupons de ${category.name} | Cuponito`,
    description,
    canonical,
    modifiedTime: category.updated_at,
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#page`,
        name: `Cupons de ${category.name}`,
        description,
        url: canonical,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${SITE_URL}/#organization` },
      },
      CUPONITO_ORGANIZATION,
      breadcrumb([
        { name: 'Página Inicial', url: `${SITE_URL}/` },
        { name: 'Cupons', url: `${SITE_URL}/cupons` },
        { name: category.name, url: canonical },
      ]),
      ...(coupons.length > 0 ? [couponOfferList(`Cupons de ${category.name}`, coupons)] : []),
    ],
  };

  const body = chrome(
    `
      <main>
        <article>
          <h1>Cupons de ${escapeHtml(category.name)}</h1>
          <p>${escapeHtml(description)}</p>
          ${
            coupons.length > 0
              ? `<ul>${couponListItems(coupons)}</ul>`
              : `<p>Nenhum cupom ativo nesta categoria agora. Veja <a href="${SITE_URL}/cupons">todos os cupons</a>.</p>`
          }
        </article>
      </main>`,
    [
      { name: 'Cuponito', url: `${SITE_URL}/` },
      { name: 'Cupons', url: `${SITE_URL}/cupons` },
      { name: category.name, url: canonical },
    ],
    links
  );

  return { head: renderHead(meta, [schema]), body };
}

// ── Quem somos ───────────────────────────────────────────────────────────────

export const ABOUT_ESPELHA_GRUPOS_PARAGRAPHS = [
  'O cuponito nasceu de uma frustração muito simples: a gente clicava num cupom, colava no carrinho e… nada. Expirado. Inválido. Já usado.',
  'Então resolvemos criar o que nós gostaríamos de encontrar: um lugar onde os cupons são testados de verdade, atualizados todo dia, e organizados de um jeito que qualquer pessoa consiga usar: sem precisar de tutorial, sem cadastro, sem enrolação.',
  'Somos um time pequeno com uma missão simples: se tem desconto bom no Brasil, o cuponito acha pra você.',
];

export function renderAboutPage(links: ChromeLinks): RenderedPage {
  const canonical = `${SITE_URL}/quem-somos`;
  const description =
    'Conheça a história do Cuponito e nossa missão de encontrar cupons testados e descontos bons no Brasil.';

  const meta: HeadMeta = {
    title: 'Quem somos nós | Cuponito',
    description,
    canonical,
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...CUPONITO_ORGANIZATION,
        description:
          'Cupons de desconto atualizados diariamente para Amazon, Shopee e Mercado Livre.',
        founder: { '@id': FLAVIA_VALE_PERSON['@id'] },
        sameAs: ['https://espelhagrupos.com.br/quem-somos'],
      },
      FLAVIA_VALE_PERSON,
      {
        '@type': 'AboutPage',
        '@id': `${canonical}#page`,
        name: 'Quem somos nós',
        description,
        url: canonical,
        inLanguage: 'pt-BR',
        about: { '@id': `${SITE_URL}/#organization` },
      },
      breadcrumb([
        { name: 'Página Inicial', url: `${SITE_URL}/` },
        { name: 'Quem somos', url: canonical },
      ]),
    ],
  };

  const body = chrome(
    `
      <main>
        <article>
          <h1>Quem somos nós</h1>
          ${ABOUT_ESPELHA_GRUPOS_PARAGRAPHS.map(text => `<p>${escapeHtml(text)}</p>`).join('\n          ')}
          <h2>Cuponito e Espelha Grupos</h2>
          <p>
            O Cuponito é feito pela mesma equipe do
            <a href="https://espelhagrupos.com.br">Espelha Grupos</a>, software web brasileiro
            para afiliadas e admins de grupos de WhatsApp. O Espelha Grupos espelha ofertas de
            grupos e canais de origem para os seus grupos, troca cada link pelo seu código de
            afiliada (Shopee, Mercado Livre, Amazon, Magalu, SHEIN, AliExpress) e publica com
            filas, intervalos e histórico de envios. Teste grátis de 7 dias; Pro R$ 69 por 30 dias.
          </p>
        </article>
      </main>`,
    [
      { name: 'Cuponito', url: `${SITE_URL}/` },
      { name: 'Quem somos', url: canonical },
    ],
    links
  );

  return { head: renderHead(meta, [schema]), body };
}

// ── Home e listagens ─────────────────────────────────────────────────────────
//
// Sem estas rotas no prerender, as páginas de maior autoridade do site (a home
// e os três hubs) respondiam só a casca do SPA: nenhum texto, nenhum link real
// para loja, categoria ou post. Era o furo que sobrava depois de `/blog/:slug`,
// `/desconto/:slug` e `/categoria/:slug`.

function storeListItems(stores: PrerenderStore[]): string {
  return stores
    .map(
      store =>
        `<li><a href="${SITE_URL}/desconto/${store.slug}">Cupom de desconto ${escapeHtml(store.name)}</a></li>`
    )
    .join('');
}

function categoryListItems(categories: PrerenderCategory[]): string {
  return categories
    .map(
      category =>
        `<li><a href="${SITE_URL}/categoria/${category.slug}">Cupons de ${escapeHtml(category.name)}</a></li>`
    )
    .join('');
}

function postListItems(posts: PrerenderPostSummary[]): string {
  return posts
    .map(post => {
      const date = formatDatePtBr(post.published_at);
      return `<li>
            <a href="${SITE_URL}/blog/${post.slug}">${escapeHtml(post.title)}</a>
            ${post.published_at ? `<time datetime="${escapeHtml(post.published_at)}">${date}</time>` : ''}
            ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ''}
          </li>`;
    })
    .join('');
}

function latestUpdate(rows: Array<{ updated_at?: string | null }>): string | null {
  return rows.reduce<string | null>((acc, row) => {
    if (!row.updated_at) return acc;
    return !acc || row.updated_at > acc ? row.updated_at : acc;
  }, null);
}

export interface HomeData {
  coupons: PrerenderCoupon[];
  stores: PrerenderStore[];
  categories: PrerenderCategory[];
  posts: PrerenderPostSummary[];
}

export function renderHomePage(data: HomeData): RenderedPage {
  const canonical = `${SITE_URL}/`;
  const description =
    'Encontre cupons de desconto atualizados diariamente para Amazon, Shopee, Mercado Livre e centenas de outras lojas. Economia real e verificada.';
  const updated = latestUpdate(data.coupons);

  const meta: HeadMeta = {
    title: 'Cuponito - Cupons de Desconto Verificados',
    description,
    canonical,
    modifiedTime: updated,
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Cuponito',
        url: canonical,
        inLanguage: 'pt-BR',
        description,
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/cupons?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      { ...CUPONITO_ORGANIZATION, founder: { '@id': FLAVIA_VALE_PERSON['@id'] } },
      breadcrumb([{ name: 'Página Inicial', url: canonical }]),
      ...(data.coupons.length > 0
        ? [couponOfferList('Top Cupons de Desconto', data.coupons.slice(0, 20))]
        : []),
    ],
  };

  const body = chrome(
    `
      <main>
        <h1>Cupons de desconto verificados todos os dias</h1>
        <p>${escapeHtml(description)}</p>
        ${updated ? `<p>Última atualização dos cupons: <time datetime="${escapeHtml(updated)}">${formatDatePtBr(updated)}</time></p>` : ''}

        ${
          data.coupons.length > 0
            ? `<h2>Cupons em destaque</h2><ul>${couponListItems(data.coupons.slice(0, 12), true)}</ul>
               <p><a href="${SITE_URL}/cupons">Ver todos os cupons</a></p>`
            : ''
        }

        ${
          data.stores.length > 0
            ? `<h2>Lojas com cupom</h2><ul>${storeListItems(data.stores.slice(0, 12))}</ul>
               <p><a href="${SITE_URL}/lojas">Ver todas as lojas</a></p>`
            : ''
        }

        ${
          data.categories.length > 0
            ? `<h2>Categorias</h2><ul>${categoryListItems(data.categories.slice(0, 12))}</ul>`
            : ''
        }

        ${
          data.posts.length > 0
            ? `<h2>Guias do Cuponito</h2><ul>${postListItems(data.posts.slice(0, 5))}</ul>
               <p><a href="${SITE_URL}/blog">Ver o blog</a></p>`
            : ''
        }
      </main>`,
    [{ name: 'Cuponito', url: canonical }],
    { stores: [], posts: [] }
  );

  return { head: renderHead(meta, [schema]), body };
}

export function renderCouponsPage(
  coupons: PrerenderCoupon[],
  categories: PrerenderCategory[],
  links: ChromeLinks
): RenderedPage {
  const canonical = `${SITE_URL}/cupons`;
  const description =
    'Lista atualizada de cupons de desconto verificados para as maiores lojas do Brasil.';
  const updated = latestUpdate(coupons);

  const meta: HeadMeta = {
    title: 'Todos os Cupons de Desconto | Cuponito',
    description,
    canonical,
    modifiedTime: updated,
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#page`,
        name: 'Todos os Cupons de Desconto',
        description,
        url: canonical,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${SITE_URL}/#organization` },
        ...(updated ? { dateModified: updated } : {}),
      },
      CUPONITO_ORGANIZATION,
      breadcrumb([
        { name: 'Página Inicial', url: `${SITE_URL}/` },
        { name: 'Todos os Cupons', url: canonical },
      ]),
      ...(coupons.length > 0 ? [couponOfferList('Todos os Cupons de Desconto', coupons)] : []),
    ],
  };

  const body = chrome(
    `
      <main>
        <h1>Todos os cupons de desconto</h1>
        <p>${escapeHtml(description)}</p>
        ${updated ? `<p>Atualizado em <time datetime="${escapeHtml(updated)}">${formatDatePtBr(updated)}</time></p>` : ''}
        ${coupons.length > 0 ? `<ul>${couponListItems(coupons, true)}</ul>` : '<p>Nenhum cupom ativo neste momento.</p>'}
        ${categories.length > 0 ? `<h2>Por categoria</h2><ul>${categoryListItems(categories)}</ul>` : ''}
      </main>`,
    [
      { name: 'Cuponito', url: `${SITE_URL}/` },
      { name: 'Cupons', url: canonical },
    ],
    links
  );

  return { head: renderHead(meta, [schema]), body };
}

export function renderStoresPage(stores: PrerenderStore[], links: ChromeLinks): RenderedPage {
  const canonical = `${SITE_URL}/lojas`;
  const description =
    'Encontre cupons de desconto das melhores lojas do Brasil: Amazon, Shopee, Mercado Livre e centenas de outras lojas verificadas.';

  const meta: HeadMeta = {
    title: 'Lojas com Cupom de Desconto | Cuponito',
    description,
    canonical,
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#page`,
        name: 'Todas as Lojas com Cupons',
        description,
        url: canonical,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${SITE_URL}/#organization` },
      },
      CUPONITO_ORGANIZATION,
      breadcrumb([
        { name: 'Página Inicial', url: `${SITE_URL}/` },
        { name: 'Todas as Lojas', url: canonical },
      ]),
      {
        '@type': 'ItemList',
        name: 'Lojas com cupom de desconto',
        itemListElement: stores.map((store, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: store.name,
          url: `${SITE_URL}/desconto/${store.slug}`,
        })),
      },
    ],
  };

  const body = chrome(
    `
      <main>
        <h1>Todas as lojas com cupom de desconto</h1>
        <p>${escapeHtml(description)}</p>
        <p>${stores.length} lojas com cupons conferidos pela equipe do Cuponito.</p>
        ${stores.length > 0 ? `<ul>${storeListItems(stores)}</ul>` : '<p>Nenhuma loja ativa neste momento.</p>'}
      </main>`,
    [
      { name: 'Cuponito', url: `${SITE_URL}/` },
      { name: 'Lojas', url: canonical },
    ],
    links
  );

  return { head: renderHead(meta, [schema]), body };
}

export function renderBlogListPage(
  posts: PrerenderPostSummary[],
  links: ChromeLinks
): RenderedPage {
  const canonical = `${SITE_URL}/blog`;
  const description =
    'Guias e comparativos do Cuponito sobre cupons, ofertas e ferramentas para quem divulga como afiliado.';
  const updated = latestUpdate(posts);

  const meta: HeadMeta = {
    title: 'Blog | Cuponito',
    description,
    canonical,
    modifiedTime: updated,
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${canonical}#blog`,
        name: 'Blog do Cuponito',
        description,
        url: canonical,
        inLanguage: 'pt-BR',
        publisher: { '@id': `${SITE_URL}/#organization` },
        blogPost: posts.map(post => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: `${SITE_URL}/blog/${post.slug}`,
          ...(post.published_at ? { datePublished: post.published_at } : {}),
        })),
      },
      CUPONITO_ORGANIZATION,
      breadcrumb([
        { name: 'Página Inicial', url: `${SITE_URL}/` },
        { name: 'Blog', url: canonical },
      ]),
    ],
  };

  const body = chrome(
    `
      <main>
        <h1>Blog do Cuponito</h1>
        <p>${escapeHtml(description)}</p>
        ${posts.length > 0 ? `<ul>${postListItems(posts)}</ul>` : '<p>Nenhum artigo publicado ainda.</p>'}
      </main>`,
    [
      { name: 'Cuponito', url: `${SITE_URL}/` },
      { name: 'Blog', url: canonical },
    ],
    // a listagem já linka todos os posts no corpo; repetir no rodapé é ruído
    { ...links, posts: [] }
  );

  return { head: renderHead(meta, [schema]), body };
}

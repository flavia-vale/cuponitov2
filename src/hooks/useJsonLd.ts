import { useMemo } from 'react';
import type { Coupon } from '@/hooks/useCoupons';
import { SITE_URL } from '@/lib/seo';

function fallbackValidThrough() {
  return `${new Date().getFullYear()}-12-31`;
}

// ── Breadcrumbs ──────────────────────────────────────────────────────────────

function breadcrumbHome() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Página Inicial", item: `${SITE_URL}/` },
    ],
  };
}

function breadcrumbStore(storeName: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Página Inicial", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: `Cupons de Desconto ${storeName}`, item: `${SITE_URL}/desconto/${slug}` },
    ],
  };
}

function breadcrumbBlog(articleTitle: string, articleSlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Página Inicial", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: articleTitle, item: `${SITE_URL}/blog/${articleSlug}` },
    ],
  };
}

function breadcrumbLojas() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Página Inicial", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Todas as Lojas", item: `${SITE_URL}/lojas` },
    ],
  };
}

function breadcrumbCupons() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Página Inicial", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Todos os Cupons", item: `${SITE_URL}/cupons` },
    ],
  };
}

function breadcrumbBlogList() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Página Inicial", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };
}

// ── Schemas base ─────────────────────────────────────────────────────────────

function orgSchema(name = 'Cuponito', url = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    description: "Cupons de desconto atualizados diariamente para Amazon, Shopee e Mercado Livre.",
    logo: `${SITE_URL}/og-image.png`,
  };
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cuponito",
    url: SITE_URL,
    description: "Cupons de desconto atualizados diariamente para Amazon, Shopee e Mercado Livre.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/cupons?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function faqPageSchema(storeName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `O cupom ${storeName} é gratuito?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sim, todos os cupons listados aqui são completamente gratuitos. O Cuponito nunca cobra para exibir ou liberar um cupom.`,
        },
      },
      {
        "@type": "Question",
        name: `Os cupons ${storeName} funcionam no app?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A maioria dos cupons funciona tanto no site quanto no app. Alguns podem ser exclusivos do app.`,
        },
      },
      {
        "@type": "Question",
        name: `Com que frequência os cupons são atualizados?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Nossa equipe verifica e atualiza os cupons da ${storeName} várias vezes ao dia.`,
        },
      },
    ],
  };
}

function couponItemList(listName: string, coupons: Coupon[]) {
  const fallback = fallbackValidThrough();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: coupons.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Offer",
        name: `${c.title}${c.code ? ` — Código: ${c.code}` : ''}${c.discount ? ` (${c.discount})` : ''}`,
        description: `${c.title}${c.code ? ` — Use o código: ${c.code}` : ''}${c.discount ? ` — Desconto: ${c.discount}` : ''} na loja ${c.store}.`,
        url: c.link,
        seller: { "@type": "Organization", name: c.store },
        priceCurrency: "BRL",
        price: "0",
        validThrough: c.expiry || fallback,
        availability: "https://schema.org/InStock",
      },
    })),
  };
}

export interface BlogArticle {
  title: string;
  slug: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  imageUrl?: string;
}

function blogPostingSchema(article: BlogArticle) {
  const canonicalUrl = `${SITE_URL}/blog/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    headline: article.title,
    description: article.description,
    url: canonicalUrl,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.authorName || "Cuponito",
      ...(article.authorUrl ? { url: article.authorUrl } : {}),
    },
    publisher: orgSchema(),
    ...(article.imageUrl ? { image: article.imageUrl } : {}),
  };
}

// ── Tipos de rota ─────────────────────────────────────────────────────────────

type HomeRoute = { type: 'home'; coupons: Coupon[] };
type StoreRoute = { type: 'store'; storeName: string; slug: string; coupons: Coupon[] };
type BlogRoute = { type: 'blog'; article: BlogArticle };
type LojasRoute = { type: 'lojas' };
type CuponsRoute = { type: 'cupons' };
type BlogListRoute = { type: 'blog-list' };
type GenericRoute = { type: 'generic' };

export type JsonLdRoute =
  | HomeRoute
  | StoreRoute
  | BlogRoute
  | LojasRoute
  | CuponsRoute
  | BlogListRoute
  | GenericRoute;

export function useJsonLd(route: JsonLdRoute): object[] {
  return useMemo(() => {
    switch (route.type) {
      case 'home':
        return [
          websiteSchema(),
          orgSchema(),
          breadcrumbHome(),
          ...(route.coupons.length > 0
            ? [couponItemList("Top Cupons de Desconto", route.coupons)]
            : []),
        ];
      case 'store':
        return [
          { ...orgSchema(route.storeName, `${SITE_URL}/desconto/${route.slug}`) },
          breadcrumbStore(route.storeName, route.slug),
          faqPageSchema(route.storeName),
          ...(route.coupons.length > 0
            ? [couponItemList(`Cupons de Desconto ${route.storeName}`, route.coupons)]
            : []),
        ];
      case 'blog':
        return [
          orgSchema(),
          breadcrumbBlog(route.article.title, route.article.slug),
          blogPostingSchema(route.article),
        ];
      case 'lojas':
        return [orgSchema(), breadcrumbLojas()];
      case 'cupons':
        return [orgSchema(), breadcrumbCupons()];
      case 'blog-list':
        return [orgSchema(), breadcrumbBlogList()];
      case 'generic':
      default:
        return [orgSchema()];
    }
  }, [route]);
}

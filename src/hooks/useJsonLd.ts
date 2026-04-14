import { useMemo } from 'react';
import type { Coupon } from '@/hooks/useCoupons';

const BASE_URL = 'https://cuponito.com.br';

function fallbackValidThrough() {
  return `${new Date().getFullYear()}-12-31`;
}

function breadcrumbHome() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Página Inicial", item: `${BASE_URL}/` },
    ],
  };
}

function breadcrumbStore(storeName: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Página Inicial", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: `Cupons de Desconto ${storeName}`, item: `${BASE_URL}/desconto/${slug}` },
    ],
  };
}

function breadcrumbBlog(articleTitle: string, articleSlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Página Inicial", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: articleTitle, item: `${BASE_URL}/blog/${articleSlug}` },
    ],
  };
}

function orgSchema(name = 'Cuponito', url = BASE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    description: "Cupons de desconto atualizados diariamente para Amazon, Shopee e Mercado Livre.",
    logo: `${BASE_URL}/og-image.png`,
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
  const canonicalUrl = `${BASE_URL}/blog/${article.slug}`;
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

type HomeRoute = { type: 'home'; coupons: Coupon[] };
type StoreRoute = { type: 'store'; storeName: string; slug: string; coupons: Coupon[] };
type BlogRoute = { type: 'blog'; article: BlogArticle };
type GenericRoute = { type: 'generic' };

export type JsonLdRoute = HomeRoute | StoreRoute | BlogRoute | GenericRoute;

export function useJsonLd(route: JsonLdRoute): object[] {
  return useMemo(() => {
    switch (route.type) {
      case 'home': {
        const schemas: object[] = [orgSchema(), breadcrumbHome()];
        if (route.coupons.length > 0) {
          schemas.push(couponItemList("Top Cupons de Desconto", route.coupons));
        }
        return schemas;
      }
      case 'store': {
        const schemas: object[] = [
          { ...orgSchema(route.storeName, `${BASE_URL}/desconto/${route.slug}`) },
          breadcrumbStore(route.storeName, route.slug),
        ];
        if (route.coupons.length > 0) {
          schemas.push(couponItemList(`Cupons de Desconto ${route.storeName}`, route.coupons));
        }
        return schemas;
      }
      case 'blog': {
        return [
          orgSchema(),
          breadcrumbBlog(route.article.title, route.article.slug),
          blogPostingSchema(route.article),
        ];
      }
      case 'generic':
      default:
        return [orgSchema()];
    }
  }, [route]);
}

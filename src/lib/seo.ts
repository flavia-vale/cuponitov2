export const SITE_URL = 'https://www.cuponito.com.br';

// A sincronização com a Lomadee cria lojas repetidas com o UUID colado no fim do slug
// (`cupom-desconto-loja-lomadee-6fe8dae4-…`). A página "de verdade" é a de slug sem o UUID;
// as repetidas apontam o canonical para ela e ficam fora do sitemap.
const STORE_DUPLICATE_SUFFIX = /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Slug da loja principal: o mesmo slug sem o UUID de duplicata (se não tem, devolve o próprio). */
export function primaryStoreSlug(slug: string): string {
  return slug.replace(STORE_DUPLICATE_SUFFIX, '');
}

export function getLatestUpdatedLabel(
  items: Array<{ updated_at?: string | null }> | null | undefined,
  locale = 'pt-BR'
): string | null {
  if (!items || items.length === 0) return null;

  const latestMs = items.reduce<number | null>((acc, item) => {
    if (!item.updated_at) return acc;
    const parsed = new Date(item.updated_at).getTime();
    if (Number.isNaN(parsed)) return acc;
    return acc === null || parsed > acc ? parsed : acc;
  }, null);

  if (latestMs === null) return null;

  return new Date(latestMs).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// Meta description de loja e categoria (Bing, 22/11: "meta descriptions too short", 19 páginas).
// Uma função só para o React e o HTML do servidor (antes o React dizia "até 80% OFF", tirado em
// 12/11 por não valer para toda loja). Abaixo de 110 caracteres, completa com fatos do site.
const META_MIN = 110;
const clean = (value: string | null | undefined) => String(value ?? '').replace(/\s+/g, ' ').trim();
const withPeriod = (value: string) => (/[.!?…]$/.test(value) ? value : `${value}.`);

// "Geral" e "Ofertas no link" são as categorias-balde do painel (AdminOffersTab, CouponExtractor):
// "Cupons de Geral" não lê como frase. As demais seguem "Cupons de <nome>".
const CATEGORY_HEADINGS: Record<string, string> = {
  geral: 'Cupons de desconto gerais',
  'ofertas no link': 'Ofertas com desconto direto no link',
};

/** Título e H1 da página da categoria (o mesmo no React e no HTML do servidor). */
export function categoryHeading(name: string | null | undefined): string {
  const label = clean(name);
  return CATEGORY_HEADINGS[label.toLowerCase()] ?? `Cupons de ${label}`;
}

/** Loja: a descrição do painel quando tem tamanho; senão o texto padrão (≈150 caracteres). */
export function storeMetaDescription(store: { name: string; meta_description?: string | null; description?: string | null }): string {
  const own = clean(store.meta_description) || clean(store.description);
  if (own.length >= META_MIN) return own;
  return `Cupom de desconto ${clean(store.name)} hoje: cupons verificados e atualizados pela equipe do Cuponito, com o link da loja oficial e as ofertas no WhatsApp.`;
}

/** Categoria: o texto do painel, completado quando é curto. */
export function categoryMetaDescription(category: { name: string; description?: string | null }): string {
  const own = clean(category.description);
  if (own.length >= META_MIN) return own;
  const tail = 'Verificados pelo Cuponito, com o link da loja oficial e as ofertas do dia no WhatsApp.';
  return own ? `${withPeriod(own)} ${tail}` : `${categoryHeading(category.name)} ${tail.charAt(0).toLowerCase()}${tail.slice(1)}`;
}

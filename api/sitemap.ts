import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BASE_URL = 'https://www.cuponito.com.br'

function formatDate(dateStr?: string | null): string | null {
  if (!dateStr) return null
  return dateStr.split('T')[0]
}

// `lastmod` só sai quando existe data real de mudança. Página fixa com
// lastmod = "hoje" não informa nada ao crawler e queima confiança no sitemap.
function urlEntry(
  loc: string,
  lastmod: string | null,
  changefreq: string,
  priority: number
): string {
  return `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
}

/** Data mais recente de uma lista de registros, em YYYY-MM-DD. */
function latestDate(rows: Array<{ updated_at?: string | null }>): string | null {
  const latest = rows.reduce<string | null>((acc, row) => {
    if (!row.updated_at) return acc
    return !acc || row.updated_at > acc ? row.updated_at : acc
  }, null)
  return latest ? latest.split('T')[0] : null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const [storesResult, postsResult, categoriesResult, couponsResult] = await Promise.all([
    supabase
      .from('stores')
      .select('slug, updated_at')
      .eq('active', true)
      .order('name'),
    supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase
      .from('coupon_categories')
      .select('slug, updated_at')
      .order('sort_order')
      .order('name'),
    supabase
      .from('coupons')
      .select('updated_at')
      .eq('status', true)
      .order('updated_at', { ascending: false })
      .limit(1),
  ])

  const stores = storesResult.data ?? []
  const posts = postsResult.data ?? []
  const categories = categoriesResult.data ?? []
  const coupons = couponsResult.data ?? []

  // Páginas estáticas — ordem reflete importância para crawlers.
  // As institucionais saem sem lastmod (não mudam com o deploy); as de
  // listagem herdam a data real do conteúdo mais recente que exibem.
  const couponsLastmod = latestDate(coupons)
  const storesLastmod = latestDate(stores)
  const postsLastmod = latestDate(posts)
  const homeLastmod = [couponsLastmod, storesLastmod, postsLastmod]
    .filter((date): date is string => Boolean(date))
    .sort()
    .pop() ?? null

  const staticUrls = [
    urlEntry(`${BASE_URL}/`, homeLastmod, 'daily', 1.0),
    urlEntry(`${BASE_URL}/cupons`, couponsLastmod, 'daily', 0.9),
    urlEntry(`${BASE_URL}/lojas`, storesLastmod, 'weekly', 0.8),
    urlEntry(`${BASE_URL}/blog`, postsLastmod, 'weekly', 0.7),
    urlEntry(`${BASE_URL}/quem-somos`, null, 'monthly', 0.5),
    urlEntry(`${BASE_URL}/como-funciona`, null, 'monthly', 0.5),
    urlEntry(`${BASE_URL}/fale-conosco`, null, 'monthly', 0.5),
    urlEntry(`${BASE_URL}/perguntas-frequentes`, null, 'monthly', 0.5),
    urlEntry(`${BASE_URL}/termos-de-uso`, null, 'monthly', 0.4),
    ...categories.map(category =>
      urlEntry(
        `${BASE_URL}/categoria/${category.slug}`,
        formatDate(category.updated_at),
        'daily',
        0.7
      )
    ),
  ].join('\n')

  // Páginas de loja — core do site, atualizam com frequência
  const storeUrls = stores
    .map(store =>
      urlEntry(
        `${BASE_URL}/desconto/${store.slug}`,
        formatDate(store.updated_at),
        'daily',
        0.8
      )
    )
    .join('\n')

  // Posts do blog — conteúdo estável após publicação
  const postUrls = posts
    .map(post =>
      urlEntry(
        `${BASE_URL}/blog/${post.slug}`,
        formatDate(post.updated_at),
        'monthly',
        0.6
      )
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticUrls}
${storeUrls}
${postUrls}
</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  // Cache de 6h no CDN; serve versão stale por até 24h enquanto revalida em background
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400')
  res.status(200).send(xml)
}

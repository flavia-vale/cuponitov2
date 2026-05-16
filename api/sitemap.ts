import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BASE_URL = 'https://www.cuponito.com.br'

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return new Date().toISOString().split('T')[0]
  return dateStr.split('T')[0]
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: number): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const today = new Date().toISOString().split('T')[0]

  const [storesResult, postsResult, categoriesResult] = await Promise.all([
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
  ])

  const stores = storesResult.data ?? []
  const posts = postsResult.data ?? []
  const categories = categoriesResult.data ?? []

  // Páginas estáticas — ordem reflete importância para crawlers
  const staticUrls = [
    urlEntry(`${BASE_URL}/`, today, 'daily', 1.0),
    urlEntry(`${BASE_URL}/cupons`, today, 'daily', 0.9),
    urlEntry(`${BASE_URL}/lojas`, today, 'weekly', 0.8),
    urlEntry(`${BASE_URL}/blog`, today, 'weekly', 0.7),
    urlEntry(`${BASE_URL}/quem-somos`, today, 'monthly', 0.5),
    urlEntry(`${BASE_URL}/como-funciona`, today, 'monthly', 0.5),
    urlEntry(`${BASE_URL}/fale-conosco`, today, 'monthly', 0.5),
    urlEntry(`${BASE_URL}/perguntas-frequentes`, today, 'monthly', 0.5),
    urlEntry(`${BASE_URL}/termos-de-uso`, today, 'monthly', 0.4),
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

// Vercel Edge Middleware — prerender para bots de busca nas páginas de blog
// Para usuários normais: retorna undefined → SPA funciona normalmente
// Para Googlebot/similares: busca dados do Supabase e retorna HTML completo

export const config = {
  matcher: ['/blog/:slug*'],
};

const BOTS =
  /googlebot|google-inspectiontool|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebot|ia_archiver/i;

const SITE_URL = 'https://www.cuponito.com.br';

function esc(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  const ua = request.headers.get('user-agent') || '';

  // Só intercepta /blog/:slug (ignora /blog/ e /blog sem slug)
  const blogMatch = url.pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!blogMatch || !BOTS.test(ua)) return undefined;

  const slug = blogMatch[1];
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) return undefined;

  try {
    const apiUrl =
      `${SUPABASE_URL}/rest/v1/blog_posts` +
      `?slug=eq.${encodeURIComponent(slug)}` +
      `&status=eq.published` +
      `&select=title,excerpt,meta_title,meta_description,content,cover_image,published_at,slug`;

    const res = await fetch(apiUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) return undefined;

    const posts: Array<Record<string, string>> = await res.json();
    const post = posts?.[0];

    if (!post) return undefined;

    const title = post.meta_title || post.title;
    const description =
      post.meta_description || post.excerpt || 'Artigo no blog do Cuponito.';
    const canonical = `${SITE_URL}/blog/${post.slug}`;
    const image = post.cover_image || `${SITE_URL}/og-image.png`;
    const datePublished = post.published_at
      ? new Date(post.published_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '';

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description,
      image,
      datePublished: post.published_at,
      url: canonical,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      publisher: {
        '@type': 'Organization',
        name: 'Cuponito',
        url: SITE_URL,
      },
    });

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | Blog Cuponito</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${esc(title)} | Blog Cuponito">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Cuponito">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)} | Blog Cuponito">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${image}">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <header>
    <nav><a href="${SITE_URL}">Cuponito</a> › <a href="${SITE_URL}/blog">Blog</a></nav>
  </header>
  <main>
    <article>
      <h1>${esc(post.title)}</h1>
      ${datePublished ? `<time datetime="${post.published_at}">${datePublished}</time>` : ''}
      ${post.excerpt ? `<p>${esc(post.excerpt)}</p>` : ''}
      <div>${post.content || ''}</div>
    </article>
  </main>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Prerendered': 'true',
      },
    });
  } catch {
    return undefined;
  }
}

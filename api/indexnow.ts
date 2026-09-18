import type { VercelRequest, VercelResponse } from '@vercel/node'

// IndexNow: avisa Bing (o índice que o ChatGPT consulta), Yandex e Seznam na
// hora em que uma URL muda, em vez de esperar o próximo rastreamento.
// A chave é pública por definição — fica servida como arquivo .txt na raiz do site.
const DEFAULT_KEY = '268bc9e2cdb8e7c8c38f2e8040e819cf'
const HOST = 'www.cuponito.com.br'
const BASE_URL = `https://${HOST}`
const ENDPOINT = 'https://api.indexnow.org/IndexNow'
const MAX_URLS = 100

function absolute(pathOrUrl: string): string | null {
  try {
    const url = new URL(pathOrUrl, BASE_URL)
    // só aceita URL do próprio host: o IndexNow rejeita host de terceiro
    if (url.host !== HOST) return null
    return url.toString()
  } catch {
    return null
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Use POST' })
    return
  }

  const key = process.env.INDEXNOW_KEY || DEFAULT_KEY
  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) ?? {}
  const rawUrls: unknown = body.urls

  const urlList = Array.isArray(rawUrls) ? rawUrls : [rawUrls]
  const urls = urlList
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .map(absolute)
    .filter((value): value is string => value !== null)
    .slice(0, MAX_URLS)

  if (urls.length === 0) {
    res.status(400).json({ error: 'Informe ao menos uma URL do próprio domínio em "urls".' })
    return
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation: `${BASE_URL}/${key}.txt`,
        urlList: urls,
      }),
    })

    res.status(response.ok ? 200 : 502).json({
      submitted: urls.length,
      indexNowStatus: response.status,
      urls,
    })
  } catch (error) {
    res.status(502).json({
      error: 'Falha ao falar com o IndexNow',
      detail: error instanceof Error ? error.message : String(error),
    })
  }
}

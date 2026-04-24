import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { XMLParser } from 'https://esm.sh/fast-xml-parser@4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const COUPON_API_BASE = 'https://api.linksynergy.com/coupon/1.0'
const TOKEN_ENDPOINT  = 'https://api.linksynergy.com/token'
const RESULTS_PER_PAGE = 500
// Renova 2 min antes do vencimento para evitar race conditions
const TOKEN_REFRESH_BUFFER_SEC = 120

interface TokenSet {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function determineCategory(description: string, discountType: string, storeName: string): string {
  const text = `${description} ${discountType} ${storeName}`.toLowerCase()
  if (/frete gr[aá]ti|envio gr[aá]ti|free shipping/.test(text)) return 'Frete Grátis'
  if (/moda|roupa|vest[iu]|fashion|c&a|zara|renner/.test(text)) return 'Moda'
  if (/tech|eletr[ôo]|notebook|celular|smartphone|kabum|ssd/.test(text)) return 'Tech'
  if (/delivery|comida|restaurante|ifood|pizza|lanche/.test(text)) return 'Delivery'
  if (/viagem|hotel|passagem|hospedagem|a[eé]reo|turismo/.test(text)) return 'Viagens'
  if (/beleza|cosm[eé]t|maquiagem|perfume|skincare|cabelo/.test(text)) return 'Beleza'
  return 'Geral'
}

// ── XML parser ────────────────────────────────────────────────────────────────
// A API Rakuten retorna <couponfeed> com N elementos <link type="TEXT">.
// Campos principais: offerdescription, couponcode, clickurl, advertiserid,
// advertisername, offerstartdate, offerenddate (ISO), promotiontypes.
// Não existe discountamount no formato Brazil Network — o desconto é derivado
// da description e do nome do promotiontype.

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  // Garante array mesmo com um único <link> ou <category>/<promotiontype>
  isArray: (name) => ['link', 'category', 'promotiontype'].includes(name),
})

function extractOfferId(clickUrl: string): string {
  // clickurl traz o offerid como query param: ...?id=X&offerid=951620.1097&...
  try {
    return new URL(clickUrl).searchParams.get('offerid') ?? ''
  } catch {
    return ''
  }
}

function parseIsoDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null
  const d = new Date(String(dateStr))
  return isNaN(d.getTime()) ? null : d.toISOString()
}

function formatDiscount(promoTypeName: string, description: string): string {
  const text = `${description} ${promoTypeName}`.toLowerCase()
  if (/frete gr[aá]ti|envio gr[aá]ti|free shipping/.test(text)) return 'Frete Grátis'
  // Extrai "X%" da descrição quando mencionado
  const pctMatch = description.match(/(\d+(?:[.,]\d+)?)\s*%/)
  if (pctMatch) return `${pctMatch[1].replace(',', '.')}% OFF`
  return promoTypeName || 'Desconto Especial'
}

function parseRakutenResponse(xml: string) {
  const root = xmlParser.parse(xml)
  const feed = root?.couponfeed ?? {}
  const links: any[] = Array.isArray(feed.link) ? feed.link : (feed.link ? [feed.link] : [])

  return {
    totalMatches: parseInt(String(feed.TotalMatches ?? '0'), 10),
    totalPages:   parseInt(String(feed.TotalPages   ?? '1'), 10),
    offers: links.map(link => {
      const promoTypes: any[] = link.promotiontypes?.promotiontype ?? []
      const promoTypeName = promoTypes
        .map((p: any) => (typeof p === 'object' ? String(p['#text'] ?? p) : String(p)))
        .filter(Boolean)
        .join(', ')

      const clickUrl = String(link.clickurl ?? '')
      const offerId  = extractOfferId(clickUrl)

      return {
        advertiserId:   String(link.advertiserid ?? ''),
        advertiserName: String(link.advertisername ?? ''),
        // offerId extraído da clickurl é o identificador único confiável do cupom
        promotionId:    offerId || `${link.advertiserid}_${String(link.offerdescription ?? '').slice(0, 30)}`,
        description:    String(link.offerdescription ?? ''),
        beginDate:      parseIsoDate(link.offerstartdate),
        endDate:        parseIsoDate(link.offerenddate),
        discount:       formatDiscount(promoTypeName, String(link.offerdescription ?? '')),
        couponCode:     link.couponcode ? String(link.couponcode) : null,
        clickUrl,
        discountType:   promoTypeName,
      }
    })
  }
}

// ── Token helpers ─────────────────────────────────────────────────────────────

async function postToken(tokenKey: string, body: URLSearchParams): Promise<TokenSet> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      // Documentação Rakuten: Authorization: Bearer {token-key} — tanto para
      // troca inicial quanto para renovação via refresh_token.
      'Authorization': `Bearer ${tokenKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: body.toString(),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`/token ${res.status}: ${text.slice(0, 200)}`)
  let json: any
  try { json = JSON.parse(text) } catch { throw new Error(`/token resposta não-JSON: ${text.slice(0, 200)}`) }
  if (!json.access_token) throw new Error(`/token sem access_token: ${text.slice(0, 200)}`)
  return json as TokenSet
}

// Troca token-key por novo par de tokens (usado quando não há refresh_token).
function exchangeTokenKey(tokenKey: string, sid: string): Promise<TokenSet> {
  const body = new URLSearchParams()
  if (sid) body.set('scope', sid)
  else body.set('scope', '')
  return postToken(tokenKey, body)
}

// Renova o access_token usando o refresh_token atual.
// O access_token anterior expira imediatamente; os novos tokens são persistidos.
function refreshAccessToken(tokenKey: string, refreshToken: string, sid: string): Promise<TokenSet> {
  const body = new URLSearchParams()
  body.set('refresh_token', refreshToken)
  if (sid) body.set('scope', sid)
  return postToken(tokenKey, body)
}

// Persiste o novo par de tokens em extra_config (merge — preserva sid, mid, etc.).
async function persistTokens(
  supabase: any,
  accountId: string,
  currentExtra: Record<string, any>,
  tokens: TokenSet
): Promise<string> {
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()
  await supabase.from('affiliate_accounts').update({
    extra_config: {
      ...currentExtra,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: expiresAt,
    }
  }).eq('id', accountId)
  return expiresAt
}

// ── Log helper ────────────────────────────────────────────────────────────────

async function finishLog(
  supabase: any,
  logId: string | null,
  status: string,
  inserted: number,
  updated: number,
  skipped: number,
  error: string | null = null,
  meta: Record<string, unknown> = {}
) {
  if (!logId) return
  await supabase.from('sync_logs').update({
    status,
    finished_at: new Date().toISOString(),
    records_inserted: inserted,
    records_updated: updated,
    records_skipped: skipped,
    error_message: error,
    meta
  }).eq('id', logId)
}

// ── Main handler ──────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  let logId: string | null = null
  const telemetry: Record<string, unknown> = {}

  try {
    const body = await req.json().catch(() => ({}))
    const accountId = body.account_id

    const { data: accounts, error: accError } = await supabase
      .from('affiliate_accounts')
      .select('*, integration_providers(slug, base_url)')
      .eq('active', true)
      .eq('id', accountId)

    if (accError || !accounts?.length) throw new Error('Conta não encontrada ou inativa')

    const account = accounts[0]
    const { data: logRow } = await supabase.from('sync_logs').insert({ account_id: account.id, status: 'running' }).select('id').single()
    logId = logRow?.id ?? null

    const extra = (account.extra_config ?? {}) as Record<string, any>

    // token_key: chave de longa duração usada para autorizar o endpoint /token.
    // Vem do env (Supabase secret) ou do api_token da conta. Nunca expira.
    const envSecretName = typeof extra.env_secret === 'string' ? extra.env_secret : 'RAKUTEN_TOKEN'
    const tokenKey: string | undefined =
      body.rakuten_token ||
      (account.api_token || undefined) ||
      Deno.env.get(envSecretName) ||
      Deno.env.get('RAKUTEN_TOKEN') ||
      undefined

    if (!tokenKey) throw new Error('token_key ausente: configure api_token da conta ou secret RAKUTEN_TOKEN')

    const sid     = String(extra.sid ?? account.publisher_id ?? '')
    const mid     = typeof extra.mid === 'string' ? extra.mid : ''
    const network = typeof extra.network === 'string' ? extra.network : ''

    telemetry.token_key_len = tokenKey.length
    telemetry.sid = sid || null
    telemetry.mid = mid || null
    telemetry.network = network || null

    // ── Resolução do access_token ────────────────────────────────────────────
    const storedAccessToken  = typeof extra.access_token  === 'string' ? extra.access_token  : null
    const storedRefreshToken = typeof extra.refresh_token === 'string' ? extra.refresh_token : null
    const storedExpiresAt    = typeof extra.token_expires_at === 'string' ? extra.token_expires_at : null

    const isValid = storedAccessToken && storedExpiresAt &&
      new Date(storedExpiresAt).getTime() > Date.now() + TOKEN_REFRESH_BUFFER_SEC * 1000

    let accessToken: string
    let tokenSource: string

    if (isValid) {
      // Token ainda dentro da janela de validade — usa sem custo adicional.
      accessToken = storedAccessToken!
      tokenSource = 'cached'
      telemetry.token_expires_at = storedExpiresAt
    } else if (storedRefreshToken) {
      // Token expirado (ou prestes a expirar) mas temos refresh_token: renova.
      try {
        const tokens = await refreshAccessToken(tokenKey, storedRefreshToken, sid)
        const expiresAt = await persistTokens(supabase, account.id, extra, tokens)
        accessToken = tokens.access_token
        tokenSource = 'refreshed'
        telemetry.token_expires_at = expiresAt
      } catch (refreshErr: any) {
        // Refresh falhou (ex.: refresh_token revogado). Tenta troca direta.
        telemetry.refresh_error = refreshErr.message
        const tokens = await exchangeTokenKey(tokenKey, sid)
        const expiresAt = await persistTokens(supabase, account.id, extra, tokens)
        accessToken = tokens.access_token
        tokenSource = 'exchanged_after_refresh_fail'
        telemetry.token_expires_at = expiresAt
      }
    } else {
      // Sem refresh_token: troca token-key por access_token pela primeira vez.
      const tokens = await exchangeTokenKey(tokenKey, sid)
      const expiresAt = await persistTokens(supabase, account.id, extra, tokens)
      accessToken = tokens.access_token
      tokenSource = 'exchanged'
      telemetry.token_expires_at = expiresAt
    }

    telemetry.token_source = tokenSource

    // ── Chamada à API de cupons ──────────────────────────────────────────────
    const qs = new URLSearchParams({ resultsperpage: String(RESULTS_PER_PAGE), pagenumber: '1' })
    if (mid)     qs.set('mid', mid)
    if (network) qs.set('network', network)

    const baseUrl = account.integration_providers?.base_url || COUPON_API_BASE
    const url = `${baseUrl}?${qs}`

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/xml',
        'Authorization': `Bearer ${accessToken}`,
      }
    })
    const responseText = await res.text()

    telemetry.request_url    = url
    telemetry.response_status = res.status
    telemetry.response_bytes  = responseText.length
    telemetry.response_preview = responseText.slice(0, 300)

    if (!res.ok) {
      // Se 401, o access_token foi rejeitado — pode ser que o token tenha sido
      // invalidado remotamente. Forçar renovação na próxima execução zerando expires_at.
      if (res.status === 401 && storedRefreshToken) {
        await supabase.from('affiliate_accounts').update({
          extra_config: { ...extra, token_expires_at: '1970-01-01T00:00:00.000Z' }
        }).eq('id', account.id)
        telemetry.forced_refresh_on_next = true
      }
      throw new Error(`API Rakuten: ${res.status} - ${responseText.slice(0, 200)}`)
    }

    const { offers, totalMatches, totalPages } = parseRakutenResponse(responseText)
    telemetry.parsed_offers  = offers.length
    telemetry.total_matches  = totalMatches
    telemetry.total_pages    = totalPages

    if (offers.length === 0) {
      await finishLog(supabase, logId, 'success', 0, 0, 0,
        'API retornou 0 ofertas — verifique sid/mid/network ou credenciais', telemetry)
      return new Response(JSON.stringify({ success: true, stats: { inserted: 0, updated: 0, skipped: 0 }, telemetry }), { headers: corsHeaders })
    }

    const stats = { inserted: 0, updated: 0, skipped: 0 }

    for (const offer of offers) {
      if (!offer.clickUrl || !offer.advertiserId) { stats.skipped++; continue }

      let { data: store } = await supabase.from('stores').select('id').eq('store_id', offer.advertiserId).maybeSingle()
      if (!store) {
        const { data: newStore } = await supabase.from('stores').insert({
          name: offer.advertiserName,
          slug: `cupom-desconto-${slugify(offer.advertiserName)}`,
          store_id: offer.advertiserId,
          active: true
        }).select('id').single()
        store = newStore
      }
      if (!store) { stats.skipped++; continue }

      const promoId = `rakuten_${offer.promotionId}`
      const couponData = {
        awin_promotion_id: promoId,
        store_id: store.id,
        store: offer.advertiserName,
        title: offer.description,
        description: offer.description,
        code: offer.couponCode || null,
        link: offer.clickUrl,
        discount: offer.discount,
        expiry: offer.endDate,
        status: true,
        updated_at: new Date().toISOString(),
        category: determineCategory(offer.description, offer.discountType, offer.advertiserName)
      }

      const { data: existing } = await supabase.from('coupons').select('id').eq('awin_promotion_id', promoId).maybeSingle()
      if (!existing) {
        const { error: insErr } = await supabase.from('coupons').insert(couponData)
        insErr ? stats.skipped++ : stats.inserted++
      } else {
        const { error: updErr } = await supabase.from('coupons').update(couponData).eq('id', existing.id)
        updErr ? stats.skipped++ : stats.updated++
      }
    }

    await finishLog(supabase, logId, 'success', stats.inserted, stats.updated, stats.skipped, null, telemetry)
    return new Response(JSON.stringify({ success: true, stats, telemetry }), { headers: corsHeaders })

  } catch (err: any) {
    if (logId) await finishLog(supabase, logId, 'error', 0, 0, 0, err.message, telemetry)
    return new Response(JSON.stringify({ error: err.message, telemetry }), { status: 500, headers: corsHeaders })
  }
})

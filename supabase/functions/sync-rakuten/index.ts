import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const COUPON_API_BASE = 'https://api.linksynergy.com/coupon/1.0'
const RESULTS_PER_PAGE = 500

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function determineCategory(description: string, discountType: string, storeName: string): string {
  const text = `${description} ${discountType} ${storeName}`.toLowerCase()
  if (/frete gr[aá]ti|envio gr[aá]ti|free shipping/.test(text)) return 'Frete Grátis'
  if (/moda|roupa|vest[iu]|fashion|c&a|zara|renner/.test(text)) return 'Moda'
  if (/tech|eletr[ôo]|notebook|celular|smartphone|kabum|ssd/.test(text)) return 'Tech'
  if (/delivery|comida|restaurante|ifood|pizza|lanche/.test(text)) return 'Delivery'
  if (/viagem|hotel|passagem|hospedagem|a[eé]reo|turismo/.test(text)) return 'Viagens'
  if (/beleza|cosm[eé]t|maquiagem|perfume|skincare|cabelo/.test(text)) return 'Beleza'
  if (discountType.toLowerCase().includes('free shipping')) return 'Frete Grátis'
  return 'Geral'
}

// ─── XML Parsing ──────────────────────────────────────────────────────────────

/**
 * Extracts the text content of the first matching XML tag.
 * Handles both plain text and CDATA sections.
 */
function xmlText(xml: string, tag: string): string {
  const re = new RegExp(
    `<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))</${tag}>`,
    'i'
  )
  const m = re.exec(xml)
  if (!m) return ''
  return (m[1] ?? m[2] ?? '').trim()
}

/**
 * Extracts text from a tag with a specific attribute value.
 * e.g. <discountamount type="percent">10.00</discountamount>
 */
function xmlAttrText(xml: string, tag: string, attr: string, attrVal: string): string {
  const re = new RegExp(
    `<${tag}[^>]+${attr}=["']${attrVal}["'][^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))</${tag}>`,
    'i'
  )
  const m = re.exec(xml)
  if (!m) return ''
  return (m[1] ?? m[2] ?? '').trim()
}

/**
 * Splits the Rakuten XML response into individual <link> blocks.
 * Each <link> block represents one promotional offer.
 */
function extractLinkBlocks(xml: string): string[] {
  return [...xml.matchAll(/<link>([\s\S]*?)<\/link>/g)].map(m => m[0])
}

/**
 * Converts Rakuten date format "MM/DD/YYYY" to ISO 8601.
 * Returns null for empty or invalid dates.
 */
function parseRakutenDate(dateStr: string): string | null {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const [mm, dd, yyyy] = parts
  const d = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T23:59:59`)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

/**
 * Formats a human-readable discount string from Rakuten discount fields.
 */
function formatDiscount(discountType: string, block: string): string {
  const pct = parseFloat(xmlAttrText(block, 'discountamount', 'type', 'percent') || '0')
  const abs = parseFloat(xmlAttrText(block, 'discountamount', 'type', 'absolute') || '0')
  const type = discountType.toLowerCase()

  if (type.includes('percentage') && pct > 0) return `${pct % 1 === 0 ? pct.toFixed(0) : pct}% OFF`
  if ((type.includes('dollar') || type.includes('fixed') || type.includes('amount')) && abs > 0) {
    return `R$ ${abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(2)} OFF`
  }
  if (type.includes('free shipping')) return 'Frete Grátis'
  if (type.includes('fixed price') && abs > 0) return `R$ ${abs.toFixed(0)}`
  return 'Desconto Especial'
}

/**
 * Parses the full Rakuten Coupon Web Service XML response.
 */
function parseRakutenResponse(xml: string): {
  totalPages: number
  totalMatches: number
  offers: {
    advertiserId: string
    advertiserName: string
    promotionId: string
    promotionType: string
    description: string
    beginDate: string | null
    endDate: string | null
    discountType: string
    discount: string
    couponCode: string
    clickUrl: string
    landingUrl: string
  }[]
} {
  const totalMatches = parseInt(xmlText(xml, 'TotalMatches') || '0', 10)
  const totalPages = parseInt(xmlText(xml, 'TotalPages') || '0', 10)
  const blocks = extractLinkBlocks(xml)

  const offers = blocks.map(block => {
    const discountType = xmlText(block, 'discounttype')
    return {
      advertiserId: xmlText(block, 'advertiserid') || xmlText(block, 'mid'),
      advertiserName: xmlText(block, 'advertisername'),
      promotionId: xmlText(block, 'promotionid'),
      promotionType: xmlText(block, 'promotiontype'),
      description: xmlText(block, 'offerdescription'),
      beginDate: parseRakutenDate(xmlText(block, 'offerbegindate')),
      endDate: parseRakutenDate(xmlText(block, 'offerenddate')),
      discountType,
      discount: formatDiscount(discountType, block),
      couponCode: xmlText(block, 'couponcode'),
      clickUrl: xmlText(block, 'clickurl'),
      landingUrl: xmlText(block, 'landingurl'),
    }
  })

  return { totalPages, totalMatches, offers }
}

// ─── Sync Log ─────────────────────────────────────────────────────────────────

async function finishLog(
  supabase: ReturnType<typeof createClient>,
  logId: string | null,
  status: string,
  inserted: number,
  updated: number,
  skipped: number,
  errorMessage: string | null = null,
  meta: Record<string, unknown> = {}
) {
  if (!logId) return
  await supabase
    .from('sync_logs')
    .update({
      status,
      finished_at: new Date().toISOString(),
      records_inserted: inserted,
      records_updated: updated,
      records_skipped: skipped,
      error_message: errorMessage,
      meta,
    })
    .eq('id', logId)
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  let logId: string | null = null
  let accountId: string | null = null

  try {
    const body = await req.json().catch(() => ({}))
    accountId = body.account_id ?? null

    // Buscar contas Rakuten ativas (uma específica ou todas)
    let query = supabase
      .from('affiliate_accounts')
      .select('*, integration_providers(slug, base_url)')
      .eq('active', true)

    if (accountId) {
      query = query.eq('id', accountId)
    } else {
      // Filtrar apenas contas do provider Rakuten quando buscando todas
      const { data: provider } = await supabase
        .from('integration_providers')
        .select('id')
        .eq('slug', 'rakuten')
        .maybeSingle()
      if (provider) query = query.eq('provider_id', provider.id)
    }

    const { data: accounts, error: accError } = await query
    if (accError) throw accError
    if (!accounts || accounts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Nenhuma conta Rakuten ativa encontrada' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const summary = []

    for (const account of accounts) {
      // Registrar início do sync
      const { data: logRow } = await supabase
        .from('sync_logs')
        .insert({ account_id: account.id, status: 'running' })
        .select('id')
        .single()
      logId = logRow?.id ?? null

      // Prioridade do token: api_token no banco → env var específica → RAKUTEN_TOKEN global
      const envSecret = account.extra_config?.env_secret
      const token =
        account.api_token ||
        (envSecret ? Deno.env.get(envSecret) : null) ||
        Deno.env.get('RAKUTEN_TOKEN')

      if (!token) {
        await finishLog(supabase, logId, 'error', 0, 0, 0, 'RAKUTEN_TOKEN não configurado')
        summary.push({ account: account.name, status: 'error', error: 'token ausente' })
        continue
      }

      // SID e network ID opcionais (configurados em extra_config)
      const sid: string = account.extra_config?.sid ?? account.publisher_id ?? ''
      const networkId: string = account.extra_config?.network_id ?? '0'
      // base_url: usa provider ou override em extra_config, fallback para padrão
      const baseUrl: string =
        account.extra_config?.base_url ??
        account.integration_providers?.base_url ??
        COUPON_API_BASE

      const stats = { inserted: 0, updated: 0, skipped: 0, stores_created: 0 }
      const errors: string[] = []
      let page = 1
      let totalPages = 1 // será atualizado após primeira resposta

      while (page <= totalPages) {
        const params = new URLSearchParams({
          token,
          resultsperpage: String(RESULTS_PER_PAGE),
          pagenumber: String(page),
          network: networkId,
        })

        const apiUrl = `${baseUrl.replace(/\/$/, '')}?${params}`
        const res = await fetch(apiUrl, {
          headers: { 'Accept': 'application/xml, text/xml, */*' }
        })

        const responseText = await res.text()

        if (!res.ok) {
          errors.push(`API HTTP ${res.status}: ${responseText.slice(0, 300)}`)
          break
        }

        // Detecta erro retornado como XML (ex: <error>Invalid token</error>)
        if (/<error[^>]*>/i.test(responseText) && !/<link>/i.test(responseText)) {
          const errMsg = xmlText(responseText, 'error') || xmlText(responseText, 'message')
          errors.push(`API error: ${errMsg || responseText.slice(0, 200)}`)
          break
        }

        const { totalPages: tp, totalMatches, offers } = parseRakutenResponse(responseText)

        // Atualiza total de páginas na primeira resposta
        if (page === 1) {
          totalPages = tp || 1
          if (offers.length === 0) {
            errors.push(`Nenhuma oferta retornada. TotalMatches=${totalMatches}. Preview: ${responseText.slice(0, 400)}`)
            break
          }
        }

        if (offers.length === 0) break

        for (const offer of offers) {
          try {
            if (!offer.clickUrl) { stats.skipped++; continue }
            if (!offer.advertiserId) { stats.skipped++; continue }

            // Garantir que a loja existe em stores
            let { data: store } = await supabase
              .from('stores')
              .select('id')
              .eq('store_id', offer.advertiserId)
              .maybeSingle()

            if (!store) {
              const storeName = offer.advertiserName || account.name
              const { data: newStore, error: storeErr } = await supabase
                .from('stores')
                .insert({
                  name: storeName,
                  slug: `cupom-desconto-${slugify(storeName)}`,
                  store_id: offer.advertiserId,
                  active: true,
                })
                .select('id')
                .single()

              if (storeErr) {
                // Slug duplicado: fallback com ID do anunciante
                const { data: retryStore } = await supabase
                  .from('stores')
                  .insert({
                    name: storeName,
                    slug: `cupom-desconto-${slugify(storeName)}-${offer.advertiserId}`,
                    store_id: offer.advertiserId,
                    active: true,
                  })
                  .select('id')
                  .single()
                store = retryStore
              } else {
                store = newStore
                stats.stores_created++
                // Enriquecer logo/cor em background
                supabase.functions
                  .invoke('enrich-store', { body: { store_id: newStore!.id } })
                  .catch(() => { /* não bloqueia o sync */ })
              }
            }

            if (!store) { stats.skipped++; continue }

            // Montar URL de tracking com SID como sub-ID (u1) para atribuição
            const trackingUrl = sid
              ? offer.clickUrl.includes('?')
                ? `${offer.clickUrl}&u1=${encodeURIComponent(sid)}`
                : `${offer.clickUrl}?u1=${encodeURIComponent(sid)}`
              : offer.clickUrl

            const couponData = {
              awin_promotion_id: `rakuten_${offer.promotionId}`,
              store_id: store.id,
              store: offer.advertiserName,
              publisher_id: account.publisher_id,
              title: offer.description || 'Oferta Especial',
              description: offer.description || '',
              terms: '',
              code: offer.couponCode || null,
              type: offer.couponCode ? 'voucher' : 'deal',
              link: trackingUrl,
              discount: offer.discount,
              expiry: offer.endDate,
              expiry_text: offer.endDate
                ? new Date(offer.endDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    timeZone: 'America/Sao_Paulo',
                  })
                : '',
              start_date: offer.beginDate,
              status: true,
              updated_at: new Date().toISOString(),
              category: determineCategory(offer.description, offer.discountType, offer.advertiserName),
            }

            const { data: existing } = await supabase
              .from('coupons')
              .select('id')
              .eq('awin_promotion_id', couponData.awin_promotion_id)
              .maybeSingle()

            if (!existing) {
              const { error } = await supabase.from('coupons').insert(couponData)
              if (!error) stats.inserted++; else stats.skipped++
            } else {
              const { error } = await supabase
                .from('coupons')
                .update({
                  title: couponData.title,
                  description: couponData.description,
                  code: couponData.code,
                  link: couponData.link,
                  discount: couponData.discount,
                  expiry: couponData.expiry,
                  expiry_text: couponData.expiry_text,
                  start_date: couponData.start_date,
                  status: couponData.status,
                  updated_at: couponData.updated_at,
                  store: couponData.store,
                  store_id: couponData.store_id,
                })
                .eq('awin_promotion_id', couponData.awin_promotion_id)
              if (!error) stats.updated++; else stats.skipped++
            }
          } catch (offerErr: unknown) {
            errors.push((offerErr as Error).message)
            stats.skipped++
          }
        }

        page++
      }

      const finalStatus =
        errors.length > 0 && stats.inserted + stats.updated === 0 ? 'error' : 'success'

      await finishLog(
        supabase, logId, finalStatus,
        stats.inserted, stats.updated, stats.skipped,
        errors.length > 0 ? errors.slice(0, 5).join(' | ') : null,
        { stores_created: stats.stores_created, pages_fetched: page - 1, total_pages: totalPages }
      )

      await supabase
        .from('sync_schedules')
        .update({ last_run_at: new Date().toISOString() })
        .eq('account_id', account.id)

      summary.push({ account: account.name, ...stats, status: finalStatus })
    }

    return new Response(JSON.stringify({ success: true, summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    if (logId) {
      await finishLog(supabase, logId, 'error', 0, 0, 0, (err as Error).message)
    }
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const COUPON_API_BASE = 'https://api.linksynergy.com/coupon/1.0'
const RESULTS_PER_PAGE = 500

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

function xmlText(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))</${tag}>`, 'i')
  const m = re.exec(xml)
  return m ? (m[1] ?? m[2] ?? '').trim() : ''
}

function xmlAttrText(xml: string, tag: string, attr: string, attrVal: string): string {
  const re = new RegExp(`<${tag}[^>]+${attr}=["']${attrVal}["'][^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))</${tag}>`, 'i')
  const m = re.exec(xml)
  return m ? (m[1] ?? m[2] ?? '').trim() : ''
}

function extractLinkBlocks(xml: string): string[] {
  return [...xml.matchAll(/<link>([\s\S]*?)<\/link>/g)].map(m => m[0])
}

function parseRakutenDate(dateStr: string): string | null {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const [mm, dd, yyyy] = parts
  const d = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T23:59:59`)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

function formatDiscount(discountType: string, block: string): string {
  const pct = parseFloat(xmlAttrText(block, 'discountamount', 'type', 'percent') || '0')
  const abs = parseFloat(xmlAttrText(block, 'discountamount', 'type', 'absolute') || '0')
  const type = discountType.toLowerCase()
  if (type.includes('percentage') && pct > 0) return `${pct % 1 === 0 ? pct.toFixed(0) : pct}% OFF`
  if ((type.includes('dollar') || type.includes('fixed') || type.includes('amount')) && abs > 0) return `R$ ${abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(2)} OFF`
  if (type.includes('free shipping')) return 'Frete Grátis'
  return 'Desconto Especial'
}

function parseRakutenResponse(xml: string) {
  return {
    totalMatches: parseInt(xmlText(xml, 'TotalMatches') || '0', 10),
    totalPages: parseInt(xmlText(xml, 'TotalPages') || '0', 10),
    offers: extractLinkBlocks(xml).map(block => {
      const discountType = xmlText(block, 'discounttype')
      return {
        advertiserId: xmlText(block, 'advertiserid') || xmlText(block, 'mid'),
        advertiserName: xmlText(block, 'advertisername'),
        promotionId: xmlText(block, 'promotionid'),
        description: xmlText(block, 'offerdescription'),
        beginDate: parseRakutenDate(xmlText(block, 'offerbegindate')),
        endDate: parseRakutenDate(xmlText(block, 'offerenddate')),
        discount: formatDiscount(discountType, block),
        couponCode: xmlText(block, 'couponcode'),
        clickUrl: xmlText(block, 'clickurl'),
        discountType
      }
    })
  }
}

async function finishLog(supabase: any, logId: string | null, status: string, inserted: number, updated: number, skipped: number, error: string | null = null) {
  if (!logId) return
  await supabase.from('sync_logs').update({ status, finished_at: new Date().toISOString(), records_inserted: inserted, records_updated: updated, records_skipped: skipped, error_message: error }).eq('id', logId)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  let logId: string | null = null

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

    // Prioridade: Token vindo da Vercel (body) -> Token no Banco -> Secret do Supabase
    const token = body.rakuten_token || account.api_token || Deno.env.get('RAKUTEN_TOKEN')

    if (!token) {
      await finishLog(supabase, logId, 'error', 0, 0, 0, 'Token não configurado')
      return new Response(JSON.stringify({ error: 'Token ausente' }), { status: 400, headers: corsHeaders })
    }

    const stats = { inserted: 0, updated: 0, skipped: 0 }
    const baseUrl = account.integration_providers?.base_url || COUPON_API_BASE
    
    // Chamada à API com Header de Autorização
    const params = new URLSearchParams({ token, resultsperpage: String(RESULTS_PER_PAGE), pagenumber: '1' })
    const res = await fetch(`${baseUrl}?${params}`, {
      headers: { 
        'Accept': 'application/xml',
        'Authorization': `Bearer ${token}` // Adicionado conforme solicitado
      }
    })

    const responseText = await res.text()
    if (!res.ok) throw new Error(`Erro API Rakuten: ${res.status} - ${responseText.slice(0, 100)}`)

    const { offers } = parseRakutenResponse(responseText)

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
        await supabase.from('coupons').insert(couponData)
        stats.inserted++
      } else {
        await supabase.from('coupons').update(couponData).eq('id', existing.id)
        stats.updated++
      }
    }

    await finishLog(supabase, logId, 'success', stats.inserted, stats.updated, stats.skipped)
    return new Response(JSON.stringify({ success: true, stats }), { headers: corsHeaders })

  } catch (err: any) {
    if (logId) await finishLog(supabase, logId, 'error', 0, 0, 0, err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
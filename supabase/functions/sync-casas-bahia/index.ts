import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1ir70CyrHHSB_P56nlYNzqmrTGM7fZKICcwcKH4vMva0/export?format=csv&gid=1935674487'
const STORE_NAME = 'Casas Bahia'
const DEFAULT_PUBLISHER_ID = '2740940'

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      out.push(cur.trim())
      cur = ''
    } else {
      cur += char
    }
  }

  out.push(cur.trim())
  return out
}

function parseCsv(csv: string): Array<Record<string, string>> {
  const lines = csv
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)

  if (lines.length < 2) return []

  const headers = parseCsvLine(lines[0])
  const rows: Array<Record<string, string>> = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((header, idx) => {
      row[header.trim()] = (values[idx] ?? '').trim()
    })
    rows.push(row)
  }

  return rows
}

function toIsoDateEndOfDay(dateValue: string): string | null {
  if (!dateValue) return null
  const clean = dateValue.trim()

  const br = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (br) {
    const [, d, m, y] = br
    return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 23, 59, 59, 999)).toISOString()
  }

  const parsed = new Date(clean)
  if (!Number.isNaN(parsed.getTime())) {
    parsed.setUTCHours(23, 59, 59, 999)
    return parsed.toISOString()
  }

  return null
}

function normalizeStatus(status: string, expiryIso: string | null): boolean {
  const s = (status || '').toLowerCase().trim()
  if (s.includes('inativ') || s.includes('encerr') || s.includes('expir')) return false

  if (expiryIso) {
    const now = Date.now()
    if (new Date(expiryIso).getTime() < now) return false
  }

  return true
}

function mapCategory(raw: string): string {
  const value = (raw || '').trim()
  if (!value) return 'Geral'

  const base: Record<string, string> = {
    eletronicos: 'Tech',
    tecnologia: 'Tech',
    informatica: 'Tech',
    moda: 'Moda',
    beleza: 'Beleza',
    casa: 'Casa & Decoração',
    decoracao: 'Casa & Decoração',
    supermercado: 'Mercado',
    mercado: 'Mercado',
  }

  const key = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

  return base[key] || value
}

function buildAwinTrackingUrl(destinationUrl: string, publisherId: string, advertiserId: string): string {
  const base = 'https://www.awin1.com/cread.php'
  const params = new URLSearchParams({
    awinaffid: publisherId,
    awinmid: advertiserId,
    clickref: 'cuponito-casas-bahia-sheet',
    ued: destinationUrl,
  })
  return `${base}?${params.toString()}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  try {
    const { data: storeRow, error: storeError } = await supabase
      .from('stores')
      .select('id, name, store_id, awin_advertiser_id')
      .ilike('name', STORE_NAME)
      .maybeSingle()

    if (storeError || !storeRow) {
      throw new Error(`Loja ${STORE_NAME} não encontrada em stores.`)
    }

    const { data: awinProvider } = await supabase
      .from('integration_providers')
      .select('id')
      .eq('slug', 'awin')
      .maybeSingle()

    let accountPublisherId = ''
    let accountAdvertiserId = ''

    if (awinProvider?.id) {
      const { data: casasAccount } = await supabase
        .from('affiliate_accounts')
        .select('publisher_id, extra_config')
        .eq('provider_id', awinProvider.id)
        .ilike('name', '%casas bahia%')
        .eq('active', true)
        .maybeSingle()

      accountPublisherId = String(casasAccount?.publisher_id || '').trim()
      accountAdvertiserId = String(casasAccount?.extra_config?.awin_advertiser_id || '').trim()
    }

    const advertiserId = String(
      storeRow.awin_advertiser_id
      || storeRow.store_id
      || accountAdvertiserId
      || Deno.env.get('AWIN_CASAS_BAHIA_ADVERTISER_ID')
      || ''
    ).trim()

    const publisherId = String(
      Deno.env.get('AWIN_PUBLISHER_ID')
      || accountPublisherId
      || DEFAULT_PUBLISHER_ID
    ).trim()

    if (!advertiserId || !publisherId) {
      throw new Error('AWIN_PUBLISHER_ID e awin_advertiser_id/store_id são obrigatórios para converter link em afiliado.')
    }

    const csvResponse = await fetch(SHEET_CSV_URL)
    if (!csvResponse.ok) {
      return new Response(JSON.stringify({ success: false, skipped: true, reason: `planilha indisponível (${csvResponse.status})` }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const csvText = await csvResponse.text()
    const rows = parseCsv(csvText)

    if (rows.length === 0) {
      return new Response(JSON.stringify({ success: false, skipped: true, reason: 'planilha sem dados válidos' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const required = ['SKU', 'URL da Oferta', 'Título', 'Fim', 'Status']
    const first = rows[0] || {}
    const missing = required.filter((col) => !(col in first))
    if (missing.length > 0) {
      return new Response(JSON.stringify({ success: false, skipped: true, reason: `colunas ausentes: ${missing.join(', ')}` }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const now = new Date().toISOString()
    const seen = new Set<string>()
    const couponsToUpsert: any[] = []

    for (const row of rows) {
      const sku = (row['SKU'] || '').trim()
      const originalUrl = (row['URL da Oferta'] || '').trim()
      const title = (row['Título'] || '').trim()

      if (!sku || !originalUrl || !title) continue

      const dedupeKey = `${sku}__${originalUrl}`
      if (seen.has(dedupeKey)) continue
      seen.add(dedupeKey)

      const expiryIso = toIsoDateEndOfDay((row['Fim'] || '').trim())
      const status = normalizeStatus(row['Status'] || '', expiryIso)

      const promotionId = `sheet_casasbahia_${btoa(dedupeKey).replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_')}`

      couponsToUpsert.push({
        awin_promotion_id: promotionId,
        store_id: storeRow.id,
        store: STORE_NAME,
        publisher_id: publisherId,
        title,
        description: [row['Vantagem'], row['Benefício']].filter(Boolean).join(' • ') || 'Oferta válida na Casas Bahia',
        code: null,
        type: 'offer',
        link: buildAwinTrackingUrl(originalUrl, publisherId, advertiserId),
        discount: (row['Benefício'] || '').trim() || null,
        category: mapCategory(row['Categoria'] || ''),
        expiry: expiryIso,
        expiry_text: expiryIso
          ? new Date(expiryIso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })
          : null,
        status,
        updated_at: now,
      })
    }

    if (couponsToUpsert.length === 0) {
      return new Response(JSON.stringify({ success: true, store: STORE_NAME, inserted_or_updated: 0, deactivated: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const activeIds = couponsToUpsert.map((c) => c.awin_promotion_id)

    const { error: upsertError } = await supabase
      .from('coupons')
      .upsert(couponsToUpsert, { onConflict: 'awin_promotion_id' })

    if (upsertError) throw upsertError

    const { data: deactivatedRows, error: deactivateError } = await supabase
      .from('coupons')
      .update({ status: false, updated_at: now })
      .eq('store', STORE_NAME)
      .not('awin_promotion_id', 'in', `(${activeIds.map((id) => `"${id}"`).join(',')})`)
      .select('id')

    if (deactivateError) throw deactivateError

    return new Response(JSON.stringify({
      success: true,
      store: STORE_NAME,
      inserted_or_updated: couponsToUpsert.length,
      deactivated: deactivatedRows?.length ?? 0,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    console.error(`[sync-casas-bahia] Erro:`, err?.message ?? err)
    return new Response(JSON.stringify({
      success: false,
      skipped: true,
      reason: err?.message ?? 'erro desconhecido',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

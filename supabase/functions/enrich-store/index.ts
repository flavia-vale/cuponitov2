import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url)
    let host = parsed.hostname.replace(/^www\./, '')
    // Remover subdomínios regionais: pt.aliexpress.com → aliexpress.com
    const parts = host.split('.')
    if (parts.length > 2) {
      const twoPartTlds = ['com.br', 'co.uk', 'com.au', 'co.jp', 'com.ar', 'com.mx']
      const lastTwo = parts.slice(-2).join('.')
      host = twoPartTlds.includes(lastTwo)
        ? parts.slice(-3).join('.')
        : parts.slice(-2).join('.')
    }
    return host
  } catch { return null }
}

function extractAwinDestination(trackingUrl: string): string | null {
  try {
    const url = new URL(trackingUrl)
    const ued = url.searchParams.get('ued')
    if (ued) return extractDomain(decodeURIComponent(ued))
    return extractDomain(trackingUrl)
  } catch { return null }
}

async function fetchBrandfetch(domain: string, apiKey: string) {
  // Tentar domínio exato, depois .com se for .com.br
  const domains = [domain]
  if (domain.endsWith('.com.br')) domains.push(domain.replace('.com.br', '.com'))

  for (const d of domains) {
    const res = await fetch(`https://api.brandfetch.io/v2/brands/${d}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })

    if (!res.ok) continue

    const data = await res.json()
    if (data.message || data.error) continue

    // Logo: SVG > PNG, preferir tema light
    let logo_url: string | null = null
    const logos: any[] = data.logos ?? []
    const logoEntry = logos.find((l: any) => l.theme === 'light') ?? logos[0]
    if (logoEntry?.formats?.length) {
      const svg = logoEntry.formats.find((f: any) => f.format === 'svg')
      const png = logoEntry.formats.find((f: any) => f.format === 'png')
      logo_url = (svg ?? png)?.src ?? null
    }

    // Cor: tipo "brand" primeiro, depois mais proeminente
    let brand_color: string | null = null
    const colors: any[] = data.colors ?? []
    const branded = colors.find((c: any) => c.type === 'brand')
      ?? colors.sort((a: any, b: any) => (b.brightness ?? 0) - (a.brightness ?? 0))[0]
    if (branded?.hex) brand_color = branded.hex

    if (logo_url || brand_color) {
      return { logo_url, brand_color, domain: d }
    }
  }

  return { logo_url: null, brand_color: null, domain }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const brandfetchKey = Deno.env.get('BRANDFETCH_API_KEY') ?? ''

  if (!brandfetchKey) {
    return new Response(JSON.stringify({
      error: 'BRANDFETCH_API_KEY não configurada. Obtenha gratuitamente em brandfetch.io e adicione como Supabase Secret.'
    }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const storeId: string | null = body.store_id ?? null
    const force: boolean = body.force ?? false

    let query = supabase.from('stores').select('id, name, logo_url, brand_color')
    if (storeId) {
      query = query.eq('id', storeId)
    } else if (!force) {
      query = query.is('logo_url', null)
    }

    const { data: stores, error } = await query
    if (error) throw error
    if (!stores?.length) {
      return new Response(JSON.stringify({ message: 'Nenhuma loja para enriquecer' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const results = []

    for (const store of stores) {
      // Buscar domínio via cupom mais recente
      const { data: couponRow } = await supabase
        .from('coupons')
        .select('link')
        .eq('store_id', store.id)
        .not('link', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      let domain: string | null = null
      if (couponRow?.link) {
        domain = couponRow.link.includes('awin1.com')
          ? extractAwinDestination(couponRow.link)
          : extractDomain(couponRow.link)
      }

      // Fallback: derivar domínio do nome da loja
      if (!domain) {
        const cleaned = store.name
          .toLowerCase()
          .replace(/\s+(br|latam|brasil|&latam).*$/i, '')
          .trim()
          .replace(/[^a-z0-9]/g, '')
        domain = `${cleaned}.com.br`
      }

      const brand = await fetchBrandfetch(domain, brandfetchKey)

      const update: Record<string, string> = {}
      if (brand.logo_url) update.logo_url = brand.logo_url
      if (brand.brand_color && (force || store.brand_color === '#575ecf')) {
        update.brand_color = brand.brand_color
      }

      if (Object.keys(update).length > 0) {
        await supabase.from('stores').update(update).eq('id', store.id)
      }

      results.push({
        store: store.name,
        domain: brand.domain,
        logo: brand.logo_url ? '✓' : '✗',
        color: update.brand_color ?? (brand.brand_color ?? '✗'),
        updated: Object.keys(update).length > 0
      })
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

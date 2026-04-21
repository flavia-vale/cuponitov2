import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function determineCategory(title: string, description: string, categoryName: string): string {
  const text = `${title} ${description} ${categoryName}`.toLowerCase()
  if (/frete gr[aá]ti|envio gr[aá]ti/.test(text)) return 'Frete Grátis'
  if (/moda|roupa|vest[iu]|fashion|c&a|zara|renner/.test(text)) return 'Moda'
  if (/tech|eletr[ôo]|notebook|celular|smartphone|kabum|tv |ssd|gpu/.test(text)) return 'Tech'
  if (/delivery|comida|restaurante|ifood|pizza|lanche/.test(text)) return 'Delivery'
  if (/viagem|hotel|passagem|hospedagem|a[eé]reo|turismo/.test(text)) return 'Viagens'
  if (/beleza|cosm[eé]t|maquiagem|perfume|skincare|cabelo/.test(text)) return 'Beleza'
  return categoryName || 'Geral'
}

async function finishLog(
  supabase: any,
  logId: string | null,
  status: string,
  inserted: number,
  updated: number,
  skipped: number,
  errorMessage: string | null = null,
  meta: Record<string, unknown> = {}
) {
  if (!logId) return
  await supabase.from('sync_logs').update({
    status,
    finished_at: new Date().toISOString(),
    records_inserted: inserted,
    records_updated: updated,
    records_skipped: skipped,
    error_message: errorMessage,
    meta
  }).eq('id', logId)
}

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

    // Buscar conta(s) Lomadee ativa(s)
    let query = supabase
      .from('affiliate_accounts')
      .select('*, integration_providers(slug, base_url)')
      .eq('active', true)

    if (accountId) query = query.eq('id', accountId)
    else {
      const { data: provider } = await supabase
        .from('integration_providers')
        .select('id')
        .eq('slug', 'lomadee')
        .single()
      if (provider) query = query.eq('provider_id', provider.id)
    }

    const { data: accounts, error: accError } = await query
    if (accError) throw accError
    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({ message: 'Nenhuma conta Lomadee ativa encontrada' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const summary = []

    for (const account of accounts) {
      const { data: logRow } = await supabase
        .from('sync_logs')
        .insert({ account_id: account.id, status: 'running' })
        .select('id')
        .single()
      logId = logRow?.id ?? null

      const envSecret = account.extra_config?.env_secret
      const token =
        account.api_token ||
        (envSecret ? Deno.env.get(envSecret) : null) ||
        Deno.env.get('LOMADEE_APP_TOKEN')

      if (!token) {
        await finishLog(supabase, logId, 'error', 0, 0, 0, 'Token Lomadee não configurado')
        continue
      }

      const sourceId = account.publisher_id
      const baseUrl = account.integration_providers?.base_url || 'https://api.lomadee.com/v3'
      const pageSize = 100
      const stats = { inserted: 0, updated: 0, skipped: 0, stores_created: 0 }
      const errors: string[] = []
      let page = 1
      let totalPages = 1

      while (page <= totalPages) {
        const url = `${baseUrl}/${sourceId}/coupon/_all?token=${token}&sourceId=${sourceId}&page=${page}&pageSize=${pageSize}`
        const res = await fetch(url, {
          headers: { 'Accept': 'application/json' }
        })

        const responseText = await res.text()
        if (!res.ok) {
          errors.push(`API error p${page}: ${res.status} ${responseText.slice(0, 200)}`)
          break
        }

        let data: any
        try { data = JSON.parse(responseText) } catch {
          errors.push(`JSON parse error: ${responseText.slice(0, 200)}`)
          break
        }

        // Diagnóstico na primeira página
        if (page === 1 && !data.coupons) {
          errors.push(`debug: status=${res.status} keys=${Object.keys(data).join(',')} preview=${responseText.slice(0, 300)}`)
          break
        }

        const coupons: any[] = data.coupons ?? []
        const pagination = data.pagination ?? {}
        totalPages = pagination.totalPage ?? pagination.total_page ?? 1

        if (coupons.length === 0) break

        for (const coupon of coupons) {
          try {
            const store = coupon.store ?? {}
            const storeId = String(store.id ?? '')
            const storeName: string = store.name ?? 'Loja Lomadee'
            if (!storeId) { stats.skipped++; continue }

            // Garantir loja
            let { data: storeRow } = await supabase
              .from('stores')
              .select('id')
              .eq('store_id', storeId)
              .maybeSingle()

            if (!storeRow) {
              const { data: newStore, error: storeErr } = await supabase
                .from('stores')
                .insert({
                  name: storeName,
                  slug: `cupom-desconto-${slugify(storeName)}`,
                  store_id: storeId,
                  active: true
                })
                .select('id')
                .single()

              if (storeErr) {
                const { data: retryStore } = await supabase
                  .from('stores')
                  .insert({
                    name: storeName,
                    slug: `cupom-desconto-${slugify(storeName)}-${storeId}`,
                    store_id: storeId,
                    active: true
                  })
                  .select('id')
                  .single()
                storeRow = retryStore
              } else {
                storeRow = newStore
                stats.stores_created++
                supabase.functions.invoke('enrich-store', {
                  body: { store_id: newStore!.id }
                }).catch(() => {})
              }
            }

            if (!storeRow) { stats.skipped++; continue }

            const code: string | null = coupon.code ?? coupon.couponCode ?? null
            const link: string = coupon.link ?? store.link ?? ''
            if (!link) { stats.skipped++; continue }

            const expiryDate = coupon.finalDate ? new Date(coupon.finalDate) : null
            const categoryName: string = coupon.category?.name ?? ''

            const couponData = {
              store_id: storeRow.id,
              store: storeName,
              title: coupon.description ?? coupon.title ?? 'Oferta Especial',
              description: coupon.description ?? '',
              code,
              discount: coupon.discount ?? '',
              link,
              expiry: expiryDate ? expiryDate.toISOString() : null,
              expiry_text: expiryDate
                ? expiryDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })
                : '',
              start_date: coupon.initialDate ? new Date(coupon.initialDate).toISOString() : null,
              status: true,
              category: determineCategory(coupon.description ?? '', '', categoryName),
              updated_at: new Date().toISOString(),
              // ID único Lomadee armazenado em awin_promotion_id para reusar a coluna
              awin_promotion_id: `lomadee_${coupon.id}`
            }

            const { data: existing } = await supabase
              .from('coupons')
              .select('id')
              .eq('awin_promotion_id', couponData.awin_promotion_id)
              .maybeSingle()

            if (!existing) {
              const { error } = await supabase.from('coupons').insert(couponData)
              if (!error) stats.inserted++
              else stats.skipped++
            } else {
              const { error } = await supabase.from('coupons').update({
                title: couponData.title,
                description: couponData.description,
                code: couponData.code,
                discount: couponData.discount,
                link: couponData.link,
                expiry: couponData.expiry,
                expiry_text: couponData.expiry_text,
                status: couponData.status,
                updated_at: couponData.updated_at,
                store: couponData.store,
                store_id: couponData.store_id
              }).eq('awin_promotion_id', couponData.awin_promotion_id)
              if (!error) stats.updated++
              else stats.skipped++
            }
          } catch (e: any) {
            errors.push(e.message)
            stats.skipped++
          }
        }

        if (coupons.length < pageSize) break
        page++
      }

      const finalStatus = errors.length > 0 && stats.inserted + stats.updated === 0 ? 'error' : 'success'
      await finishLog(
        supabase, logId, finalStatus,
        stats.inserted, stats.updated, stats.skipped,
        errors.length > 0 ? errors.slice(0, 5).join(' | ') : null,
        { stores_created: stats.stores_created, pages: page - 1 }
      )

      await supabase
        .from('sync_schedules')
        .update({ last_run_at: new Date().toISOString() })
        .eq('account_id', account.id)

      summary.push({ account: account.name, ...stats, status: finalStatus })
    }

    return new Response(JSON.stringify({ success: true, summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    if (logId) await finishLog(supabase, logId, 'error', 0, 0, 0, err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

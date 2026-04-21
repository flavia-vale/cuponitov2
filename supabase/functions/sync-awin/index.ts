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

    // Buscar contas ativas (uma específica ou todas)
    let query = supabase
      .from('affiliate_accounts')
      .select('*, integration_providers(slug, base_url)')
      .eq('active', true)

    if (accountId) query = query.eq('id', accountId)

    const { data: accounts, error: accError } = await query
    if (accError) throw accError
    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({ message: 'Nenhuma conta Awin ativa encontrada' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const summary = []

    for (const account of accounts) {
      // Registrar início do log
      const { data: logRow } = await supabase
        .from('sync_logs')
        .insert({
          account_id: account.id,
          status: 'running'
        })
        .select('id')
        .single()

      logId = logRow?.id ?? null

      // Prioridade: api_token do banco → secret específico da conta → secret global
      const envSecret = account.extra_config?.env_secret
      const token =
        account.api_token ||
        (envSecret ? Deno.env.get(envSecret) : null) ||
        Deno.env.get('AWIN_API_TOKEN')
      if (!token) {
        await finishLog(supabase, logId, 'error', 0, 0, 0, 'Token não configurado')
        continue
      }

      const stats = { inserted: 0, updated: 0, skipped: 0, stores_created: 0 }
      const pageSize = 200
      let page = 1
      let hasMore = true
      const errors: string[] = []

      while (hasMore) {
        const res = await fetch(
          `https://api.awin.com/publisher/${account.publisher_id}/promotions`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              page,
              pageSize,
              filters: { status: 'active', type: 'all', membership: 'joined' }
            })
          }
        )

        const responseText = await res.text()
        if (!res.ok) {
          errors.push(`API error: ${res.status} ${res.statusText} — ${responseText.slice(0, 200)}`)
          hasMore = false
          break
        }

        let data: any
        try { data = JSON.parse(responseText) } catch { data = {} }
        const promotions: any[] = data.data ?? (Array.isArray(data) ? data : [])

        // Captura diagnóstico na primeira página
        if (page === 1 && promotions.length === 0) {
          errors.push(`debug: status=${res.status} total=${data.pagination?.total ?? '?'} body_preview=${responseText.slice(0, 300)}`)
        }

        if (promotions.length === 0) { hasMore = false; break }

        for (const promo of promotions) {
          try {
            const advertiser = promo.advertiser ?? {
              id: account.extra_config?.awin_advertiser_id ?? promo.advertiserId,
              name: account.extra_config?.store_name ?? account.name
            }

            if (!advertiser?.id) continue

            // Garantir que a loja existe
            let { data: store } = await supabase
              .from('stores')
              .select('id')
              .eq('store_id', String(advertiser.id))
              .maybeSingle()

            if (!store) {
              const storeName = advertiser.name ?? account.name
              const { data: newStore, error: storeErr } = await supabase
                .from('stores')
                .insert({
                  name: storeName,
                  slug: slugify(storeName),
                  store_id: String(advertiser.id),
                  awin_advertiser_id: String(advertiser.id),
                  active: true
                })
                .select('id')
                .single()

              if (storeErr) {
                // Slug duplicado: tentar com sufixo do ID
                const { data: retryStore } = await supabase
                  .from('stores')
                  .insert({
                    name: storeName,
                    slug: `${slugify(storeName)}-${advertiser.id}`,
                    store_id: String(advertiser.id),
                    awin_advertiser_id: String(advertiser.id),
                    active: true
                  })
                  .select('id')
                  .single()
                store = retryStore
              } else {
                store = newStore
                stats.stores_created++
              }
            }

            if (!store) continue

            const couponData = {
              awin_promotion_id: String(promo.promotionId ?? promo.id),
              store_id: store.id,
              store: advertiser.name ?? account.name,
              publisher_id: account.publisher_id,
              title: promo.title ?? 'Oferta Especial',
              description: promo.description ?? '',
              terms: promo.terms ?? '',
              code: promo.voucher?.code ?? promo.voucherCode ?? null,
              type: promo.type ?? 'voucher',
              link: promo.urlTracking ?? promo.url ?? '',
              expiry: promo.endDate ? new Date(promo.endDate).toISOString() : null,
              expiry_text: promo.endDate
                ? new Date(promo.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })
                : '',
              start_date: promo.startDate ? new Date(promo.startDate).toISOString() : null,
              status: true,
              updated_at: new Date().toISOString(),
              category: (promo.voucher?.code ?? promo.voucherCode) ? 'Geral' : 'Ofertas no link'
            }

            if (!couponData.link) { stats.skipped++; continue }

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
              const { error } = await supabase
                .from('coupons')
                .update({
                  title: couponData.title,
                  description: couponData.description,
                  terms: couponData.terms,
                  code: couponData.code,
                  link: couponData.link,
                  expiry: couponData.expiry,
                  expiry_text: couponData.expiry_text,
                  start_date: couponData.start_date,
                  status: couponData.status,
                  updated_at: couponData.updated_at,
                  store: couponData.store,
                  store_id: couponData.store_id
                })
                .eq('awin_promotion_id', couponData.awin_promotion_id)
              if (!error) stats.updated++
              else stats.skipped++
            }
          } catch (promoErr: any) {
            errors.push(promoErr.message)
            stats.skipped++
          }
        }

        if (promotions.length < pageSize) hasMore = false
        else page++
      }

      const finalStatus = errors.length > 0 && stats.inserted + stats.updated === 0 ? 'error' : 'success'
      await finishLog(
        supabase, logId, finalStatus,
        stats.inserted, stats.updated, stats.skipped,
        errors.length > 0 ? errors.slice(0, 5).join(' | ') : null,
        { stores_created: stats.stores_created, pages: page - 1 }
      )

      // Atualizar próxima execução no agendamento
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
    if (logId) {
      await finishLog(supabase, logId, 'error', 0, 0, 0, err.message)
    }
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

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
  await supabase
    .from('sync_logs')
    .update({
      status,
      finished_at: new Date().toISOString(),
      records_inserted: inserted,
      records_updated: updated,
      records_skipped: skipped,
      error_message: errorMessage,
      meta
    })
    .eq('id', logId)
}

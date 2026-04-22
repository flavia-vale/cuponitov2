import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mapa de provedor → edge function responsável
const PROVIDER_FUNCTION_MAP: Record<string, string> = {
  awin: 'sync-awin',
  lomadee: 'sync-lomadee',
  rakuten: 'sync-rakuten',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const now = new Date().toISOString()

  try {
    // Buscar todos os agendamentos habilitados cujo next_run_at já passou
    const { data: schedules, error } = await supabase
      .from('sync_schedules')
      .select(`
        id,
        interval_hours,
        account_id,
        affiliate_accounts (
          id,
          name,
          active,
          integration_providers ( slug )
        )
      `)
      .eq('enabled', true)
      .lte('next_run_at', now)

    if (error) throw error
    if (!schedules || schedules.length === 0) {
      return new Response(JSON.stringify({ message: 'Nenhum agendamento pendente', checked_at: now }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const dispatched = []
    const skipped = []

    for (const schedule of schedules) {
      const account = schedule.affiliate_accounts as any
      if (!account?.active) {
        skipped.push({ schedule_id: schedule.id, reason: 'conta inativa' })
        continue
      }

      const providerSlug = account.integration_providers?.slug
      const functionName = PROVIDER_FUNCTION_MAP[providerSlug]

      if (!functionName) {
        skipped.push({ schedule_id: schedule.id, reason: `provedor "${providerSlug}" sem função mapeada` })
        continue
      }

      // Calcular próxima execução ANTES de disparar (evita re-disparo em caso de lentidão)
      const nextRun = new Date(Date.now() + schedule.interval_hours * 60 * 60 * 1000).toISOString()
      await supabase
        .from('sync_schedules')
        .update({ next_run_at: nextRun, last_run_at: now })
        .eq('id', schedule.id)

      // Disparar edge function do provedor de forma assíncrona
      const invokeResult = await supabase.functions.invoke(functionName, {
        body: { account_id: account.id }
      })

      dispatched.push({
        account: account.name,
        function: functionName,
        next_run_at: nextRun,
        error: invokeResult.error?.message ?? null
      })
    }

    return new Response(JSON.stringify({ success: true, dispatched, skipped }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    console.error('[sync-dispatcher] Erro crítico:', err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

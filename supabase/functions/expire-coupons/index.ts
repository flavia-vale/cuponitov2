import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    console.log("[expire-coupons] Iniciando rotina de exclusão de cupons vencidos...");

    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('coupons')
      .delete()
      .not('expiry', 'is', null)
      .lt('expiry', now)
      .select('id')

    if (error) throw error

    console.log(`[expire-coupons] ${data?.length ?? 0} cupons vencidos excluídos.`)

    return new Response(
      JSON.stringify({ success: true, deleted_count: data?.length ?? 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    console.error('[expire-coupons] Erro:', err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

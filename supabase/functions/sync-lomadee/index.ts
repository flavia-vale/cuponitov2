import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Relay para a Vercel Function em gru1 (São Paulo)
// api.lomadee.com só é acessível via IPs brasileiros
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const vercelUrl = Deno.env.get('VERCEL_SYNC_URL')
  const syncSecret = Deno.env.get('SYNC_SECRET')

  if (!vercelUrl) {
    return new Response(JSON.stringify({
      error: 'VERCEL_SYNC_URL não configurado. Adicione como Supabase Secret.'
    }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const body = await req.json().catch(() => ({}))

    // Injeta credenciais para que a Vercel não precise ter essas vars duplicadas
    const lomadeeToken = Deno.env.get('LOMADEE_APP_TOKEN')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    const response = await fetch(`${vercelUrl}/api/sync-lomadee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(syncSecret ? { 'Authorization': `Bearer ${syncSecret}` } : {})
      },
      body: JSON.stringify({ ...body, lomadee_token: lomadeeToken, supabase_url: supabaseUrl, service_role_key: serviceRoleKey })
    })

    const text = await response.text()
    let data: any
    try { data = JSON.parse(text) } catch {
      return new Response(JSON.stringify({ error: `Vercel retornou resposta inválida: ${text.slice(0, 200)}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

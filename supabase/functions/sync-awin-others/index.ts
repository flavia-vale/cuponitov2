import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const token = Deno.env.get('AWIN_TOKEN_OTHERS')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const PUBLISHER_ID = '2701264'
    const STORE_NAME = 'Awin - Outras lojas'

    if (!token) throw new Error("Secret AWIN_TOKEN_OTHERS não configurada.")

    const date = new Date()
    date.setFullYear(date.getFullYear() - 2)
    const startDate = date.toISOString().split('T')[0]

    console.log(`[sync-awin-others] Buscando ofertas desde ${startDate}`)

    const url = `https://api.awin.com/promotion/publisher/${PUBLISHER_ID}?accessToken=${token}&status=active&type=all&startDate=${startDate}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Erro API Awin: ${response.status}`)
    
    const data = await response.json()
    const promotions = Array.isArray(data) ? data : (data ? [data] : [])

    const offers = promotions.map((p: any) => ({
      awin_promotion_id: String(p.promotionId || p.id),
      publisher_id: PUBLISHER_ID,
      store_name: STORE_NAME,
      title: p.title || 'Oferta Especial',
      description: p.description || '',
      code: p.voucherCode || null,
      discount: p.campaignName || '',
      link: p.url || '',
      expiry: p.endDate ? new Date(p.endDate).toISOString() : null,
      updated_at: new Date().toISOString()
    })).filter(o => o.link)

    if (offers.length > 0) {
      const { error } = await supabase.from('offers').upsert(offers, { onConflict: 'awin_promotion_id' })
      if (error) throw error
    }

    return new Response(JSON.stringify({ success: true, count: offers.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error(`[sync-awin-others] Erro:`, err.message)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})
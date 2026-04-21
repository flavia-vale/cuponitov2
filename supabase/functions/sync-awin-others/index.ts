import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const PUBLISHER_ID = '2701264';
  const STORE_NAME = 'Awin - Outras lojas';
  const TOKEN = 'c9941ffb-6453-4637-bc63-d3946a5916cb';

  try {
    console.log(`[sync-awin-others] Iniciando captura...`);
    const response = await fetch(`https://api.awin.com/promotion/publisher/${PUBLISHER_ID}?accessToken=${TOKEN}`);
    const data = await response.json();
    const promotions = Array.isArray(data) ? data : [data];

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
    })).filter(o => o.link);

    if (offers.length > 0) {
      await supabase.from('offers').upsert(offers, { onConflict: 'awin_promotion_id' });
    }

    return new Response(JSON.stringify({ success: true, store: STORE_NAME, count: offers.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
})
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { data: accounts, error: accError } = await supabaseClient
      .from('affiliate_accounts')
      .select('*')
      .eq('status', true);

    if (accError) throw accError;
    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({ message: 'Nenhuma conta configurada.' }), { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    // Define uma data de início de 2 anos atrás
    const date = new Date();
    date.setFullYear(date.getFullYear() - 2);
    const startDate = date.toISOString().split('T')[0];

    const globalToken = Deno.env.get('AWIN_API_TOKEN');
    const summary = [];

    for (const account of accounts) {
      try {
        const activeToken = account.api_token || globalToken;
        
        if (!activeToken) continue;

        console.log(`[awin-integration] Buscando ofertas desde ${startDate} para o ID ${account.publisher_id}`);

        // URL com status=active, type=all e startDate retroativo
        const url = `https://api.awin.com/promotion/publisher/${account.publisher_id}?accessToken=${activeToken}&status=active&type=all&startDate=${startDate}`;
        const response = await fetch(url);

        if (!response.ok) continue;

        const data = await response.json();
        const promotions = Array.isArray(data) ? data : (data ? [data] : []);

        const offersToSave = promotions.map((p: any) => ({
          awin_promotion_id: String(p.promotionId || p.id),
          publisher_id: account.publisher_id,
          store_name: account.store_name,
          title: p.title || p.name || 'Oferta',
          description: p.description || '',
          code: p.voucherCode || null,
          discount: p.campaignName || '',
          link: p.url || p.link || '',
          expiry: p.endDate ? new Date(p.endDate).toISOString() : null,
          status: true,
          updated_at: new Date().toISOString()
        })).filter(o => o.link);

        if (offersToSave.length > 0) {
          await supabaseClient
            .from('offers')
            .upsert(offersToSave, { onConflict: 'awin_promotion_id' });
        }

        summary.push({ store: account.store_name, count: offersToSave.length });
      } catch (err) {
        console.error(`[awin-integration] Falha na conta ${account.publisher_id}:`, err.message);
      }
    }

    return new Response(JSON.stringify({ success: true, processed: summary }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})
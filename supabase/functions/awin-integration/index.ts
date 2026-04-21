import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handler para CORS
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  // Cliente Supabase com Service Role para ignorar RLS no Insert/Upsert
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    console.log("[awin-integration] Iniciando processamento de contas com parâmetros otimizados...");

    // 1. Buscar contas ativas no banco
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

    const globalToken = Deno.env.get('AWIN_API_TOKEN');
    const summary = [];

    // 2. Iterar sobre cada conta
    for (const account of accounts) {
      try {
        const activeToken = account.api_token || globalToken;
        
        if (!activeToken) {
          console.warn(`[awin-integration] Pulando ${account.store_name}: Token ausente.`);
          continue;
        }

        // URL atualizada com status=active e type=all
        const url = `https://api.awin.com/promotion/publisher/${account.publisher_id}?accessToken=${activeToken}&status=active&type=all`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`[awin-integration] Erro API Awin para ${account.store_name} (${account.publisher_id}): ${response.status}`);
          continue;
        }

        const data = await response.json();
        const promotions = Array.isArray(data) ? data : (data ? [data] : []);

        // 3. Mapear e preparar para Upsert
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
          const { error: upsertError } = await supabaseClient
            .from('offers')
            .upsert(offersToSave, { onConflict: 'awin_promotion_id' });

          if (upsertError) throw upsertError;
        }

        summary.push({ store: account.store_name, count: offersToSave.length });
        console.log(`[awin-integration] Sucesso: ${account.store_name} - ${offersToSave.length} ofertas.`);

      } catch (err) {
        console.error(`[awin-integration] Falha na conta ${account.publisher_id}:`, err.message);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: summary 
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error(`[awin-integration] Erro Fatal:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})
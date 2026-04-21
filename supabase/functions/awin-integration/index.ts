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
    console.log("[awin-integration] Iniciando sincronização multi-conta");

    // 1. Buscar todas as contas ativas
    const { data: accounts, error: accError } = await supabaseClient
      .from('affiliate_accounts')
      .select('*')
      .eq('status', true);

    if (accError) throw accError;
    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({ message: 'Nenhuma conta ativa encontrada' }), { headers: corsHeaders });
    }

    const globalToken = Deno.env.get('AWIN_API_TOKEN');
    const results = [];

    // 2. Loop pelas contas
    for (const account of accounts) {
      try {
        const token = account.api_token || globalToken;
        if (!token) {
          console.error(`[awin-integration] Token ausente para conta ${account.publisher_id}`);
          continue;
        }

        console.log(`[awin-integration] Processando: ${account.store_name} (${account.publisher_id})`);
        
        const awinUrl = `https://api.awin.com/promotion/publisher/${account.publisher_id}?accessToken=${token}`;
        const response = await fetch(awinUrl);

        if (!response.ok) {
          console.error(`[awin-integration] Erro na conta ${account.publisher_id}: ${response.status}`);
          continue;
        }

        const rawData = await response.json();
        const promotions = Array.isArray(rawData) ? rawData : [rawData];

        // 3. Mapeamento e Upsert
        const offersToUpsert = promotions.map((p: any) => ({
          awin_promotion_id: String(p.promotionId || p.id),
          publisher_id: account.publisher_id,
          store_name: account.store_name,
          title: p.title || p.name || 'Oferta Especial',
          description: p.description || '',
          code: p.voucherCode || null,
          discount: p.campaignName || '', // Ou extrair do título se necessário
          link: p.url || p.link || '',
          expiry: p.endDate ? new Date(p.endDate).toISOString() : null,
          status: true,
          updated_at: new Date().toISOString()
        })).filter(o => o.link);

        if (offersToUpsert.length > 0) {
          const { error: upsertError } = await supabaseClient
            .from('offers')
            .upsert(offersToUpsert, { onConflict: 'awin_promotion_id' });

          if (upsertError) console.error(`[awin-integration] Erro no upsert para ${account.publisher_id}:`, upsertError);
          
          results.push({
            publisher_id: account.publisher_id,
            count: offersToUpsert.length,
            status: 'success'
          });
        }
      } catch (err) {
        console.error(`[awin-integration] Falha catastrófica na conta ${account.publisher_id}:`, err.message);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed_accounts: results.length,
      details: results 
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error(`[awin-integration] Erro Geral:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})
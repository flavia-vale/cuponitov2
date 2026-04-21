import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("[awin-integration] Início da execução da função");

    // 2. Verificação básica de cabeçalho (requerido pelo invoke do Supabase Client)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("[awin-integration] Erro: Cabeçalho Authorization ausente");
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const AWIN_API_TOKEN = Deno.env.get('AWIN_API_TOKEN');
    const PUBLISHER_ID = '2740940';
    
    if (!AWIN_API_TOKEN) {
      console.error("[awin-integration] Erro: AWIN_API_TOKEN não configurada nos Secrets");
      return new Response(
        JSON.stringify({ error: 'Configuração ausente: AWIN_API_TOKEN' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Chamada API Awin - Ajustado para v2 com accessToken na URL
    const awinUrl = `https://api.awin.com/promotion/publisher/${PUBLISHER_ID}?accessToken=${AWIN_API_TOKEN}`;
    console.log(`[awin-integration] Chamando Awin para Publisher: ${PUBLISHER_ID}`);

    const response = await fetch(awinUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`[awin-integration] Resposta da Awin: Status ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[awin-integration] Erro retornado pela API Awin: ${errorText}`);
      
      return new Response(
        JSON.stringify({ 
          error: 'A API da Awin retornou um erro', 
          awin_status: response.status,
          details: errorText 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`[awin-integration] Sucesso: ${Array.isArray(data) ? data.length : 0} registros recebidos`);

    return new Response(
      JSON.stringify({ 
        success: true,
        count: Array.isArray(data) ? data.length : 0,
        sample: Array.isArray(data) ? data.slice(0, 1) : data
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[awin-integration] Erro inesperado: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
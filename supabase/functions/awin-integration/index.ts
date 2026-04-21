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

    // 2. Verificação de Autenticação (Requisito Supabase)
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

    // URL fornecida pelo usuário
    const awinUrl = `https://api.awin.com/promotion/publisher/${PUBLISHER_ID}`;
    console.log(`[awin-integration] Chamando API Awin: ${awinUrl}`);

    const response = await fetch(awinUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AWIN_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`[awin-integration] Resposta da Awin: Status ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[awin-integration] Erro na API Awin: ${errorText}`);
      
      // Se a Awin retornar 404, vamos retornar um erro amigável
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ 
            error: 'Endpoint da Awin não encontrado', 
            details: 'Verifique se a URL da promoção para este Publisher ID está correta na documentação da Awin.',
            awin_status: 404 
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Erro ao consultar Awin', details: errorText, status: response.status }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`[awin-integration] Sucesso: ${data.length} registros recebidos`);

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
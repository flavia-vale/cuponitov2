import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const AWIN_API_TOKEN = Deno.env.get('AWIN_API_TOKEN');
    
    if (!AWIN_API_TOKEN) {
      console.error("[awin-integration] AWIN_API_TOKEN not found in environment variables");
      return new Response(
        JSON.stringify({ error: 'AWIN_API_TOKEN is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("[awin-integration] Fetching coupons from Awin API...");

    // URL da API da Awin para cupons (Vouchers)
    // Note: Geralmente a Awin usa GET para listar vouchers, mas o usuário mencionou POST.
    // Vou preparar a estrutura base. Se for GET, mudamos facilmente.
    const response = await fetch('https://api.awin.com/vouchers', {
      method: 'GET', // Ajustaremos conforme a documentação/necessidade
      headers: {
        'Authorization': `Bearer ${AWIN_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[awin-integration] Awin API error:", errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from Awin', details: errorData }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("[awin-integration] Data received from Awin successfully");

    return new Response(
      JSON.stringify({ 
        message: 'Conexão com Awin estabelecida com sucesso',
        count: data.length,
        sample: data.slice(0, 1) // Enviamos apenas um exemplo para mapeamento inicial
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("[awin-integration] Unexpected error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})

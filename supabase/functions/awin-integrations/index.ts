import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    console.log("[awin-integrations] Iniciando sincronização horária...");

    const { data: accounts, error: accError } = await supabase
      .from('affiliate_accounts')
      .select('*')
      .eq('status', true);

    if (accError) throw accError;
    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({ message: 'Nenhuma conta ativa encontrada' }), { headers: corsHeaders });
    }

    const globalToken = Deno.env.get('AWIN_API_TOKEN');
    const globalSummary = [];

    for (const account of accounts) {
      const token = account.api_token || globalToken;
      if (!token) continue;

      let page = 1;
      const pageSize = 200;
      let hasMore = true;
      const accountStats = {
        store: account.store_name,
        ofertas_novas: 0,
        ofertas_atualizadas: 0,
        lojas_criadas: 0
      };

      while (hasMore) {
        const response = await fetch(`https://api.awin.com/publisher/${account.publisher_id}/promotions?accessToken=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filters: { status: 'active', type: 'all', membership: 'joined' },
            pagination: { page: page, pageSize: pageSize }
          })
        });

        let data;
        if (!response.ok) {
          const getUrl = `https://api.awin.com/promotion/publisher/${account.publisher_id}?accessToken=${token}&status=active&type=all&page=${page}&pageSize=${pageSize}`;
          const getResponse = await fetch(getUrl);
          if (!getResponse.ok) {
            hasMore = false;
            break;
          }
          data = await getResponse.json();
        } else {
          data = await response.json();
        }

        const promotions = data.data || (Array.isArray(data) ? data : []);
        if (promotions.length === 0) {
          hasMore = false;
          break;
        }

        for (const promo of promotions) {
          const advertiser = promo.advertiser;
          if (!advertiser) continue;

          // a. Verificar/Criar Loja usando o novo campo store_id
          let { data: store } = await supabase
            .from('stores')
            .select('id')
            .eq('store_id', advertiser.id)
            .maybeSingle();

          if (!store) {
            const { data: newStore, error: createError } = await supabase
              .from('stores')
              .insert([{
                name: advertiser.name,
                slug: slugify(advertiser.name),
                store_id: advertiser.id,
                awin_advertiser_id: advertiser.id,
                active: true
              }])
              .select('id')
              .single();
            
            if (createError) continue;
            store = newStore;
            accountStats.lojas_criadas++;
          }

          // b. Verificar/Upsert Cupom
          const couponData = {
            awin_promotion_id: String(promo.promotionId),
            store_id: store.id,
            store: advertiser.name,
            publisher_id: account.publisher_id,
            title: promo.title,
            description: promo.description,
            terms: promo.terms,
            code: promo.voucher?.code || null,
            type: promo.type,
            link: promo.urlTracking || promo.url,
            expiry: promo.endDate ? new Date(promo.endDate).toISOString() : null,
            start_date: promo.startDate ? new Date(promo.startDate).toISOString() : null,
            status: promo.status === 'active',
            updated_at: new Date().toISOString(),
            category: promo.voucher?.code ? 'Geral' : 'Ofertas no link'
          };

          const { data: existingCoupon } = await supabase
            .from('coupons')
            .select('id')
            .eq('awin_promotion_id', couponData.awin_promotion_id)
            .maybeSingle();

          if (!existingCoupon) {
            const { error: insertError } = await supabase.from('coupons').insert([couponData]);
            if (!insertError) accountStats.ofertas_novas++;
          } else {
            const { error: updateError } = await supabase
              .from('coupons')
              .update({
                title: couponData.title,
                description: couponData.description,
                terms: couponData.terms,
                code: couponData.code,
                link: couponData.link,
                expiry: couponData.expiry,
                start_date: couponData.start_date,
                status: couponData.status,
                updated_at: couponData.updated_at,
                store: couponData.store,
                store_id: couponData.store_id
              })
              .eq('awin_promotion_id', couponData.awin_promotion_id);

            if (!updateError) accountStats.ofertas_atualizadas++;
          }
        }

        if (promotions.length < pageSize) hasMore = false;
        else page++;
      }
      globalSummary.push(accountStats);
    }

    return new Response(JSON.stringify({ success: true, summary: globalSummary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function determineCategory(title: string, description: string, storeName: string): string {
  const text = `${title} ${description} ${storeName}`.toLowerCase()
  if (/frete gr[aá]ti|envio gr[aá]ti|free shipping/.test(text)) return 'Frete Grátis'
  if (/moda|roupa|vest[iu]|fashion|c&a|zara|renner|under armour|asics|nike|adidas|puma|denim|calvin klein|lacoste|tommy hilfiger|quiksilver|billabong/.test(text)) return 'Moda'
  if (/tech|eletr[ôo]|notebook|celular|smartphone|kabum|ssd|consol|playstation|xbox|tv|monitor|teclado|mouse|headphone|fone|samsung|lg|iphone|ipad|macbook/.test(text)) return 'Tech'
  if (/delivery|comida|restaurante|ifood|pizza|lanche|burguer|sushi|açai|doces|sobremesa|aliment/.test(text)) return 'Delivery'
  if (/viagem|hotel|passagem|hospedagem|a[eé]reo|turismo|resort|motel|pousada|booking|airbnb/.test(text)) return 'Viagens'
  if (/beleza|cosm[eé]t|maquiagem|perfume|skincare|cabelo|shampoo|condicionador|creme|hidratante|sérum|máscara|unha/.test(text)) return 'Beleza'
  return 'Geral'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  try {
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('id, title, description, store')

    if (error) throw error

    let updated = 0
    const updates: Array<{ id: string; category: string }> = []

    for (const coupon of coupons || []) {
      const newCategory = determineCategory(coupon.title, coupon.description || '', coupon.store)
      updates.push({ id: coupon.id, category: newCategory })
    }

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('coupons')
        .update({ category: update.category })
        .eq('id', update.id)

      if (!updateError) updated++
    }

    return new Response(
      JSON.stringify({ success: true, total: coupons?.length || 0, updated }),
      { headers: corsHeaders }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    )
  }
})

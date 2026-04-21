import { createClient } from '@supabase/supabase-js';

// Vercel serverless function — região gru1 (São Paulo) para acessar api.lomadee.com
export const config = {
  regions: ['gru1'],
  maxDuration: 300,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function determineCategory(title: string, description: string, categoryName: string): string {
  const text = `${title} ${description} ${categoryName}`.toLowerCase();
  if (/frete gr[aá]ti|envio gr[aá]ti/.test(text)) return 'Frete Grátis';
  if (/moda|roupa|vest[iu]|fashion|c&a|zara|renner/.test(text)) return 'Moda';
  if (/tech|eletr[ôo]|notebook|celular|smartphone|kabum|tv |ssd|gpu/.test(text)) return 'Tech';
  if (/delivery|comida|restaurante|ifood|pizza|lanche/.test(text)) return 'Delivery';
  if (/viagem|hotel|passagem|hospedagem|a[eé]reo|turismo/.test(text)) return 'Viagens';
  if (/beleza|cosm[eé]t|maquiagem|perfume|skincare|cabelo/.test(text)) return 'Beleza';
  return categoryName || 'Geral';
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  // Verificar secret
  const syncSecret = process.env.SYNC_SECRET ?? '';
  const authHeader = req.headers.get('authorization') ?? '';
  if (syncSecret && authHeader !== `Bearer ${syncSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const lomadeeToken = process.env.LOMADEE_APP_TOKEN!;

  if (!supabaseUrl || !serviceRoleKey || !lomadeeToken) {
    return new Response(JSON.stringify({ error: 'Variáveis de ambiente não configuradas' }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let body: any = {};
  try { body = await req.json(); } catch {}
  const accountId: string | null = body.account_id ?? null;

  // Buscar conta(s) Lomadee ativa(s)
  let query = supabase
    .from('affiliate_accounts')
    .select('*, integration_providers(slug, base_url)')
    .eq('active', true);

  if (accountId) {
    query = query.eq('id', accountId) as any;
  } else {
    const { data: provider } = await supabase
      .from('integration_providers')
      .select('id')
      .eq('slug', 'lomadee')
      .single();
    if (provider) query = query.eq('provider_id', provider.id) as any;
  }

  const { data: accounts, error: accError } = await query;
  if (accError) return new Response(JSON.stringify({ error: accError.message }), { status: 500 });
  if (!accounts || accounts.length === 0) {
    return new Response(JSON.stringify({ message: 'Nenhuma conta Lomadee ativa' }), { status: 200 });
  }

  const summary = [];

  for (const account of accounts) {
    let logId: string | null = null;
    const { data: logRow } = await supabase
      .from('sync_logs')
      .insert({ account_id: account.id, status: 'running' })
      .select('id')
      .single();
    logId = logRow?.id ?? null;

    const token = lomadeeToken;
    const sourceId = account.publisher_id;
    const baseUrl = (account.integration_providers as any)?.base_url || 'https://api.lomadee.com/v3';
    const pageSize = 100;
    const stats = { inserted: 0, updated: 0, skipped: 0, stores_created: 0 };
    const errors: string[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const url = `${baseUrl}/${sourceId}/coupon/_all?token=${token}&sourceId=${sourceId}&page=${page}&pageSize=${pageSize}`;
      let res: globalThis.Response;
      try {
        res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      } catch (e: any) {
        errors.push(`Fetch error p${page}: ${e.message}`);
        break;
      }

      const responseText = await res.text();
      if (!res.ok) {
        errors.push(`API error p${page}: ${res.status} ${responseText.slice(0, 200)}`);
        break;
      }

      let data: any;
      try { data = JSON.parse(responseText); } catch {
        errors.push(`JSON parse error: ${responseText.slice(0, 200)}`);
        break;
      }

      if (page === 1 && !data.coupons) {
        errors.push(`debug: keys=${Object.keys(data).join(',')} preview=${responseText.slice(0, 300)}`);
        break;
      }

      const coupons: any[] = data.coupons ?? [];
      const pagination = data.pagination ?? {};
      totalPages = pagination.totalPage ?? pagination.total_page ?? 1;

      if (coupons.length === 0) break;

      for (const coupon of coupons) {
        try {
          const store = coupon.store ?? {};
          const storeExtId = String(store.id ?? '');
          const storeName: string = store.name ?? 'Loja Lomadee';
          if (!storeExtId) { stats.skipped++; continue; }

          let { data: storeRow } = await supabase
            .from('stores')
            .select('id')
            .eq('store_id', storeExtId)
            .maybeSingle();

          if (!storeRow) {
            const { data: newStore, error: storeErr } = await supabase
              .from('stores')
              .insert({
                name: storeName,
                slug: `cupom-desconto-${slugify(storeName)}`,
                store_id: storeExtId,
                active: true,
              })
              .select('id')
              .single();

            if (storeErr) {
              const { data: retryStore } = await supabase
                .from('stores')
                .insert({
                  name: storeName,
                  slug: `cupom-desconto-${slugify(storeName)}-${storeExtId}`,
                  store_id: storeExtId,
                  active: true,
                })
                .select('id')
                .single();
              storeRow = retryStore;
            } else {
              storeRow = newStore;
              stats.stores_created++;
              supabase.functions.invoke('enrich-store', {
                body: { store_id: newStore!.id },
              }).catch(() => {});
            }
          }

          if (!storeRow) { stats.skipped++; continue; }

          const code: string | null = coupon.code ?? coupon.couponCode ?? null;
          const link: string = coupon.link ?? store.link ?? '';
          if (!link) { stats.skipped++; continue; }

          const expiryDate = coupon.finalDate ? new Date(coupon.finalDate) : null;
          const categoryName: string = coupon.category?.name ?? '';
          const promotionId = `lomadee_${coupon.id}`;

          const couponData = {
            store_id: storeRow.id,
            store: storeName,
            title: coupon.description ?? coupon.title ?? 'Oferta Especial',
            description: coupon.description ?? '',
            code,
            discount: coupon.discount ?? '',
            link,
            expiry: expiryDate ? expiryDate.toISOString() : null,
            expiry_text: expiryDate
              ? expiryDate.toLocaleDateString('pt-BR', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  timeZone: 'America/Sao_Paulo',
                })
              : '',
            start_date: coupon.initialDate ? new Date(coupon.initialDate).toISOString() : null,
            status: true,
            category: determineCategory(coupon.description ?? '', '', categoryName),
            updated_at: new Date().toISOString(),
            awin_promotion_id: promotionId,
          };

          const { data: existing } = await supabase
            .from('coupons')
            .select('id')
            .eq('awin_promotion_id', promotionId)
            .maybeSingle();

          if (!existing) {
            const { error } = await supabase.from('coupons').insert(couponData);
            if (!error) stats.inserted++; else stats.skipped++;
          } else {
            const { error } = await supabase.from('coupons').update({
              title: couponData.title,
              description: couponData.description,
              code: couponData.code,
              discount: couponData.discount,
              link: couponData.link,
              expiry: couponData.expiry,
              expiry_text: couponData.expiry_text,
              status: couponData.status,
              updated_at: couponData.updated_at,
              store: couponData.store,
              store_id: couponData.store_id,
            }).eq('awin_promotion_id', promotionId);
            if (!error) stats.updated++; else stats.skipped++;
          }
        } catch (e: any) {
          errors.push(e.message);
          stats.skipped++;
        }
      }

      if (coupons.length < pageSize) break;
      page++;
    }

    const finalStatus = errors.length > 0 && stats.inserted + stats.updated === 0 ? 'error' : 'success';
    if (logId) {
      await supabase.from('sync_logs').update({
        status: finalStatus,
        finished_at: new Date().toISOString(),
        records_inserted: stats.inserted,
        records_updated: stats.updated,
        records_skipped: stats.skipped,
        error_message: errors.length > 0 ? errors.slice(0, 5).join(' | ') : null,
        meta: { stores_created: stats.stores_created, pages: page - 1 },
      }).eq('id', logId);
    }

    await supabase
      .from('sync_schedules')
      .update({ last_run_at: new Date().toISOString() })
      .eq('account_id', account.id);

    summary.push({ account: account.name, ...stats, status: finalStatus });
  }

  return new Response(JSON.stringify({ success: true, summary }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

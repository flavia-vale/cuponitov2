// Vercel serverless function — região gru1 (São Paulo) para acessar api-beta.lomadee.com.br
// Nova API Lomadee (2024+): POST /affiliate/campaigns com x-api-key header
// Suporta ambos offerType (Url direto + Spreadsheet via shortener endpoint)

import https from 'https';

function httpsGetJson(url: string, headers: Record<string, string> = {}, maxRedirects = 5): Promise<{ ok: boolean; status: number; text: string; finalUrl: string; redirects: string[] }> {
  const redirects: string[] = [];
  const attempt = (currentUrl: string, left: number): Promise<{ ok: boolean; status: number; text: string; finalUrl: string; redirects: string[] }> =>
    new Promise((resolve, reject) => {
      const req = https.get(currentUrl, {
        headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; Cuponito/1.0)', ...headers },
      }, (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400 && res.headers.location && left > 0) {
          res.resume();
          const next = new URL(res.headers.location, currentUrl).toString();
          redirects.push(`${status}→${next}`);
          attempt(next, left - 1).then(resolve, reject);
          return;
        }
        let body = '';
        res.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        res.on('end', () => resolve({ ok: status >= 200 && status < 300, status, text: body, finalUrl: currentUrl, redirects }));
      });
      req.setTimeout(30_000, () => { req.destroy(new Error('timeout')); });
      req.on('error', (e: NodeJS.ErrnoException) => reject(new Error(`${e.code ?? e.message}: ${e.message}`)));
    });
  return attempt(url, maxRedirects);
}

function httpsPostJson(url: string, body: string, headers: Record<string, string> = {}): Promise<{ ok: boolean; status: number; text: string }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; Cuponito/1.0)', ...headers },
    }, (res) => {
      const status = res.statusCode ?? 0;
      let resBody = '';
      res.on('data', (chunk: Buffer) => { resBody += chunk.toString(); });
      res.on('end', () => resolve({ ok: status >= 200 && status < 300, status, text: resBody }));
    });
    req.setTimeout(30_000, () => { req.destroy(new Error('timeout')); });
    req.on('error', (e: NodeJS.ErrnoException) => reject(new Error(`${e.code ?? e.message}: ${e.message}`)));
    req.write(body);
    req.end();
  });
}

// ── Supabase REST helper ───────────────────────────────────────────────────────

class DB {
  private base: string;
  private headers: Record<string, string>;

  constructor(url: string, key: string) {
    this.base = `${url}/rest/v1`;
    this.headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  }

  async select<T = any>(table: string, qs: string): Promise<T[]> {
    const res = await fetch(`${this.base}/${table}?${qs}`, { headers: this.headers });
    if (!res.ok) throw new Error(`SELECT ${table}: ${await res.text()}`);
    return res.json();
  }

  async insert<T = any>(table: string, data: object, returning = true): Promise<T | null> {
    const res = await fetch(`${this.base}/${table}`, {
      method: 'POST',
      headers: { ...this.headers, Prefer: returning ? 'return=representation' : 'return=minimal' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`INSERT ${table}: ${await res.text()}`);
    if (!returning) return null;
    const rows: T[] = await res.json();
    return rows[0] ?? null;
  }

  async update(table: string, data: object, qs: string): Promise<void> {
    const res = await fetch(`${this.base}/${table}?${qs}`, {
      method: 'PATCH',
      headers: { ...this.headers, Prefer: 'return=minimal' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`UPDATE ${table}: ${await res.text()}`);
  }

  async invokeFunction(supabaseUrl: string, fn: string, body: object): Promise<void> {
    fetch(`${supabaseUrl}/functions/v1/${fn}`, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function determineCategory(title: string, description: string, categoryName: string): string {
  const text = `${title} ${description} ${categoryName}`.toLowerCase();
  if (/frete gr[aá]ti|envio gr[aá]ti/.test(text)) return 'Frete Grátis';
  if (/moda|roupa|vest[iu]|fashion|c&a|zara|renner|under armour|asics|nike|adidas|puma|denim|calvin klein|lacoste|tommy hilfiger|quiksilver|billabong/.test(text)) return 'Moda';
  if (/tech|eletr[ôo]|notebook|celular|smartphone|kabum|tv |ssd|gpu|consol|playstation|xbox|monitor|teclado|mouse|headphone|fone|samsung|lg|iphone|ipad|macbook/.test(text)) return 'Tech';
  if (/delivery|comida|restaurante|ifood|pizza|lanche|burguer|sushi|açai|doces|sobremesa|aliment/.test(text)) return 'Delivery';
  if (/viagem|hotel|passagem|hospedagem|a[eé]reo|turismo|resort|motel|pousada|booking|airbnb/.test(text)) return 'Viagens';
  if (/beleza|cosm[eé]t|maquiagem|perfume|skincare|cabelo|shampoo|condicionador|creme|hidratante|sérum|máscara|unha/.test(text)) return 'Beleza';
  return categoryName || 'Geral';
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const syncSecret = process.env.SYNC_SECRET ?? '';
  const authHeader = (req.headers['authorization'] ?? '') as string;
  if (syncSecret && authHeader !== `Bearer ${syncSecret}`) { res.status(401).json({ error: 'Unauthorized' }); return; }

  const body: any = req.body ?? {};
  const supabaseUrl: string = process.env.SUPABASE_URL || body.supabase_url || '';
  const serviceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || body.service_role_key || '';
  const lomadeeApiKey: string = process.env.LOMADEE_API_KEY || process.env.LOMADEE_APP_TOKEN || body.lomadee_api_key || body.lomadee_token || '';

  if (!supabaseUrl || !serviceRoleKey || !lomadeeApiKey) {
    res.status(500).json({ error: 'Variáveis não configuradas: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LOMADEE_API_KEY' });
    return;
  }

  const db = new DB(supabaseUrl, serviceRoleKey);
  const accountId: string | null = body.account_id ?? null;

  let accounts: any[];
  try {
    if (accountId) {
      accounts = await db.select('affiliate_accounts', `id=eq.${accountId}&active=eq.true&select=*,integration_providers(slug,base_url)`);
    } else {
      const providers = await db.select('integration_providers', 'slug=eq.lomadee&select=id');
      const providerId = providers[0]?.id;
      if (!providerId) { res.status(200).json({ message: 'Provider Lomadee não encontrado' }); return; }
      accounts = await db.select('affiliate_accounts', `provider_id=eq.${providerId}&active=eq.true&select=*,integration_providers(slug,base_url)`);
    }
  } catch (e: any) { res.status(500).json({ error: e.message }); return; }

  if (!accounts || accounts.length === 0) { res.status(200).json({ message: 'Nenhuma conta Lomadee ativa' }); return; }

  const summary = [];
  const apiHeaders = { 'x-api-key': lomadeeApiKey };
  const brandCache: Record<string, any> = {};

  for (const account of accounts) {
    let logId: string | null = null;
    try { const log = await db.insert<{ id: string }>('sync_logs', { account_id: account.id, status: 'running' }); logId = log?.id ?? null; } catch { }

    const stats = { inserted: 0, updated: 0, skipped: 0, stores_created: 0, skipped_no_url: 0, skipped_no_store: 0, skipped_db_error: 0, shortener_errors: 0, offer_types: {} as Record<string, number>, sample_errors: [] as string[], sample_payload: null as any };
    const errors: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const qs = new URLSearchParams({
          page: String(page),
          limit: '100',
          types: 'PersonalCoupon,GenericCoupon',
          status: 'onTime',
        }).toString();

        const { ok, status, text } = await httpsGetJson(`https://api-beta.lomadee.com.br/affiliate/campaigns?${qs}`, apiHeaders);

        if (!ok) {
          errors.push(`API error p${page}: ${status} ${text.slice(0, 200)}`);
          break;
        }

        let data: any;
        try { data = JSON.parse(text); } catch { errors.push(`JSON parse error p${page}: ${text.slice(0, 200)}`); break; }

        const campaigns = Array.isArray(data.data) ? data.data : [];
        const meta = data.meta ?? {};
        hasMore = page < (meta.totalPages ?? 1);

        if (page === 1 && campaigns.length === 0) {
          errors.push(`empty_first_page: ${text.slice(0, 300)}`);
          break;
        }

        for (const campaign of campaigns) {
          try {
            const offerType = campaign.offerType ?? 'Unknown';
            stats.offer_types[offerType] = (stats.offer_types[offerType] ?? 0) + 1;

            const orgId = campaign.organizationId;
            if (!orgId) { stats.skipped++; continue; }

            // Busca info de marca (com cache)
            let brandName = 'Loja Lomadee';
            let brandLogo = '';
            if (!brandCache[orgId]) {
              try {
                const { ok: brandOk, text: brandText } = await httpsGetJson(`https://api-beta.lomadee.com.br/affiliate/brands/${orgId}`, apiHeaders);
                if (brandOk) {
                  const brandData = JSON.parse(brandText);
                  brandCache[orgId] = { name: brandData.data?.name ?? 'Loja Lomadee', logo: brandData.data?.logo ?? '' };
                }
              } catch { }
            }
            if (brandCache[orgId]) { brandName = brandCache[orgId].name; brandLogo = brandCache[orgId].logo; }

            // Registro de loja (sem filtros de habilitação por enquanto)
            let storeDbId: string | null = null;
            try {
              const storeRows = await db.select<{ id: string }>('stores', `store_id=eq.${orgId}&select=id`);
              if (storeRows.length > 0) {
                storeDbId = storeRows[0].id;
              } else {
                const slug = `cupom-desconto-${slugify(brandName)}`;
                try {
                  const newStore = await db.insert<{ id: string }>('stores', { name: brandName, slug, store_id: orgId, active: true, logo_url: brandLogo || null });
                  storeDbId = newStore?.id ?? null;
                  if (storeDbId) { stats.stores_created++; db.invokeFunction(supabaseUrl, 'enrich-store', { store_id: storeDbId }); }
                } catch (e: any) {
                  if (stats.sample_errors.length < 5) stats.sample_errors.push(`store_insert_1: ${e.message?.slice(0, 200)}`);
                  try {
                    const retry = await db.insert<{ id: string }>('stores', { name: brandName, slug: `${slug}-${orgId}`, store_id: orgId, active: true, logo_url: brandLogo || null });
                    storeDbId = retry?.id ?? null;
                  } catch (e2: any) {
                    if (stats.sample_errors.length < 5) stats.sample_errors.push(`store_insert_2: ${e2.message?.slice(0, 200)}`);
                  }
                }
              }
            } catch (e: any) {
              if (stats.sample_errors.length < 5) stats.sample_errors.push(`store_select: ${e.message?.slice(0, 200)}`);
            }
            if (!storeDbId) { stats.skipped_no_store++; stats.skipped++; continue; }

            // Determina link: se Url, usa direto; se Spreadsheet, chama shortener
            let linkUrl = campaign.url || '';
            if (!linkUrl && campaign.offerType === 'Spreadsheet') {
              try {
                const shortenerRes = await httpsPostJson(
                  'https://api-beta.lomadee.com.br/affiliate/shortener/url',
                  JSON.stringify({ organizationId: orgId, type: 'Coupon', featureId: campaign.id }),
                  apiHeaders
                );
                if (shortenerRes.ok) {
                  const shortData = JSON.parse(shortenerRes.text);
                  linkUrl = shortData.data?.[0]?.url ?? campaign.url ?? '';
                } else {
                  stats.shortener_errors++;
                }
              } catch (e: any) { stats.shortener_errors++; linkUrl = campaign.url || ''; }
            }
            if (!linkUrl) { stats.skipped_no_url++; stats.skipped++; continue; }

            const code: string | null = campaign.code ?? null;
            const promotionId = `lomadee_${campaign.id}`;
            const expiryDate = campaign.period?.endAt ? new Date(campaign.period.endAt) : null;

            const couponData = {
              store_id: storeDbId,
              store: brandName,
              title: campaign.name ?? 'Oferta Especial',
              description: campaign.description ?? '',
              code,
              discount: '', // Lomadee não fornece desconto em %
              link: linkUrl,
              expiry: expiryDate ? expiryDate.toISOString() : null,
              expiry_text: expiryDate
                ? expiryDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })
                : '',
              start_date: campaign.period?.startAt ? new Date(campaign.period.startAt).toISOString() : null,
              status: true,
              category: determineCategory(campaign.name ?? '', campaign.description ?? '', campaign.categories?.join(' ') ?? ''),
              updated_at: new Date().toISOString(),
              awin_promotion_id: promotionId,
            };

            try {
              const existing = await db.select<{ id: string }>('coupons', `awin_promotion_id=eq.${promotionId}&select=id`);
              if (existing.length === 0) {
                if (!stats.sample_payload) stats.sample_payload = couponData;
                await db.insert('coupons', couponData, false);
                stats.inserted++;
              } else {
                await db.update('coupons', {
                  title: couponData.title, description: couponData.description,
                  code: couponData.code, link: couponData.link, expiry: couponData.expiry,
                  expiry_text: couponData.expiry_text, status: couponData.status,
                  updated_at: couponData.updated_at, store: couponData.store, store_id: couponData.store_id,
                }, `awin_promotion_id=eq.${promotionId}`);
                stats.updated++;
              }
            } catch (e: any) {
              stats.skipped_db_error++;
              stats.skipped++;
              if (stats.sample_errors.length < 5) stats.sample_errors.push(`coupon_db: ${e.message?.slice(0, 300)}`);
            }

          } catch (e: any) { errors.push(e.message); stats.skipped++; }
        }

        page++;
      } catch (e: any) { errors.push(e.message); break; }
    }

    const finalStatus = errors.length > 0 && stats.inserted + stats.updated === 0 ? 'error' : 'success';
    if (logId) {
      try {
        await db.update('sync_logs', {
          status: finalStatus,
          finished_at: new Date().toISOString(),
          records_inserted: stats.inserted,
          records_updated: stats.updated,
          records_skipped: stats.skipped,
          error_message: errors.length > 0 ? errors.slice(0, 5).join(' | ') : null,
          meta: {
            stores_created: stats.stores_created,
            brands_cached: Object.keys(brandCache).length,
            skipped_no_url: stats.skipped_no_url,
            skipped_no_store: stats.skipped_no_store,
            skipped_db_error: stats.skipped_db_error,
            shortener_errors: stats.shortener_errors,
            offer_types: stats.offer_types,
            sample_errors: stats.sample_errors,
            sample_payload: stats.sample_payload,
          },
        }, `id=eq.${logId}`);
      } catch { }
    }

    try { await db.update('sync_schedules', { last_run_at: new Date().toISOString() }, `account_id=eq.${account.id}`); } catch { }
    summary.push({ account: account.name, ...stats, status: finalStatus });
  }

  res.status(200).json({ success: true, summary });
}

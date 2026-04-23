// Vercel serverless function — região gru1 (São Paulo) para acessar api.lomadee.com
// Usa REST API do Supabase diretamente (sem @supabase/supabase-js) pois o pacote ws
// (dependência do realtime-js) falha na inicialização em funções serverless em gru1.

import https from 'https';

function httpsGetJson(url: string, maxRedirects = 5): Promise<{ ok: boolean; status: number; text: string; finalUrl: string; redirects: string[] }> {
  const redirects: string[] = [];
  const attempt = (currentUrl: string, left: number): Promise<{ ok: boolean; status: number; text: string; finalUrl: string; redirects: string[] }> =>
    new Promise((resolve, reject) => {
      const req = https.get(currentUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; Cuponito/1.0)',
        },
      }, (res) => {
        const status = res.statusCode ?? 0;
        // Seguir redirects manualmente: a API Lomadee responde 307 quando o appToken
        // está no lugar errado ou está inválido. Sem follow, víamos "status<400 + body vazio".
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

// ── Supabase REST helper ───────────────────────────────────────────────────────

class DB {
  private base: string;
  private headers: Record<string, string>;

  constructor(url: string, key: string) {
    this.base = `${url}/rest/v1`;
    this.headers = {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    };
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

  async upsert(table: string, data: object, onConflict: string, ignoreDuplicates = false): Promise<void> {
    const prefer = ignoreDuplicates
      ? 'resolution=ignore-duplicates,return=minimal'
      : 'resolution=merge-duplicates,return=minimal';
    const res = await fetch(`${this.base}/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
      method: 'POST',
      headers: { ...this.headers, Prefer: prefer },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`UPSERT ${table}: ${await res.text()}`);
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

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const syncSecret = process.env.SYNC_SECRET ?? '';
  const authHeader = (req.headers['authorization'] ?? '') as string;
  if (syncSecret && authHeader !== `Bearer ${syncSecret}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Vercel auto-parseia application/json para req.body
  const body: any = req.body ?? {};

  const supabaseUrl: string = process.env.SUPABASE_URL || body.supabase_url || '';
  const serviceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || body.service_role_key || '';
  const lomadeeToken: string = process.env.LOMADEE_APP_TOKEN || body.lomadee_token || '';

  if (!supabaseUrl || !serviceRoleKey || !lomadeeToken) {
    res.status(500).json({ error: 'Variáveis não configuradas: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LOMADEE_APP_TOKEN' });
    return;
  }

  const db = new DB(supabaseUrl, serviceRoleKey);
  const accountId: string | null = body.account_id ?? null;

  // Buscar conta(s) Lomadee ativa(s)
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
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }

  if (!accounts || accounts.length === 0) {
    res.status(200).json({ message: 'Nenhuma conta Lomadee ativa' });
    return;
  }

  const summary = [];

  for (const account of accounts) {
    let logId: string | null = null;

    try {
      const log = await db.insert<{ id: string }>('sync_logs', { account_id: account.id, status: 'running' });
      logId = log?.id ?? null;
    } catch { /* ignora erro de log */ }

    // Lojas explicitamente desabilitadas pelo admin são ignoradas
    // Novas lojas (não cadastradas ainda) são sempre sincronizadas e auto-registradas
    const disabledStoreIds = new Set<string>();
    try {
      const filters = await db.select('lomadee_store_filters', `account_id=eq.${account.id}&enabled=eq.false&select=lomadee_store_id`);
      for (const f of filters) disabledStoreIds.add(f.lomadee_store_id);
    } catch { /* sem filtros = permite tudo */ }

    const token = lomadeeToken;
    const sourceId = account.publisher_id;
    const baseUrl = account.integration_providers?.base_url || 'https://api.lomadee.com.br/v3';
    const pageSize = 100;
    const stats = { inserted: 0, updated: 0, skipped: 0, stores_created: 0 };
    const errors: string[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      // Lomadee v3: appToken OBRIGATÓRIO no path; sourceId como query.
      // Aplicamos redundância do token também como query param (alguns gateways exigem).
      // Referência: https://developer.lomadee.com/api/v3/#/coupon
      const url = `${baseUrl}/${token}/coupon/_all?sourceId=${sourceId}&token=${token}&page=${page}&pageSize=${pageSize}`;
      let responseText: string;
      let responseOk: boolean;
      let responseStatus: number;
      let redirectsTrail: string[] = [];
      try {
        const r = await httpsGetJson(url);
        responseText = r.text;
        responseOk = r.ok;
        responseStatus = r.status;
        redirectsTrail = r.redirects;
      } catch (e: any) {
        errors.push(`Fetch error p${page}: ${e.message}`);
        break;
      }

      if (!responseOk) {
        const trail = redirectsTrail.length ? ` redirects=[${redirectsTrail.join(' ')}]` : '';
        errors.push(`API error p${page}: ${responseStatus}${trail} ${responseText.slice(0, 200)}`);
        break;
      }

      let data: any;
      try { data = JSON.parse(responseText); } catch {
        errors.push(`JSON parse error p${page} (status=${responseStatus}): ${responseText.slice(0, 200)}`);
        break;
      }

      if (page === 1 && (!data.coupons || (Array.isArray(data.coupons) && data.coupons.length === 0))) {
        // Telemetria: captura formato exato da resposta quando a primeira página vem vazia.
        // Isso torna visível o "sucesso vazio" (ex.: API respondendo {"message":"Invalid token"}).
        const trail = redirectsTrail.length ? ` redirects=[${redirectsTrail.join(' ')}]` : '';
        errors.push(`empty_first_page status=${responseStatus}${trail} keys=${Object.keys(data).join(',')} preview=${responseText.slice(0, 300)}`);
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

          // Auto-registra loja nova com enabled=true; pula se já existe (ignoreDuplicates)
          try {
            await db.upsert('lomadee_store_filters', {
              account_id: account.id,
              lomadee_store_id: storeExtId,
              store_name: storeName,
              store_logo: store.thumbnail ?? store.image ?? '',
              enabled: true,
            }, 'account_id,lomadee_store_id', true);
          } catch { /* ignora */ }

          // Pular lojas desabilitadas pelo admin
          if (disabledStoreIds.has(storeExtId)) {
            stats.skipped++;
            continue;
          }

          // Buscar ou criar loja
          let storeDbId: string | null = null;
          try {
            const storeRows = await db.select<{ id: string }>('stores', `store_id=eq.${storeExtId}&select=id`);
            if (storeRows.length > 0) {
              storeDbId = storeRows[0].id;
            } else {
              const slug = `cupom-desconto-${slugify(storeName)}`;
              try {
                const newStore = await db.insert<{ id: string }>('stores', { name: storeName, slug, store_id: storeExtId, active: true });
                storeDbId = newStore?.id ?? null;
                if (storeDbId) {
                  stats.stores_created++;
                  db.invokeFunction(supabaseUrl, 'enrich-store', { store_id: storeDbId });
                }
              } catch {
                const retry = await db.insert<{ id: string }>('stores', { name: storeName, slug: `${slug}-${storeExtId}`, store_id: storeExtId, active: true }).catch(() => null);
                storeDbId = retry?.id ?? null;
              }
            }
          } catch { /* ignora erro de loja */ }

          if (!storeDbId) { stats.skipped++; continue; }

          const code: string | null = coupon.code ?? coupon.couponCode ?? null;
          const link: string = coupon.link ?? store.link ?? '';
          if (!link) { stats.skipped++; continue; }

          const expiryDate = coupon.finalDate ? new Date(coupon.finalDate) : null;
          const categoryName: string = coupon.category?.name ?? '';
          const promotionId = `lomadee_${coupon.id}`;

          const couponData = {
            store_id: storeDbId,
            store: storeName,
            title: coupon.description ?? coupon.title ?? 'Oferta Especial',
            description: coupon.description ?? '',
            code,
            discount: coupon.discount ?? '',
            link,
            expiry: expiryDate ? expiryDate.toISOString() : null,
            expiry_text: expiryDate
              ? expiryDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })
              : '',
            start_date: coupon.initialDate ? new Date(coupon.initialDate).toISOString() : null,
            status: true,
            category: determineCategory(coupon.description ?? '', '', categoryName),
            updated_at: new Date().toISOString(),
            awin_promotion_id: promotionId,
          };

          try {
            const existing = await db.select<{ id: string }>('coupons', `awin_promotion_id=eq.${promotionId}&select=id`);
            if (existing.length === 0) {
              await db.insert('coupons', couponData, false);
              stats.inserted++;
            } else {
              await db.update('coupons', {
                title: couponData.title, description: couponData.description,
                code: couponData.code, discount: couponData.discount,
                link: couponData.link, expiry: couponData.expiry,
                expiry_text: couponData.expiry_text, status: couponData.status,
                updated_at: couponData.updated_at, store: couponData.store,
                store_id: couponData.store_id,
              }, `awin_promotion_id=eq.${promotionId}`);
              stats.updated++;
            }
          } catch { stats.skipped++; }

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
      try {
        await db.update('sync_logs', {
          status: finalStatus,
          finished_at: new Date().toISOString(),
          records_inserted: stats.inserted,
          records_updated: stats.updated,
          records_skipped: stats.skipped,
          error_message: errors.length > 0 ? errors.slice(0, 5).join(' | ') : null,
          meta: { stores_created: stats.stores_created, pages: page - 1 },
        }, `id=eq.${logId}`);
      } catch { /* ignora erro de log */ }
    }

    try {
      await db.update('sync_schedules', { last_run_at: new Date().toISOString() }, `account_id=eq.${account.id}`);
    } catch { /* ignora */ }

    summary.push({ account: account.name, ...stats, status: finalStatus });
  }

  res.status(200).json({ success: true, summary });
}

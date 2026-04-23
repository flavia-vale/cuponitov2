// Vercel serverless function — Rakuten LinkShare Coupon API, MID 43984
// Usa REST API do Supabase diretamente (sem @supabase/supabase-js) para evitar
// problemas com o módulo ws em funções serverless.
// Valida status HTTP: considera sucesso apenas respostas 2xx (< 400).

import https from 'https';

const RAKUTEN_MID = '43984';
const RAKUTEN_BASE_URL = 'https://api.linksynergy.com/coupon/1.0';
const RESULTS_PER_PAGE = 500;

// ── HTTP helper ───────────────────────────────────────────────────────────────

function httpsGetJson(url: string): Promise<{ ok: boolean; status: number; text: string }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Cuponito/1.0)',
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk: Buffer) => { body += chunk.toString(); });
      res.on('end', () => resolve({
        ok: (res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 300,
        status: res.statusCode ?? 0,
        text: body,
      }));
    });
    req.setTimeout(30_000, () => { req.destroy(new Error('timeout')); });
    req.on('error', (e: NodeJS.ErrnoException) => reject(new Error(`${e.code ?? e.message}: ${e.message}`)));
  });
}

// ── Supabase REST helper ──────────────────────────────────────────────────────

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

function determineCategory(description: string, discountType: string, storeName: string): string {
  const text = `${description} ${discountType} ${storeName}`.toLowerCase();
  if (/frete gr[aá]ti|envio gr[aá]ti|free shipping/.test(text)) return 'Frete Grátis';
  if (/moda|roupa|vest[iu]|fashion/.test(text)) return 'Moda';
  if (/tech|eletr[ôo]|notebook|celular|smartphone|ssd/.test(text)) return 'Tech';
  if (/delivery|comida|restaurante|ifood|pizza/.test(text)) return 'Delivery';
  if (/viagem|hotel|passagem|hospedagem|a[eé]reo|turismo/.test(text)) return 'Viagens';
  if (/beleza|cosm[eé]t|maquiagem|perfume|skincare|cabelo/.test(text)) return 'Beleza';
  return 'Geral';
}

// Converts Rakuten date format "MM/DD/YYYY" to ISO 8601. Returns null for invalid dates.
function parseRakutenDate(dateStr: string | undefined | null): string | null {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [mm, dd, yyyy] = parts;
  const d = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T23:59:59`);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// Normalizes Rakuten discount fields into a human-readable string.
function formatDiscount(discountType: string, discountAmount: any): string {
  const type = (discountType ?? '').toLowerCase();

  // discountAmount can be: [{$t:"10.00",type:"percent"},...] or {percent:"10",absolute:"0"} or string
  let pct = 0;
  let abs = 0;

  if (Array.isArray(discountAmount)) {
    for (const item of discountAmount) {
      const val = parseFloat(item['$t'] ?? item.amount ?? item.value ?? '0');
      const t = (item.type ?? '').toLowerCase();
      if (t === 'percent' && val > 0) pct = val;
      if ((t === 'absolute' || t === 'dollar' || t === 'amount') && val > 0) abs = val;
    }
  } else if (discountAmount && typeof discountAmount === 'object') {
    pct = parseFloat(discountAmount.percent ?? discountAmount['$t'] ?? '0');
    abs = parseFloat(discountAmount.absolute ?? discountAmount.dollar ?? '0');
  }

  if (type.includes('percentage') && pct > 0) return `${pct % 1 === 0 ? pct.toFixed(0) : pct}% OFF`;
  if ((type.includes('dollar') || type.includes('fixed') || type.includes('amount')) && abs > 0) {
    return `R$ ${abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(2)} OFF`;
  }
  if (type.includes('free shipping')) return 'Frete Grátis';
  if (type.includes('fixed price') && abs > 0) return `R$ ${abs.toFixed(0)}`;
  return 'Desconto Especial';
}

// ── Rakuten JSON response parser ──────────────────────────────────────────────

interface RakutenOffer {
  promotionId: string;
  advertiserName: string;
  description: string;
  beginDate: string | null;
  endDate: string | null;
  discountType: string;
  discount: string;
  couponCode: string;
  clickUrl: string;
}

interface ParsedFeed {
  totalMatches: number;
  totalPages: number;
  offers: RakutenOffer[];
}

// The Rakuten JSON response can arrive in several shapes depending on API version:
//   Shape A: { couponfeed: { link: [...], TotalMatches: "5", TotalPages: "1" } }
//   Shape B: { link: [...], TotalMatches: "5", TotalPages: "1" }
//   Shape C: single link object instead of array when only one result
function parseRakutenJson(data: any): ParsedFeed {
  // Unwrap couponfeed envelope if present
  const feed: any = data?.couponfeed ?? data;

  const totalMatches = parseInt(String(feed?.TotalMatches ?? feed?.totalmatches ?? '0'), 10);
  const totalPages = parseInt(String(feed?.TotalPages ?? feed?.totalpages ?? '1'), 10);

  // Normalize link: can be array or single object
  const rawLinks: any[] = Array.isArray(feed?.link)
    ? feed.link
    : feed?.link
    ? [feed.link]
    : [];

  const offers: RakutenOffer[] = rawLinks.map((item: any) => {
    const discountType: string = item.discounttype ?? item.discountType ?? '';
    return {
      promotionId: String(item.promotionid ?? item.promotionId ?? ''),
      advertiserName: String(item.advertisername ?? item.advertiserName ?? ''),
      description: String(item.offerdescription ?? item.offerDescription ?? item.description ?? ''),
      beginDate: parseRakutenDate(item.offerbegindate ?? item.offerBeginDate),
      endDate: parseRakutenDate(item.offerenddate ?? item.offerEndDate),
      discountType,
      discount: formatDiscount(discountType, item.discountamount ?? item.discountAmount),
      couponCode: String(item.couponcode ?? item.couponCode ?? ''),
      clickUrl: String(item.clickurl ?? item.clickUrl ?? ''),
    };
  });

  return { totalMatches, totalPages, offers };
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

  const body: any = req.body ?? {};

  const supabaseUrl: string = process.env.SUPABASE_URL || body.supabase_url || '';
  const serviceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || body.service_role_key || '';
  const rakutenToken: string = process.env.RAKUTEN_TOKEN || body.rakuten_token || '';

  if (!supabaseUrl || !serviceRoleKey || !rakutenToken) {
    res.status(500).json({
      error: 'Variáveis não configuradas: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RAKUTEN_TOKEN',
    });
    return;
  }

  const db = new DB(supabaseUrl, serviceRoleKey);
  const accountId: string | null = body.account_id ?? null;

  // Buscar conta(s) Rakuten ativa(s)
  let accounts: any[];
  try {
    if (accountId) {
      accounts = await db.select('affiliate_accounts', `id=eq.${accountId}&active=eq.true&select=*,integration_providers(slug,base_url)`);
    } else {
      const providers = await db.select('integration_providers', 'slug=eq.rakuten&select=id');
      const providerId = providers[0]?.id;
      if (!providerId) {
        res.status(200).json({ message: 'Provider Rakuten não encontrado' });
        return;
      }
      accounts = await db.select('affiliate_accounts', `provider_id=eq.${providerId}&active=eq.true&select=*,integration_providers(slug,base_url)`);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }

  if (!accounts || accounts.length === 0) {
    res.status(200).json({ message: 'Nenhuma conta Rakuten ativa' });
    return;
  }

  const summary = [];

  for (const account of accounts) {
    let logId: string | null = null;

    try {
      const log = await db.insert<{ id: string }>('sync_logs', { account_id: account.id, status: 'running' });
      logId = log?.id ?? null;
    } catch { /* ignora erro de log */ }

    const token: string = account.api_token || rakutenToken;
    const sid: string = account.extra_config?.sid ?? account.publisher_id ?? '';
    const baseUrl: string = account.extra_config?.base_url
      ?? account.integration_providers?.base_url
      ?? RAKUTEN_BASE_URL;

    const stats = { inserted: 0, updated: 0, skipped: 0, stores_created: 0 };
    const logs: string[] = [];
    const errors: string[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const params = new URLSearchParams({
        token,
        mid: RAKUTEN_MID,
        resultsperpage: String(RESULTS_PER_PAGE),
        pagenumber: String(page),
      });

      const apiUrl = `${baseUrl.replace(/\/$/, '')}?${params}`;

      let responseText: string;
      let responseOk: boolean;
      let responseStatus: number;
      try {
        const r = await httpsGetJson(apiUrl);
        responseText = r.text;
        responseOk = r.ok;
        responseStatus = r.status;
      } catch (e: any) {
        errors.push(`Fetch error p${page}: ${e.message}`);
        break;
      }

      // Valida status HTTP — considera sucesso apenas 2xx
      if (!responseOk) {
        errors.push(`API HTTP ${responseStatus} p${page}: ${responseText.slice(0, 300)}`);
        break;
      }

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        errors.push(`JSON parse error p${page}: ${responseText.slice(0, 300)}`);
        break;
      }

      const { totalMatches, totalPages: tp, offers } = parseRakutenJson(data);

      if (page === 1) {
        totalPages = tp || 1;

        // Log detalhado quando 200 OK mas sem itens (distingue erro de código de falta de ofertas)
        if (offers.length === 0) {
          const preview = responseText.length > 500 ? responseText.slice(0, 500) + '…' : responseText;
          logs.push(
            `[MID=${RAKUTEN_MID}] 200 OK porém sem ofertas. ` +
            `TotalMatches=${totalMatches} TotalPages=${tp}. ` +
            `Chaves da resposta: ${Object.keys(data).join(',')}. ` +
            `Preview: ${preview}`
          );
          // Registra no log de sync para visibilidade no admin
          if (logId) {
            try {
              await db.update('sync_logs', {
                status: 'success',
                finished_at: new Date().toISOString(),
                records_inserted: 0,
                records_updated: 0,
                records_skipped: 0,
                error_message: null,
                meta: {
                  mid: RAKUTEN_MID,
                  total_matches: totalMatches,
                  total_pages: tp,
                  pages_fetched: 1,
                  empty_response: true,
                  response_keys: Object.keys(data),
                  response_preview: responseText.slice(0, 300),
                },
              }, `id=eq.${logId}`);
            } catch { /* ignora */ }
          }
          summary.push({ account: account.name, ...stats, status: 'success', empty: true, logs });
          break;
        }
      }

      if (offers.length === 0) break;

      for (const offer of offers) {
        try {
          if (!offer.clickUrl) { stats.skipped++; continue; }

          const advertiserId = RAKUTEN_MID;
          const advertiserName = offer.advertiserName || `Loja Rakuten ${RAKUTEN_MID}`;

          // Garante que a loja existe em stores
          let storeDbId: string | null = null;
          try {
            const storeRows = await db.select<{ id: string }>('stores', `store_id=eq.${advertiserId}&select=id`);
            if (storeRows.length > 0) {
              storeDbId = storeRows[0].id;
            } else {
              const slug = `cupom-desconto-${slugify(advertiserName)}`;
              try {
                const newStore = await db.insert<{ id: string }>('stores', {
                  name: advertiserName,
                  slug,
                  store_id: advertiserId,
                  active: true,
                });
                storeDbId = newStore?.id ?? null;
                if (storeDbId) {
                  stats.stores_created++;
                  db.invokeFunction(supabaseUrl, 'enrich-store', { store_id: storeDbId });
                }
              } catch {
                const retry = await db.insert<{ id: string }>('stores', {
                  name: advertiserName,
                  slug: `cupom-desconto-${slugify(advertiserName)}-${advertiserId}`,
                  store_id: advertiserId,
                  active: true,
                }).catch(() => null);
                storeDbId = retry?.id ?? null;
              }
            }
          } catch { /* ignora erro de loja */ }

          if (!storeDbId) { stats.skipped++; continue; }

          // Monta URL de tracking com SID como sub-ID (u1) para atribuição
          const trackingUrl = sid
            ? offer.clickUrl.includes('?')
              ? `${offer.clickUrl}&u1=${encodeURIComponent(sid)}`
              : `${offer.clickUrl}?u1=${encodeURIComponent(sid)}`
            : offer.clickUrl;

          const promotionId = `rakuten_${offer.promotionId || `${RAKUTEN_MID}_${page}_${stats.inserted + stats.updated + stats.skipped}`}`;

          const couponData = {
            awin_promotion_id: promotionId,
            store_id: storeDbId,
            store: advertiserName,
            publisher_id: account.publisher_id,
            title: offer.description || 'Oferta Especial',
            description: offer.description || '',
            code: offer.couponCode || null,
            link: trackingUrl,
            discount: offer.discount,
            expiry: offer.endDate,
            expiry_text: offer.endDate
              ? new Date(offer.endDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  timeZone: 'America/Sao_Paulo',
                })
              : '',
            start_date: offer.beginDate,
            status: true,
            updated_at: new Date().toISOString(),
            category: determineCategory(offer.description, offer.discountType, advertiserName),
          };

          try {
            const existing = await db.select<{ id: string }>('coupons', `awin_promotion_id=eq.${promotionId}&select=id`);
            if (existing.length === 0) {
              await db.insert('coupons', couponData, false);
              stats.inserted++;
            } else {
              await db.update('coupons', {
                title: couponData.title,
                description: couponData.description,
                code: couponData.code,
                link: couponData.link,
                discount: couponData.discount,
                expiry: couponData.expiry,
                expiry_text: couponData.expiry_text,
                start_date: couponData.start_date,
                status: couponData.status,
                updated_at: couponData.updated_at,
                store: couponData.store,
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

      if (offers.length < RESULTS_PER_PAGE) break;
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
          meta: {
            mid: RAKUTEN_MID,
            stores_created: stats.stores_created,
            pages_fetched: page - 1,
            total_pages: totalPages,
            ...(logs.length > 0 ? { empty_response_logs: logs.slice(0, 3) } : {}),
          },
        }, `id=eq.${logId}`);
      } catch { /* ignora erro de log */ }
    }

    try {
      await db.update('sync_schedules', { last_run_at: new Date().toISOString() }, `account_id=eq.${account.id}`);
    } catch { /* ignora */ }

    summary.push({ account: account.name, mid: RAKUTEN_MID, ...stats, status: finalStatus });
  }

  res.status(200).json({ success: true, mid: RAKUTEN_MID, summary });
}

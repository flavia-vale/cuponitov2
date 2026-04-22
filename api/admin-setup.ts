// ENDPOINT TEMPORÁRIO — deletado imediatamente após o setup da Rakuten
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const PROJECT_REF = 'jyvmrkykukialdbcebei';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  if (!SERVICE_KEY || req.headers.authorization !== `Bearer ${SERVICE_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { access_token, rakuten_token, sid, security_token } = req.body as Record<string, string>;
  if (!sid || !access_token || !rakuten_token) {
    return res.status(400).json({ error: 'sid, access_token e rakuten_token são obrigatórios' });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const steps: Record<string, unknown> = {};

  // ── 1. Upsert integration_providers ────────────────────────────────────────
  const { data: provider, error: provErr } = await supabase
    .from('integration_providers')
    .upsert(
      { name: 'Rakuten Advertising', slug: 'rakuten', base_url: 'https://api.linksynergy.com/coupon/1.0', active: true },
      { onConflict: 'slug' }
    )
    .select('id, slug')
    .single();

  if (provErr) return res.status(500).json({ step: 'provider', error: provErr.message });
  steps.provider = { ok: true, id: provider!.id };

  // ── 2. Criar affiliate_account ──────────────────────────────────────────────
  const { data: existing } = await supabase
    .from('affiliate_accounts')
    .select('id')
    .eq('provider_id', provider!.id)
    .eq('publisher_id', sid)
    .maybeSingle();

  if (existing) {
    steps.account = { id: existing.id, note: 'already_exists' };
  } else {
    const { data: account, error: accErr } = await supabase
      .from('affiliate_accounts')
      .insert({
        name: 'Rakuten Brasil',
        publisher_id: sid,
        api_token: null,
        provider_id: provider!.id,
        extra_config: { sid, security_token: security_token ?? null, env_secret: 'RAKUTEN_TOKEN', network_id: '0' },
        active: true,
      })
      .select('id')
      .single();

    if (accErr) return res.status(500).json({ step: 'account', error: accErr.message, steps });
    steps.account = { ok: true, id: account!.id };
  }

  // ── 3. Setar secret RAKUTEN_TOKEN ───────────────────────────────────────────
  const secRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/secrets`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([{ name: 'RAKUTEN_TOKEN', value: rakuten_token }]),
  });
  steps.secret = { status: secRes.status, ok: secRes.ok };

  // ── 4. Deploy edge function sync-rakuten ────────────────────────────────────
  const funcPath = join(process.cwd(), 'supabase/functions/sync-rakuten/index.ts');
  if (existsSync(funcPath)) {
    const funcBody = readFileSync(funcPath, 'utf-8');

    // Verifica se já existe
    const checkRes = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/functions/sync-rakuten`,
      { headers: { 'Authorization': `Bearer ${access_token}` } }
    );

    const method = checkRes.status === 200 ? 'PATCH' : 'POST';
    const fnUrl = checkRes.status === 200
      ? `https://api.supabase.com/v1/projects/${PROJECT_REF}/functions/sync-rakuten`
      : `https://api.supabase.com/v1/projects/${PROJECT_REF}/functions`;

    const payload: Record<string, unknown> = { name: 'sync-rakuten', verify_jwt: false, body: funcBody };
    if (method === 'POST') payload.slug = 'sync-rakuten';

    const fnRes = await fetch(fnUrl, {
      method,
      headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const fnText = await fnRes.text();
    steps.function = { status: fnRes.status, ok: fnRes.ok, preview: fnText.slice(0, 400) };
  } else {
    steps.function = { skipped: true, reason: 'arquivo não encontrado no bundle Vercel' };
  }

  return res.status(200).json({ success: true, steps });
}

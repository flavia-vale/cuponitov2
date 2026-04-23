import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const syncSecret = process.env.SYNC_SECRET;
  const authHeader = req.headers['authorization'];

  if (syncSecret && authHeader !== `Bearer ${syncSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Token vem do ambiente — NUNCA hardcode em source. Se ausente aqui, a edge function
    // vai tentar account.api_token ou o secret RAKUTEN_TOKEN do Supabase.
    const token = process.env.RAKUTEN_TOKEN || undefined;

    console.log(
      '[api/sync-rakuten] Token da env:',
      token ? `presente (len=${token.length}, prefix=${token.substring(0, 4)})` : 'ausente (usará fallback da edge function)'
    );

    const { data, error } = await supabase.functions.invoke('sync-rakuten', {
      body: {
        ...req.body,
        ...(token ? { rakuten_token: token } : {})
      }
    });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

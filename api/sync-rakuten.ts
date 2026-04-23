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
    // Dispara a Edge Function do Supabase que contém a lógica de parsing XML do Rakuten
    const { data, error } = await supabase.functions.invoke('sync-rakuten', {
      body: req.body || {}
    });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RAKUTEN_TOKEN = 'MuUtdYgwGUo7tPsA7UGVEVrume8GXRwh';

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
    const token = process.env.RAKUTEN_TOKEN || RAKUTEN_TOKEN;
    
    // Log de depuração para Vercel (mascarado)
    console.log("[api/sync-rakuten] Token recebido:", token ? `Sim (${token.substring(0, 4)}...)` : "Não");

    const { data, error } = await supabase.functions.invoke('sync-rakuten', {
      body: { 
        ...req.body, 
        rakuten_token: token 
      }
    });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
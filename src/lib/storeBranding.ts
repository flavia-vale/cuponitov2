import { supabase } from '@/integrations/supabase/client';

export interface StoreBrand {
  id: string;
  slug: string;
  display_name: string;
  brand_color: string;
  fallback_color: string;
  icon_emoji: string;
  logo_url?: string | null;
}

const FALLBACK_COLOR = '#575ecf';

export async function fetchStoreBrands(): Promise<StoreBrand[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('display_name');
  if (error) throw error;
  return data as StoreBrand[];
}

export function getStoreBrandColor(
  brands: StoreBrand[],
  storeSlug: string,
): string {
  const brand = brands.find((b) => b.slug === storeSlug);
  return brand?.brand_color ?? brand?.fallback_color ?? FALLBACK_COLOR;
}

export function normalizeStoreSlug(storeName: string): string {
  return storeName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}
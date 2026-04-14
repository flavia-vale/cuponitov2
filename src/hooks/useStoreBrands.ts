import { useQuery } from '@tanstack/react-query';
import { fetchStoreBrands, type StoreBrand } from '@/lib/storeBranding';

export function useStoreBrands() {
  return useQuery<StoreBrand[]>({
    queryKey: ['store-brands'],
    queryFn: fetchStoreBrands,
    staleTime: 30 * 60 * 1000,
  });
}

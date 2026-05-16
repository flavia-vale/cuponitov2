export const SITE_URL = 'https://www.cuponito.com.br';

export function getLatestUpdatedLabel(
  items: Array<{ updated_at?: string | null }> | null | undefined,
  locale = 'pt-BR'
): string | null {
  if (!items || items.length === 0) return null;

  const latestMs = items.reduce<number | null>((acc, item) => {
    if (!item.updated_at) return acc;
    const parsed = new Date(item.updated_at).getTime();
    if (Number.isNaN(parsed)) return acc;
    return acc === null || parsed > acc ? parsed : acc;
  }, null);

  if (latestMs === null) return null;

  return new Date(latestMs).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

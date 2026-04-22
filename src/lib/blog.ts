export function calcReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

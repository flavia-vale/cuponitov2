// "Continue economizando": cada post linka os próximos da lista em ordem circular, então todo post
// recebe exatamente `count` links de outros posts (nenhum fica órfão, regra "mínimo 3 entradas").
// Mesma função no React e no HTML do servidor.
export const RELATED_POSTS_COUNT = 4;

export function relatedPosts<T extends { slug: string }>(
  all: readonly T[],
  currentSlug: string,
  count: number = RELATED_POSTS_COUNT
): T[] {
  const index = all.findIndex(post => post.slug === currentSlug);
  if (index < 0) return all.slice(0, count);
  return [...all.slice(index + 1), ...all.slice(0, index)].slice(0, count);
}

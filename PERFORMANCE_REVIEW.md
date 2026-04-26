# Revisão de Performance — Cuponito v2

> Análise realizada em 2026-04-25. Projeto: React 19 + Vite 7 SPA hospedado na Vercel, com Supabase como backend e TanStack Router + Query para navegação e dados.

---

## Sumário Executivo

O projeto está funcional mas carrega **todo o JavaScript do admin (TipTap, Recharts, react-hook-form, Zod)** para qualquer visitante público. Além disso, o banco de dados é consultado sem limites de paginação e sem cache padrão configurado. As correções de maior impacto são três: code splitting por rota, paginação de cupons e `QueryClient` com defaults sensatos.

---

## 1. Bundle & Build

### Problemas

| # | Arquivo | Problema |
|---|---------|----------|
| 1.1 | `vite.config.ts` | Sem `build.rollupOptions.output.manualChunks` — um único vendor chunk carrega TipTap (~300 KB gz), Recharts, react-hook-form, Zod, ~25 pacotes Radix e Lucide para **todo visitante público** |
| 1.2 | `vite.config.ts` | Sem `build.target: 'es2022'` — gera transformações desnecessárias de downlevel |
| 1.3 | `vite.config.ts` | Sem plugin de análise de bundle (ex: `rollup-plugin-visualizer`) — impossível medir regressões |

### Plano de Ação

```ts
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':   ['react', 'react-dom'],
          'vendor-query':   ['@tanstack/react-query', '@tanstack/react-router'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-radix':   [/* todos @radix-ui/* */],
          'vendor-tiptap':  [/* todos @tiptap/* */],
          'vendor-charts':  ['recharts'],
          'vendor-forms':   ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-lucide':  ['lucide-react'],
        },
      },
    },
  },
  plugins: [
    TanStackRouterVite({ /* ... */ }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    visualizer({ open: false, filename: 'dist/stats.html' }),
  ],
});
```

**Impacto estimado**: redução de ~60-70% no JS da primeira visita pública.

---

## 2. Code Splitting por Rota

### Problema

Todos os arquivos de rota (`src/routes/*.tsx`) fazem import estático (eager) das páginas:

```ts
// src/routes/index.tsx — ATUAL (ruim)
import Home from '@/pages/Home';
export const Route = createFileRoute('/')({ component: Home });

// src/routes/admin.coupons.tsx — carrega TipTap para QUALQUER visitante
import AdminCouponsDashboard from '@/pages/AdminCouponsDashboard';
```

O item 7 do `plan.md` existente lista `React.lazy para rotas de Admin` — ainda não implementado.

### Plano de Ação

TanStack Router suporta lazy routes via arquivo `.lazy.tsx`:

```ts
// src/routes/admin.coupons.lazy.tsx  (NOVO)
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/admin/coupons')({
  component: () => import('../pages/AdminCouponsDashboard').then(m => ({ default: m.default })),
});
```

**Prioridade de conversão**:

| Rota | Dependências pesadas | Prioridade |
|------|---------------------|------------|
| `/admin/*` | TipTap, Recharts, react-hook-form, Zod | 🔴 Alta |
| `/blog/$slug` | BlogPost + useBlogPosts (over-fetch) | 🔴 Alta |
| `/blog/` | BlogList | 🟡 Média |
| `/cupons` | CuponsPage | 🟡 Média |
| `/lojas` | LojasPage | 🟡 Média |
| `/categoria/$slug` | CategoryPage | 🟡 Média |
| `/desconto/$slug` | StorePage | 🟡 Média |

**Regra**: rotas públicas de conteúdo pesado usam lazy; Home, Lojas (listagem simples) e rotas de erro ficam eager.

---

## 3. Data Fetching — QueryClient sem Defaults

### Problema

`src/router.tsx` cria o `QueryClient` sem nenhuma opção:

```ts
const queryClient = new QueryClient();  // staleTime: 0, refetchOnWindowFocus: true
```

Resultado: qualquer query sem `staleTime` explícito re-busca dados a cada foco de aba e cada mount de componente.

### Plano de Ação

```ts
// src/router.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            60_000,   // 1 min
      gcTime:               10 * 60_000,
      refetchOnWindowFocus: false,
      retry:                1,
    },
  },
});
```

Hooks que precisam de dados mais frescos sobrescrevem localmente (ex: `staleTime: 0` no admin).

---

## 4. Data Fetching — Queries Problemáticas

### 4.1 `useCoupons` — fetch ilimitado

```ts
// src/hooks/useCoupons.ts — ATUAL
await supabase.from('coupons').select('*, stores(id, name, logo_url, color)')
  .eq('status', true)
  .order('is_flash', { ascending: false })
  .order('created_at', { ascending: false });
// sem .limit() — busca TODOS os cupons ativos em cada visita
```

**Plano**: paginar + selecionar apenas colunas usadas:

```ts
.select('id, code, title, discount_value, discount_type, is_flash, expiry_date, url, stores(id, name, logo_url, color)')
.limit(300)
```

Para listas maiores: implementar paginação com cursor ou infinite scroll.

### 4.2 `BlogPost.tsx` — carrega TODOS os posts para achar 2 relacionados

```ts
// src/pages/BlogPost.tsx — ATUAL
const { data: allPosts } = useBlogPosts();                    // busca TUDO
const relatedPosts = allPosts?.filter(p => p.id !== post?.id).slice(0, 2);
```

**Plano**: usar a query já existente `useRelatedPosts` ou criar query dedicada com `.limit(2)` e `.neq('id', post.id)`.

### 4.3 `usePosts.fetchRelatedPosts` — 3 round-trips sequenciais

```ts
// src/hooks/usePosts.ts — ATUAL (waterfall)
const r1 = await supabase.from('posts').select...  // busca por IDs relacionados
const r2 = await supabase.from('posts').select...  // backfill por categoria
const r3 = await supabase.from('posts').select...  // backfill genérico
```

**Plano**: consolidar em uma única query com `or()` ou via RPC Postgres.

### 4.4 `useBlogPosts` — 2 round-trips para filtro por categoria

```ts
// src/hooks/useBlog.ts — ATUAL
const { data: cat } = await supabase.from('blog_categories').select('id').eq('slug', slug);
const { data } = await supabase.from('blog_posts').select(...).eq('category_id', cat.id);
```

**Plano**: usar join direto:

```ts
.select('*, blog_categories!inner(slug)')
.eq('blog_categories.slug', categorySlug)
```

### 4.5 `useIncrementBlogViews` — invalida cache errado

```ts
// src/hooks/useBlog.ts
onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
// invalida TODA a lista de posts a cada pageview
```

**Plano**: invalidar apenas o post específico:

```ts
onSuccess: (_, postId) => queryClient.invalidateQueries({ queryKey: ['blog-post', postId] })
```

### 4.6 Admin — fetch duplicado em `AdminCouponsDashboard`

`AdminCouponsDashboard.tsx` faz fetch direto via `useEffect + setState` E seu filho `AdminCouponsTab` faz a mesma query via `useQuery`. **Plano**: remover o `useEffect` do pai e deixar apenas o `useQuery` do filho.

---

## 5. Renderização — Problemas em Componentes

### 5.1 `Math.random()` em render

```ts
// src/components/CouponCard.tsx:24
const usageCount = Math.floor(Math.random() * 500) + 50;  // muda a cada render

// src/components/StoreCouponCard.tsx:28
const usageCount = Math.floor(Math.random() * 2000) + 100;

// src/components/ui/sidebar.tsx:663
return `${Math.floor(Math.random() * 40) + 50}%`
```

Problemas: quebra memoização, causa flickering, incompatível com futura hidratação SSR.

**Plano**: mover `usageCount` para o banco de dados ou gerar valor determinístico baseado no `id` do cupom:

```ts
const usageCount = useMemo(() => (coupon.id.charCodeAt(0) % 500) + 50, [coupon.id]);
```

### 5.2 `transition-all` em vez de propriedades específicas

Vários componentes usam `transition-all duration-300` que força o browser a avaliar TODAS as propriedades animáveis.

**Plano**: substituir por `transition-[transform,shadow,opacity] duration-300` onde aplicável.

### 5.3 Animações escalonadas em `StoreCards.tsx`

```tsx
// src/components/StoreCards.tsx:38
style={{ animationDelay: `${i * 100}ms` }}  // delay em cascata para cada card
```

Com muitos cards isso atrasa o paint útil. **Plano**: limitar o delay máximo a 300ms e usar `will-change: opacity` apenas no elemento animado.

---

## 6. Imagens & Assets

### 6.1 Falta `width`/`height` e `fetchpriority`

A ausência de dimensões em `<img>` causa **Cumulative Layout Shift (CLS)**. Afeta:
- `src/pages/BlogPost.tsx:115` — imagem de capa do post
- `src/components/blog/BlogPostCard.tsx` — todos os cards
- `src/components/CouponCard.tsx:53` — logos de lojas

**Plano**:
```tsx
// Imagem LCP (acima da dobra)
<img src={post.cover_image} width={800} height={450} fetchpriority="high" alt={post.title} />

// Imagens abaixo da dobra
<img src={logo} width={48} height={48} loading="lazy" alt={store.name} />
```

### 6.2 Favicon de 28 KB

`public/placeholder.svg` (28.625 bytes) está referenciado como favicon. **Plano**: substituir por um `.ico` ou `.png` de 1-2 KB.

### 6.3 `og-image.png` não existe

`SEOHead.tsx` e `useJsonLd.ts` referenciam `/og-image.png` que não existe em `public/`. Retorna 404 em todo compartilhamento social.

**Plano**: criar e adicionar `public/og-image.png` (1200×630 px, <200 KB).

### 6.4 Cache de Storage muito curto

Uploads de logos e imagens de blog usam `cacheControl: '3600'` (1 hora).

**Plano**: aumentar para `'2592000'` (30 dias) — esses assets são estáticos após upload.

### 6.5 Google Fonts — 6 pesos de 3 famílias

```html
<!-- index.html -->
Fredoka:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Lexend:wght@700
```

**Plano**: auditar quais pesos são realmente usados no Tailwind config; remover os não usados. Adicionar `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` (já presente) e considerar subset via `text=` param.

---

## 7. Cache HTTP

### Problema

`vercel.json` define headers de segurança mas **nenhum `Cache-Control`** para assets:

```json
// vercel.json — sem cache para /assets/*
```

Os assets Vite têm hash no nome (ex: `index-Bx3k9.js`) — ideais para cache longo — mas a Vercel serve sem `immutable`.

### Plano de Ação

```json
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
}
```

---

## 8. Virtualização de Listas

Nenhuma lista usa virtualização. Páginas como `/cupons`, `/lojas`, `/categoria/$slug` e a tabela do admin renderizam todos os itens no DOM:

```tsx
// src/pages/CuponsPage.tsx
active.map(c => <CouponCard key={c.id} {...c} />)  // pode ser centenas de cards
```

**Plano**: instalar `@tanstack/react-virtual` (mesma família do TanStack Router/Query) e virtualizar:
1. Tabela de cupons no admin (`AdminCouponsTab`)
2. Grade de lojas em `/lojas`
3. Lista de cupons em `/cupons` e `/categoria/$slug`

Threshold sugerido: virtualizar quando a lista puder exceder 50 itens.

---

## 9. Memory Leaks & Cleanup

### 9.1 `setTimeout` sem cancelamento

Padrão repetido em 4 componentes (`StoreCouponCard`, `PopularCouponItem`, `InlineCouponBox`, `BlogCtaBanner`):

```ts
// padrão atual — setState após unmount
setTimeout(() => setCopied(false), 2000);
```

**Plano**:
```ts
useEffect(() => {
  if (!copied) return;
  const id = setTimeout(() => setCopied(false), 2000);
  return () => clearTimeout(id);
}, [copied]);
```

### 9.2 `useIncrementBlogViews` — duplo disparo em dev

```ts
// src/pages/BlogPost.tsx:24
useEffect(() => {
  if (post?.id) incrementViews.mutate(post.id);
}, [post?.id]);
```

React 19 StrictMode executa effects duas vezes em dev → 2 incrementos por visita em desenvolvimento.

**Plano**: guard com `useRef`:
```ts
const fired = useRef(false);
useEffect(() => {
  if (post?.id && !fired.current) {
    fired.current = true;
    incrementViews.mutate(post.id);
  }
}, [post?.id]);
```

### 9.3 `RoleProtectedRoute` sem AbortController

```ts
// src/components/auth/RoleProtectedRoute.tsx:18
useEffect(() => {
  checkRole().then(() => setIsChecking(false));  // sem cancel
}, []);
```

Se o usuário navegar durante a checagem, `setIsChecking` roda em componente desmontado.

---

## 10. Bug: `floor`/`random` não importados em `AdminStoresTab`

```ts
// src/components/admin/AdminStoresTab.tsx:43
store_id: form.store_id || floor(random() * 8999999 + 1000000)
// `floor` e `random` não são funções globais → ReferenceError em runtime
```

**Plano**: corrigir para `Math.floor(Math.random() * ...)`.

---

## 11. SEO Técnico (impacto indireto de performance)

- `src/components/SEOHead.tsx` — `JSON.stringify` do JSON-LD roda a cada render sem memoização do resultado final
- Duas tabelas paralelas (`posts` + `blog_posts`) causam fetch duplo em páginas de blog — consolidar ou nomear claramente o propósito de cada uma
- `AI_RULES.md` menciona `react-router-dom` mas o projeto usa TanStack Router — atualizar para evitar confusão futura

---

## Roadmap Priorizado

### 🔴 Alta Prioridade (maior impacto / menor risco)

| # | Tarefa | Arquivo(s) | Impacto |
|---|--------|-----------|---------|
| P1 | Lazy routes para `/admin/*` | `src/routes/admin*.tsx` | -60% JS público |
| P2 | `manualChunks` no Vite | `vite.config.ts` | -40% vendor chunk |
| P3 | `QueryClient` com defaults | `src/router.tsx` | -50% re-fetches |
| P4 | Paginar `useCoupons` + colunas explícitas | `src/hooks/useCoupons.ts` | -80% payload DB |
| P5 | Corrigir `floor`/`random` typo | `AdminStoresTab.tsx:43` | Fix bug crítico |

### 🟡 Média Prioridade (UX perceptível)

| # | Tarefa | Arquivo(s) | Impacto |
|---|--------|-----------|---------|
| P6 | `width`/`height` em todas as `<img>` | múltiplos | Elimina CLS |
| P7 | `fetchpriority="high"` no LCP | `BlogPost.tsx`, `HeroBanner` | Melhora LCP |
| P8 | Fix `useIncrementBlogViews` invalidation | `src/hooks/useBlog.ts:109` | -N fetches/visit |
| P9 | Remover fetch duplicado no admin | `AdminCouponsDashboard.tsx` | Menos requests |
| P10 | Fix `BlogPost.tsx` related posts | `src/pages/BlogPost.tsx` | -1 query pesada |
| P11 | Fix `Math.random()` em render | `CouponCard.tsx`, `StoreCouponCard.tsx` | Estabilidade |
| P12 | `Cache-Control` para assets Vite | `vercel.json` | Cache longo |
| P13 | `cacheControl` de storage: 1h → 30d | `AdminBlogEditor`, `AdminStoresTab` | -repeated fetches |

### 🟢 Baixa Prioridade (polimento)

| # | Tarefa | Arquivo(s) | Impacto |
|---|--------|-----------|---------|
| P14 | Virtualizar listas grandes | múltiplos | Scroll suave |
| P15 | Fix `setTimeout` sem cleanup | 4 componentes | Sem warning React |
| P16 | Fix `RoleProtectedRoute` AbortController | `auth/RoleProtectedRoute.tsx` | Robustez |
| P17 | `transition-all` → propriedades específicas | múltiplos | GPU efficiency |
| P18 | Adicionar `og-image.png` | `public/` | SEO social |
| P19 | Substituir favicon (28KB SVG → 2KB) | `public/placeholder.svg` | -26KB |
| P20 | Lazy routes para `/blog`, `/cupons`, etc. | `src/routes/` | JS splits extras |
| P21 | Refatorar queries sequenciais em `usePosts` | `src/hooks/usePosts.ts` | -2 round-trips |
| P22 | Adicionar `rollup-plugin-visualizer` | `vite.config.ts` | Observabilidade |
| P23 | Auditar e reduzir pesos Google Fonts | `index.html` | -KB fontes |

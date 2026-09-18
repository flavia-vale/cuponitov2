# Cuponito v2 — Documentação para Claude

## 📋 Visão Geral

**Stack:** React 19 + TypeScript + Vite + TanStack Router/Query + Supabase PostgreSQL  
**Modelo:** SPA full-stack com backend serverless  
**Padrão:** Component-based UI com hooks de dados (React Query)

---

## 🚨 REGRAS DE BANCO — NÃO VIOLAR

### `useCoupons.ts` — NUNCA adicionar join com `stores`
A tabela `stores` **não tem coluna `color`**. As colunas de cor são `brand_color` e `fallback_color`.
O join `stores(id, name, logo_url, color)` causa erro `42703` em produção e **JÁ foi corrigido 3 vezes**.
- **NÃO FAZER:** `.select('..., stores(id, name, logo_url, color)')`
- **Correto:** `.select('id, code, title, description, ...')` — sem join stores
- Os componentes recebem dados de loja via `useStoreBrands()` + `storeBrandMap`, não via join no useCoupons.

### `prerender/` — NUNCA pedir coluna que pode não existir no banco
O prerender do Edge lê o Supabase pela REST. Pedir uma coluna ainda não migrada
devolve **400** e a página inteira viraria 404. Colunas novas entram pelo
`tryQuery` com fallback (ver `fetchPost` e `schema_json`).

### Prerender serve o MESMO HTML para todo mundo
`middleware.ts` injeta o conteúdo em `#root` para navegador e robô igualmente.
Servir HTML diferente por user-agent é cloaking — não fazer, mesmo "só para o bot".
O React monta com `createRoot().render()`, que substitui o conteúdo do container;
trocar por `hydrateRoot` quebraria a página (erro de hidratação).

---

## ⚠️ LEMBRETES CRÍTICOS

### 🔴 **SEMPRE que adicionar uma feature nova:**

1. **Se é gerenciável pelo usuário → DEVE ser editável no painel admin**
   - Exemplos: categorias, lojas, configurações, conteúdo dinâmico
   - NÃO deixe hardcoded em código React
   - Exceção: valores fixos de negócio que nunca mudam

2. **Padrão a seguir para CRUD de novo recurso:**
   - ✅ Criar tabela no Supabase (migration)
   - ✅ Criar hook com React Query (ex: `useCouponCategories`)
   - ✅ Criar componente admin tab (ex: `AdminCouponCategoriesTab`)
   - ✅ Adicionar tab ao sidebar (`AdminSidebar.tsx`)
   - ✅ Renderizar no dashboard (`AdminCouponsDashboard.tsx`)
   - ✅ Usar dados dinâmicos nas páginas públicas (nunca hardcode)

3. **Padrão já implementado (copiar desse):**
   - Blog categories: `blog_categories` table + `useBlogCategories` hook + `AdminBlogCategoriesTab`
   - **Coupon categories (NOVO):** `coupon_categories` table + `useCouponCategories` hook + `AdminCouponCategoriesTab`

---

## 🏗️ Estrutura do Projeto

```
├── src/
│   ├── pages/                    # Páginas (rotas)
│   │   ├── AdminCouponsDashboard.tsx    # Painel principal
│   │   ├── CuponsPage.tsx               # Listagem pública
│   │   ├── CategoryPage.tsx             # Categoria específica
│   │   ├── Home.tsx                     # Landing
│   │   └── ...
│   ├── components/
│   │   ├── admin/                       # Componentes do painel
│   │   │   ├── AdminSidebar.tsx         # Navegação (MANTER ATUALIZADO)
│   │   │   ├── AdminCouponsTab.tsx
│   │   │   ├── AdminBlogCategoriesTab.tsx (REFERÊNCIA para novo CRUD)
│   │   │   ├── AdminCouponCategoriesTab.tsx (NOVO)
│   │   │   ├── CouponForm.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── hooks/
│   │   ├── useCoupons.ts
│   │   ├── useCouponCategories.ts (NOVO)
│   │   ├── useBlog.ts
│   │   └── ...
│   └── lib/
│       └── utils.ts
├── prerender/                   # HTML do servidor para busca e IA (Edge)
│   ├── data.ts                  # leitura do Supabase pela REST
│   ├── markdown.ts              # Markdown → HTML mínimo
│   ├── html.ts                  # head, JSON-LD e injeção na casca do SPA
│   └── render.ts                # blog, loja, categoria, quem-somos
├── middleware.ts                # roteia o prerender + 301 do site antigo
├── api/
│   ├── sitemap.ts               # sitemap com lastmod real
│   └── indexnow.ts              # avisa o Bing na publicação
├── scripts/
│   ├── diag-acesso-robos-ia.mjs # npm run seo:robos
│   └── diag-entrega-seo.mjs     # npm run seo:entrega
├── supabase/
│   ├── migrations/               # Versionadas, NUNCA alterar após merge
│   │   ├── 20260414182606_*.sql
│   │   ├── 20260425200000_coupon_categories.sql (NOVO)
│   │   └── ...
│   └── functions/
└── package.json
```

---

## 🔄 Como Funciona o Admin Painel

### AdminSidebar.tsx
Define as abas disponíveis. **SEMPRE que adicionar uma nova tab, atualizar aqui:**

```typescript
export type AdminTab = 'dashboard' | 'cupons' | 'categorias' | 'lojas' | 'seo' | 'integracoes';

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'categorias', label: 'Categorias', icon: Tag },  // Adicionar aqui
  // ...
];
```

### AdminCouponsDashboard.tsx
Renderiza o conteúdo baseado na tab ativa. **SEMPRE que adicionar uma nova tab, renderizar aqui:**

```typescript
{activeTab === 'categorias' && <AdminCouponCategoriesTab />}
```

---

## 📊 Categorias de Cupons — Implementação

### Tabela: `coupon_categories`

```sql
CREATE TABLE public.coupon_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,           -- "Moda", "Tech", etc
  slug        TEXT NOT NULL UNIQUE,           -- "moda", "tech" (URL-safe)
  description TEXT,                           -- Descrição curta
  icon        TEXT,                           -- Emoji ou nome do ícone
  color_hex   TEXT NOT NULL DEFAULT '#FF4D00',
  sort_order  INTEGER NOT NULL DEFAULT 0,     -- Ordem de exibição
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### Hook: `useCouponCategories`

```typescript
export function useCouponCategories() {
  return useQuery<CouponCategory[]>({
    queryKey: ['coupon-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupon_categories')
        .select('*')
        .order('sort_order')
        .order('name');
      // ...
    },
    staleTime: 30 * 60 * 1000,  // 30 minutos de cache
  });
}
```

### Componente Admin: `AdminCouponCategoriesTab`

- Cria nova categoria
- Edita existente (com aviso de renomeação em massa)
- Deleta categoria
- **🔴 IMPORTANTE:** Ao renomear, executa:
  ```sql
  UPDATE coupons SET category = 'Novo Nome' WHERE category = 'Nome Antigo'
  ```

### Páginas que usam (DINÂMICAS)

- `CuponsPage.tsx` — Filtros de categoria (antes hardcoded)
- `CategoryPage.tsx` — Lookup slug→name→description (antes hardcoded)
- `CouponForm.tsx` — Select de categoria (antes hardcoded)

---

## 🔗 Padrões & Decisões Arquiteturais

### 1. **Relacionamento Categoria ↔ Coupon**
- `coupons.category` é um campo **TEXT** (por string, não ID)
- ✅ Permite renomeação em massa simples
- ✅ Sem necessidade de migration ao renomear
- ⚠️ Sem FK — confiar em lógica de aplicação

### 2. **React Query Caching**
- Stale time: 5-30 minutos (variar conforme frequência de mudança)
- Query key em array: `['coupon-categories']`, `['coupons']`, etc.
- Invalidar ao salvar: `queryClient.invalidateQueries({ queryKey: ['coupon-categories'] })`

### 3. **RLS (Row Level Security)**
- Leitura: `public` (qualquer um)
- Escrita: `authenticated` (usuários logados)
- Validar `auth.role()` no Supabase

### 4. **TypeScript Types**
- Para tabelas: usar `Tables<'coupon_categories'>` de `supabase/types.ts` (auto-gerado)
- Para hooks: exportar tipos customizados (ex: `export type CouponCategory = {...}`)

---

## 📝 Checklist para Novas Features

- [ ] Migration criada em `supabase/migrations/` com timestamp
- [ ] Tipos TypeScript definidos/exportados
- [ ] Hook React Query criado com `staleTime` apropriado
- [ ] Componente admin (tab) implementado (CRUD completo)
- [ ] `AdminSidebar.tsx` atualizado com nova tab
- [ ] `AdminCouponsDashboard.tsx` renderizando nova tab
- [ ] Páginas públicas usando dados dinâmicos (nunca hardcode)
- [ ] Commit com mensagem descritiva
- [ ] PR com testes manuais documentados

### Se a feature cria ou muda página PÚBLICA
- [ ] A rota entra no `prerender/render.ts` (ou reusa uma existente): sem HTML do
      servidor a página não existe para o Google nem para as IAs
- [ ] `<h1>`, `<article>`, datas visíveis e JSON-LD no HTML, não só no React
- [ ] A página nasce linkada de pelo menos 3 páginas internas (`<a href>` real)
- [ ] `npm run seo:entrega` e `npm run seo:robos` passando

---

## 🚀 Como Rodar Migrations

### Via CLI (local)
```bash
supabase db push
```

### Via Dashboard (sem CLI)
1. Supabase.com → seu projeto
2. SQL Editor (lado esquerdo)
3. Cole o SQL do arquivo em `supabase/migrations/`
4. Run (Ctrl+Enter)

---

## 🐛 Troubleshooting

### Categoria não aparece no select do formulário
- Verificar se hook `useCouponCategories` está retornando dados
- Verificar se migration foi aplicada no Supabase
- Verificar cache: `queryClient.invalidateQueries({ queryKey: ['coupon-categories'] })`

### Cupons não atualizam ao renomear categoria
- Verificar se o UPDATE em `AdminCouponCategoriesTab.tsx` está rodando
- Verificar se `coupons` cache foi invalidado

### Página de categoria mostra "não encontrada" brevemente
- Normal durante carregamento do hook
- `CategoryPage.tsx` mostra skeleton enquanto `categoriesLoading = true`

---

## 📚 Referências Internas

- **Blog Categories (modelo completo):** `AdminBlogCategoriesTab.tsx` + `useBlog.ts`
- **Coupon CRUD:** `AdminCouponsTab.tsx` + `useCoupons.ts`
- **Auto-categorização:** `src/lib/utils.ts` → `autoCategorize(title, description)`

---

**Última atualização:** 2026-09-18  
**Por:** Claude  
**Branch:** `claude/stoic-hawking-f7ctit` — entrega de HTML para busca/IA (prerender no Edge)
e os dois posts que citam o Espelha Grupos. Ver `docs/espelha-grupos-entrega-html-2026-09-18.md`.

---

## 📱 Regras de CSS / Layout Mobile

### Nunca usar margem negativa para full-bleed em mobile
`-mx-4 px-4` (ou qualquer `-mx-*`) em containers com `overflow-x-auto` causa scroll horizontal na página inteira no mobile.

**Errado:** `<div className="flex overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">`  
**Correto:** `<div className="flex overflow-x-auto w-full">`

### Sempre adicionar `overflow-x-hidden` no wrapper raiz das páginas
```jsx
<div className="min-h-screen overflow-x-hidden bg-[#f5f3ef]">
```

### Aspect-ratio em cards deve escalar com breakpoints
```jsx
// Correto: escala progressiva
"aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[21/9]"
// Errado: ratio fixo grande demais em mobile
"aspect-[16/9]"
```

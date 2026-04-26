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

**Última atualização:** 2026-04-25  
**Por:** Claude  
**Branch:** `claude/admin-category-editing-vBbYy` → PR #21

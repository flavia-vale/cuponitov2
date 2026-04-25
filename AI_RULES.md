# AI Rules for Cuponito Application

## Tech Stack Overview
- **Framework**: React 19 (SPA mode)
- **State Management**: TanStack Query (React Query) for data fetching, React Context for UI state
- **Routing**: TanStack Router (`@tanstack/react-router`) — routes defined as files under `src/routes/`
- **Styling**: Tailwind CSS (utility-first) with Shadcn/ui components
- **HTTP Client**: Supabase JS client (`@supabase/supabase-js`)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **UI Components**: Shadcn/ui library
- **Icons**: Lucide React
- **Notifications**: `sonner` (wrapped by `toast` utility)
- **Editor**: TipTap for blog authoring
- **Build Tool**: Vite (SPA configuration)

## Library Usage Rules
| Category | Library | How to Use |
|----------|---------|------------|
| **Routing** | `@tanstack/react-router` | Use `<Link>`, `useNavigate`, `useParams` from TanStack Router. Routes are files in `src/routes/`. |
| **Data Fetching** | `@tanstack/react-query` | Use `useQuery`, `useMutation`. |
| **Backend API** | `@supabase/supabase-js` | Use `supabase` client from `src/integrations/supabase/client.ts`. |
| **Styling** | Tailwind CSS | Use utility classes and Shadcn components. |
| **Notifications** | `sonner` | Use the `toast` utility from `@/hooks/use-toast`. |

## General Rules
1. **Component Isolation** – Create a new file for every new component.
2. **File Placement** – Components in `src/components/`, pages in `src/pages/`.
3. **Routes** – All application routes are file-based in `src/routes/`. Never use react-router-dom.
4. **Environment Variables** – Store in `.env`, never commit secrets.
5. **Build** – Always use `vite build && cp dist/index.html dist/404.html` for SPA compatibility.

---

## Critical Design Rules (NEVER violate)

### 1. Mobile-First OBRIGATÓRIO
- **Todo CSS deve começar pelo mobile.** Use os prefixos responsivos do Tailwind na ordem: base (mobile) → `sm:` → `md:` → `lg:` → `xl:`.
- NUNCA escreva estilos pensando no desktop primeiro. O layout mobile é o padrão.
- Exemplos corretos:
  - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` ✓
  - `flex-col md:flex-row` ✓
  - `px-4 md:px-8` ✓
- Exemplos proibidos:
  - `grid-cols-3 sm:grid-cols-1` ✗ (começa do desktop)
  - `hidden sm:block` sem um fallback mobile adequado ✗
- Sidebar do admin: em mobile usa Sheet/drawer, em desktop aparece fixo.
- Textos e espaçamentos: menores no mobile, maiores em `md:`/`lg:`.

### 2. Sem Breaking Changes
- **NUNCA remova ou renomeie colunas do banco** sem uma migration de compatibilidade.
- **NUNCA mude o tipo de uma coluna existente** sem confirmar com o usuário (ex: int → text é breaking).
- **NUNCA remova props obrigatórias de componentes** usados em múltiplos lugares sem atualizar todos os usos.
- **NUNCA altere o formato de retorno de uma função utilitária ou hook** que já é consumido por outras partes.
- Prefira mudanças aditivas: adicione novas colunas/campos em vez de modificar os existentes.
- Quando uma migração puder perder dados, crie um script de rollback e avise o usuário.

### 3. Tudo Configurável pelo Admin
- **NUNCA hardcode conteúdo visível ao usuário final.** Textos, links, cores e rótulos devem vir do banco.
- Conteúdo configurável vai na tabela `site_settings` (via `useSettings`) ou na tabela `stores`.
- Campos obrigatórios de loja no Admin (`AdminStoresTab`): `name`, `slug`, `brand_color`, `icon_emoji`, `logo_url`, `description`, `meta_description`.
- O Admin já tem a aba **SEO & Configurações** (`AdminSeoTab`) para hero, SEO da home e links globais — use-a para novos campos globais.
- Badges, rótulos de confiança, textos de chamada, percentuais de desconto exibidos: TODOS devem vir de `settings` ou do registro da loja no Supabase.
- **Proibido** usar objetos de estilo fixos no código (ex: `storeStyles = { amazon: { color: '#...' } }`). Cores vêm da coluna `brand_color` da tabela `stores`.

---
*These rules ensure the application remains maintainable and aligned with the React Router architecture.*
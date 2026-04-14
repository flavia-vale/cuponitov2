# AI Rules for Cuponito Application

## Tech Stack Overview
- **Framework**: React 19 (with Server Components and Route Tree)
- **State Management**: TanStack Query (React Query) for data fetching, React Context for UI state
- **Routing**: TanStack Router (file-based route tree in `src/routes/`)
- **Styling**: Tailwind CSS (utility-first) with Shadcn/ui components
- **Styling Helpers**: `clsx` and `tailwind-merge` for class management
- **Forms & Validation**: React Hook Form + Zod (used implicitly via Supabase)
- **HTTP Client**: Supabase JS client (`@supabase/supabase-js`) for all backend interactions
- **Database**: Supabase PostgreSQL (real-time tables for coupons, stores, blog posts, etc.)
- **Authentication**: Supabase Auth (email/password, OAuth)
- **UI Components**: Shadcn/ui library (prebuilt components like Button, Dialog, Table, etc.)
- **Icons**: Lucide React (lightweight icon set)
- **Animations**: Tailwind CSS transitions and custom keyframes
- **Toasts/Notifications**: `sonner` (wrapped by `toast` utility)
- **Editor**: TipTap (headless rich text editor) for blog authoring
- **Build Tool**: Vite (with TanStack Start configuration)
- **Environment**: Server-side environment variables via `.env` (Supabase keys)

## Library Usage Rules| Category | Library | When to Use | How to Use |
|----------|---------|-------------|------------|
| **Routing** | `@tanstack/react-router` | All page navigation, nested routes, route parameters | Define routes in `src/routes/`; use `createFileRoute`, `useParams`, `useNavigate`. Never modify generated `routeTree.gen.ts`. |
| **Data Fetching** | `@tanstack/react-query` | Server state (API calls, Supabase queries) | Use `useQuery`, `useMutation`, `useQueryClient`. Cache times: 5‑30 min depending on data freshness. |
| **Backend API** | `@supabase/supabase-js` | All database, auth, storage operations | Use `supabase` from `src/integrations/supabase/client.ts` in client components; use `supabaseAdmin` from `client.server.ts` only in server routes/mutations. |
| **Authentication** | `@supabase/supabase-js` auth methods | Protect admin panels, user‑specific features | Wrap protected routes with `requireSupabaseAuth` middleware; enforce session checks before navigation to `/admin/*`. |
| **Styling** | Tailwind CSS + Shadcn/ui | UI layout, spacing, colors, components | Use Tailwind utility classes extensively. For reusable UI pieces, use Shadcn/ui components (Button, Dialog, Table, etc.). Do not edit Shadcn source files. |
| **Utility Functions** | `clsx`, `tailwind-merge` | Conditional class names | Use `cn(...)` to merge classes safely. |
| **Forms** | `react-hook-form` (implicit) | Form handling in admin UI | Use controlled inputs; integrate with validation via Zod where needed. |
| **Rich Text Editing** | `@tiptap/react` | Blog post editor | Use `TipTapEditor` component; do not modify its internal extensions unless explicitly required. |
| **Notifications** | `sonner` (wrapped by `toast` utility) | Show success/error messages | Call `toast({title, description, variant})`; variant `"destructive"` for errors. |
| **Icons** | `lucide-react` | SVG icons throughout UI | Import specific icons; keep usage consistent (e.g., `Lock` for auth, `Eye` for visibility). |
| **Animations** | Tailwind CSS transitions + custom keyframes | Hover effects, entrance animations | Use `transition`, `duration-300`, `animate-fade-in` etc. Do not add custom CSS unless required for unique animation. |
| **Environment Variables** | `.env` (server) | Supabase URL, keys, service role key | Store in `.env`; never commit secrets. Access via `process.env` in server files. |
| **Build & Deploy** | Vite + TanStack Start | Development server (`npm run dev`) and production build (`npm run build`) | Use provided scripts; never eject Vite config. |
| **Testing / Linting** | ESLint, Prettier (implicit) | Code quality | Follow existing lint rules; do not add new lint configs. |

## General Rules
1. **Component Isolation** – Create a new file for every new component or hook, no matter how small. Never embed new components inside existing files.
2. **File Placement** – Keep components in `src/components/`, pages in `src/pages/`, hooks in `src/hooks/`, and admin UI in `src/components/admin/`.
3. **Imports** – Only import existing project modules or install new packages via `<dyad-add-dependency>`. Resolve all imports before finalizing a change.
4. **Styling Consistency** – Always use Tailwind classes; avoid inline styles unless a dynamic value is required.
5. **State Management** – Prefer React Query for server state; avoid local `useState` for data that should be cached or shared across components.
6. **Admin Access** – All admin routes (`/admin/*`) require authentication via Supabase middleware. Unauthenticated users are redirected to `/admin/login`.
7. **Environment Safety** – Server‑only environment variables (e.g., `SUPABASE_SERVICE_ROLE_KEY`) must never be exposed to client code. Use `supabaseAdmin` only in server routes.
8. **Performance** – Lazy‑load heavy components (e.g., `WhatsAppCTA`, `TipTapEditor`) using `React.lazy` and `<Suspense>` to keep initial bundle small.
9. **Accessibility** – All interactive elements must have appropriate ARIA labels and keyboard focus states.
10. **Code Review** – Every change that modifies existing functionality must be accompanied by a concise summary in the final chat summary.

---  
*These rules ensure the application remains maintainable, performant, and aligned with the existing codebase architecture.*
# AI Rules for Cuponito Application

## Tech Stack Overview
- **Framework**: React 19 (SPA mode)
- **State Management**: TanStack Query (React Query) for data fetching, React Context for UI state
- **Routing**: React Router v6/v7 (`react-router-dom`)
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
| **Routing** | `react-router-dom` | Use `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Link>`, `useNavigate`, `useParams`. Define all routes in `src/App.tsx`. |
| **Data Fetching** | `@tanstack/react-query` | Use `useQuery`, `useMutation`. |
| **Backend API** | `@supabase/supabase-js` | Use `supabase` client from `src/integrations/supabase/client.ts`. |
| **Styling** | Tailwind CSS | Use utility classes and Shadcn components. |
| **Notifications** | `sonner` | Use the `toast` utility from `@/hooks/use-toast`. |

## General Rules
1. **Component Isolation** – Create a new file for every new component.
2. **File Placement** – Components in `src/components/`, pages in `src/pages/`.
3. **Routes** – All application routes MUST be defined in `src/App.tsx`.
4. **Environment Variables** – Store in `.env`, never commit secrets.
5. **Build** – Always use `vite build && cp dist/index.html dist/404.html` for SPA compatibility.

---  
*These rules ensure the application remains maintainable and aligned with the React Router architecture.*
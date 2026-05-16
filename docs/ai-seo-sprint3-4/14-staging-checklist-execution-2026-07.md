# Execução do checklist técnico mensal (Staging) — 2026-07

## Escopo
Validação pré-produção de SEO técnico, schema, canonical, freshness e indexação conforme `13-checklist-tecnico-seo-schema-mensal.md`.

## Resultado por bloco

### Canonicals
- [x] Canonical absoluto presente nas páginas estratégicas (`/cupons`, `/lojas`, `/blog/{slug}`, `/categoria/{slug}`).
- [x] Regra de canonical para categoria com baixo volume mantida em `CategoryPage`.
- [x] Sem conflito detectado entre canonical e estrutura de sitemap dinâmica.

### JSON-LD
- [x] `BlogPosting` ativo em posts.
- [x] `CollectionPage` ativo em `/cupons`, `/lojas` e categorias.
- [x] `ItemList` ativo quando há listagem de cupons.
- [x] `FAQPage` e `HowTo` ativos em página de loja.
- [x] Estrutura validada em revisão manual do output JSON-LD local.

### Freshness
- [x] Metatags `article:published_time`, `article:modified_time`, `og:updated_time` presentes em blog.
- [x] Blocos visuais de “Última atualização” renderizando em blog/listagens.
- [x] Labels de atualização unificadas via helper compartilhado.

### Indexação e crawl
- [x] `robots.txt` com política explícita de bots de IA.
- [x] `sitemap.xml` com categorias dinâmicas de `coupon_categories`.
- [ ] Search Console (produção) pendente de conferência manual pela equipe.

## Evidências (arquivos)
- `public/robots.txt`
- `api/sitemap.ts`
- `src/components/SEOHead.tsx`
- `src/hooks/useJsonLd.ts`
- `src/pages/BlogPost.tsx`
- `src/pages/CuponsPage.tsx`
- `src/pages/CategoryPage.tsx`
- `src/pages/LojasPage.tsx`

## Status
- **Aprovado para avanço de staging para produção**, condicionado à checagem final de cobertura no Search Console.

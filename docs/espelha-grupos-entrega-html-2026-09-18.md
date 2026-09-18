# Entrega de HTML para busca e IA + posts do Espelha Grupos

**Data:** 2026-09-18
**Origem:** `POSTS_CUPONITO_ESPELHA_GRUPOS_2026-09-18.md` (seções 1 a 5)
**Escopo:** M1–M10 do plano, no que é implementável no repositório.

## Diagnóstico que originou a mudança

| # | Medição (18/09) | Resultado |
|---|---|---|
| D1 | `/blog/:slug`, `/desconto/:slug`, `/categoria/:slug` | HTTP **404** (96 das 105 URLs do sitemap) |
| D2 | mesmas URLs com UA de navegador, bingbot, OAI-SearchBot, PerplexityBot | corpo idêntico de 2.560 B, 0 `<h1>`, 0 `<article>`, 0 `ld+json` |
| D8 | `og:image` | inexistente |

D1 zera o SEO (Google descarta 404 antes de renderizar JavaScript). D2 zera a
leitura por IA mesmo com D1 resolvido: os robôs da OpenAI, Anthropic e
Perplexity não executam JavaScript.

## O que foi implementado

| Item | Onde |
|---|---|
| **M1** — rotas com parâmetro respondem 200 | `middleware.ts` devolve `Response` própria; `vercel.json` ganhou rewrites explícitos para `/blog/:slug`, `/desconto/:slug` e `/categoria/:slug` e `trailingSlash: false` |
| **M2** — HTML com conteúdo vindo do servidor | `prerender/` (`data.ts`, `markdown.ts`, `html.ts`, `render.ts`) monta `<h1>`, `<article>`, datas visíveis, links internos reais e JSON-LD; injetado na casca do SPA pelo middleware |
| **M3** — 301 do site antigo | `/store/<loja>/` resolvido no middleware contra a tabela `stores` (senão `/lojas`); `/stores-2/*` por `redirects` no `vercel.json` |
| **M4** — sitemap honesto | `api/sitemap.ts`: `lastmod` só sai quando existe data real; institucionais sem `lastmod`; listagens herdam a data do conteúdo |
| **M5** — robots.txt | `public/robots.txt` com `OAI-SearchBot`, `Claude-SearchBot`, `Claude-User`, `Perplexity-User`, `Applebot`, `DuckAssistBot`, `meta-externalagent`; `Disallow` de `/adminblog`, `/login`, `/access-denied` |
| **M7** — `og:image` estática | `public/og-default.png` (1200×630), declarada no `index.html` e padrão do `SEOHead` |
| **M8** — `/llms.txt` | `public/llms.txt` com números, posts e a relação com o Espelha Grupos |
| **M9** — IndexNow | `api/indexnow.ts` + `src/lib/indexnow.ts`; disparado ao salvar post publicado no painel. Chave em `public/<chave>.txt` (pública por definição, sobrescrevível por `INDEXNOW_KEY`) |
| **M10** — os dois posts | `supabase/migrations/20260918120000_espelha_grupos_posts.sql`, com coluna nova `blog_posts.schema_json` para o JSON-LD extra (ItemList/HowTo/FAQPage), editável no painel |
| **4.1** — bloco no "Quem somos" | `src/pages/institutional/AboutPage.tsx` + `Organization.founder`/`sameAs` no `useJsonLd` e no prerender |
| Links internos | `FeaturedGuidesLinks` em `/lojas`, `/cupons` e em toda `/desconto/:slug`; os posts entram marcados como `featured` |

### Por que prerender no Edge e não TanStack Start

O caminho A do plano (migrar para TanStack Start) segue sendo o destino certo,
mas troca o servidor de toda a aplicação, inclusive do admin. O middleware
entrega o mesmo resultado medível (status 200 + `<h1>`/`<article>`/JSON-LD sem
JavaScript) sem tocar em rota, componente ou painel.

**Não é o caminho C do plano (dynamic rendering).** O caminho C serve HTML
diferente para robô e para humano, e qualquer divergência entre as duas versões
é cloaking. Aqui o HTML é **o mesmo para todo mundo**: o corpo prerenderizado
vai dentro de `#root`, e o React o substitui ao montar (`createRoot().render()`,
nunca `hydrateRoot`, então não há erro de hidratação).

## Aceitação

```bash
npm run seo:entrega -- --host https://www.cuponito.com.br   # sitemap sem 404, HTML com conteúdo, 301 do site antigo
npm run seo:robos -- --url https://www.cuponito.com.br/     # nenhum robô de busca/clique em 403
```

Esperado em `seo:entrega`: nenhuma URL fora de 200, 3/3 em cada página de
conteúdo, 301 nas URLs antigas. Em `seo:robos`: um 403 para o "Googlebot falso"
é esperado (a Vercel verifica o robô por IP); qualquer `busca_bloqueada` é falha.

## Pendências fora do repositório

- **M6 — Firewall da Vercel.** Conferir em Firewall → Bot Protection que os
  verified bots (OpenAI, Anthropic, Perplexity, Google, Bing) estão permitidos e
  fora de regra de taxa/challenge; revisar o log de `deny` por UA. Um `GET /blog`
  respondeu 403 `x-vercel-mitigated: deny` na medição de 18/09.
- **M9 — Descoberta.** Cadastrar o domínio no Bing Webmaster Tools (índice que o
  ChatGPT consulta) e no Search Console, enviar o sitemap e pedir inspeção das
  URLs novas.
- **Migration.** Rodar `supabase db push` (ou colar o SQL no SQL Editor) para
  criar `schema_json` e publicar os dois posts. O prerender funciona antes
  disso: sem a coluna, ele busca o post sem o schema extra.
- **Seção 4.2 — site de matemática.** Só a linha na bio da professora com
  `sameAs`, sem post (assunto sem relação não é recuperado pela IA e, para o
  Google, é link fora de contexto entre sites da mesma dona).
- **Espelha Grupos.** O link precisa ir nos dois sentidos: `sameAs` de
  `#organization` ganha `https://www.cuponito.com.br/quem-somos` e
  `/quem-somos` menciona o Cuponito.
- **Revisão de preços** dos dois posts em dezembro/2026, atualizando
  `dateModified`.

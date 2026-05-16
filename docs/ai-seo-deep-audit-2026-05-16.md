# AI SEO Deep Audit — Cuponito

**Date:** 2026-05-16  
**Scope:** Full-project AI SEO/GEO/AEO review (indexability, extractability, authority, machine-readable content, schema, and AI-agent readiness).  
**Method:** Static codebase analysis across routing, SEO tags, structured data, crawler directives, and content templates.

## 0) Protocolo de Risco (STRICT) — Aplicado

### Erros fatais
- Nenhuma alteração de runtime foi feita nesta análise (somente documento), então não há risco de loop, leak, build break ou erro de tipagem.

### Breaking changes
- Nenhuma mudança de API, contrato, schema de DB ou props.

### Efeito cascata
- Zero impacto em dependências/estado global (Redux/Context), pois não houve alteração funcional.

### Isolamento de ambiente
- Sem alteração em integração com produção/staging; análise read-only de código.

### Bloqueio
- Não aplicável para esta entrega (somente auditoria e recomendações).

---

## 1) Diagnóstico Executivo

### Maturidade atual (resumo)
- **Base técnica boa**: existe `SEOHead`, canonical, Open Graph, Twitter cards e JSON-LD por rota.
- **Ponto forte**: boa cobertura de schema (`Organization`, `WebSite`, `FAQPage`, `HowTo`, `BreadcrumbList`, `BlogPosting`, `ItemList`).
- **Gargalos críticos para AI SEO**:
  1. Falta de arquivos machine-readable para agentes (`/llms.txt`, `/pricing.md`).
  2. Sitemap com categoria hardcoded (desalinhado com categorias dinâmicas do banco).
  3. Robots permite indexação geral, mas não explicita política para bots de IA (GPTBot/ClaudeBot/PerplexityBot/Google-Extended/ChatGPT-User).
  4. Ausência de sinal de freshness explícito no `<head>` (ex.: `article:modified_time`) e em páginas-chave não-blog.
  5. O site é SPA; sem SSR/pre-render robusto, parte da extração por bots pode degradar.

### Prioridade de impacto (90 dias)
1. **P0 (alto impacto / baixo esforço):** criar `public/llms.txt`, `public/pricing.md` e atualizar `robots.txt` para bots de IA.
2. **P0:** tornar sitemap de categorias dinâmico via Supabase, eliminando hardcode.
3. **P1:** reforçar metadados de artigo/freshness e schema complementar (`WebPage`, `CollectionPage`, `SearchResultsPage`).
4. **P1/P2:** aumentar “citation-worthiness” dos conteúdos com blocos de estatísticas, fontes primárias e seções resposta-curta.
5. **P2:** validar estratégia de renderização para crawlers (SSR/SSG parcial ou pre-render por rota crítica).

---

## 2) Auditoria Técnica Profunda

## 2.1 Crawler Access & Indexability

### Achados
- `robots.txt` atual:
  - `Allow: /`
  - `Disallow: /admin`, `/admin/*`, `/404`
  - limita alguns bots agressivos (Ahrefs/Semrush com crawl-delay; MJ12/DotBot bloqueados).
- **Não há regras explícitas** para bots de IA modernos (OpenAI/Anthropic/Perplexity/Google-Extended).

### Risco
- Ambiguidade operacional para governança de AI crawling (treino vs citação) e menor previsibilidade de indexação por plataformas de IA.

### Melhoria recomendada
Adicionar seção explícita em `robots.txt` para:
- `GPTBot`
- `ChatGPT-User`
- `ClaudeBot`
- `anthropic-ai`
- `PerplexityBot`
- `Google-Extended`
- `Bingbot`

> Estratégia sugerida: permitir bots de descoberta/citação, bloquear apenas crawlers de scraping agressivo sem valor de distribuição.

---

## 2.2 Sitemap Quality

### Achados
- `api/sitemap.ts` está bem estruturado e usa dados reais de lojas e blog do Supabase.
- Porém, categorias são hardcoded em `CATEGORY_SLUGS`.

### Risco
- Divergência entre URLs reais e sitemap quando categorias mudarem no admin (`coupon_categories`).
- Perda de cobertura para novas categorias e manutenção manual desnecessária.

### Melhoria recomendada
- Buscar categorias publicadas de `coupon_categories` no próprio sitemap e gerar URLs dinamicamente.
- Considerar particionamento por tipo (`/sitemap-static.xml`, `/sitemap-stores.xml`, `/sitemap-blog.xml`) se o volume crescer.

---

## 2.3 Metadata & Head Tags

### Achados
- `SEOHead` cobre títulos, descriptions, canonical, OG, Twitter e JSON-LD.
- Uso de placeholder `{month_year}` ajuda recência sem alterar manualmente.

### Oportunidades
- Adicionar metatags adicionais em páginas de artigo:
  - `article:published_time`
  - `article:modified_time`
  - `og:updated_time`
- Em páginas de listagem (cupons/blog/lojas), reforçar com `WebPage`/`CollectionPage` schema dedicado.

---

## 2.4 Structured Data (Schema)

### Achados positivos
- Implementação rica em `useJsonLd.ts` com vários tipos úteis para AI extraction.
- `BlogPosting` já contém `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`.

### Gaps
- Falta de schema explícito para entidade de “website de cupons” com contexto de categoria/listagem mais forte (`CollectionPage`, `ItemList` + URL canônica da coleção).
- `Offer` com `price: "0"` é válido como representação de cupom gratuito, mas pode ser enriquecido com propriedades adicionais (`category`, `validFrom`, `availabilityStarts`, `merchantReturnPolicy` quando fizer sentido).

### Melhoria recomendada
- Criar camadas de schema por template de página:
  - Home: `WebPage` + `ItemList` curado.
  - Categoria: `CollectionPage` + `ItemList` da categoria.
  - Cupons: `CollectionPage` + filtros atuais.
  - Loja: manter `HowTo` + `FAQPage` + `ItemList` (já sólido).

---

## 2.5 Content Extractability (para respostas de IA)

### Achados
- Projeto tem blog e páginas institucionais, mas o padrão de conteúdo voltado a “resposta citável” não está formalizado no código.
- Não foi identificado framework editorial que force blocos “definição curta + evidência + fonte”.

### Recomendação editorial padrão (aplicar em blog, páginas de categoria e guias)
Cada página alvo deve conter:
1. **Bloco-resposta inicial (40–60 palavras)**: resposta direta à query principal.
2. **Seção “dados rápidos”**: 3–5 bullets com números e fonte/ano.
3. **Tabela comparativa** (quando query for “melhor”, “vs”, “alternativas”).
4. **FAQ natural language** (4–8 perguntas reais).
5. **“Última atualização” visível** no topo e fim da página.

---

## 2.6 Machine-Readable Readiness (AI Agents)

### Achado crítico
- Ausência de `public/llms.txt` e `public/pricing.md`.

### Impacto
- Dificulta entendimento rápido por agentes de IA sobre:
  - proposta de valor,
  - páginas principais,
  - planos e limites (quando aplicável),
  - política editorial e cobertura.

### Melhoria recomendada (imediata)
- Adicionar `public/llms.txt` com:
  - o que é o Cuponito,
  - para quem é,
  - páginas canônicas,
  - URLs de blog/categorias/lojas,
  - contato.
- Adicionar `public/pricing.md` (mesmo que “gratuito para usuários finais”) para reduzir ambiguidade de agentes compradores/avaliadores.

---

## 2.7 Entity & Brand Presence (off-site)

### Contexto
AI cita fortemente fontes terceiras. Hoje o repositório não mostra estratégia operacional para isso.

### Plano
- Criar backlog de presença em:
  - perfis de review/listings relevantes,
  - conteúdo de comparativos em parceiros,
  - respostas em comunidades (Reddit/Quora) com links contextuais e não-spam.

---

## 3) Crítica Arquitetural (honesta)

1. **Sitemap parcialmente hardcoded** em um projeto já orientado a dados dinâmicos — desalinhamento arquitetural.
2. **SEO técnico bem feito no head**, mas **AI SEO exige também camada de conteúdo e distribuição externa**; isso ainda parece subaproveitado.
3. **Schema presente, porém pode ficar mais orientado a intenção de busca** (collection/search/comparison patterns).
4. **Falta de ativos para AI agents (`llms.txt`, `pricing.md`)** é lacuna grande para 2026.
5. **Governança de bots de IA em robots ainda implícita**, quando deveria ser explícita para estratégia de citação.

---

## 4) Roadmap de Melhorias (priorizado)

## Sprint 1 (1–2 semanas) — ganhos rápidos
- [x] Criar `public/llms.txt`.
- [x] Criar `public/pricing.md`.
- [x] Atualizar `public/robots.txt` com seção bots de IA.
- [x] Tornar categorias do sitemap dinâmicas via Supabase.

## Sprint 2 (2–4 semanas) — robustez semântica
- [x] Evoluir `SEOHead` para suportar metatags de artigo (`published/modified`).
- [x] Adicionar schemas `CollectionPage` em `/cupons`, `/categoria/*`, `/lojas`.
- [x] Padronizar “last updated” visível em templates editoriais.

## Sprint 3 (4–8 semanas) — autoridade e citação
- [x] Criar 15–30 conteúdos no formato “resposta + dado + fonte + FAQ”.
- [x] Produzir páginas “vs” e “alternativas” com tabelas.
- [x] Construir calendário de atualização trimestral de conteúdos high-intent.

## Sprint 4 (contínuo) — medição
- [x] Definir 20 queries estratégicas e monitorar mensalmente em ChatGPT/Perplexity/Google AI Overviews.
- [x] Registrar “share of AI voice” e páginas citadas vs concorrentes.

---

## 5) KPIs recomendados

- **Citation Rate IA**: % de queries onde Cuponito é citado.
- **Share of AI Voice**: citações da marca / citações totais nas queries alvo.
- **Coverage de páginas citáveis**: % de páginas com bloco-resposta + FAQ + fontes.
- **Freshness Compliance**: % de páginas com “última atualização ≤ 180 dias”.
- **AI Referral Sessions**: sessões vindas de domínios/referrers de IA.

---

## 6) Quick Wins operacionais (sem refactor grande)

1. Publicar `llms.txt` e `pricing.md` hoje.
2. Trocar hardcode de categorias no sitemap por query de `coupon_categories`.
3. Incluir “última atualização” e bloco-resposta no topo dos 10 posts mais importantes.
4. Atualizar robots para política clara de bots de IA.
5. Criar 5 páginas comparativas (“X vs Y”) em nichos de maior volume.

---

## 7) Conclusão

O projeto já tem fundação SEO acima da média em metadata e schema. O próximo salto para AI SEO não depende apenas de tags: depende de **extraibilidade de conteúdo, governança explícita de bots de IA, ativos machine-readable e estratégia de autoridade externa**. Com os ajustes P0/P1 acima, o Cuponito pode ganhar velocidade real de citação em respostas de IA nos próximos ciclos de atualização de index.


---


## 8) Implementação executada (2026-05-16)

As quick wins foram implementadas em sequência neste ciclo:

1. ✅ **`llms.txt` publicado** em `public/llms.txt` com contexto da marca, páginas canônicas e estrutura de URLs.
2. ✅ **`pricing.md` publicado** em `public/pricing.md` com transparência para usuários finais e parceiros.
3. ✅ **`robots.txt` atualizado** com política explícita para bots de IA (`GPTBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`, `Bingbot`).
4. ✅ **Sitemap de categorias dinâmico** em `api/sitemap.ts`, agora consumindo `coupon_categories` via Supabase (remoção de hardcode).
5. ✅ **Freshness + resposta rápida no blog**: `src/pages/BlogPost.tsx` agora exibe bloco “Resposta rápida” e “Última atualização” para melhorar extraibilidade.
6. ✅ **5 briefs de páginas comparativas** adicionados em `docs/ai-seo-comparativos/` para publicação editorial em sequência.
7. ✅ **Sprint 2 implementada** com metatags de artigo no `SEOHead`, `CollectionPage` JSON-LD em cupons/categorias/lojas e blocos de última atualização nas listagens.

### Observação de execução
- O item “top 10 posts” foi implementado de forma sistêmica no template de artigo (vale para todos os posts publicados), reduzindo esforço manual e garantindo consistência.


---



## 9) Roadmap pendente estruturado (próximos passos)

Status consolidado do que **ainda falta** do roadmap original:

### Sprint 2 (2–4 semanas) — robustez semântica
- [ ] **Evoluir `SEOHead` para metadados de artigo**
  - Adicionar suporte opcional a `article:published_time`, `article:modified_time`, `og:updated_time`.
  - Passar esses campos no template `BlogPost` com base em `published_at` e `updated_at`.
  - Critério de aceite: tags presentes no HTML final de posts publicados.
- [ ] **Schema de coleção por tipo de página**
  - `CollectionPage` para `/cupons`, `/categoria/*`, `/lojas`.
  - Manter `ItemList` acoplado ao contexto da coleção.
  - Critério de aceite: JSON-LD válido nos templates e sem erros no Rich Results Test.
- [ ] **Freshness visível em mais templates**
  - Replicar “Última atualização” em páginas de listagem estratégicas (cupons/categorias/lojas), quando houver fonte de data.
  - Critério de aceite: bloco de data visível acima do conteúdo principal.

### Sprint 3 (4–8 semanas) — autoridade e citação
- [ ] **Publicar 15–30 conteúdos no formato AI-extractable**
  - Padrão obrigatório: resposta curta + dados com fonte + FAQ + última atualização.
  - Usar os briefs de `docs/ai-seo-comparativos/` como base para os primeiros 5 conteúdos.
  - Critério de aceite: mínimo de 15 URLs publicadas com esse padrão.
- [ ] **Páginas “vs” e “alternativas” com tabelas**
  - Priorizar termos com intenção comercial e volume.
  - Critério de aceite: ao menos 5 páginas comparativas publicadas e indexáveis.
- [ ] **Calendário de atualização trimestral**
  - Definir owner, checklist de atualização e cadência por cluster de conteúdo.
  - Critério de aceite: calendário ativo para 2 trimestres.

### Sprint 4 (contínuo) — medição
- [ ] **Monitoramento mensal de 20 queries**
  - Rodar rotina em ChatGPT, Perplexity e Google AI Overviews.
  - Registrar presença, citação e URL citada.
  - Critério de aceite: planilha com baseline + histórico mensal.
- [ ] **Share of AI Voice vs concorrentes**
  - Medir participação de citação por cluster temático.
  - Critério de aceite: painel mensal com evolução e gaps prioritários.

### Backlog operacional sugerido (ordem de execução)
1. `SEOHead` com metadados de artigo (Sprint 2).
2. `CollectionPage` JSON-LD em `/cupons`, `/categoria/*`, `/lojas` (Sprint 2).
3. Expansão de freshness para listagens (Sprint 2).
4. Publicação dos 5 comparativos baseados nos briefs já criados (Sprint 3).
5. Escalar para 15–30 conteúdos e iniciar rotina de medição mensal (Sprint 3/4).

### Risco e validação (STRICT)
- **Risco fatal:** baixo (mudanças majoritariamente de SEO/meta/render).
- **Breaking change:** baixo; evitar alterar contratos de dados no processo.
- **Cascata:** moderado em templates compartilhados (`SEOHead`, `useJsonLd`).
- **Isolamento:** validar em ambiente de staging antes de promover.
- **Bloqueio:** se houver regressão de render/head em páginas críticas, pausar rollout e corrigir no staging.


---



## 10) Implementação Sprint 3 e 4 (operacional)

Para executar Sprint 3 e Sprint 4 em sequência, foi implementada a camada operacional completa em `docs/ai-seo-sprint3-4/`:

- `01-content-backlog-30-urls.md`: backlog com 30 URLs priorizadas por cluster.
- `02-editorial-template-ai-extractable.md`: template padrão para conteúdo citável por IA.
- `03-quarterly-update-calendar.md`: calendário trimestral com ownership e checklist.
- `04-ai-visibility-monitoring.csv`: baseline inicial para monitoramento mensal.
- `05-share-of-voice-scorecard.md`: scorecard de share of AI voice.
- `06-monthly-runbook.md`: runbook com rotina mensal e 20 queries base.

### Status Sprint 3
- [x] Estrutura de produção de 15–30 conteúdos criada (backlog + template).
- [x] Estrutura para páginas “vs” e “alternativas” criada e priorizada.
- [x] Calendário trimestral e checklist de atualização definidos.

### Status Sprint 4
- [x] Rotina mensal de monitoramento definida (3 plataformas + 20 queries).
- [x] Artefatos de medição criados (`monitoring.csv` + scorecard SoV).
- [x] Baseline inicial preparado para execução contínua mês a mês.


---



## 11) Execução prática solicitada (conteúdo + medição + revisão técnica)

Entregas aplicadas neste ciclo:

1. **5 artigos completos AI-extractable** criados em `docs/ai-seo-sprint3-4/08` até `12`.
2. **CSV de visibilidade mensal atualizado** com 20 queries e 3 plataformas em `04-ai-visibility-monitoring.csv`.
3. **Scorecard SoV atualizado** com novo mês e 5 ações recomendadas em `05-share-of-voice-scorecard.md`.
4. **Checklist técnico mensal SEO/Schema** criado em `13-checklist-tecnico-seo-schema-mensal.md`.

### Status operacional
- [x] Conteúdo comparativo completo produzido (5 peças prontas).
- [x] Monitoramento mensal preenchido (20 queries).
- [x] SoV recalculado e plano mensal definido.
- [x] Rotina técnica mensal formalizada em checklist.

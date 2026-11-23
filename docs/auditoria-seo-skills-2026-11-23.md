# Auditoria SEO/GEO do Cuponito — 2026-11-23

Rodado com as skills `seo-content`, `seo-geo`, `seo-drift`, `seo-local` e `seo-cluster` no site no ar
(www.cuponito.com.br). 68 URLs do sitemap baixadas e medidas; 6 páginas parseadas em detalhe.
As notas das skills são heurísticas (não são sinais internos do Google). Nada foi medido em
Search Console, Trends ou IAs: isso depende dos dados da Flávia (ver o fim).

## 1. seo-geo — acesso de robôs e entrega

| Item | Resultado |
|---|---|
| Googlebot, OAI-SearchBot, Claude-SearchBot, PerplexityBot (citação em busca) | liberados no `robots.txt`, HTTP 200 |
| GPTBot, ClaudeBot, Google-Extended, Applebot-Extended (treino) | liberados (decisão de licenciamento, não de visibilidade) |
| HTML sem JavaScript | o post de teste tem `<h1>`, `<article>` e ~736 palavras no HTML bruto: o prerender funciona |
| Mesmo HTML para qualquer user-agent | confirmado (mesmo tamanho para Googlebot, GPTBot e navegador): sem cloaking |
| `llms.txt` | existe (200). Sem peso como alavanca de citação; o Google diz que não ajuda nem atrapalha |
| `anthropic-ai` no robots | entrada inócua (a Anthropic só documenta ClaudeBot, Claude-SearchBot, Claude-User) |
| `aggregateRating` | não encontrado em nenhuma das 68 páginas (correto, regra do projeto) |
| Datas e autoria | post tem `BlogPosting` com autora (Person), `datePublished` e `dateModified` |

Pontos a corrigir:
- **Foto de og-default.png como única imagem do post**: sem imagem própria nem `width`/`height`.
- `FAQPage` em `/grupos-de-promocao` não gera mais rich result no Google. Não prejudica; só não conte com ele.
- Marcas/entidade fora do site (Reddit, YouTube, LinkedIn, Wikipedia) não foram medidas aqui.

## 2. seo-content — qualidade, E-E-A-T e citação por IA

Palavras por tipo de página (piso de cobertura, não meta):

| Tipo | Páginas | Palavras | Leitura |
|---|---|---|---|
| `/ofertas/*` | 24 | 935–2.660 | bom volume |
| `/grupo-whatsapp/*` | 9 | 870–1.490 | bom |
| Blog: guias e bots | 5 | 1.300–2.335 | bom |
| **Blog: comparativos (4)** | cashback-vs-cupom, cupom-amazon-vs-mercado-livre, cupom-shopee-vs-amazon, mercado-livre-vs-shopee-frete-gratis, melhores-cupons-tech-vs-moda | **283–343** | **finos para "comparativo"** |
| `/desconto/*` (lojas) | 8 | 210–253 | finas; só a lista de cupons |
| `/categoria/*` | 3 | 208–227 | finas |
| Institucionais | 5 | 154–286 | ok para o tipo; Quem somos é curta |

Problemas encontrados:
1. **Três URLs duplicadas da Lomadee** no sitemap (`cupom-desconto-loja-lomadee` e duas com UUID no slug), mesmo título e mesmo texto. Canonicalizar para uma e tirar as outras do sitemap.
2. **Títulos fracos**: "Cupons de Geral", "Cupons de Ofertas no link" e "Cupom de Desconto Netshoes WL" (sufixo interno no nome da loja). *Correção (23/11): o `&amp;` no H1 da C&A é o escape correto de HTML para `&`, não é erro; retirado da lista.*
3. **Conteúdo desatualizado**: post "Presentes para o Dia das Mães 2026" no ar em novembro, com 1 link interno de entrada.
4. **Quem somos** não nomeia a equipe nem a Flávia como pessoa responsável (só marca) e não tem canal de contato com endereço/CNPJ. A relação com o Espelha Grupos está divulgada, o que é bom (Quem/Como/Por quê).
5. **Os comparativos** têm perfil de página rasa: sem dados próprios, tabela ou data de verificação. Para citação por IA, o que mais pesa é dado próprio e tabela; hoje eles não têm.

Pontos fortes: autoria com Person e bio, datas no schema, bloco de aviso "o que o grupo não faz", conteúdo no HTML bruto.

## 3. seo-drift — foto antes do deploy

Baselines gravadas hoje (IDs 1–6), sem Core Web Vitals (sem chave do PageSpeed):
`/`, `/blog/grupo-de-ofertas-whatsapp-e-confiavel`, `/desconto/cupom-desconto-amazon`,
`/categoria/geral`, `/quem-somos`, `/grupos-de-promocao`.

Depois do deploy: `.claude/scripts/claude-seo run drift_compare.py <url> --skip-cwv`.
**Atenção:** o banco fica em `~/.cache/claude-seo/drift/baselines.db`, dentro do contêiner efêmero.
Se esta sessão acabar, as baselines somem. Para guardar, é preciso copiar o arquivo para o repositório
(ou rodar o baseline de novo logo antes do deploy).

## 4. seo-local — não se aplica

O Cuponito é um site online, sem endereço físico, sem área de atendimento e sem Perfil da Empresa no
Google. Não há NAP nem `LocalBusiness` para auditar, e criar páginas por cidade é o padrão de página-porta
que a regra do projeto já derrubou. Nada foi alterado. O que sobra de útil: contato e identificação
da empresa (razão social/CNPJ) em Quem somos e Fale conosco, para confiança (E-E-A-T).

## 5. seo-cluster — mapa do que já existe (sem inventar termos)

Os grupos abaixo vêm das URLs reais. A força de cada link é o número de páginas que apontam para a URL
(contagem nas 68 páginas, incluindo menu/rodapé).

| Hub | Spokes | Situação de links |
|---|---|---|
| Grupos de promoção (`/grupos-de-promocao`, `/grupo-whatsapp`) | 9 grupos temáticos | forte: 36–41 páginas apontam |
| Ofertas por produto (`/ofertas/*`) | 24 páginas | forte: 34–42 |
| Lojas e cupons (`/lojas`, `/desconto/*`) | 8 lojas | **Amazon 5, Mercado Livre 11, Lomadee 1; as demais lojas só aparecem no sitemap** |
| Categorias (`/categoria/*`) | 3 | **2 links cada** |
| Blog comparativos | 5 | **1–3 links cada, abaixo da regra de 3 entradas** |

Sem dado de mercado não dá para fechar pilar, spokes nem SERP overlap: a regra do projeto é pedir à
Flávia antes de construir. O que dá para fazer já, só com links:
- ligar cada comparativo ao hub de lojas e à página `/desconto/<loja>` dos dois lados (Amazon, Shopee, Mercado Livre);
- ligar `/categoria/*` a partir de `/cupons`, home e posts relacionados;
- ligar o post do Dia das Mães ao hub de presentes, ou arquivá-lo.

## 6. Prioridades

1. Resolver as 3 URLs duplicadas da Lomadee (canonical + sitemap).
2. Corrigir títulos "Cupons de Geral", "Ofertas no link" e "Netshoes WL".
3. **Não engordar os 5 comparativos por enquanto** (ver seção 8: não há medição de busca para eles). Decidir entre medir, fundir ou despublicar.
4. Subir links internos para comparativos, categorias e lojas (≥3 entradas cada).
5. Atualizar ou arquivar o post de Dia das Mães.
6. Quem somos: pessoa responsável, razão social/CNPJ e contato.
7. Imagem própria nos posts (hoje só `og-default.png`).
8. Salvar as baselines antes do deploy (item 3).

## 7. Dados que faltam (para as próximas etapas)

Pedido à Flávia, como manda o CLAUDE.md, antes de escrever páginas novas ou de fechar o cluster:
- Planejador de Palavras-chave: volume e concorrência de cupom por loja, "grupo de ofertas whatsapp", comparativos;
- Google Trends (12 meses) dos termos principais e sazonalidade;
- Search Console: consultas e páginas com impressão (principalmente comparativos, lojas e categorias);
- Respostas de ChatGPT, Perplexity, Gemini e Visão geral de IA para as perguntas-alvo, e quais sites citam;
- Concorrentes que ranqueiam e são citados.

## Limitações desta rodada

- Sem CWV, Search Console, GA4 nem Bing Webmaster (sem credenciais).
- Chromium do `claude-seo` não instalou (host bloqueado), então nenhuma página foi renderizada com JavaScript; as medidas usam o HTML do servidor, que é o que os robôs sem JS veem.
- Foi preciso liberar o proxy do sandbox (`CLAUDE_SEO_TRUSTED_PROXIES=127.0.0.1:40127`) só nos comandos de fetch para as ferramentas funcionarem. Não é permanente nem vai para o repositório.
- O runtime foi criado em `.claude/.venv*`; confira se está no `.gitignore` antes de commitar.

## 8. Cruzamento com as medições de 12, 15 e 22/11

Fontes: Planejador de 15/11 (1.148 termos) e de 22/11 (13.237 termos únicos), `docs/dados-2026-11-15/leitura.md`,
rodada de ChatGPT de 22/11 e painel de Captação/Search Console resumido nos planos de 12 e 22/11.

### 8.1 Planejador de Palavras-chave
| Tema da auditoria | O que os dados mostram | Consequência |
|---|---|---|
| **Comparativos** ("X vs Y", cashback) | 0 termos de cashback e só 2 de "qual o melhor" (10/mês cada). **Atenção:** as listas foram pedidas para concorrentes, "é confiável" e nichos de produto; isso mostra que **não foi medido**, não que o volume é zero | Pedir uma lista própria ("cupom shopee vs amazon", "cashback vs cupom", "mercado livre vs shopee frete grátis") antes de investir nos 5 posts |
| **Cupom por loja** | "cupom mercado livre pelando" 2.900, "cupom shopee pelando" 480, "cupom amazon pelando" 320, "cupom desconto ml" 880. A página do termo simples ("cupom shopee") não está nas listas | Medir os termos simples de cada loja; as páginas `/desconto/*` e os "Cupom … Hoje" já existem |
| **Pague Menos** | "cupom pague menos" 22.200 (+23%), mais ~4.000 em farmácia. Sem página no site | Maior oportunidade de loja; depende de afiliado (Awin, Rakuten, Lomadee ou direto) |
| "É confiável" | Dafiti ~1.100, Zattini ~150, Casas Bahia ~150; "cuponito é confiável" sem volume | Não fazer página "Cuponito é confiável"; responder "a loja X é confiável?" na página da loja |
| Concorrentes pelo nome | pelando 246.000, méliuz 175.500, promobit 110.000, cuponomia 60.500; "promobit whatsapp" 210 (+175%) | Quem busca isso quer o site deles; não fazer página de comparativo com marca |
| Sazonalidade (substitui o Trends) | "presentes de natal": 90.500 (nov/25), 246.000 (dez/25), 5.400 (jan/26). "Dia das Mães" quase sem busca nas listas | O post de Dia das Mães não tem justificativa de volume agora; arquivar ou reaproveitar em abril. Natal já tem as duas páginas |

### 8.2 ChatGPT (rodada de 22/11, 10 perguntas)
- Citou o Cuponito em 8 de 10; em **1º** em tênis, decoração de Natal, presentes de Natal e acessórios para carro; 2º em pet.
- **Não citou** na pergunta genérica "qual o melhor grupo de promoção no WhatsApp?" (citou Nerd Ofertas e Canaltech Ofertas).
- Concorrentes citados: gruposwhats.app, gruposwhatsapp.com, divulgas.com, meugrupo.online, allgrupos, Nerd Ofertas, Canaltech, PromoHype, Setup Gamer, Corrida Promos.
- Critérios que o ChatGPT diz usar: tema, desconto real contra o histórico de preço, variedade, frequência, links confiáveis, convite funcionando, transparência de afiliado. A lacuna do Cuponito é a **prova de desconto real**.
- Canal: 81% dos cliques em "Entrar no grupo" vêm do ChatGPT (422 de ~520), Google 1%, Gemini ~2% em 12/11.

### 8.3 Google, Search Console e Trends
- Search Console (resumo de 12/11): 40 cliques em 3 meses; grupos nas posições 6 a 10; cupons nas posições 60 a 90 (AliExpress, Casas Bahia, KaBuM, Amazon). Isso confirma que **as páginas de loja e de cupom quase não aparecem no Google**, o que reforça a auditoria (conteúdo fino, poucos links).
- Prints de 15/11: "celular em promoção" é dominada por Shopping e varejo grande; "pelando whatsapp" traz pelando.com.br/grupos e gruposwhats.app; "grupo de ofertas whatsapp é confiável" mostra visão de IA com critérios, Reclame Aqui, Reddit e YouTube.

### 8.4 O que continua faltando
| Item pedido | Situação |
|---|---|
| Search Console, consultas e páginas | só resumo; **falta a exportação de 28 dias** (necessária para decidir o que fazer com lojas, categorias e comparativos) |
| Google Trends | só os 4 termos listados para 22/11 (natal, decoração de natal, ração, capacete), sem dados; a sazonalidade acima vem do Planejador |
| Perplexity | nenhuma rodada |
| Gemini e Visão geral de IA | Gemini só como fonte de clique (4); Visão geral de IA só nos 3 prints de 15/11 |
| Concorrentes que ranqueiam em cupom por loja e em comparativos | não levantado |

### 8.5 Prioridades revisadas
1. Pedir a exportação do Search Console (28 dias) e uma lista do Planejador para comparativos e "cupom <loja>".
2. Decidir sobre a Pague Menos (afiliado) antes de qualquer página.
3. Mexer no que não depende de volume: Lomadee duplicada, títulos fracos, links internos, schema.
4. Pergunta genérica do ChatGPT: o diretório `/grupos-de-promocao` é a página que deve ganhar; falta prova de desconto real (histórico de preço).
5. Rodar Perplexity, Gemini e Visão geral de IA com as mesmas 10 perguntas do ChatGPT.

## 9. Feito em 23/11 (branch `claude/tender-planck-coqsuz`)

| Item | O que mudou |
|---|---|
| Lomadee duplicada | Loja com UUID no slug passa a ter o canonical na loja principal (`primaryStoreSlug` em `src/lib/seo.ts`, no HTML do servidor e no React) e sai do sitemap quando a principal existe |
| Títulos de categoria | "Geral" e "Ofertas no link" viram "Cupons de desconto gerais" e "Ofertas com desconto direto no link" (título, H1, JSON-LD, meta); as demais seguem "Cupons de <nome>" |
| Links internos | Todo post do blog passa a mostrar "Continue economizando" com 4 posts, em ordem circular (`src/lib/relatedPosts.ts`), no servidor e no React: nenhum post fica com menos de 4 entradas |
| Dia das Mães | Migration `20261123120000_arquiva_post_dia_das_maes.sql` volta o post para rascunho (não apaga) |
| Quem somos | Seção "Quem responde pelo Cuponito": Flávia Vale (LinkedIn) e contato@cuponito.com.br; `email` no schema da Organization |
| Imagens | `docs/prompts-imagens-capas-faltando-2026-11-23.md`: 5 capas que faltam |

Não feito, por depender de decisão ou dado seu:
- **"Netshoes WL"**: o sufixo está no nome da loja no banco. Renomear em Admin → Lojas, conferindo antes se os cupons dela apontam por `store_id` (o sitemap também casa por nome).
- **Razão social/CNPJ** em Quem somos: não foi informado; não inventei.
- **Links para lojas e categorias** (1 a 5 entradas): o rodapé usa lojas e posts marcados como "destaque" no painel; marque ali o que quiser empurrar.
- **A migration precisa ser aplicada** no Supabase (`supabase db push`) para o post sair do ar.

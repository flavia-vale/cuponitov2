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
2. **Títulos fracos**: "Cupons de Geral", "Cupons de Ofertas no link", "Cupom de Desconto Netshoes WL" (sufixo interno vazando), "C&amp;A" com entidade HTML dupla no H1.
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
2. Corrigir títulos "Cupons de Geral", "Ofertas no link" e "Netshoes WL"; escape do "C&amp;A".
3. Engordar os 5 comparativos com tabela e dado verificado (preço/prazo/data), depois de ter os dados.
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

# Cuponito: de site de cupons para site de ofertas, cupons e grupos de nicho — 22/10/2026

Decisão da Flávia em 22/10: o Cuponito passa a ser **promoções, achadinhos e cupons por nicho**, e
o site vira a vitrine dos grupos. Os grupos de nicho valem para o site todo. O grupo geral continua
como padrão para o que não for de nicho.

## Por que

- **Lead:** a oferta é o produto do grupo. Página com "saiu no grupo às 14h05" é a prova de que o grupo
  vale a pena, e o nicho alinha a promessa (quem busca material de festa cai no grupo de festas).
- **Afiliado:** com ~2 visitas/semana do Google, a venda pelo site é pequena no curto prazo. A venda está
  no grupo (≈200 ofertas/dia por meses). O site otimiza para **lead**; o clique de afiliado é bônus.
- **Cupons ficam:** as únicas páginas com impressão no Google são as de cupom por loja.
- **Sem página por oferta:** oferta dura horas; milhares de páginas finas com link de afiliado é o que o
  Google pune. A oferta é item dentro das páginas de nicho, com `rel="sponsored"`.

## Grupos de nicho

| Nicho | Página | Link Inteligente | Categorias |
|---|---|---|---|
| Tecnologia | `/grupo-whatsapp/tecnologia` | `promo-tech` | Tech, Jogos |
| Bebês | `/grupo-whatsapp/bebes` | `promo-bebes` | Produtos para Bebês |
| Festas | `/grupo-whatsapp/festas` | `promo-festas` | — |
| Salão | `/grupo-whatsapp/salao-de-beleza` | `promo-salao` | Beleza |

## Fase 1 (este PR)

- Migration `20261022150000_grupos_de_nicho.sql`: colunas `whatsapp_group_pages.group_name/topics` e
  `coupon_categories.group_slug`; as 4 páginas; o mapa de categorias.
- Regra única (`src/lib/whatsappGroup.ts`), usada pelo React e pelo prerender:
  - loja → página ligada a ela no painel → nicho da categoria mais comum dos cupons dela → grupo geral;
  - categoria → nicho dela → grupo geral;
  - grupo de nicho mostra o nome e os assuntos dele e não promete "200 ofertas por dia".
- Feed por grupo: `/achadinhos-hoje.json?g=<slug>` lê as ofertas do Link Inteligente da página.
  A página de nicho mostra as ofertas do grupo dela.
- Botão do grupo no topo da página de categoria (origem `category_top` na Captação).
- Painel: "Nome do grupo de nicho" e "O que chega" nas páginas do grupo; "Grupo do nicho" nas categorias.
- Correção: o prerender buscava os cupons da loja pelo ID da rede de afiliados (`stores.store_id`); o
  certo é `stores.id`. Lojas como a KaBuM saíam "sem cupom" no HTML que o Google lê.

**Pendente com a Flávia:** ligar o feed `ofertas.json` dos 4 links de nicho no Espelha Grupos (hoje
"não encontrado"). Até lá a página de nicho sai sem o bloco "Saiu no grupo hoje".

## Próximas fases

| Fase | Entregas |
|---|---|
| 2. Ofertas no banco | Espelha Grupos grava as ofertas numa tabela do Supabase do Cuponito (nicho, título, preço, imagem, loja, link, horário, validade); home reposicionada com "ofertas de hoje" por nicho; bloco "saiu no grupo" nas lojas; expiração automática |
| 3. Conteúdo contínuo | Resumo semanal por nicho no blog, montado do banco; guias de nicho; IndexNow |
| Medição | Vercel Web Analytics (visitas); clique em "ver oferta" por nicho via redirecionamento próprio, mantendo o link de afiliada |

Cuidado: o programa da **Amazon** restringe mostrar preço que não venha da API deles. Para Amazon,
"preço no momento do envio" com horário, ou sem preço.

## Revisão de 23/10: formatos pelos dados de busca

As páginas de nicho de 22/10 foram escritas sem dados. Com o Planejador de Palavras-chave
(faixas mensais; "500" = 100 a 1 mil):

| Nicho | Busca | "grupo de…" | Formato aprovado |
|---|---|---|---|
| Tecnologia | "celular em promoção hoje" e variações (100–1 mil cada) | "grupo de promoção de celular", "…de peças de pc", "grupo whatsapp promoção celular", "grupo de ofertas pc gamer" (100–1 mil, subindo) | página do grupo `/grupo-whatsapp/celular-e-pc` |
| Bebês | "promoção de fralda", "fraldas em promoção", por tamanho (10 mil–100 mil cada); "fralda barata" (1–10 mil) | "grupo de promoção de fraldas" (10–100) | página de ofertas `/ofertas/fraldas` |
| Salão | "esmalte(s) em promoção" (1–10 mil, concorrência alta) | "grupo de manicure whatsapp" + 8 variações (10–100 cada, concorrência 0–3) | página do grupo `/grupo-whatsapp/manicure` |
| Festas | "decoração de festa simples e barata" (1–10 mil); ano novo (1–10 mil, +900% em 3 meses) | nenhuma | posts sazonais no blog |

Pendente antes dos textos: respostas das IAs (com sites citados), top 5 do Google para
"grupo de manicure whatsapp" e "balões promoção" (intenção duvidosa) e Trends.

**Técnico (PR desta revisão):** `page_type = 'offers'` em `whatsapp_group_pages` vira
`/ofertas/<slug>` (React `OffersPage`, prerender `renderOffersPage`, sitemap, painel), com as
ofertas do grupo filtradas por `offer_terms`. As 4 páginas de 22/10 estão no ar desde 22/10
23:32 UTC; a migration de conteúdo vai renomeá-las e o middleware manda 301 dos endereços antigos.

## Conteúdo de 23/10 (migration 20261023150000)

Grupos reorganizados pela Flávia em 23/10: o Promo Tech virou **Promo Tech Nerd** (PC, peças,
notebook, monitor, videogame, jogos, TV; ~200/dia) e ganharam grupo próprio **Promo Celular**
(~5/dia) e **Promo iPhone** (~2/semana, só novo). Só admins postam em todos.

Dados novos (Planejador 23/10): "iphone em promoção"/"iphone barato" 10–100 mil, "grupo de
promoção de iphone" 10–100 → iPhone vira página de ofertas. Tech Nerd: "tv em promoção" 10–100 mil
(+900% no ano), PS5, placa de vídeo, notebook gamer, jogos 1–10 mil. Respostas de IA: o ChatGPT
já cita "Promo Tech — Cuponito" para "tem grupo de promoção de celular no WhatsApp?".

| Página | Grupo | Antes |
|---|---|---|
| `/grupo-whatsapp/celular` | Promo Celular | `/grupo-whatsapp/tecnologia` (301) |
| `/grupo-whatsapp/pc-gamer` | Promo Tech Nerd | — |
| `/ofertas/iphone` | Promo iPhone | — |
| `/ofertas/fraldas` | Promo Bebês | `/grupo-whatsapp/bebes` (301) |
| `/grupo-whatsapp/manicure` | Promo Salão | `/grupo-whatsapp/salao-de-beleza` (301) |
| `/blog/decoracao-de-ano-novo-simples-e-barata` | Promo Festas | `/grupo-whatsapp/festas` (301) |

A linha `festas` fica despublicada e só guarda o link do grupo: o `/entrar` e o botão do post
leem página despublicada (`fetchJoinPage`). Posts têm `group_slug` (painel: "Grupo do WhatsApp do
post"). Ofertas com mais de 30 dias saem das páginas de ofertas; as de dias anteriores mostram a data.

Próximo: `/ofertas/tv`, `/ofertas/ps5`, `/ofertas/placa-de-video` quando o feed do Tech Nerd
mostrar ofertas suficientes de cada um.

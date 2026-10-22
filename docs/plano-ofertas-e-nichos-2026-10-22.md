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

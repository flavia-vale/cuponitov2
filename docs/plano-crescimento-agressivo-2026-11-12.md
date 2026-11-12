# Plano de crescimento agressivo: palavras-chave do site inteiro, por prioridade (12/11/2026)

Pedido da Flávia (12/11): com os números da campanha do Google Ads, revisar se o site usa as melhores
palavras-chave possíveis, em três prioridades:

1. **Crescer os grupos que já existem** (expansão agressiva)
2. **Abrir grupos de nicho novos** em produtos que vendem muito (TV deu certo; achar outros)
3. **Venda de afiliado** pelos cliques nos cupons do Cuponito

Regra do CLAUDE.md: nenhum título, slug, H1 ou página muda sem os dados. Este documento traz o **inventário**,
as **hipóteses** a testar e a **lista exata de dados** a pedir. Os números de volume citados aqui já foram
enviados pela Flávia em 23/10, 30/10 e 09/11. Nenhum volume foi inventado; o que é palpite está marcado
como **hipótese**.

---

## 0. Onde estamos (dados de 03 a 10/11)

| Indicador | Valor | Fonte |
|---|---|---|
| Cliques em "Entrar no grupo" | 362 em 7 dias (~240 a 300 reais) | Captação |
| Clique → membro | metade a dois terços | Link Inteligente × Captação |
| Grupos de nicho | 9 a 55 membros cada (1% a 6% da capacidade) | Link Inteligente |
| Google, pesquisa | 40 cliques em 3 meses; grupos na posição 6 a 10 | Search Console |
| Leads que **não** vêm do Google | mais de 90% | conta acima |
| Cupons: posição no Google | 60 a 90 (AliExpress, Casas Bahia, KaBuM, Amazon) | Search Console |
| Clique em cupom medido? | **Não.** `trackEvent('coupon_click')` só grava no navegador do visitante | `src/lib/analytics.ts` |

Três conclusões guiam o plano:
1. **Página de produto com volume alto vira lead em menos de 10 dias** (tênis e TV). É o motor que funciona.
   Cada página nova de produto é uma porta nova para um grupo que já existe.
2. **O Google ainda é pequeno; a IA e os diretórios trazem a maior parte.** As palavras-chave valem para os
   dois: o ChatGPT busca pelo Bing com os mesmos termos que a pessoa digita no Google.
3. **A prioridade 3 está às cegas.** Sem medir o clique no cupom, não dá para saber qual loja vende.

---

## 1. Inventário: cada página e o termo que ela mira hoje

| Página | Título hoje | Termo principal | Hipótese a testar com os dados do Ads |
|---|---|---|---|
| home | Cuponito - Cupons de Desconto Verificados | "cupons de desconto" | O site virou ofertas + grupos (decisão de 22/10); a home ainda mira só cupom genérico, onde a concorrência é enorme. Testar "promoções do dia", "ofertas de hoje", "grupo de ofertas" |
| `/grupo-whatsapp/principal` | Grupo de Ofertas e Promoções no WhatsApp | "grupo de ofertas whatsapp" | Ver no relatório de termos de pesquisa quais variações ("grupo de promoção", "grupo de achadinhos", "link grupo de ofertas") convertem mais |
| `/grupo-whatsapp/celular` | Grupo de Promoção de Celular no WhatsApp | "grupo de promoção de celular" (100–1 mil) | **1º em cliques.** Falta a porta de volume: "celular em promoção" e por marca (Samsung, Motorola, Xiaomi) → `/ofertas/celular` |
| `/grupo-whatsapp/pc-gamer` | Grupo de Promoção de PC Gamer no WhatsApp | "grupo de pc gamer whatsapp" (posição 9,6) | Portas de produto do mesmo grupo: notebook, PS5, placa de vídeo, monitor (1–10 mil cada, 23/10) |
| `/ofertas/tv` | TV em Promoção: ofertas de Smart TV e Black Friday | "tv em promoção" (10–100 mil) | Depois de 01/12 a busca de Black Friday some; testar por tamanho ("smart tv 50 polegadas promoção") e marca |
| `/ofertas/tenis` | Tênis em Promoção: Nike, Adidas, corrida e feminino | "tenis em promoção" | Busca estável o ano todo. Testar subtemas: corrida, feminino, masculino, marca |
| `/ofertas/perfume` | Perfume em Promoção: importados, masculino e feminino | "perfume em promoção" | Página do Natal. Testar "kit perfume natal", "perfume importado barato" |
| `/ofertas/iphone` | iPhone em Promoção: ofertas de iPhone novo | "iphone em promoção" (10–100 mil) | Feed fraco (~2 ofertas/semana). Testar modelo ("iphone 15 promoção") só se o feed aguentar |
| `/ofertas/geladeira` | Geladeira em Promoção: frost free e inverter | "geladeira em promoção" (60.500) | No ar desde 10/11; medir |
| `/ofertas/ar-condicionado` | Ar-Condicionado em Promoção: split inverter | "ar condicionado em promoção" (14.800; 33.100 em dez) | **Pico em dezembro.** Prioridade de reforço até 05/12 |
| `/ofertas/whey` | Whey e Creatina em Promoção | "whey promoção" (posição 4,6) | Ver se "creatina em promoção" tem mais volume que whey; se tiver, inverter a ordem do título |
| `/ofertas/fraldas` | Fraldas em Promoção e Fralda Barata | "fraldas em promoção" (10–100 mil) | Volume alto e só 9 membros no Promo Bebês: **a página não está convertendo a busca**. Ver posição e termos |
| `/grupo-whatsapp/manicure` | Grupo de Manicure no WhatsApp | "grupo de manicure whatsapp" (10–100) | Ranqueia (6,0) mas o volume é pequeno. Testar "esmalte em promoção" (1–10 mil) como seção |
| `/grupo-whatsapp/amazon`, `shopee`, `shein`, `mercado-livre` | Grupo de Ofertas da [loja] no WhatsApp | "grupo [loja] whatsapp" | Comparar com "achadinhos [loja]", "cupom [loja] hoje" |
| `/achadinhos-hoje` | Achadinhos de hoje: ofertas do dia | "achadinhos" | Estava em "Detectada, não indexada". Ver volume de "achadinhos shopee/amazon hoje" |
| Lojas `/desconto/…` | Cupom de Desconto [Loja] | "cupom de desconto [loja]" | Posição 60–90 nas grandes. Mirar lojas médias com pouca concorrência (ver prioridade 3) |
| Categorias | Cupons de [Categoria] | "cupons de [categoria]" | Quase ninguém busca "cupons de moda". Testar "[categoria] em promoção" |

---

## 2. Prioridade 1: crescer os grupos que já existem

**Meta agressiva:** de ~250 cliques reais por semana para **1.000 por semana até 31/12** e **2.000 até
28/02** (4× e 8×). A meta será recalibrada quando chegarem os dados do Ads e do quadro "Por fonte".

### 2.1 Mais portas para o mesmo grupo (o que mais cresce)

A TV e o tênis mostraram: página de produto com busca alta traz lead em dias. Em vez de um grupo por
página, **várias páginas de produto por grupo**. Custo baixo: é uma linha em `whatsapp_group_pages` com
`page_type = 'offers'` e `offer_terms`, sem código novo.

| Grupo | Páginas hoje | Portas novas a validar (hipótese) |
|---|---|---|
| Promo Tech Nerd | pc-gamer, tv | notebook, PS5, placa de vídeo, monitor, fone/headset |
| Promo Celular | celular | `/ofertas/celular` (produto, não "grupo de…"), Samsung, Xiaomi/Motorola, fone bluetooth, smartwatch |
| Promo Eletrodomésticos | geladeira, ar-condicionado | air fryer (8.100), máquina de lavar, micro-ondas, fogão, ventilador (verão) |
| Promo Tênis | tenis | tênis de corrida, tênis feminino, chinelo/sandália (verão) |
| Promo Perfumes | perfume | kit de perfume para presente (Natal), perfume masculino/feminino separados |
| Promo Fit | whey | creatina (página própria se tiver volume) |
| Promo Bebês | fraldas | fralda por marca/tamanho como seções; lenço umedecido |

**Gatilho de cada página nova (os três):** volume ≥ 5 mil/mês no Planejador; o feed do grupo traz
≥ 3 ofertas por dia do produto; respostas das IAs levantadas. Cada página nasce com 3 links internos,
FAQ no HTML do servidor e IndexNow no dia.

### 2.2 Calendário: estar pronto antes do pico

| Janela | Termos (já com dado) | O que fazer |
|---|---|---|
| até 27/11 | black friday tv / geladeira (60.500 em nov) / ar condicionado (27.100 em nov) | Reforço nas páginas que existem; nada de página nova depois de ~20/11 |
| 28/11 a 24/12 | Natal: perfume, brinquedos (hipótese), kits de presente | Contagem trocada para Natal (painel). Página de brinquedos só com dado |
| dezembro | ar condicionado em promoção (33.100 em dez, o dobro de nov) | Ar-condicionado é a página nº 1 de dezembro |
| jan a fev | volta às aulas: notebook, material escolar, mochila (hipótese) | Validar no Trends em dezembro |

### 2.3 Fora do Google (onde está a maior parte dos leads)

1. **Quadro "Por fonte" da Captação** (pedido para 17/11): diz quanto vem de ChatGPT, Bing, diretórios,
   Instagram. O esforço da semana seguinte vai para a fonte que mais traz.
2. **Bing Webmaster**: o ChatGPT busca pelo Bing. Ver se as páginas de grupo estão no top 10 lá.
3. **Diretórios citados pelo ChatGPT** (gruposwhats.app, gruposwhatsapp.com): cadastrar todos os grupos
   de nicho com o link do `/entrar` de origem própria.
4. **Rodada de IA** com as perguntas-alvo de cada grupo (lista na seção 5).

### 2.4 Anúncio: só se o membro custar menos do que vale

A campanha do Ads deu o custo por clique real de cada termo. Com a taxa clique → membro (~50%) e o valor
de um membro (comissão do mês ÷ membros), sai a conta:

**custo por membro = CPC ÷ taxa do site (clique no botão ÷ visita) ÷ 0,5**

Se o custo por membro de algum termo for menor que o valor do membro, esse termo vale escalar. Os outros
param. A conta só fecha com os dados da seção 5.

---

## 3. Prioridade 2: grupos novos em produtos que vendem muito

### 3.1 Por que a TV deu certo (o padrão a copiar)

1. Busca "[produto] em promoção" com 10–100 mil por mês
2. Tíquete alto: comissão boa por venda, e a pessoa compara preço antes de comprar
3. Produto comparável (modelos, marcas, tamanhos): dá para escrever guia útil (tabela, preço por polegada)
4. Pico sazonal previsível + busca o ano todo
5. Oferta em quantidade nos grupos espelhados
6. Pouca gente com página boa para "grupo de promoção de [produto]" nas IAs

### 3.2 Candidatos (hipóteses, ordenadas pelo padrão acima)

| Candidato | Por que pode dar certo | Risco | Grupo novo ou porta de um existente? |
|---|---|---|---|
| **Colchão** | tíquete alto, compara marca/tamanho, vende muito no Mercado Livre e Amazon | frete e devolução | grupo novo "Promo Casa" (colchão, cama, sofá, panelas) |
| **Pneu** | tíquete alto, compra planejada, busca por medida (ex. "pneu aro 15") | público diferente do atual | grupo novo "Promo Auto e Moto" |
| **Ferramentas** (parafusadeira, furadeira, lavadora de alta pressão) | Mercado Livre/Amazon fortes, presente de Natal e Dia dos Pais | volume a confirmar | grupo novo ou dentro do "Promo Casa" |
| **Ração e pet** | compra **repetida todo mês**: o membro fica mais tempo no grupo | tíquete médio, margem baixa | grupo novo "Promo Pet" (já existe loja pet com clique) |
| **Brinquedos** | pico no Natal e no Dia das Crianças | sazonal demais | página sazonal ligada ao Promo Bebês |
| **Maquiagem e skincare** | Shopee e marcas com comissão de até 20% (Nina Makeup) | tíquete baixo | ampliar o Promo Salão para "Promo Beleza" |
| **Supermercado** (café, cerveja, limpeza) | frequência alta, Amazon e Mercado Livre | comissão baixa | grupo novo só se o feed tiver volume |
| **Notebook** | volta às aulas, tíquete alto | já cabe no Tech Nerd | **porta** do Tech Nerd, não grupo |
| **Air fryer, lavadora** | volume alto | já cabe no Eletrodomésticos | **porta** do Eletrodomésticos |

**Regra para abrir grupo novo:** só quando o produto não cabe num grupo que já existe. Grupo novo divide a
audiência e a manutenção; porta nova soma ao grupo que já tem gente.

**Gatilho para abrir (os quatro):** (1) "[produto] em promoção" ≥ 10 mil/mês; (2) Espelha Grupos tira
≥ 10 ofertas/dia do tema; (3) comissão por venda ≥ a média dos grupos atuais; (4) as IAs não citam um
concorrente forte para "grupo de promoção de [produto]".

---

## 4. Prioridade 3: venda de afiliado pelos cupons

### 4.1 Primeiro medir (pré-requisito, código)

Hoje o clique no cupom não sai do navegador do visitante. Proposta, no mesmo modelo do `/entrar`:
- O botão do cupom passa por um redirecionamento próprio (ex.: `/ir/<id do cupom>`), que grava loja,
  página de origem, fonte da visita e aparelho, e manda para o link de afiliado salvo no banco
  (nunca um destino vindo da URL: redirecionamento aberto).
- Aba "Cliques em cupom" no painel: por loja, por página, por fonte.
- `rel="sponsored nofollow"` mantido; o mesmo HTML para navegador e robô.

Sem isso, qualquer escolha de palavra-chave de cupom é chute.

### 4.2 Escolher as lojas certas (depois de medir)

As grandes (Amazon, AliExpress, Casas Bahia, KaBuM) estão na posição 60 a 90: os sites grandes de cupom
dominam. O caminho é a **cauda**:
- Lojas médias onde já estamos perto: "desconto china in box" (7,5), Casa das Alianças (21).
- Lojas com comissão alta e pouca concorrência no "cupom [loja]" (a lista sai do Planejador + painel
  do Lomadee/Awin).
- Termos de intenção imediata: "cupom [loja] primeira compra", "cupom frete grátis [loja] hoje".
- Ligar a loja ao grupo de nicho (já é a regra): quem chega pelo cupom da KaBuM vê o Promo Tech Nerd.

---

## 5. O que preciso da Flávia (com o Ads, ficou fácil)

### A. Google Ads (o mais valioso; ~15 minutos)

1. **Relatório de termos de pesquisa** da campanha inteira, exportado em planilha: Campanhas →
   Insights e relatórios → **Termos de pesquisa** → período todo → Download (CSV). Colunas: termo,
   impressões, cliques, CTR, CPC médio, conversões. É a lista do que as pessoas digitaram de verdade.
2. **Relatório de palavras-chave** da campanha (mesmo caminho, "Palavras-chave de pesquisa").
3. **Informações do leilão** (Auction insights): quem disputa os mesmos termos. São os concorrentes.
4. **Planejador de Palavras-chave com números exatos** (agora que há gasto, ele mostra o número e não a
   faixa): "Descobrir novas palavras-chave" → colar as sementes abaixo → Brasil, português, últimos
   12 meses → Download com a série mensal.

   **Lote 1, portas dos grupos atuais (P1):**
   `celular em promoção`, `samsung em promoção`, `motorola em promoção`, `xiaomi em promoção`,
   `notebook em promoção`, `ps5 promoção`, `placa de video promoção`, `monitor gamer promoção`,
   `fone bluetooth promoção`, `smartwatch promoção`, `air fryer promoção`, `maquina de lavar promoção`,
   `micro-ondas promoção`, `ventilador promoção`, `tenis de corrida promoção`, `tenis feminino promoção`,
   `chinelo promoção`, `kit perfume presente`, `creatina em promoção`, `smart tv 50 polegadas promoção`,
   `esmalte em promoção`

   **Lote 2, grupos novos (P2):**
   `colchão em promoção`, `pneu em promoção`, `parafusadeira promoção`, `ferramentas em promoção`,
   `ração em promoção`, `brinquedos em promoção`, `maquiagem em promoção`, `skincare promoção`,
   `sofá em promoção`, `panela promoção`, `cerveja promoção`, `café em promoção`

   **Lote 3, home e grupos gerais:**
   `grupo de ofertas whatsapp`, `grupo de promoção whatsapp`, `grupo de achadinhos`, `promoções do dia`,
   `ofertas de hoje`, `achadinhos shopee`, `achadinhos amazon`, `link grupo de promoção`

   **Lote 4, cupons (P3):** as 30 lojas com cupom ativo e comissão mais alta no painel de afiliado
   (sementes `cupom [loja]`).
5. **Conversões**: quantos cliques do anúncio viraram "Entrar no grupo" (o `gclid` já é gravado no `/entrar`).

### B. Grupos e dinheiro (5 minutos)

6. **Membros de cada grupo hoje** e entradas da última semana (Link Inteligente).
7. **Comissão do último mês por grupo** (ou por loja/plataforma, se não der por grupo). Daqui sai quanto
   vale um membro e quais produtos pagam melhor.
8. **Quais temas o Espelha Grupos mais recebe** por dia (contagem por palavra, ou os grupos espelhados
   com mais ofertas). Grupo novo sem oferta não se sustenta.

### C. Busca orgânica e IA (10 minutos)

9. **Captação → "Por fonte"**, últimos 7 dias.
10. **Search Console → Desempenho → Pesquisa**, últimos 28 dias: consultas e páginas (exportar).
11. **Bing Webmaster → Desempenho de pesquisa**, 28 dias.
12. **Google Trends** (Brasil, 5 anos, comparação): `colchão`, `pneu`, `ração`, `brinquedos`, `notebook`.
13. **ChatGPT e Perplexity**, com print das fontes citadas:
    - "tem grupo de promoção de colchão / pneu / ração / ferramentas no WhatsApp?"
    - "melhor grupo de promoção de celular no WhatsApp"
    - "onde achar promoção de notebook / air fryer hoje"
    - "grupo de ofertas no WhatsApp é confiável?"

### D. Decisões (sim ou não)

14. Posso fazer o **medidor de clique em cupom** (seção 4.1)? Ele muda o link do botão de cupom.
15. Topa **mais de um grupo por mês** se os gatilhos baterem, ou prefere crescer só portas dos grupos atuais?
16. A **home** pode deixar de mirar "cupons de desconto" e mirar ofertas/grupo, se os dados confirmarem?

---

## 6. Ordem de execução

| Quando | O quê | Depende de |
|---|---|---|
| 12 a 14/11 | Flávia manda A, B e C | — |
| 14/11 | Claude cruza os dados e devolve a tabela final: página × termo novo × motivo | A, B, C |
| 15 a 20/11 | Ajuste de títulos/H1/seções das páginas que já convertem; portas novas que batam o gatilho (máx. 4 antes da Black Friday) | tabela final |
| 15 a 20/11 | Medidor de clique em cupom no ar | decisão 14 |
| 21 a 30/11 | Black Friday: só reforço e IndexNow, nada novo | — |
| 01 a 05/12 | Natal e ar-condicionado; 1º grupo novo da prioridade 2, se bater o gatilho | dados do lote 2 |
| semanal | Quadro "Por fonte" + membros → mover esforço para o que mais traz | — |

## Fontes de mercado

- Categorias mais vendidas online no Brasil (moda, eletrônicos e celulares, beleza, casa, alimentos):
  [Loggi](https://www.loggi.com/conteudos/empreendedorismo/produtos-que-mais-vendem-na-internet/),
  [Loja Integrada](https://lojaintegrada.com.br/hub/produtos-mais-vendidos-na-shopee/)
- Participação: Mercado Livre ~13,9%, Shopee ~10,4%, Amazon ~7,5%:
  [Nubimetrics](https://academia.nubimetrics.com/br/tendencias-mercado-para-acompanhar)
- Comissão de afiliado (blogs, confirmar nos painéis oficiais): Amazon 1% a 10% por categoria
  ([Cupom Online](https://www.cupomonline.com.br/afiliado-amazon-vale-a-pena/)); Mercado Livre até 16% em
  beleza, esportes, roupas e calçados ([Divulga Ninja](https://www.divulganinja.com.br/blog/quanto-mercado-livre-paga-afiliados-comissoes));
  Nina Makeup até 20% ([Mercado & Consumo](https://mercadoeconsumo.com.br/12/08/2026/destaque-do-dia/nina-makeup-lanca-programa-de-afiliados-com-comissao-de-ate-20/))

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

---

## 7. Revisão de 12/11 (noite): Planejador com números exatos, Captação e Link Inteligente

Dados da Flávia: 4 planilhas do Planejador (21.924 termos, Brasil, nov/2025 a out/2026, série mensal),
Captação de 7 dias e painel do Link Inteligente. Decisões: **sim** para o medidor de clique em cupom,
para mais de um grupo por mês e para a home deixar de mirar só "cupons de desconto".

### 7.1 Urgente: o Promo Eletrodomésticos não leva ninguém

O link `promo-eletrodomesticos` está **sem grupo** ("Falta adicionar um grupo"). Quem clica em
`/ofertas/geladeira` e `/ofertas/ar-condicionado` não entra em lugar nenhum. Correção (1 minuto):
Link Inteligente → PROMO ELETRODOMÉSTICOS → "Grupo para adicionar" → PROMO ELETRODOMÉSTICOS → Adicionar.

### 7.2 De onde vem o lead: o ChatGPT

**466 cliques em 7 dias** (66,6 por dia; eram 362 na semana anterior, +29%).

| Fonte (cliques com fonte medida) | Cliques | Parte |
|---|---|---|
| **ChatGPT** | **151** | **65%** |
| Sem JavaScript (provável robô) | 50 | 21% |
| Direto (WhatsApp, app, favorito) | 22 | 9% |
| Gemini | 4 | 2% |
| Google | 4 | 2% |
| Outro buscador | 3 | 1% |

Outros 232 cliques são de antes da medição. Google Ads: 0 cliques no botão.

1. **O ChatGPT traz dois terços dos leads; o Google, 2%.** O canal que mais cresce é a resposta da IA.
   As páginas que o ChatGPT cita são as de **grupo** ("grupo de promoção de celular", "pc gamer") e o
   diretório `/grupos-de-promocao`, que em uma semana virou a **4ª página em cliques (42)**.
2. Por isso as páginas de grupo **não mudam de título** (celular, pc-gamer, manicure): é o que a IA cita.
3. O Google é a aposta de médio prazo. É lá que estão os volumes grandes ("celular em promoção" 90.500),
   e quem os pega são as páginas **de ofertas** por produto.

### 7.3 Clique vira membro? Menos do que parecia

| Grupo | Membros 10/11 | Membros 12/11 | Cliques no link (7 dias) |
|---|---|---|---|
| Promo Tech (PC gamer) | 49 | 63 | 83 |
| Promo Celular | 55 | 64 | 89 |
| Promo Tênis | 26 | 37 | 64 |
| Promo TV | 17 | 25 | 38 |
| Promo Fit (whey) | 8 | 13 | 20 |
| Promo Perfumes | 9 | 12 | 28 |
| Promo iPhone | 11 | 12 | 14 |
| Promo Salão / Bebês / Festas | 10 / 9 / 23 | 10 / 9 / 23 | 8 / 4 / 2 |
| Ofertas Fafaciane (geral) | 199 | 202 | 102 |

São +54 membros em 2 a 3 dias, ou cerca de 20 por dia, contra cerca de 64 cliques por dia no Link
Inteligente. Isso dá **entre 25% e 35% de clique virando membro**, já descontando quem saiu. Não é a
metade a dois terços estimada em 10/11.

**Leitura:** de cada 3 pessoas que clicam, 2 não ficam no grupo. Melhorar a tela do convite (nome, foto e
descrição do grupo, a primeira mensagem fixada) é mais barato que trazer mais visitas. Para medir: anotar
os membros de cada grupo **todo dia no mesmo horário** por uma semana.

### 7.4 O que o Planejador mostrou

**"Grupo de…" quase ninguém busca no Google.** Todas as variações de "grupo de promoção/ofertas
whatsapp" somam ~6 mil por mês. "Celular em promoção" sozinho tem 90 mil. A pessoa busca **o produto**.

| Tema (variações somadas sem repetir) | Busca/mês | Nov/25 | Dez/25 | Lance máx. (R$) | Grupo |
|---|---|---|---|---|---|
| **Celular** (em promoção 90.500, barato 90.500, bom e barato 49.500, Samsung barato 22.200) | ~590 mil | 650 mil | 613 mil | 1,40 | Promo Celular |
| **Tênis** (masculino 60.500, feminino 40.500, promoção 40.500, Nike 14.800, Adidas 12.100) | ~438 mil | 598 mil | 427 mil | 1,09 | Promo Tênis |
| **Pneu** (em promoção 5.400; por medida, ex. 175/70 R14 3.600; cupom Pneustore 9.900) | ~144 mil | 198 mil | 167 mil | **3,64** | — (novo) |
| **Máquina de lavar** (roupa 12.100, em promoção 9.900, lava e seca 6.600) | ~68 mil | 80 mil | 53 mil | 2,74 | Eletrodomésticos |
| **Notebook** (em promoção 22.200) | ~54 mil | 63 mil | 36 mil | 2,11 | Tech Nerd |
| **Micro-ondas** (promoção 18.100) | ~42 mil | 61 mil | 40 mil | 1,98 | Eletrodomésticos |
| **TV** (50 polegadas 6.600; "tv em promoção" já medido em 23/10) | ~39 mil | 51 mil | 33 mil | 1,78 | Promo TV |
| **Ventilador** (na promoção 8.100 → **27.100 em dez**) | ~36 mil | 49 mil | **110 mil** | 0,91 | Eletrodomésticos |
| **Sofá** (em promoção 12.100 → 22.200 em nov) | ~36 mil | 62 mil | 35 mil | 1,56 | — (novo) |
| Café, cafeteira e cápsulas (Dolce Gusto 3.600 + 3.600) | ~31 mil | 44 mil | 26 mil | 3,82 | — (novo) |
| Air fryer (promoção 8.100 → 14.800 em nov) | ~30 mil | 55 mil | 28 mil | 1,18 | Eletrodomésticos |
| Colchão (casal 4.400, solteiro 3.600 + 2.900) | ~24 mil | 32 mil | 26 mil | 2,59 | — (novo) |
| Havaianas/chinelo (havaianas promoção 4.400 → 12.100 em dez) | ~21 mil | 44 mil | 47 mil | 0,88 | Promo Tênis |
| **PS5** (promoção 9.900, **+124% no ano**) | ~21 mil | 33 mil | 23 mil | 1,46 | Tech Nerd |
| iPhone (mais barato 6.600) | ~16 mil | 17 mil | 16 mil | 1,38 | Promo iPhone |
| Ferramentas (1.900, +85% no ano) | ~12 mil | 15 mil | 12 mil | 1,06 | — |
| Maquiagem (4.400, +50% no ano) | ~6 mil | 9 mil | 6 mil | 1,87 | Promo Salão |
| Brinquedos (3.600, +128% em 3 meses) | ~6 mil | 7 mil | 8 mil | 0,76 | Promo Bebês |
| Ração (720) | ~5 mil | 5 mil | 4 mil | 7,12 | — |
| Esmalte (1.900, +46% no ano) | ~3 mil | 4 mil | 3 mil | 1,14 | Promo Salão |

Notas:
- "promoções de panelas de pressão" aparece com 301 mil. É erro do Planejador: "panela de pressão
  promoção" tem 3.600. Ficou fora da conta.
- **A forma de escrever muda tudo:** "colchão em promoção" tem só 210, mas "colchao de casal promoção"
  tem 4.400. "Iphone em promoção" quase some diante de "iphone mais barato". O título usa a forma que a
  pessoa digita.
- O **lance máximo** é o quanto os anunciantes pagam pelo clique: mostra quanto vale a venda. Pneu
  (R$ 3,64), cafeteira (R$ 3,82) e máquina de lavar (R$ 2,74) valem mais por clique que tênis (R$ 1,09).

### 7.5 Prioridade 1: o que já mudou (este PR) e o que vem

**Feito neste PR** (`20261112150000_palavras_chave_ads.sql` + código):

| Página | Antes | Depois | Por quê |
|---|---|---|---|
| Home (título do painel, `index.html` e HTML do servidor iguais) | Cuponito - Cupons de Desconto Verificados | **Promoções do Dia e Cupons de Desconto** | "promoções do dia", "ofertas do dia" e "ofertas hoje" com 2.400 cada; a home passa a linkar todas as páginas de ofertas e de grupo |
| Lojas (React e servidor iguais) | Cupom de Desconto X \| Até 80% OFF – mês | **Cupom de Desconto X Hoje** | "cupom X hoje" cresce: Amazon +646%, AliExpress +967%, Americanas +175%; "Até 80% OFF" não era verdade para toda loja |
| `/grupo-whatsapp/principal` | Grupo de Ofertas e Promoções | **Grupo de Promoção e Ofertas** | "grupo de promoção whatsapp" 2.900 > "de ofertas" 1.300 |
| `/ofertas/tenis` | Nike, Adidas, corrida e feminino | **masculino e feminino** + seções masculino/feminino e marcas | masculino (60.500) é o maior termo e não estava no título |
| `/ofertas/tv` | — | seção **TV 50 polegadas** | 6.600 + variações |
| `/ofertas/iphone` | ofertas de iPhone novo | **iPhone Mais Barato** | 6.600 contra 880 |
| `/grupo-whatsapp/shopee` | Grupo de Achadinhos da Shopee | **Achadinhos da Shopee: grupo** | "achadinhos da shopee" 12.100 contra 480 |

**Próximas portas para grupos que já existem** (até 20/11, para pegar a Black Friday). Todas têm o volume;
falta confirmar oferta no feed e a resposta da IA (seção 7.8):

| Página nova | Grupo | Busca principal | Novembro |
|---|---|---|---|
| `/ofertas/celular` | Promo Celular | celular em promoção 90.500; celular bom e barato 49.500; Samsung barato 22.200 | 110 mil |
| `/ofertas/notebook` | Promo Tech | notebook em promoção 22.200 | 27 mil |
| `/ofertas/microondas` | Eletrodomésticos | micro ondas promoção 18.100 | 27 mil |
| `/ofertas/maquina-de-lavar` | Eletrodomésticos | máquina de lavar roupa promoção 12.100 + em promoção 9.900 + lava e seca 6.600 | 27 mil |
| `/ofertas/ps5` | Promo Tech | ps5 promoção 9.900 (+124% no ano) | 15 mil |
| `/ofertas/ventilador` (até 01/12) | Eletrodomésticos | ventilador na promoção 8.100 → 27.100 em dezembro | pico em dez |

`/ofertas/celular` é a maior oportunidade do site: o Promo Celular já é o 2º grupo em cliques, e a página
de ofertas pega a busca de produto sem mexer na página do grupo, que é a que o ChatGPT cita.

### 7.6 Prioridade 2: grupos novos

| Grupo novo | Páginas | Busca | Por que sim | Risco |
|---|---|---|---|---|
| **1. Promo Casa** | `/ofertas/sofa`, `/ofertas/colchao`, depois panelas e cafeteira | sofá 12.100 (22.200 em nov); colchão casal + solteiro ~11 mil; Dolce Gusto 7.200; jogo de panelas 2.400 | ~100 mil por mês somando, lances de R$ 1,56 a 3,82, Casas Bahia, Magalu e Mercado Livre | frete de móvel; precisa de ≥ 10 ofertas por dia |
| **2. Promo Auto (pneus)** | `/ofertas/pneu`, com tabela por aro e medida | pneu em promoção 5.400; ~144 mil somando as medidas; cupom Pneustore 9.900 | **clique mais valioso do estudo (R$ 3,64)**, compra planejada, busca o ano todo | público novo para os grupos; oferta precisa ter a medida no título |

Não vale abrir agora:
- Cerveja (9.900, 18.100 em dez): a maior parte é de mercado local (Atacadão, Assaí), sem afiliado.
- Ração (720), ferramentas (1.900), smartwatch (880), monitor (480): pouco volume.
- Brinquedos (3.600) e maquiagem (4.400) não precisam de grupo próprio: viram páginas de grupos que já
  existem (Promo Bebês no Natal; Promo Salão, que está parado com 10 membros e pode virar **Promo Beleza**).

### 7.7 Prioridade 3: cupons

**Feito:** medidor de clique em cupom (`/ir`, aba **Cliques em cupom**, migration
`20261112120000_coupon_clicks.sql`). Mostra o clique por loja, página, botão e fonte, igual à Captação.

Buscas de cupom com mais volume no estudo: **Pneustore 9.900**, **Magalu hoje 8.100**, **Amazon hoje 3.600
(+646%)**, **Havaianas 3.600** (12.100 em nov/25), **Boticário hoje 2.900**, Achei Pneus 1.600, Motorola
1.600, KaBuM hoje 1.000, Americanas hoje 880.

Ordem, depois de 7 dias de medidor:
1. Ver na aba quais lojas recebem clique e cruzar com a comissão da rede.
2. Garantir cupom ativo e página caprichada para **Pneustore** (liga com o Promo Auto), **Havaianas**
   (verão) e **Boticário** (Natal), se tiverem programa de afiliado.
3. Loja grande (Amazon, Magalu) continua com pouca chance no Google: o tráfego vem pelos grupos.

### 7.8 O que preciso da Flávia agora

**Hoje (5 minutos)**
1. **Adicionar o grupo ao link do Promo Eletrodomésticos** (7.1).
2. Rodar no SQL Editor: `20261112120000_coupon_clicks.sql` e `20261112150000_palavras_chave_ads.sql`.
3. Mesclar o PR.

**Para as páginas novas (até 14/11; o ChatGPT é 65% dos leads)**
4. **ChatGPT**, com print das fontes citadas, para cada pergunta:
   - "onde achar celular em promoção hoje?" e "qual celular bom e barato comprar na Black Friday?"
   - "tem grupo de promoção de notebook no WhatsApp?" e "onde achar notebook em promoção?"
   - "tem grupo de promoção de PS5 no WhatsApp?"
   - "onde achar micro-ondas e máquina de lavar em promoção?"
   - "tem grupo de promoção de móveis / sofá / colchão no WhatsApp?"
   - "tem grupo de promoção de pneus no WhatsApp?"
5. **Espelha Grupos:** quantas ofertas por dia chegam de celular, notebook, PS5, micro-ondas, máquina de
   lavar, sofá/colchão e pneu. Uma página só entra com ≥ 3 por dia do produto, e um grupo novo com ≥ 10.

**Decisões**
6. Promo Casa e Promo Auto: abrir se o feed tiver oferta?
7. Promo Salão → Promo Beleza (maquiagem + esmalte + salão)?
8. Google Ads: a campanha gastou? Se vai continuar, o anúncio tem que apontar para as páginas do site
   (a Captação contou 0 cliques vindos de anúncio).

### 7.9 Metas revistas

| Data | Meta | Medida |
|---|---|---|
| 19/11 | 6 portas novas no ar (7.5) | — |
| 30/11 | ≥ 1.000 cliques por semana no botão | Captação |
| 30/11 | ≥ 35% de clique virando membro | membros/dia × cliques |
| 31/12 | ≥ 1.500 membros somando os grupos de nicho (hoje: 268) | Link Inteligente |
| 31/12 | Promo Casa no ar com ≥ 100 membros | Link Inteligente |

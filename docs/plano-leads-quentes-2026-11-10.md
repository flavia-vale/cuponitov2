# Leads quentes para os grupos: estado em 10/11/2026 e plano até a Black Friday

Revisão do `plano-black-november-2026-10-30.md` com os dados que a Flávia mandou em 09/11:
aba **Captação do grupo** (7 dias), Search Console **"Desempenho nos recursos de IA generativa"**
(3 meses) e o relatório **"Detectada, mas não indexada"** (75 páginas).

Amanhã é o **11.11**. A Black Friday é **sex 27/11** (faltam 17 dias). Valem as regras de sempre: captação
por SEO e GEO, nada de página nova sem os dados de busca e de IA (CLAUDE.md), todo botão pelo `/entrar`.

---

## 1. Mercado

| Fato | Fonte | O que tiramos dele |
|---|---|---|
| E-commerce deve faturar **R$ 13,3 bi** de 26 a 29/11, **+20,7%** sobre 2025 | Confi Neotrust / E-Commerce Brasil (out/26) | A Black Friday deste ano é maior que a de 2025. A procura por "promoção" sobe junto |
| **Mais pedidos com tíquete menor**: em 2025 os pedidos subiram 28% e o tíquete caiu 12,8% | Confi Neotrust | Gente comprando muita coisa e caçando preço. É o perfil de quem entra em grupo de ofertas |
| **47%** pretendem comprar na Black Friday 2026 (43% em 2025) | pesquisa Esquenta Black Friday, Globo | Mais gente decidida a comprar |
| **Eletrônicos, vestuário e celulares** lideram a intenção de compra | mesmas fontes | São exatamente os nossos 4 grupos que mais recebem clique (celular, PC/TV, tênis) |
| O pico de busca é **só novembro**: "black friday tv" vai de 10 para 100 e volta a 11 em dezembro | Google Trends, 30/10 | O que não estiver pronto até ~20/11 perde a janela. Depois de 01/12, o assunto é Natal |

Fontes: [Meio & Mensagem](https://www.meioemensagem.com.br/marketing/black-friday-deve-movimentar-r-133-bi-no-e-commerce),
[Gironews](https://gironews.com/varejo-digital/black-friday-2026-deve-movimentar-r-133-bilhoes-no-e-commerce-nacional/),
[Mercado & Consumo](https://mercadoeconsumo.com.br/21/10/2026/artigos/o-que-devemos-esperar-da-black-friday-em-2026/),
[Central do Varejo](https://centraldovarejo.com.br/black-friday-2026-data-faturamento-e-preparacao-do-varejo/).

## 2. Os leads que estão chegando (Captação, 03 a 09/11)

**362 cliques em "Entrar no grupo" em 7 dias (51,7 por dia, 69% pelo celular).** Em 18/10 eram
**5 cliques em 7 dias**. Em três semanas o botão passou a receber 70 vezes mais cliques.

### 2.1 Para onde vão

| Página | Cliques | Grupo | No ar desde |
|---|---|---|---|
| `/grupo-whatsapp/celular` | 80 | Promo Celular | 23/10 |
| `/grupo-whatsapp/pc-gamer` | 60 | Promo Tech Nerd | 23/10 |
| `/ofertas/tenis` | 43 | Promo Tênis | 30/10 |
| `/ofertas/tv` | 24 | Promo TV | 30/10 |
| `/grupo-whatsapp/amazon` | 18 | geral | 18/10 |
| `/ofertas/perfume` | 12 | Promo Perfumes | 31/10 |
| `/ofertas/iphone` | 9 | Promo iPhone | 23/10 |
| outras (achadinhos, manicure, shein, whey, lojas…) | ~116 | — | — |

Leitura:
1. **Quatro páginas fazem 57% dos cliques** (207 de 362), e são as quatro do tema que lidera a Black Friday
   (celular, PC, TV, tênis). A tese de 30/10 ("70% do esforço no que já converte") se confirmou.
2. **Tênis e TV, com 10 dias de vida, já são 3º e 4º.** Página de ofertas de produto com volume de busca alto
   funciona rápido.
3. **Perfume (12 em 9 dias)** começou bem para uma página de 31/10. É o tema do Natal (seção 4, frente D).
4. **iPhone só 9**: o Promo iPhone posta ~2 ofertas por semana e a página fica vazia na maior parte dos dias.
   Página sem oferta não convence.

### 2.2 De onde vem o clique: o que é certo e o que é dúvida

| Origem | Cliques | O que é |
|---|---|---|
| `group_page` + `offers_page_top` + outros do React | ~236 (65%) | Pessoa com o site carregado, clicando no botão. **Lead real.** |
| `html_*` (HTML do servidor) | ~126 (35%) | Clique antes de o React montar, ou robô que se identifica como navegador |

**Sinal de alerta:** `/desconto/cupom-desconto-dr-dog-cosmeticos-pet`, `…-kabum-br` e `…-livrarias-curitiba`
têm **exatamente 6 cliques cada**, e duas delas estão na lista "Detectada, mas não indexada" (o Google não
manda ninguém para lá). O filtro de robô do `/entrar` (`isLikelyBot`) barra quem diz "bot" no nome, mas não
barra ferramenta de SEO ou agente de IA que usa nome de navegador. **Parte dos `html_store` deve ser robô.**
Conta conservadora: **~240 a 300 cliques reais por semana**.

**O que não sabemos e precisamos saber:**
- **De onde a pessoa veio** (Google, Bing, ChatGPT, diretório, Instagram). O `/entrar` não grava isso.
  Sem esse dado, não dá para saber se o crescimento é do Google, do ChatGPT ou dos diretórios, nem onde
  pôr o próximo esforço.
- **Quantos entraram de fato.** Clique não é entrada. O número sai do painel do Link Inteligente.
- **Google Ads: 0 cliques de anúncio.** A campanha de teste (R$ 30/dia de 10/11 a 30/11) não está
  rodando, ou o anúncio não manda para as páginas com `gclid`.

## 3. Google: o que o Search Console diz

### 3.1 Recursos de IA (Visão geral de IA e Modo IA)

**108 impressões em 3 meses, quase todas depois de 22/10** (de 0 por dia para 3 a 12 por dia).
Começou no dia em que as páginas de nicho foram ao ar.

| Página | Impressões na IA do Google |
|---|---|
| `/grupo-whatsapp/pc-gamer` | 42 |
| `/blog/grupo-de-ofertas-whatsapp-e-confiavel` | 23 |
| `/grupo-whatsapp/manicure` | 16 |
| `/grupo-whatsapp/shein` | 7 |
| home | 5 |

Leitura: é pouco, mas é o **primeiro sinal de que a IA do Google cita o Cuponito**, e cita as páginas
de grupo de nicho. O 2º lugar é o post **"grupo de ofertas é confiável?"**: a dúvida de confiança aparece
na IA. Isso reforça o bloco de fatos (só admins postam, grátis, sair quando quiser, de onde vêm as ofertas)
em todas as páginas de grupo.

### 3.2 "Detectada, mas não indexada": 75 páginas

O Google achou e **nem rastreou** (último rastreamento "N/D"). Quando ele faz isso com dezenas de páginas,
é porque julga que o site tem muita página parecida e de pouco valor, e reduz a visita do robô. Isso
atrasa também as páginas boas (como `/achadinhos-hoje`, que está na lista).

O que tem na lista:

| Tipo | Exemplos | Problema |
|---|---|---|
| Categorias em inglês vindas da Lomadee | `animals`, `food-and-beverages`, `health`, `promotions`, `shopping`, `sports`, `wellness`, `infant-products` | Duplicam as em português (`animals` × `animais`) e o nome não é o que o brasileiro digita |
| Lojas de teste | `cupom-desconto-lomadee-teste`, `…-loja-lomadee`, `…-loja-lomadee-6fe8dae4-…` (com UUID no endereço) | Não deviam existir em público |
| Lojas sem cupom ou com cupom velho | Coza, Grendene, Kappesberg, Skeptic… | Página fina: nome da loja e nada |
| Grandes sem conteúdo próprio | Shopee, Mercado Livre, Nike, Adidas | Concorrência alta; sem cupom ativo, não tem por que ranquear |

**Causa no código:** o `api/sitemap.ts` manda ao Google **todas** as categorias e **todas** as lojas ativas,
sem olhar se têm cupom. O prerender da loja e da categoria não marca `noindex` quando a página está vazia
(só a página de ofertas faz isso).

## 4. Plano até 30/11

### Frente A: medir de onde vem o lead (código, até 12/11). **Primeiro.**

1. O `/entrar` passa a gravar **só o domínio** de quem mandou a pessoa (`referrer_host`: `google.com`,
   `bing.com`, `chatgpt.com`, `gruposwhats.app`, `instagram.com`…). Sem URL completa, sem IP, sem
   identificar a pessoa. Migration com coluna nova e `tryQuery` com fallback (regra do prerender).
   Detalhe: o navegador só manda o domínio de origem para o `/entrar` se a página guardar o
   `document.referrer` da chegada; o React grava isso na primeira página da visita e passa no link.
2. Aba Captação ganha o quadro **"Por fonte"**.
3. Endurecer o filtro de robô: clique `html_*` sem `Accept-Language` ou de navegador sem suporte a JS
   conta à parte ("suspeito"), em vez de somar no total.

Resultado: na semana do 11.11 já dá para dizer "o ChatGPT trouxe X, o Google Y, os diretórios Z".

### Frente B: limpar o que o Google não quer (código + painel, até 14/11)

1. **Sitemap:** só lojas com cupom ativo e categorias com cupom ativo e nome em português.
2. **Prerender:** loja ou categoria sem cupom ativo sai com `noindex, follow` (como a página de ofertas vazia).
   A página continua no ar para quem chega; só não pede para o Google indexar.
3. **Painel (Flávia):** desativar as lojas de teste (`lomadee-teste`, `loja-lomadee` e as duas com UUID) e
   juntar as categorias em inglês nas em português (renomear `animals` para `Animais` move os cupons, regra
   do `AdminCouponCategoriesTab`). O Claude manda a lista exata de pares.
4. Depois: 301 das categorias em inglês para as em português.

Por quê: menos páginas fracas = o Google volta a rastrear o site, e as páginas de grupo e de ofertas
(as que trazem lead) entram mais rápido. Não traz lead amanhã; protege as próximas 4 semanas.

### Frente C: espremer as 4 páginas que convertem (conteúdo, de 11 a 20/11)

As páginas de celular, PC gamer, tênis e TV recebem 57% dos cliques. Cada melhoria nelas vale mais que
uma página nova.

1. **Resumo do 11.11 no dia 12/11** em cada uma: "No 11.11 o grupo mandou N ofertas; a melhor foi
   X por R$ Y". Dado real do feed, com data visível. Prova que o grupo entrega, e é texto novo para o
   Google e o Bing (IndexNow no mesmo dia).
2. **Contagem para 27/11** com data real nas 4 páginas (já previsto na Frente E de 30/10).
3. **Bloco de confiança** igual ao do post "é confiável?" (2º mais citado pela IA do Google) no topo das
   páginas de grupo: só admins postam, grátis, sai quando quiser, link de afiliado explicado.
4. **QR code no computador** (31% dos cliques são de desktop, e quem clica no computador muitas vezes não
   tem o WhatsApp Web aberto). Já previsto em 22/10, ainda não feito.
5. **iPhone:** a página fica vazia. Ou o Promo Celular manda as ofertas de iPhone também para o feed do
   iPhone, ou a página mostra as ofertas de iPhone dos últimos 30 dias (já é a regra) com destaque para
   a última. Decisão da Flávia.

### Frente D: leads mais quentes, quem já quer comprar (decisão da Flávia, a partir de 11/11)

O lead mais quente é quem busca **"black friday tv"**, **"tv em promoção"**, **"tenis em promoção"**: a pessoa
vai comprar este mês. Essas buscas têm 1–10 mil a 10–100 mil por mês e +900% em 3 meses (Planejador, 30/10).
No orgânico, uma página nova leva semanas para chegar nelas. O caminho rápido é o anúncio.

- **Google Ads, teste de R$ 30/dia de 11/11 a 30/11 (~R$ 600)**, só rede de pesquisa, para
  `/ofertas/tv`, `/ofertas/tenis`, `/grupo-whatsapp/celular` e `/grupo-whatsapp/pc-gamer`. A medição já está
  pronta desde 31/10 (`gclid` no `/entrar` + exportação de conversões na Captação). Hoje: 0 cliques de anúncio.
- Antes de ligar: a Flávia diz **quanto vale um membro** (comissão do mês ÷ membros). Se o membro custar
  mais que isso, para no dia 18/11.

### Frente E: GEO e diretórios (Flávia, contínuo)

1. **Diretórios de grupos** (gruposwhats.app, gruposbrasil, telegrupos): o ChatGPT cita esses sites quando
   perguntam por grupo de promoção de tênis, de whey e de Black Friday (rodada de 30/10). O kit está
   pronto em `docs/kit-diretorios-e-telegram-2026-10-30.md`. Cadastrar **Promo Tênis, Promo TV e Promo
   Celular primeiro**. Com a Frente A, dá para ver se os diretórios mandam gente.
2. **Rodada de IA em 20/11**: as mesmas perguntas de 30/10, para ver se o ChatGPT já cita o Cuponito para
   tênis e TV e se já usa o nome "Promo Celular".

### Frente F: o próprio grupo trazendo gente (decisão da Flávia, de 20 a 30/11)

Ainda sem resposta desde 30/10. Uma mensagem por dia nos grupos de celular, tech, TV e tênis:
"Black Friday chegando: encaminhe este grupo para quem vai comprar", com o link do `/entrar` de origem
`grupo_encaminhar` (para contar). Na Black Friday é quando mais gente encaminha oferta.

### Depois de 01/12: Natal

Perfume (12 cliques em 9 dias, "grupo de promoção de perfumes whatsapp" +900% no ano) vira a página do
Natal. Tênis segue (busca estável o ano todo). TV e celular voltam ao nível de outubro.

## 5. Metas

| Data | Meta | Se não bater |
|---|---|---|
| 12/11 | Frente A no ar; 1º dia com fonte do clique | — |
| 16/11 | ≥ 60 cliques reais por dia; sabemos a fonte de 80% | Ver qual fonte caiu |
| 20/11 | Rodada de IA; Frente B no ar; ≥ 3 diretórios com grupo cadastrado | Reforçar o bloco de fatos das páginas não citadas |
| 27 a 30/11 | ≥ 120 cliques reais por dia | Se o clique sobe e a entrada não, o problema é o convite do grupo (nome, foto, descrição) |
| 01/12 | Entradas por grupo × cliques; custo por membro do anúncio | Decidir a página de Natal e se o anúncio continua |

## 6. O que preciso da Flávia

**Números (5 minutos)**
1. Link Inteligente: **entradas por grupo nos últimos 7 dias** (Celular, Tech Nerd, TV, Tênis, Perfumes,
   iPhone, geral) e **membros de cada grupo hoje**.
2. Search Console → **Desempenho → Pesquisa** (não só IA), últimos 28 dias: consultas e páginas.
3. Bing Webmaster → Desempenho de pesquisa, últimos 28 dias (o ChatGPT busca pelo Bing).

**Decisões (sim ou não)**
4. Frente A e B: posso fazer o código? (gravar o domínio de origem; tirar loja e categoria vazias do Google)
5. Google Ads: ligar o teste de R$ 30/dia? Quanto vale um membro para você?
6. Diretórios: já cadastrou algum grupo? Quais?
7. Frente F (mensagem de encaminhar no grupo): sim ou não?
8. iPhone: juntar as ofertas de iPhone do Promo Celular no feed do Promo iPhone?

**Para o texto das páginas (regra do CLAUDE.md)**
9. Para o resumo do 11.11 e o bloco de confiança não preciso de termo novo. Para qualquer página nova
   (ex.: `/ofertas/notebook`, `/ofertas/celular`), preciso antes do Planejador e das respostas das IAs.

---

## 7. Revisão de 10/11: Link Inteligente, Search Console e respostas da Flávia

### 7.1 Clique no site × clique no Link Inteligente × membros (7 dias até 09/11)

| Grupo | Cliques no `/entrar` (site) | Cliques no Link Inteligente | Membros hoje |
|---|---|---|---|
| Promo Celular | 80 | 81 | 55 |
| Promo Tech (PC gamer) | 60 | 60 | 49 |
| Promo Tênis | 43 | 46 | 26 |
| Promo TV | 24 | 23 | 17 |
| Promo Perfumes | 12 | 15 | 9 |
| Promo iPhone | 9 | 9 | 11 |
| Promo Salão | 8 | 9 | 10 |
| Promo Fit (whey) | 7 | 7 | 8 |
| Promo Bebês | — | 4 | 9 |
| Promo Festas | — | 2 | 23 |
| Ofertas Fafaciane (geral) | ~50 (amazon, achadinhos, shein, lojas…) | 98 | 199 (66 no grupo novo + 133) |

Leitura:
1. **Os números batem quase 1 para 1.** O site é a porta de entrada de praticamente todos os cliques dos
   grupos de nicho. A suspeita de robô da seção 2.2 fica menor: se fosse robô, o Link Inteligente também
   contaria (ele recebe o redirecionamento), então não dá para separar só por aqui. A Frente A resolve.
2. **Clique vira membro.** Celular tem 55 membros, e a página está no ar desde 23/10. Tênis, com 10 dias,
   tem 26. Não dá para calcular a taxa exata (o painel mostra o total de membros, não as entradas da
   semana), mas a ordem de grandeza é de **metade a dois terços dos cliques virando membro**.
3. **O geral recebe metade dos cliques por fora do site** (98 no link, ~50 pelo site): Instagram, bio,
   divulgação direta.
4. **Os grupos ainda são pequenos** (1% a 6% da capacidade). Não falta vaga; falta gente chegando.

### 7.2 Search Console, pesquisa na web, 3 meses

**40 cliques e 3.356 impressões no trimestre**, cerca de 2 cliques por dia agora. No mesmo período o botão
do grupo recebeu 52 cliques **por dia**. **Mais de 90% dos leads não vêm do Google.** O mais provável é
ChatGPT/Bing e diretórios; a Frente A vai dizer.

O que o Google já dá:

| Página | Cliques | Impressões | Posição |
|---|---|---|---|
| `/grupo-whatsapp/pc-gamer` | 20 | 97 | 6,1 |
| home | 6 | 84 | 29,9 |
| `/grupo-whatsapp/manicure` | 5 | 46 | 6,0 |
| `/grupo-whatsapp/celular` | 2 | 20 | 7,5 |
| `/desconto/cupom-desconto-aliexpress-br-latam` | 2 | 901 | 60,0 |

- **As páginas de grupo ranqueiam na primeira página** (posição 6 a 7,5) e têm 10% a 20% de cliques por
  impressão. "grupo de pc gamer whatsapp" está em 9,6; "grupo de manicure whatsapp" em 8,8.
- **As páginas de cupom têm impressão e nenhum clique**: AliExpress, Casas Bahia, KaBuM e Amazon aparecem na
  posição 60 a 90. Isso não vai virar lead. Exceções que estão perto: "desconto china in box" (posição 7,5)
  e Casa das Alianças (21).
- `/ofertas/tv` (12,5) e `/ofertas/whey` (4,6) já aparecem, com poucas impressões. `/ofertas/tenis` ainda
  não aparece: o clique dela vem de outro lugar.

### 7.3 Decisões da Flávia (10/11)

| Pergunta | Resposta | O que muda |
|---|---|---|
| Código das frentes A e B | **Sim** | Feito neste PR (7.4) |
| Google Ads | **Não** | Frente D sai. Lead quente só pelo orgânico e pela IA |
| Diretórios | Cadastrou alguns, não lembra quais | A Frente A mostra quais mandam gente (aparecem como "Diretório: …") |
| Mensagem de encaminhar no grupo | **Não** | Frente F sai |
| iPhone no feed do Celular | **Não** | `/ofertas/iphone` continua com as ofertas dos últimos 30 dias |

### 7.4 Entregue neste PR

**Frente A: de onde vem o lead**
- `index.html`: script de 10 linhas grava no cookie `cpn_src` (1 dia, só deste site) o `utm_source` do link
  ou o **domínio** de onde a pessoa chegou; sem origem externa, `direto`. Navegar dentro do site não troca.
- `/entrar` (`middleware.ts`) lê o cookie e grava em `group_join_clicks.source`. Sem URL completa, sem IP.
- Clique **sem** o cookie = o JavaScript não rodou: aparece como "Sem JavaScript (provável robô)".
- Aba Captação: quadro **"Por fonte"** (Google, Bing, ChatGPT, Perplexity, Gemini, Instagram, Diretório: …,
  Direto…). Cliques de antes da medição aparecem como "Antes da medição de fonte".
- Migration `20261110120000_group_join_clicks_source.sql`. Pode rodar antes ou depois do deploy: sem a
  coluna, o `/entrar` grava o clique sem a fonte (nada se perde).

**Frente B: tirar do Google o que está vazio**
- Loja e categoria **sem cupom ativo** saem com `noindex, follow` no HTML do servidor e no React (mesma regra
  nos dois). A página continua no ar para quem chega por link.
- `api/sitemap.ts` só lista loja e categoria com pelo menos um cupom ativo e não vencido. Se a consulta
  de cupons falhar, o sitemap sai como antes (sem filtro), para nunca sumir com as lojas boas.
- Risco aceito: uma loja com impressão e sem cupom (ex.: China in Box, se estiver sem cupom) sai do índice.
  Volta sozinha quando ganhar cupom.

### 7.5 Ordem para pôr no ar (Flávia)

1. Rodar `supabase/migrations/20261110120000_group_join_clicks_source.sql` no SQL Editor.
2. Mesclar o PR (deploy na Vercel).
3. No painel: **desativar** as lojas de teste (`lomadee-teste`, `loja-lomadee` e as duas `loja-lomadee-…` com
   código no endereço) e **juntar** categorias repetidas (ex.: `animals` e `animais`): renomear uma para o nome
   da outra move os cupons.
4. Search Console → Sitemaps → reenviar `sitemap.xml`.
5. Em 17/11: me mandar o quadro "Por fonte" da Captação. Com ele decidimos onde pôr o esforço da última
   semana antes da Black Friday.

### 7.6 O plano sem anúncio e sem encaminhamento

Sobram as frentes que não dependem de dinheiro nem de mexer no grupo:

1. **A e B** (este PR).
2. **C: as 4 páginas que convertem** (celular, PC gamer, tênis, TV): resumo do 11.11 com ofertas reais em
   12/11, contagem para 27/11, bloco de confiança no topo, QR code no computador.
3. **E: diretórios e IA.** Com a fonte medida, cadastrar Tênis, TV e Celular nos diretórios que o ChatGPT
   cita e ver se trazem gente. Rodada de perguntas nas IAs em 20/11.
4. **Google:** as páginas de grupo já estão na posição 6 a 10. Subir para o top 3 multiplica o clique. Para
   isso: mais texto útil e atualizado (o resumo semanal das ofertas do grupo), links internos das páginas
   de loja com impressão (KaBuM → PC gamer, Netshoes → tênis) e pedir reindexação depois de cada atualização.

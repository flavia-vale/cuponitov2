# Mais leads, leads quentes e leads que compram (22/11/2026)

Continuação de `docs/plano-leads-quentes-2026-11-10.md` e `docs/analise-grupos-e-grupos-novos-2026-11-22.md`.
Decisões que continuam valendo (10/11): **sem Google Ads** e **sem mensagem de encaminhar no grupo**.

## 0. O funil hoje (16 a 22/11)

| Etapa | Número | Fonte |
|---|---|---|
| Clique em "Entrar no grupo" no site | 475 pessoas em 7 dias (~68/dia); 81% vindos do ChatGPT | Captação |
| Clique no Link Inteligente (site + diretórios + outros) | ~748 em 7 dias | Link Inteligente |
| Membro novo líquido | ~32/dia → **~30% dos cliques viram membro** | membros 12/11 × 22/11 |
| Membro que compra | **não medido** | — |
| Clique do site numa oferta | **não medido** (link direto para a loja) | `GroupOfferList.tsx` |

O funil está medido até o membro. Do membro para a venda está às cegas, e é essa a etapa que paga a
conta. Por isso a ordem abaixo começa pela medição.

## 1. Primeiro: saber qual lead compra (medir)

### 1.1 Venda por grupo (já existe no Espelha Grupos)

O wabot põe um **sub ID por grupo** nos links da Shopee (`src/modules/conversion/shopeeGroupSubId.js`), e a
aba **Vendas** mostra a comissão por grupo de destino. As ofertas que saem no **site** levam o sub ID
`site` e aparecem como "Site".

Com isso sai, por grupo: **valor do membro = comissão do mês ÷ membros**.

| Grupo | Membros (22/11) | Comissão Shopee 30 dias | Valor por membro |
|---|---|---|---|
| (preencher com a aba Vendas) | | | |

**Para que serve:**
- Decidir **em qual grupo pôr esforço**: porta nova, página, diretório, texto.
- Saber se um grupo com poucos membros, mas que vende, vale mais que um grande que não vende (ex.: o geral
  converte clique em membro pior, ~21%, mas pode vender mais).
- A Shopee é só parte da venda. Mercado Livre e Amazon têm relatório próprio: se der para separar por grupo
  lá também (ID de rastreamento por grupo), a conta fica completa.

### 1.2 Clique em oferta no site (código, Claude)

Hoje as ofertas de "Saiu no grupo hoje" e das páginas `/ofertas/*` levam **direto** à loja. Quem clica numa
oferta é o lead mais quente do site (já quer comprar), e esse clique some.

Proposta: o link da oferta passa pelo `/ir` (o mesmo medidor dos cupons) com o **id da oferta no arquivo
`group_offers`**, e não com a URL. O `/ir` só redireciona para o link gravado no banco (sem redirecionamento
aberto) e grava página, grupo, botão e fonte, como faz com cupom. O link de afiliado continua o mesmo.

Resultado: na aba **Cliques em cupom** passa a aparecer "clique em oferta por página e por grupo". Junto com
o 1.1, dá para ver qual página manda gente que compra.

## 2. Converter melhor quem já chega (o mais barato)

De cada 10 que clicam, 7 não ficam. Ganhar 10 pontos aqui equivale a +33% de leads sem nenhuma visita a mais.

| # | O que | Quem | Por quê |
|---|---|---|---|
| 2.1 | **Botão compacto no topo das páginas de grupo** (celular, PC gamer, manicure, lojas), igual ao das páginas de ofertas | Claude | Botão do topo da página de ofertas: 190 cliques; rodapé: 5 |
| 2.2 | **Tela do convite**: foto própria, nome com o assunto, descrição com "só admins postam" e quantas ofertas por dia | Flávia | É a última tela antes de entrar |
| 2.3 | **Mensagem fixada de boas-vindas** em cada grupo: o que chega, como silenciar sem sair, link do `/grupos-de-promocao` | Flávia | Quem entra e não entende o grupo sai; o link leva a outros grupos |
| 2.4 | **Diretório `/grupos-de-promocao`** (32% dos cliques): última oferta de cada grupo ("saiu às 14h05"), data atualizada sozinha, "quantas ofertas" preenchido | Claude + Flávia | Prova de que o grupo está vivo na página que o ChatGPT mais manda gente |
| 2.5 | **Promo Celular** com mais ofertas (fone, smartwatch, acessório) | Flávia | 2º grupo em cliques e ~27% de conversão; "5 por dia" parece grupo parado |

**Como medir:** membros de cada grupo no painel do Link Inteligente, **todo dia no mesmo horário**, por 7 dias
antes e 7 depois. Meta: de ~30% para **40%** de clique virando membro até 15/12.

## 3. Chegar mais leads

### 3.1 ChatGPT (81% dos cliques)

Os cliques caíram de 111 (16/11) para ~60 por dia (20 e 21/11). Como quase tudo vem do ChatGPT, a
primeira hipótese é ele ter parado de citar alguma página. Antes de qualquer outra coisa:

**Rodada de IA (Flávia, 20 minutos):** ChatGPT em janela anônima, busca ligada, print das fontes citadas.
1. "qual o melhor grupo de promoção no WhatsApp?"
2. "tem grupo de promoção de celular no WhatsApp?"
3. "tem grupo de promoção de PC gamer no WhatsApp?"
4. "tem grupo de promoção de tênis no WhatsApp?"
5. "tem grupo de decoração de Natal no WhatsApp?"
6. "tem grupo de presentes de Natal no WhatsApp?"
7. "tem grupo de promoção de pet no WhatsApp?"
8. "tem grupo de promoção de acessórios para carro / moto no WhatsApp?"

O ChatGPT busca pelo **Bing**: junto com a rodada, mandar do **Bing Webmaster Tools** (Desempenho de pesquisa,
28 dias) as consultas e páginas com impressão. É o "Search Console" de 81% dos leads.

**O que o Claude faz com isso:** página que o ChatGPT deixou de citar ganha reforço (resposta direta no
primeiro parágrafo, FAQ com a pergunta exata, data atualizada); concorrente citado no lugar vira referência
do que falta.

### 3.2 Calendário (lead quente = quem vai comprar agora)

| Janela | Quem está comprando | Página/grupo |
|---|---|---|
| até 30/11 | Black Friday (27/11): TV, celular, PC, tênis, eletrodomésticos | páginas existentes; reforço de "black friday [produto]" no texto |
| até 15/12 | decoração de Natal (pico em novembro), presentes (pico em dezembro), amigo secreto | Promo Natal, Promo Presentes, brinquedos, perfume |
| dezembro | ar-condicionado e ventilador (pico de calor), presentes de última hora | Eletrodomésticos |
| janeiro | liquidação de janeiro, volta às aulas (notebook, mochila) | **validar no Planejador em dezembro** |

### 3.3 Mais portas para os grupos que vendem

Regra de 12/11 continua: porta nova (página de produto) para grupo que já existe, com ≥ 5 mil buscas/mês e
≥ 3 ofertas/dia do produto no feed. A diferença agora: **a ordem segue o valor do membro (1.1)**, não só a
busca. Candidatas já com dado: Dolce Gusto e cafeteira (lance R$ 12 a R$ 14, Promo Casa ainda não existe),
air fryer (Eletrodomésticos), aspirador automotivo (Auto e Moto, já está na página de acessórios).

### 3.4 Lojas com impressão no Google → grupo de nicho

As páginas de cupom (`/desconto/…`) são as únicas com impressão no Google. Cada loja já leva ao grupo do
nicho dela pelo botão do topo. Conferir no painel se as lojas grandes de cada nicho estão ligadas ao grupo
certo: KaBuM e Pichau → Tech; Netshoes e Centauro → Tênis; Petz e Cobasi → Pet; Pneustore → Auto e Moto;
Boticário e Sephora → Perfumes.

## 4. Ordem

| # | O que | Quem | Quando |
|---|---|---|---|
| 1 | Aba Vendas: comissão por grupo (30 dias) | Flávia | esta semana |
| 2 | Rodada de IA + Bing Webmaster | Flávia | até 25/11 (antes da Black Friday) |
| 3 | 2.1 botão no topo das páginas de grupo + 2.4 diretório | Claude | com o sim da Flávia |
| 4 | 1.2 clique em oferta pelo `/ir` | Claude | com o sim da Flávia |
| 5 | 2.2 e 2.3 tela do convite e boas-vindas | Flávia | esta semana |
| 6 | 3.4 lojas ligadas ao grupo certo | Flávia (painel) ou Claude (migration) | dezembro |
| 7 | Revisão com os números: valor do membro por grupo, conversão, fontes | Claude | 01/12 |

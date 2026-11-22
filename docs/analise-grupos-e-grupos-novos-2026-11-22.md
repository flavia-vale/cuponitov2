# Páginas de entrada nos grupos: o que melhorar e quais grupos abrir (22/11/2026)

Base: Captação (7 dias, 16 a 22/11) e painel do Link Inteligente mandados pela Flávia em 22/11,
membros de 12/11 (`docs/plano-crescimento-agressivo-2026-11-12.md`, 7.3), HTML do servidor de
`/grupos-de-promocao` e o código das páginas de grupo e de ofertas.

## 1. Os números

**Site:** 519 cliques em "Entrar no grupo" em 7 dias (475 de pessoas), 94% pelo celular.
**Link Inteligente:** ~748 cliques em 7 dias somando os 12 links. ~270 vêm de fora do site.

| Fonte | Cliques | Parte |
|---|---|---|
| ChatGPT | 422 | **81%** (era 65% em 12/11) |
| Sem JavaScript (robô) | 59 | 11% |
| Direto | 31 | 6% |
| Google | 7 | 1% |

| Grupo | Membros 12/11 | Membros 22/11 | Ganho/dia | Cliques/dia (7 dias) | Clique → membro (aprox.) |
|---|---|---|---|---|---|
| Promo Tech Nerd | 63 | 144 | 8,1 | 20,4 | ~40% |
| Promo Perfumes | 12 | 37 | 2,5 | 6,3 | ~40% |
| Promo Tênis | 37 | 75 | 3,8 | 10,0 | ~38% |
| Promo TV | 25 | 42 | 1,7 | 4,9 | ~35% |
| Promo iPhone | 12 | 27 | 1,5 | 4,7 | ~32% |
| Promo Celular | 64 | 112 | 4,8 | 18,0 | ~27% |
| Promo Fit | 13 | 22 | 0,9 | 3,4 | ~26% |
| **Ofertas Fafaciane (geral)** | 202 | 266 | 6,4 | 31,1 | **~21%** |
| Promo Eletrodomésticos | — | 19 | — | 5,0 | — |
| Promo Salão / Bebês / Festas | 10 / 9 / 23 | 13 / 13 / 22 | ~0,3 | 1,9 / 0,9 / 0,3 | — |

Conta aproximada: ganho de 10 dias contra cliques de 7, já com quem saiu descontado. Serve para
comparar grupos entre si, não como taxa exata.

**Membros nos grupos de nicho: 526** (eram 268 em 12/11). Meta de 31/12: 1.500.

## 2. O que os dados dizem

1. **O ChatGPT é o canal.** 81% dos cliques. O Google trouxe 7. Toda melhoria e todo grupo novo
   têm que caber no que o ChatGPT lê e cita: as páginas de grupo e, principalmente, o diretório.
2. **`/grupos-de-promocao` é a página nº 1** (166 cliques, 32%). É a vitrine que a IA mostra quando
   alguém pergunta "tem grupo de promoção de X?". Cada grupo listado ali ganha visita no mesmo dia.
3. **A decisão é no topo da página.** Botão do topo da página de ofertas: 190 cliques. Botão do
   rodapé: 5 (ofertas) e 3 (grupo). Nas páginas de **grupo** o primeiro botão vem depois da
   introdução, de 7 fatos e do bloco "o que o grupo não faz": no celular, fica abaixo da primeira tela.
4. **Grupo de assunto converte quase o dobro do grupo geral** (~40% contra ~21%). Quem escolhe um
   assunto fica. É o melhor argumento para abrir mais grupos de nicho.
5. **Promo Celular converte pouco para o tamanho** (~27%). A página promete "cerca de 5 ofertas por
   dia", pouco perto dos 200 do Tech Nerd. Hipótese: a pessoa entra, vê um grupo parado e sai.
6. **Os cliques caíram na semana:** 111 em 16/11, 60 a 66 de 20 a 21/11. Com 81% vindo do ChatGPT,
   a primeira suspeita é a IA ter deixado de citar alguma página. A Black Friday é em 27/11.
7. **Telegram (4) e QR code (3) quase não são usados.** Não vale investir mais neles agora.
8. **Salão, Bebês e Festas estão parados** (de 2 a 13 cliques). `/ofertas/fraldas` mira uma busca
   de 10 a 100 mil no Google, mas o Google não traz gente, e o ChatGPT não cita a página.

## 3. Melhorias, por ordem

### 3.1 Sem código (Flávia, ~30 minutos)

| # | O que | Por quê |
|---|---|---|
| 1 | **Tela do convite de cada grupo:** foto própria (não o logo genérico), nome com o assunto ("Promo Celular · ofertas de celular"), descrição de 2 linhas com o que chega e "só admins postam" | É a última tela antes de entrar; 2 de cada 3 que clicam não ficam |
| 2 | **Mensagem fixada de boas-vindas** em cada grupo: o que chega, quantas por dia, como silenciar sem sair, link do `/grupos-de-promocao` para os outros grupos | Quem entra num grupo com 13 pessoas e não entende o grupo sai. O link leva para outros grupos |
| 3 | **Preencher "Quantas ofertas"** no painel: 7 grupos aparecem como "não informado" no diretório (TV, Fit, Perfumes, Salão, Bebês, Festas e Eletrodomésticos no FAQ) | "Não informado" na página que o ChatGPT cita passa descuido; o número é o que diferencia os grupos |
| 4 | **Promo Celular:** mais ofertas no espelhamento (acessórios, fone, smartwatch, Xiaomi e Motorola), para passar de ~5 por dia | É o 2º grupo em cliques e o que mais perde gente depois do grupo geral |
| 5 | **Decidir Promo Salão → Promo Beleza** (pendente desde 12/11): maquiagem + skincare + unha | `/ofertas/maquiagem` já leva ao Salão; "beleza" é um assunto que o ChatGPT reconhece, "salão" não |

### 3.2 Código (Claude, pode começar quando a Flávia aprovar)

| # | O que | Por quê |
|---|---|---|
| 1 | **Botão compacto no topo das páginas de grupo**, igual ao das páginas de ofertas (o mesmo `GroupJoinCTA compact`, no React e no HTML do servidor) | O botão do topo da página de ofertas é o que mais converte do site (190 cliques) |
| 2 | **Diretório: ordenar por assunto mais procurado e mostrar a última oferta de cada grupo** ("saiu às 14h05: Galaxy A15 por R$ 699"), do arquivo `group_offers` | Prova de que o grupo está vivo, na página que mais recebe visitas. Muda o texto da página: passa pela regra de SEO (seção 5) |
| 3 | **Diretório: data de atualização automática** (hoje "07 de novembro") a partir da última oferta | Data velha na página que a IA cita; a IA prefere fonte atualizada |
| 4 | **Dados da página embutidos no HTML** (mesmo HTML para todos) para o React montar sem o esqueleto de carregamento | Hoje o React apaga o HTML do servidor e mostra um esqueleto até o Supabase responder. No celular, o botão some por um instante. Medir antes com o Vercel Analytics, se estiver ligado |
| 5 | **Página própria do Promo Festas** (hoje o diretório leva a `#festas`, sem página) ou tirar o grupo do diretório | Ver a seção 4: a decoração de Natal pode ser a página dele |

## 4. Grupos novos

Regra que já vale (plano de 12/11, 3.2): grupo novo só quando o produto não cabe num grupo que
existe, e só com **≥ 10 ofertas por dia** do assunto vindas do espelhamento. O dado novo de hoje
reforça abrir: grupo de assunto converte ~40%, o geral ~21%.

| Grupo | Recomendação | Páginas (portas) | Dados que já temos | Risco |
|---|---|---|---|---|
| **Natal** | **Não um "Promo Natal"**, que morre em 25/12. Duas saídas: (a) **"Promo Presentes"**, que no Natal manda presentes e depois segue com Dia das Mães, Namorados, Pais e Crianças; (b) **decoração de Natal no Promo Festas** (árvore, pisca-pisca, enfeites), que hoje está parado | presentes de natal; presente para homem/mulher/amigo secreto; decoração de natal | Nenhum. Perfume já é "a página do Natal" | **Prazo:** a busca de Natal sobe no começo de dezembro. A página precisa estar no ar até ~01/12 |
| **Auto e Moto** | **Sim.** É o "Promo Auto" já planejado; `/ofertas/pneu` existe e hoje leva ao grupo geral | pneu (já existe), capacete, peças e acessórios de moto, som e multimídia, aspirador e lavadora para carro, óleo, bateria | pneu: ~144 mil buscas somando as medidas, **clique mais caro do estudo (R$ 3,64)**; cupom Pneustore 9.900 | peça depende do modelo; a oferta precisa ter a medida ou o modelo no título |
| **Pet** | **Sim, se o feed tiver oferta.** Compra todo mês: o membro fica mais tempo | ração (por marca: Golden, Premier, Pedigree…), areia de gato, antipulgas, petiscos | ração 720 buscas/mês, mas **lance de R$ 7,12, o mais alto do estudo** | volume de busca pequeno; margem baixa em ração |
| **Casa** | **Sim, primeiro da fila.** Já planejado ("Promo Casa"); `/ofertas/sofa` e `/ofertas/colchao` existem e levam ao grupo geral | sofá, colchão, panelas, cafeteira e cápsulas, cama e banho | sofá 12.100 (22.200 em nov), colchão ~11 mil, café e cafeteira ~31 mil, lances de R$ 1,56 a R$ 3,82 | frete de móvel |
| **Ferramentas** | Junto do Auto ("Promo Auto e Ferramentas") ou do Casa | furadeira, parafusadeira, lavadora de alta pressão, jogo de chaves | ~12 mil, +85% no ano; presente de Natal e Dia dos Pais | sozinho, pouco volume |
| **Mercado** | Talvez. Compra toda semana, mas comissão baixa | café, fraldas, limpeza, higiene (Amazon e Mercado Livre supermercado) | café ~31 mil (já contado no Casa) | comissão de supermercado é a menor |
| **Volta às aulas** | Página sazonal, não grupo: porta do Promo Bebês (que vira "Bebês e Crianças") ou do Tech Nerd (notebook) | material escolar, mochila, notebook para estudar | nenhum | só jan e fev; validar no Trends em dezembro |
| **Livros e Kindle** | Hipótese. A Amazon tem promoção de livro todo dia | livros em promoção, Kindle, e-books grátis | nenhum | ticket baixo |
| **Games (console)** | Não: já cabe no Tech Nerd (PS5 já é porta) | — | — | dividiria o grupo que mais converte |

**Decisão da Flávia (22/11): Natal vira dois grupos.**
- **Promo Presentes:** presentes de Natal agora; depois Dia das Mães, Namorados, Pais e Crianças.
- **Promo Natal:** só decoração de Natal (árvore, pisca-pisca, enfeites, mesa de Natal).
- O Promo Festas continua como está (organizadoras de festa).

Prazo: as duas páginas no ar até ~01/12, porque a busca de Natal sobe no começo de dezembro. Para
isso, os dados do Natal (lote B1 da seção 5) vêm antes dos outros.

**Ordem sugerida:** Presentes e Natal (prazo) → Casa (dados prontos, páginas no ar) → Auto e Moto (páginas no ar, clique caro)
→ Presentes/Natal (prazo) → Pet. Para cada um: criar o grupo, o link no Link Inteligente com o feed
`ofertas.json` ligado, e preencher no painel o link, o nome e "O que chega". As páginas que já
existem passam a levar ao grupo novo sem código.

## 5. O que preciso da Flávia antes de construir

Regra do `CLAUDE.md`: nenhuma página nova, título ou texto sem os dados.

**A. Espelhamento (o que decide se o grupo abre):** quantas ofertas por dia o Espelha Grupos
conseguiria espelhar de: casa (sofá, colchão, panelas), auto e moto, pet, presentes de Natal,
decoração de Natal, ferramentas. Há grupos de origem para espelhar nesses assuntos?

**B1. Planejador, lote do Natal (urgente, para as páginas saírem até ~01/12):**

```
presentes de natal
presente de natal barato
presente de natal para homem
presente de natal para mulher
presente de natal para mãe
presente de natal para criança
amigo secreto presente
presente até 50 reais
kit presente
decoração de natal
decoração de natal barata
árvore de natal
árvore de natal promoção
pisca pisca natal
enfeites de natal
mesa de natal decoração
grupo de decoração de natal whatsapp
grupo de presentes whatsapp
```

**B2. Planejador, os outros grupos** (Brasil, 12 meses):

```
capacete promoção
capacete de moto barato
peças de moto
acessórios para moto
acessórios para carro
som automotivo promoção
multimídia carro promoção
aspirador automotivo
ração em promoção
ração golden promoção
ração premier promoção
areia de gato promoção
antipulgas promoção
petshop promoção
furadeira promoção
parafusadeira promoção
lavadora de alta pressão promoção
panelas em promoção
cafeteira promoção
livros em promoção
material escolar promoção
```

**C. Google Trends** (12 meses, Brasil): "presentes de natal", "decoração de natal", "ração",
"capacete" — para saber quando o pico começa.

**D. ChatGPT** (janela anônima, busca ligada, print das fontes citadas):
- "tem grupo de promoção de pet no WhatsApp?" e "onde achar ração em promoção?"
- "tem grupo de promoção de peças de moto / acessórios de carro no WhatsApp?"
- "tem grupo de promoção de presentes de Natal no WhatsApp?" e "onde achar presente de Natal barato?"
- "tem grupo de decoração de Natal no WhatsApp?" e "onde comprar decoração de Natal barata?"
- "tem grupo de promoção de móveis / casa no WhatsApp?"
- "qual o melhor grupo de promoção no WhatsApp?" (para ver se ainda cita o `/grupos-de-promocao`,
  por causa da queda de 111 para ~60 cliques por dia)

**E. Decisões (sim ou não):**
1. ~~Natal~~ decidido em 22/11: Promo Presentes + Promo Natal (só decoração).
2. Promo Salão → Promo Beleza?
3. Pode começar o código da seção 3.2 (itens 1, 3 e 4 não mudam texto; o 2 e o 5 esperam os dados)?

## 6. Planejador de 22/11 (3 planilhas, 13.237 termos, Brasil, nov/2025 a out/2026)

Arquivos em `docs/dados-2026-11-22/` (convertidos para TSV). O Planejador repete o mesmo número para
variações próximas ("decoração de natal" e "decoracao de natal"); as somas abaixo contam cada série uma vez.
A busca "grupo de … whatsapp" é quase zero em todos os temas (peças de moto: 20 por mês): o grupo é
achado pelo ChatGPT e pelo diretório, e a busca do Google é pelo **produto**.

### 6.1 Promo Natal (só decoração): o pico é AGORA, em novembro

| Termo | Média/mês | Nov/25 | Dez/25 | Lance máx. |
|---|---|---|---|---|
| decoração de natal | 90.500 | **450.000** | 368.000 | 1,07 |
| enfeites de natal | 74.000 | **368.000** | 165.000 | 0,98 |
| guirlanda de natal | 60.500 | **368.000** | 165.000 | 0,95 |
| árvore de natal decorada | 33.100 | **246.000** | 90.500 | 1,22 |
| decoração de natal simples | 14.800 | 49.500 | **90.500** | 0,75 |
| mesa de natal | 12.100 | 33.100 | **110.000** | 2,47 |
| pisca pisca de natal | 9.900 | 60.500 | 22.200 | 0,80 (+235% no ano) |
| decoração de natal barata e criativa | 6.600 | 33.100 | 27.100 | 1,23 |
| decoração de natal para loja | 1.900 | 14.800 | 4.400 | 2,22 |
| enfeites de natal promoção | 1.300 | 9.900 | 2.400 | 0,97 |
| árvore de natal promoção | 880 | 5.400 | 2.400 | 0,80 |
| enfeites de natal shopee | 880 | 4.400 | 880 | 1,89 |
| **ano novo decoração** | 14.800 | 22.200 | **165.000** | 1,38 |
| decoração mesa ano novo | 1.600 | 1.600 | 18.100 | 1,54 |

Leitura:
- **Enfeite, guirlanda, árvore e pisca-pisca têm o pico em novembro**, não em dezembro. Cada semana
  sem página perde a maior parte da busca. O prazo de "até 01/12" vira **esta semana**.
- A busca grande é de **ideia** ("decoração de natal", "simples"); a de **compra** ("promoção",
  "barata", "shopee") é menor, mas ainda chega a ~10 mil por termo em novembro. A página tem que juntar
  as duas coisas: ideias simples e baratas + as ofertas do grupo.
- **Mesa de Natal sobe em dezembro** (110 mil) e **decoração de Ano Novo explode em dezembro**
  (165 mil). O Promo Natal pode ir até 31/12 com Ano Novo. Já existe o post
  `/blog/decoracao-de-ano-novo-simples-e-barata`, ligado ao Promo Festas: trocar para o Promo Natal?
- "Decoração de natal para loja" (14.800 em nov) é do público do Promo Festas (quem decora para os outros).

### 6.2 Promo Presentes: pico em dezembro, e busca o ano todo

| Termo | Média/mês | Nov/25 | Dez/25 | Lance máx. |
|---|---|---|---|---|
| amigo secreto | 40.500 | 165.000 | **201.000** | 0,36 |
| presentes de natal | 33.100 | 90.500 | **246.000** | 2,07 |
| presente de natal para namorado | 5.400 | 12.100 | 49.500 | 1,97 |
| lembrancinha de natal baratinha | 8.100 | 33.100 | 49.500 | 0,71 |
| presentes de natal feminino | 3.600 | 8.100 | 27.100 | 2,44 |
| presente amigo secreto | 4.400 | 18.100 | 27.100 | 1,22 |
| presentes de amigo secreto até 50 reais | 1.300 | 4.400 | 9.900 | 0,96 |
| presentes até 100 reais | 1.000 | 3.600 | 6.600 | 1,77 |
| presente de natal barato | 720 | 2.400 | 5.400 | 1,53 |
| presentes para amiga (ano todo) | 12.100 | 14.800 | 18.100 | 2,52 |
| presentes para o papai (ano todo) | 12.100 | 12.100 | 22.200 | 2,06 |
| ideias de presente para amigo (ano todo) | 9.900 | 12.100 | 14.800 | 1,90 |

Leitura:
- **Presente por faixa de preço** ("até 30", "até 50", "até 100 reais", amigo secreto) é o encaixe
  natural de um grupo de ofertas: ~17 mil por mês somando, quase tudo em dezembro.
- Presente para amiga, para o pai e para amigo têm busca **o ano todo**: confirma que o Promo
  Presentes vive depois do Natal (Dia das Mães, Namorados, Pais, Crianças).
- Lance de R$ 1,50 a R$ 2,50: a venda de presente vale mais que a de decoração.

### 6.3 Auto e Moto: o que dá para vender online

| Termo | Média/mês | Lance máx. | Serve? |
|---|---|---|---|
| moto peças | 60.500 | 2,55 | **não**: loja do bairro, "perto de mim", nome de loja (Galpão, Damasio) |
| peças de carro | 18.100 | 4,87 | **não**: depende do modelo, compra local |
| acessórios para carro | 22.200 | 3,16 (loja: até 5,49) | **sim** |
| aspirador de pó carro + variações | ~35 mil somando | 0,76 a 1,08 | **sim** (+22% no ano) |
| acessórios para moto + variações | ~15 mil somando | 1,28 a 1,98 | **sim** |
| capacete promoção / capacete barato | 6.600 + 6.600 | 0,89 a 1,02 | **sim** |
| pneu (estudo de 12/11) | ~144 mil somando | 3,64 | **sim** (página já no ar) |

**Promo Auto e Moto: sim**, com portas de acessório e de produto, não de peça:
`/ofertas/pneu` (existe), acessórios para carro, aspirador automotivo, capacete, acessórios para moto.

### 6.4 Pet: pouca busca, clique caríssimo

ração em promoção 720 · promoção de ração 320 · bravecto promoção 480 · ração por marca e peso de 90
a 260 cada. **~5 mil por mês somando tudo**, mas o lance vai de **R$ 6 a R$ 10** (o mais alto de todos
os estudos). O Google não vai trazer gente; o grupo dependeria do ChatGPT e do diretório.
**Recomendação: depois dos outros, e só se o espelhamento tiver ≥ 10 ofertas de pet por dia.**
Uma página só (`/ofertas/racao`), não várias.

### 6.5 Casa, ferramentas, livros, escolar

| Termo | Média/mês | Lance máx. |
|---|---|---|
| cafeteira dolce gusto promoção | 3.600 | **11,95** |
| máquina dolce gusto promoção | 1.300 | **13,76** |
| panela de pressão promoção | 3.600 | 1,23 |
| jogo de panelas promoção | 2.400 | 1,34 |
| cafeteira promoção | 2.400 | 3,55 |
| parafusadeira / furadeira / lavadora de alta pressão promoção | 1.600 / 1.300 / 1.300 | ~1,1 |
| livros em promoção | 3.600 (+52% no ano) | 1,18 |
| material escolar promoção | 390 | 2,07 |

("promoções de panelas de pressão" com 301 mil é o mesmo erro do Planejador visto em 12/11.)
- **Promo Casa continua o primeiro dos grupos "do ano todo"**: sofá e colchão (12/11) + panelas +
  cafeteira. **Dolce Gusto tem o clique mais caro depois do pet**: página própria vale a pena.
- Ferramentas (~4 mil somando) entram no Promo Casa, não como grupo.
- Livros: pouco, mas crescendo. Fica como hipótese.
- Material escolar: quase nada no Planejador. Não fazer.

### 6.6 Nova ordem

| # | O que | Quando | Página (proposta) |
|---|---|---|---|
| 1 | **Promo Natal** | **esta semana** (pico de novembro) | `/ofertas/decoracao-de-natal` (enfeites, árvore, guirlanda, pisca-pisca; em dezembro, mesa de Natal e Ano Novo) |
| 2 | **Promo Presentes** | até ~01/12 (pico de dezembro) | `/ofertas/presentes-de-natal`, com seções por faixa de preço e amigo secreto |
| 3 | Promo Casa | dezembro | `/ofertas/sofa` e `/ofertas/colchao` (existem) + cafeteira Dolce Gusto, panelas |
| 4 | Promo Auto e Moto | dezembro | `/ofertas/pneu` (existe) + acessórios para carro, aspirador automotivo, capacete |
| 5 | Promo Pet | só com oferta no feed | `/ofertas/racao` |

**Para pôr o Promo Natal no ar esta semana, a Flávia faz:**
1. Cria o grupo **Promo Natal** no WhatsApp e o link `promo-natal` no Link Inteligente, com o feed
   `ofertas.json` ligado no Espelha Grupos.
2. Diz quantas ofertas de decoração de Natal por dia o espelhamento consegue.
3. Opcional (pela pressa): as respostas do ChatGPT para "onde comprar decoração de Natal barata?" e
   "tem grupo de decoração de Natal no WhatsApp?". Sem elas, a página sai com os dados do Planejador,
   como em 12/11, e a rodada de IA vem depois.

O mesmo para o **Promo Presentes** (`promo-presentes`) até 01/12.

## 7. 22/11: páginas do Promo Natal e do Promo Presentes

Decisão da Flávia: **Promo Natal só com decoração de Natal** (Ano Novo fica fora; o post de Ano Novo
continua no Promo Festas) e **Promo Presentes com presentes de Natal**. Grupos e links criados por ela.

Migration `20261122120000_promo_natal_e_presentes.sql` (testada num Postgres local, roda duas vezes sem
duplicar):

| Página | Grupo | Busca principal | Seção do diretório |
|---|---|---|---|
| `/ofertas/decoracao-de-natal` | Promo Natal | decoração de natal 450 mil em nov/25; enfeites e guirlanda 368 mil | Natal (logo depois dos achadinhos) |
| `/ofertas/presentes-de-natal` | Promo Presentes | presentes de natal 246 mil em dez/25; amigo secreto 201 mil | Natal |

- Sem `offer_terms`: os dois grupos são só do assunto, então a página mostra todas as ofertas do grupo.
- Links internos: grupo geral (lista por assunto), brinquedos, perfume, e as duas páginas entre si;
  diretório e home listam sozinhos. Resposta "quais são os grupos" do diretório e `llms.txt` atualizados.
- Respostas das IAs: ainda não levantadas (a decoração tem o pico em novembro). Rodada depois.

**Ordem para pôr no ar (Flávia):**
1. Conferir os links: em 22/11, `linkdivulgador.com.br/g/promo-natal` e `/g/promo-presentes` davam 404.
   Se o link tiver outro nome, avisar o Claude (ou trocar no painel depois de rodar).
2. Ligar o feed `ofertas.json` dos dois links no Espelha Grupos.
3. SQL Editor: rodar `20261122120000_promo_natal_e_presentes.sql`. Mesclar o PR (por causa do `llms.txt`).
4. Avisar o Claude para mandar o IndexNow e rodar `npm run seo:entrega` e `npm run seo:robos`.
5. Search Console → Inspecionar URL → pedir indexação de `/ofertas/decoracao-de-natal` primeiro.
6. Painel → Grupos do WhatsApp: preencher "Quantas ofertas" dos dois quando souber o volume.

## 8. 22/11 (tarde): Promo Pet e Promo Auto e Moto, e o link novo do Link Inteligente

A Flávia criou os 4 grupos (Natal, Presentes, Pet, Auto e Moto). Os links novos têm **o número da conta**:
`linkdivulgador.com.br/g/262/<grupo>` (conferidos: redirecionam ao convite do WhatsApp). O
`/g/promo-natal` sem o número dá 404.

**Código:** `offerFeedUrl`/`offerFeedSlug` (`src/lib/groupOfferFeed.ts`) e o coletor do arquivo de ofertas
(`collect_group_offers()`, na migration `20261122150000_promo_pet_e_auto.sql`) aceitam os dois formatos.
O feed do link novo fica em `/g/262/<grupo>/ofertas.json`.

| Página | Grupo | Busca principal | Diretório |
|---|---|---|---|
| `/ofertas/acessorios-para-carro` | Promo Auto e Moto | acessórios para carro 22.200; aspirador de pó carro 18.100 (+22%) | Carro e moto |
| `/ofertas/capacete` | Promo Auto e Moto | capacete promoção 6.600 + capacete barato 6.600; acessórios para moto 8.100 | — |
| `/ofertas/pneu` (já existia) | Promo Auto e Moto (antes: grupo geral) | pneu ~144 mil somando as medidas | — |
| `/ofertas/racao` | Promo Pet | ração em promoção 720 (pouca busca, lance de R$ 6 a R$ 10) | Pet |

- Auto e Moto: a página deixa claro que o grupo é de acessório, capacete e pneu, **não de peça de
  reposição** ("moto peças" 60.500 é busca de loja do bairro).
- Testado num Postgres local: as duas migrations de 22/11 rodam duas vezes sem duplicar; o coletor
  lista `262/promo-natal`, `262/promo-presentes`, `262/promo-pet` e `262/promo-auto-e-moto`.

### Problema achado: os feeds de nicho não respondem

Em 22/11 (~14h50 de Brasília), **só o feed do grupo geral (`ofertas-fafaciane`) responde**. Os 11 de nicho
(`promo-celular`, `promo-tech`, `promo-tenis`, `promo-tv`, `promo-fit-whey-suplemento`, `promo-perfumes`,
`promo-iphone`, `promo-eletrodomesticos`, `promo-bebes`, `promo-salao`) devolvem
`{"error":"não encontrado"}` (404), e os 4 novos também (`/g/262/<grupo>/ofertas.json`: rota não existe).

Efeito no site: as páginas de **grupo** (celular, PC gamer, manicure) saem sem "Saiu no grupo hoje", e as
páginas de **ofertas** só mostram o arquivo (tênis e TV param em 21/11). A página vazia derruba a
conversão: o "Saiu no grupo hoje" é a prova de que o grupo está vivo.

**A conferir no Espelha Grupos:** se o feed `ofertas.json` dos links de nicho foi desligado (ou mudou de
endereço com o número da conta). Se o endereço novo for outro, o Claude ajusta `offerFeedUrl` e o coletor.

### Ordem para pôr no ar (Flávia)

1. Espelha Grupos: ligar o feed `ofertas.json` dos 4 links novos e conferir os de nicho antigos (acima).
2. SQL Editor: `20261122120000_promo_natal_e_presentes.sql` e `20261122150000_promo_pet_e_auto.sql`.
3. Mesclar o PR (código do feed e `llms.txt`).
4. Avisar o Claude: IndexNow das 5 páginas novas + `npm run seo:entrega` e `npm run seo:robos`.
5. Search Console: pedir indexação de `/ofertas/decoracao-de-natal` primeiro (pico em novembro).
6. Painel: "Quantas ofertas" dos 4 grupos quando souber o volume.

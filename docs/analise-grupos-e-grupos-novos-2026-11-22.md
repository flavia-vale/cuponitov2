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

**Ordem sugerida:** Casa (dados prontos, páginas no ar) → Auto e Moto (páginas no ar, clique caro)
→ Presentes/Natal (prazo) → Pet. Para cada um: criar o grupo, o link no Link Inteligente com o feed
`ofertas.json` ligado, e preencher no painel o link, o nome e "O que chega". As páginas que já
existem passam a levar ao grupo novo sem código.

## 5. O que preciso da Flávia antes de construir

Regra do `CLAUDE.md`: nenhuma página nova, título ou texto sem os dados.

**A. Espelhamento (o que decide se o grupo abre):** quantas ofertas por dia o Espelha Grupos
conseguiria espelhar de: casa (sofá, colchão, panelas), auto e moto, pet, presentes de Natal,
decoração de Natal, ferramentas. Há grupos de origem para espelhar nesses assuntos?

**B. Planejador de Palavras-chave** (Brasil, 12 meses), um lote:

```
presentes de natal
presente de natal barato
presente de natal para homem
presente de natal para mulher
amigo secreto presente
decoração de natal
árvore de natal promoção
pisca pisca natal
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
- "tem grupo de promoção de presentes de Natal no WhatsApp?"
- "tem grupo de promoção de móveis / casa no WhatsApp?"
- "qual o melhor grupo de promoção no WhatsApp?" (para ver se ainda cita o `/grupos-de-promocao`,
  por causa da queda de 111 para ~60 cliques por dia)

**E. Decisões (sim ou não):**
1. Natal: "Promo Presentes" (dura o ano todo) ou decoração de Natal no Promo Festas? Ou os dois?
2. Promo Salão → Promo Beleza?
3. Pode começar o código da seção 3.2 (itens 1, 3 e 4 não mudam texto; o 2 e o 5 esperam os dados)?

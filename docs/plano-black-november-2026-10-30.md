# Black November 2026: plano de captação para os grupos — 30/10/2026

Faltam **12 dias para o 11.11 (qua 11/11)** e **28 dias para a Black Friday (sex 27/11)**. Cyber Monday
é seg 30/11 e o 12.12 cai num sábado. Este plano diz onde pôr o esforço até lá e quais grupos abrir.

Valem as regras de antes: captação por **SEO e GEO** (decisão de 18/10), nada de página escrita sem os
dados de busca e de IA (CLAUDE.md), todo botão pelo `/entrar`, grupo decidido em `src/lib/whatsappGroup.ts`.

---

## 1. O que os dados já dizem

| Fato | Fonte | O que tiramos dele |
|---|---|---|
| Os grupos que recebem gente são o **Promo Celular** e o **Promo Tech Nerd** | Flávia, 30/10 | O que funciona é nicho com intenção de compra de produto caro. Os outros grupos, por enquanto, não. |
| O ChatGPT já cita "Promo Tech — Cuponito" para "tem grupo de promoção de celular no WhatsApp?" | rodada de IA de 23/10 | O GEO é o canal que já entrega. Ele é rápido: o ChatGPT busca pelo Bing, e o Bing indexa em dias pelo IndexNow. |
| "tv em promoção" de 10 mil a 100 mil buscas/mês, **+900% no ano**; PS5, placa de vídeo, notebook gamer e jogos de 1 mil a 10 mil | Planejador, 23/10 | Na Black Friday o assunto mais procurado é eletrônico. É o tema do Tech Nerd. |
| "iphone em promoção" e "iphone barato" de 10 mil a 100 mil | Planejador, 23/10 | A página `/ofertas/iphone` já está no ar na hora certa. |
| Autocompletar do Google para **"grupo de promoção de…"**, em ordem: peças de pc, celular, **tênis whatsapp**, peças de pc whatsapp, **perfumes** whatsapp, perfumes, **suplementos** whatsapp, **ferramentas** whatsapp, **eletrodomésticos** whatsapp | Google, 30/10 | Os dois primeiros temas já são nossos e funcionam. O **tênis** é o próximo da fila. |
| Prints da Flávia (navegador dela, 30/10), "grupo de promo…": peças de pc, promoções whatsapp, peças de pc whatsapp, **tênis whatsapp**, promoções telegram, **perfumes whatsapp**, **placa de video**, celular, **suplementos whatsapp**, peças de pc telegram, tênis | Google, 30/10 | Mesma ordem do autocompletar sem login: tênis logo depois de PC e celular. **Placa de vídeo** aparece sozinha (vai para o Tech Nerd). **Telegram** aparece 3 vezes (seção 3). |
| Autocompletar de **"grupo de ofertas de…"**: celulares, ferramentas, notebook, **tênis**, peças de pc, ar condicionado, iphone | Google, 30/10 | O tênis aparece de novo. |
| Autocompletar de "grupo black friday": **whatsapp**, telegram, vip, ofertas | Google, 30/10 | Existe a busca "grupo black friday whatsapp". |
| Autocompletar de "whey promoção": **black friday**, mercado livre, growth, dux; "creatina promoção": growth, black skull, mercado livre | Google, 30/10 | O suplemento tem demanda própria de Black Friday. |

O autocompletar mostra **ordem** de procura, não volume. Ele serve para escolher o que levar ao
Planejador, não para decidir sozinho (seção 6).

## 2. A tese: a Black Friday é a Copa do Mundo do tech

Não espalhar esforço em 10 temas. **Pôr 70% do esforço no que já converte** (celular, iPhone, TV, PS5,
PC), porque na Black Friday a procura por esses produtos multiplica e o ChatGPT já nos cita para eles.
**Os outros 30% vão para um único nicho novo**, o que os dados apontarem (seção 3).

Por quê: página nova no Google leva de 4 a 12 semanas para ranquear e temos 4. O que dá retorno em
4 semanas é (1) o que já tem impressão e já é citado pela IA, e (2) páginas novas que o Bing e o
ChatGPT pegam em dias.

## 3. Abrir grupo novo? Tênis primeiro, se o Planejador confirmar

| Candidato | Sinal até agora | Combina com a Black Friday? | Veredito |
|---|---|---|---|
| **Tênis** | 3º no "grupo de promoção de…", 4º no "grupo de ofertas de…"; variações de corrida, basquete e vôlei; "tênis em promoção" puxa Nike, Adidas, Netshoes, Centauro | Sim: Nike, Adidas e Netshoes fazem Black Friday forte e o tíquete é alto | **Abrir agora**, se "grupo de promoção de tênis" + "tenis em promoção" tiverem volume (gatilho abaixo) |
| Suplementos (whey, creatina) | Aparece no "grupo de promoção de…" e tem "whey promoção black friday" | Sim, e a compra se repete todo mês (bom para o grupo depois de dezembro) | **Segundo da fila.** Começa como página de ofertas (`/ofertas/whey`) num grupo "Promo Fit" só se tiver ≥5 ofertas/dia |
| "FIT" genérico | Sem busca própria: quem procura, procura "whey", "creatina", "tênis de corrida" | — | Não. O nome do grupo tem que ser o que a pessoa digita |
| Perfume | Aparece em "grupo de promoção de perfumes whatsapp" e "perfume árabe" | Médio | Reserva para dezembro (Natal e presente) |
| Grupo "Black Friday" temporário | "grupo black friday whatsapp" existe | Sim, mas morre em 01/12 | **Não abrir grupo.** Fazer uma **página** de Black Friday que manda cada pessoa para o grupo de nicho dela (seção 4) |
| Ferramentas, eletrodomésticos, ar-condicionado | Aparecem no autocompletar | Médio | Ar-condicionado e eletro vão para o Tech Nerd ou para o geral; não abrir grupo agora |

**Telegram:** "grupo de promoções telegram" e "grupo de promoção de peças de pc telegram" aparecem no
autocompletar. Quem busca isso não quer WhatsApp. Pergunta para a Flávia: o Espelha Grupos já publica num
canal do Telegram? Se publica, o tema de PC ganha uma segunda porta sem criar outro grupo. Se não publica,
fica para depois da Black Friday.

**Gatilho para abrir o grupo de tênis** (os três juntos):
1. Planejador: "grupo de promoção de tênis" (e variações com whatsapp) com 100 a 1 mil buscas ou mais, e
   "tenis em promoção" com 10 mil ou mais;
2. o Espelha Grupos consegue filtrar **≥10 ofertas de tênis por dia** dos grupos que já espelhamos
   (grupo de tênis com 1 oferta por dia não segura ninguém);
3. a Flávia cria o Link Inteligente `promo-tenis`.

Abrindo, o resto é cadastro, sem código novo: página `/grupo-whatsapp/tenis` no painel, categoria
"Esportes"/"Calçados" com `group_slug = tenis`, lojas Netshoes e Centauro ligadas à página.

## 4. As frentes até 30/11

### Frente A: página de Black Friday que separa por nicho (no ar até 03/11)

`/grupo-whatsapp/black-friday` (busca "grupo black friday whatsapp"). Não é um grupo: é uma página com os
grupos lado a lado ("Celular", "iPhone", "PC, TV e videogame", "Tênis", "Bebês", "Achadinhos") e as
ofertas de Black Friday que saíram em cada um hoje. Cada botão vai pelo `/entrar` com origem própria.
Assim a pessoa cai no grupo certo, e a página continua útil depois de novembro: vira a de Natal no dia 01/12.

Precisa de código: um tipo de página "hub" que lista grupos (hoje a página de grupo tem um botão só).
Entra no prerender, no sitemap e no IndexNow no dia em que publicar.

### Frente B: ofertas de Black Friday por produto (de 03/11 a 10/11)

Páginas de ofertas (`page_type = 'offers'`, já existe), alimentadas pelo feed do grupo, só onde o feed tem
oferta suficiente: `/ofertas/tv`, `/ofertas/ps5`, `/ofertas/placa-de-video` (já previstas em 23/10) e, se
os dados confirmarem, `/ofertas/tenis`. Cada uma com a seção "Black Friday 2026" e as datas visíveis.

### Frente C: GEO, onde já ganhamos (contínuo, revisão semanal)

1. Rodada de perguntas no ChatGPT, Perplexity, Gemini e Visão geral de IA do Google: "grupo de black
   friday no whatsapp", "grupo de promoção de iphone/tv/ps5/tênis", "onde ver promoção real na black friday".
   Anotar quem é citado e o que a resposta diz.
2. Ajustar o bloco de fatos das páginas para responder o que a IA pergunta (horário, volume de ofertas,
   "só admins postam", grátis). `llms.txt` com as páginas de nicho e a de Black Friday.
3. IndexNow em toda publicação e toda atualização.

### Frente D: conteúdo de Black Friday no blog (de 02/11 a 20/11)

Três posts, cada um ligado ao grupo dele por `blog_posts.group_slug`:
- calendário de promoções de novembro e dezembro (11.11, Black Friday, Cyber Monday, 12.12);
- "como saber se a promoção da Black Friday é real" (o medo da "Black Fraude" é a maior objeção);
- um guia de compra do nicho que mais converter em 11/11 (ex.: "iPhone na Black Friday 2026").

Títulos e termos só depois dos dados da seção 6.

### Frente E: converter quem já chega (até 05/11)

1. Faixa de Black Friday no topo das lojas de eletrônico e de esporte (KaBuM, Netshoes, Centauro…),
   com o botão do grupo de nicho.
2. Contagem regressiva real para 11/11 e 27/11 nas páginas de nicho ("faltam 12 dias").
   Data real, nunca "últimas vagas" falso.
3. QR code no desktop no `GroupJoinCTA` (quem clica no computador converte menos, diagnóstico de 22/10).

### Frente F (precisa de decisão da Flávia): o convite dentro do próprio grupo

O que mais multiplica grupo de ofertas é o encaminhamento: a membro manda a oferta para a irmã, e a irmã
quer o grupo. Em 18/10 essa frente ficou fora ("sem mexer nas configurações de espelhamento"). Na Black
Friday o encaminhamento atinge o pico. A proposta mínima é **uma mensagem por dia** nos grupos de celular e
tech, de 20/11 a 30/11: "Black Friday chegando: encaminhe este grupo para quem vai comprar celular",
com o link. Sem mexer no rodapé de cada oferta. **Sim ou não?**

## 5. Metas e medição

Meta fechada depois do número de partida (membros de cada grupo hoje). Proposta de forma:

| Marco | O que medir | Se não bater |
|---|---|---|
| 06/11 | Páginas das frentes A e B no ar e no Bing; cliques no `/entrar` por origem | Ver na Captação qual origem não clicou e trocar o texto |
| 12/11 (dia seguinte ao 11.11) | Entradas por grupo × cliques no `/entrar` | Se cliques sobem e entradas não, o problema é o convite (nome, foto, descrição do grupo) |
| 20/11 | Citações nas IAs (nova rodada) | Reforçar o bloco de fatos das páginas não citadas |
| 01/12 | Entradas da Black Friday por grupo e por página | Decidir o que vira página de Natal e se abre o grupo seguinte da fila |

## 6. Dados que preciso da Flávia (sem eles não escrevo as páginas)

**A. Números de partida** (5 minutos)
1. Membros de cada grupo hoje (Celular, Tech Nerd, iPhone, Bebês, Salão, Festas, geral).
2. Exportação da aba **Captação** dos últimos 14 dias (origem, página, aparelho). Com isso eu vejo se
   celular e tech entram pelo site, pelo ChatGPT ou por fora.
3. No painel do Link Inteligente: cliques por grupo nos últimos 14 dias.

**B. Planejador de Palavras-chave** (Brasil, últimos 12 meses, com volume, concorrência e tendência de 3 meses):
- grupo black friday whatsapp · grupo de ofertas black friday · black friday 2026 · black friday celular ·
  black friday iphone · black friday tv · black friday ps5 · black friday notebook
- grupo de promoção de tênis · grupo de promoção de tênis whatsapp · grupo de tênis no whatsapp ·
  tenis em promoção · tenis de corrida em promoção · black friday tênis · black friday nike · black friday netshoes
- grupo de promoção de suplementos · grupo whatsapp promoção whey · whey promoção · creatina promoção ·
  black friday whey · black friday creatina
- grupo de promoção de perfumes whatsapp · perfume em promoção

**C. Google Trends** (Brasil, 12 meses, e de 2025 também para ver o pico): "black friday tênis" × "black
friday celular" × "black friday tv" × "black friday whey"; e "tenis em promoção" × "whey promoção".

**D. Search Console** (últimos 28 dias): consultas com "black", "promoção", "grupo", "tênis", "iphone",
"tv" e as páginas que receberam impressão.

**E. Respostas das IAs** (ChatGPT, Perplexity, Gemini, Visão geral do Google), com os sites citados:
"tem grupo de black friday no whatsapp?", "grupo de promoção de tênis no whatsapp", "grupo de promoção de
whey", "como saber se a promoção da black friday é real". Se preferir, eu monto as perguntas e você só cola
as respostas.

**F. Operação**
- O Espelha Grupos consegue tirar quantas ofertas de **tênis** e de **suplemento** por dia dos grupos que
  já espelhamos? (gatilho da seção 3)
- Frente F: sim ou não?

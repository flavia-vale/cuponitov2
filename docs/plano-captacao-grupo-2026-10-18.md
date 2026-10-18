# Plano de captação do Grupo de Ofertas Fafaciane: encher 1 grupo até 18/12/2026

Escrito em 18/10/2026. Retoma o plano de 09/10 (`wabot/docs/marketing/PLANO_LEADS_GRUPO_OFERTAS_2026-10-09.md`,
fase 1 entregue nos PRs #68, #69 e #78) e troca a aposta: o plano de 09/10 dependia quase só de o Google
indexar 2 páginas. Este aqui ataca **todos os lugares onde já existe gente** e cria lugares novos.

Regra deste plano: **toda ação é executada pelo Claude**. Quando uma ação precisa de algo que só a Flávia
tem (uma senha, um token, um "sim" para gastar dinheiro), ela aparece na seção 7, uma vez, e o resto é comigo.

---

## 1. Por que ninguém entrou (diagnóstico)

O que conferi hoje, 18/10:

| Ponto | Situação | Efeito |
|---|---|---|
| Link do botão | `linkdivulgador.com.br/g/ofertas-fafaciane` → 302 → `chat.whatsapp.com/EID15…` | **Funciona.** O problema não é o link. |
| Páginas `/grupo-whatsapp` e `/grupo-whatsapp/shopee` | 200, H1 e FAQ no HTML do servidor, no sitemap | Existem há **9 dias**. Indexação pedida no Google em 10/10. Página nova de site pequeno leva de 4 a 12 semanas para ranquear em "grupo de ofertas whatsapp", disputando com Pechinchou, Promobit e Pelando. **Tráfego hoje ≈ 0.** |
| Medição | `src/lib/analytics.ts` grava contagem só no `localStorage` do visitante, sem GA nem `dataLayer` | **Estamos cegos.** Não sabemos quantas pessoas viram o botão, quantas clicaram e de onde vieram. "Ninguém entrou" pode ser "ninguém clicou" ou "clicou e desistiu no convite": são problemas diferentes. |
| Momento de maior intenção | O modal "Copiar cupom" (`CouponCard`, `StoreCouponCard`) **não mostra o grupo** | Perdemos quem acabou de usar um cupom nosso, a pessoa mais propensa a querer o próximo. |
| Cupom expirado | Card fica cinza e não oferece nada | Quem chega por um cupom vencido vai embora sem alternativa. |
| Computador | O botão abre `chat.whatsapp.com`, que no computador pede o WhatsApp Web | Visitante de desktop **não tem QR Code** para entrar pelo celular. |
| Blog | Chamada do grupo só **no fim** do post | A maioria não rola até o fim. |
| Prova social | Nenhuma página mostra ofertas reais que saíram no grupo, nem quantos membros já tem | Link de grupo de desconhecido, sem prova, gera desconfiança (golpe de grupo de ofertas é comum). |
| `llms.txt` | Fala do Espelha Grupos e dos posts para admins; **não cita o grupo para o consumidor** | As IAs não têm de onde tirar "o Cuponito tem um grupo de ofertas". |
| Grupo e canal | As ofertas do grupo (≈200/dia) **não levam o link de entrada** | Toda oferta encaminhada de um membro para uma amiga é um convite desperdiçado. É o canal nº 1 de crescimento de grupo de ofertas. |
| Canais de entrada | Só um: busca orgânica | Um único canal lento não enche grupo em 2 meses. |

**Resumo:** o funil está montado, mas quase sem gente entrando nele, sem medição e sem o laço viral.

### 1.1 Os números que a Flávia mandou em 18/10 (painel do Link Inteligente + Search Console, 3 meses)

| Dado | Valor | Leitura |
|---|---|---|
| Membros somando os 2 grupos do link | **173** (139 no "Grupo de Ofertas - Fafaciane", 34 no "NOVO Grupo…") | Ponto de partida real. Meta: completar 1 grupo. |
| Cliques no Link Inteligente | **5 em 7 dias** (4 deles em 18/10, 1 foi o teste do Claude) | Ninguém entra porque **ninguém chega ao link**. O convite não é o gargalo. |
| Cliques do Google no site inteiro | **5 em 3 meses**; 2 nos últimos 28 dias | O Cuponito **não tem tráfego orgânico** para converter. |
| Impressões | ≈100 por dia desde 27/09, posição média 60 a 75 | O Google começou a mostrar o site há 3 semanas, ainda na página 6 ou 7. |
| Páginas com impressão | Lojas grandes (AliExpress 730, Casas Bahia 255, China in Box 211 na posição 29) | Nenhuma busca de "grupo de ofertas" ainda; `/grupo-whatsapp` teve 1 impressão. |

**O que isso muda:** com o site sem visitas, as frentes que só convertem quem já visita (F2) e as que dependem do Google
ranquear (F3, F4, F5) **não enchem o grupo até 18/12**. Elas continuam no plano porque cada uma leva minutos de código e
começa a render perto da Black Friday, mas a aposta de curto prazo passa a ser **levar o link a lugares onde já existe gente**:

1. **F6, laço viral dentro do WhatsApp:** os 173 membros e o canal já recebem ≈200 ofertas por dia. Cada encaminhamento
   precisa levar o link. É o único canal com gente hoje.
2. **F7, rede de clientes do Espelha Grupos:** admins com grupos cheios, o público mais próximo que existe.
3. **F8 e F9, diretórios e Pinterest:** lugares onde as pessoas já procuram "grupo de achadinhos".
4. **F11, anúncio pago:** deixa de ser plano B. Sem ele, a conta de 17 entradas por dia não fecha.

O Cuponito passa a ser **a página de destino que dá confiança** (prova social, fatos, ofertas de hoje) para o tráfego que
essas frentes trazem, mais do que a fonte do tráfego.

### 1.2 Grupos de nicho: agora não

A pergunta de 18/10 foi se vale abrir grupos de nicho (bebê, casa, beleza…) além do grupo geral de achadinhos.

**Recomendação: não abrir agora. Usar páginas de nicho que levam ao mesmo grupo geral, e abrir um grupo de nicho só quando
os dados mostrarem um tema puxando entradas.**

- Hoje entram 5 pessoas por semana. Abrir nichos divide esse pouco tráfego, e cada grupo novo nasce vazio. Grupo vazio
  converte pior que grupo com 170 pessoas, porque quem entra vê pouca gente e pouca prova.
- O geral também é o que mais aparece nas buscas: "grupo de ofertas" e "grupo de promoções" têm de 1 mil a 10 mil buscas
  por mês cada, contra 100 a 1 mil das variações de nicho (dados de 09/10).
- A promessa de nicho (mais específica e com menos ruído) é captada pelas páginas `/grupo-whatsapp/<tema>` (F3), sem custo
  de operar outro grupo.
- **Quando abrir:** quando um tema passar de ~20% dos cliques no `/entrar` (F1) **e** o grupo geral passar de 500 membros.
  Se o Espelha Grupos já filtra ofertas por palavra-chave, o grupo de nicho sai quase sem trabalho: o mesmo robô espelha só
  as ofertas do tema. Aí a página do tema troca de link, sem mexer em mais nada.
- **Exceção, só se o filtro for automático:** um grupo **temporário de Black Friday** (de 10/11 a 02/12). É um tema que tem
  pico de busca próprio ("grupo black friday whatsapp") e, depois, os membros vão para o grupo geral.

## 2. A meta em números

- Um grupo de WhatsApp lota com **1.024 membros**. Em 61 dias (18/10 → 18/12) são **≈17 entradas por dia** em média.
- A distribuição não vai ser uniforme: **11.11 (11/11), Black Friday (27/11), Cyber Monday (30/11), 12.12 (12/12) e Natal** concentram a procura por "grupo de promoções". O plano põe a maior parte do esforço para estar indexado e convertendo **antes de 10/11**.
- Conversão típica de visitante qualificado → entrada no grupo: 3% a 8% (página do grupo: 10% a 25%). Para 17/dia, precisamos de **300 a 500 visitas qualificadas por dia** somando todas as frentes, ou de um laço viral que traga parte delas sem visita ao site.

Marcos (cumulativos, conferidos toda segunda por mim, seção 6):

Ponto de partida (18/10): **173 membros** somando os 2 grupos do link (139 + 34). O Link Inteligente usa limite de 1.000 por
grupo. Completar 1 grupo = levar o "NOVO Grupo" de 34 a 1.000, ou ≈ **870 entradas novas** (o link sempre manda para o mais
vazio, então os dois enchem juntos: a meta real é ≈ 1.170 no total, ≈ 16 por dia).

| Data | Membros (soma dos grupos) | Gatilho se não bater |
|---|---|---|
| 01/11 | 300 | Ligar o anúncio pago (F11) se a Flávia autorizar |
| 15/11 | 550 | Dobrar o que a F1 mostrar que converte |
| 30/11 (pós-Black Friday) | 900 | — |
| 18/12 | ≈1.170 (os 2 grupos perto de 1.000 cada; o Link Inteligente abre o 3º) | — |

## 3. As frentes

Cada frente diz **o que eu faço**, **onde** (repositório/arquivo) e **quando**. Ordem = prioridade.

### F1. Medição de verdade (dias 1 e 2), pré-requisito de tudo

1. **Redirecionador próprio `/entrar`** (Edge Function na Vercel, `api/entrar.ts` + regra no `middleware.ts`):
   todo botão do site passa a apontar para `/entrar?o=<origem>` (ex.: `o=modal-cupom-shopee`, `o=blog-cashback`),
   que grava a origem numa tabela `group_join_clicks` (data, origem, página, desktop/celular, referer) e responde
   302 para o Link Inteligente. Funciona sem conta de analytics e sem cookie, e não depende da Flávia.
2. **Aba "Captação" no admin** (`AdminGroupFunnelTab`): cliques por dia, por origem e por página; comparação com os
   cliques do painel do Link Inteligente e com o número de membros (campo manual, ou automático se o wabot expuser).
3. **`trackEvent` passa a gravar no Supabase** os eventos que já existem (`coupon_copy`, `whatsapp_click`), para saber
   a taxa "copiou cupom → entrou no grupo".
4. **Links por origem no Link Inteligente** (se o painel permitir mais de um link para o mesmo grupo): um para o site, um
   para as mensagens do grupo, um para diretórios. Assim separamos "veio do site" de "veio de encaminhamento".

> Regra do CLAUDE.md respeitada: o destino do `/entrar` continua vindo de `site_settings.global_links`, editável no painel.

### F2. Converter quem já visita o Cuponito (dias 2 a 5)

O site já recebe gente buscando "cupom Shopee", "cupom Mercado Livre" etc. (64 páginas de loja, 25 de categoria, 11 posts).
Cada um desses visitantes quer economizar: é exatamente o público do grupo.

1. **Modal do cupom:** depois de "Copiar e ir para a loja", o modal ganha um bloco
   "Os próximos cupons da *Shopee* chegam primeiro no grupo → Entrar grátis". É o ponto de maior intenção do site.
2. **Cupom expirado:** troca o card cinza mudo por "Esse cupom acabou. Os novos saem no grupo, de graça → Entrar".
3. **Página de loja sem cupom ativo / busca sem resultado / 404:** mesmo bloco, com o nome da loja.
4. **QR Code no desktop:** em tela grande, o `GroupJoinCTA` mostra o QR do link de entrada ("aponte a câmera do celular").
   Gerado em SVG no próprio código, sem serviço externo.
5. **Barra fixa no rodapé do celular** em todas as páginas públicas: "Grupo de ofertas grátis no WhatsApp · Entrar",
   com botão de fechar lembrado no navegador. Ocupa no máximo 15% da tela: **não é** o pop-up de tela cheia que o Google
   penaliza no mobile.
6. **Blog:** chamada compacta depois do 2º parágrafo de todo post, além da do fim.
7. **Saída no desktop (exit intent):** ao levar o mouse para fechar a aba, um card lateral com o QR. Só no desktop e
   uma vez por visitante.
8. **Home:** o grupo vira a chamada principal do topo ("200 ofertas por dia no seu WhatsApp, grátis"), e a busca de cupom
   fica logo abaixo.
9. **Página de loja:** faixa curta acima da lista de cupons: "Quer ser avisada quando sair cupom novo da *Amazon*?".
10. **Teste A/B dos textos** usando o `experiment_exposure` que já existe, medido pela F1.

### F3. Ocupar todas as buscas "grupo de …" (dias 3 a 14; precisa estar no ar antes de 10/11)

O formato que ranqueia (visto em 09/10) é uma página `/grupo-whatsapp/<tema>` dentro de site de cupons. Hoje temos 2.
Vou criar as páginas abaixo **pela tabela `whatsapp_group_pages`** (editáveis no admin), cada uma com texto próprio,
FAQ própria e, principalmente, **a lista viva das últimas ofertas daquele tema** (F5). É isso que separa uma página útil
de uma página-porta (doorway), que o Google pune.

| Página | Busca-alvo principal |
|---|---|
| `/grupo-whatsapp/achadinhos` | grupo de achadinhos whatsapp |
| `/grupo-whatsapp/promocoes` | grupo de promoções whatsapp, link grupo de promoções |
| `/grupo-whatsapp/cupons` | grupo de cupons de desconto |
| `/grupo-whatsapp/mercado-livre` | grupo de ofertas mercado livre |
| `/grupo-whatsapp/amazon` | grupo de ofertas amazon whatsapp |
| `/grupo-whatsapp/magalu` | grupo de ofertas magalu |
| `/grupo-whatsapp/shein` | grupo de achadinhos shein |
| `/grupo-whatsapp/black-friday` | grupo black friday whatsapp 2026 (pico de 10/11 a 30/11) |
| `/grupo-whatsapp/natal` | ofertas de natal whatsapp |
| `/grupo-whatsapp/erro-de-preco` | grupo de erro de preço, bug de preço |
| `/grupo-whatsapp/ofertas-relampago` | ofertas relâmpago shopee whatsapp |
| `/grupo-whatsapp/casa` | achadinhos para casa |
| `/grupo-whatsapp/beleza` | achadinhos de beleza / skincare barato |
| `/grupo-whatsapp/moda` | achadinhos de roupa |
| `/grupo-whatsapp/tecnologia` | ofertas de celular / eletrônicos whatsapp |
| `/grupo-whatsapp/mae-e-bebe` | achadinhos de bebê, enxoval barato |
| `/grupo-whatsapp/canal` | canal de ofertas whatsapp (para quem não quer mostrar o número) |

Para cada página: entrada no prerender (já existe a rota), sitemap, IndexNow para o Bing no mesmo dia, **3 links internos
reais** (loja, categoria e post relacionados) e link vindo do hub `/grupo-whatsapp`. Só crio a página de um tema se o grupo
de fato manda ofertas dele: a Flávia confirma a lista uma vez (seção 7).

### F4. Conteúdo que captura quem ainda está pesquisando (dias 5 a 30)

Posts no blog, no template "extraível por IA" (`docs/ai-seo-sprint3-4/02-…`), com o grupo como resposta natural:

1. **"Melhores grupos de ofertas no WhatsApp em 2026: como escolher"**: critérios honestos (só admins postam, volume por
   dia, lojas, link oficial, sem cobrança) e tabela comparando formatos (grupo, canal, Telegram, app). O nosso grupo entra
   como uma das opções, com os fatos reais. Busca: "melhores grupos de ofertas".
2. **"Grupo de ofertas é golpe? 7 sinais para desconfiar"**: busca de confiança, alta intenção; termina no nosso grupo
   como exemplo de grupo que segue as regras.
3. **"Como achar link de grupo de promoções que ainda funciona"**: explica convites revogados ou grupos lotados
   (o problema que o Link Inteligente resolve).
4. **"Calendário de promoções de novembro e dezembro de 2026"**: 11.11, Black Friday 27/11, Cyber Monday 30/11, 12.12,
   Natal. "Receba no dia pelo grupo".
5. **"Black Friday 2026: como não cair em falsa promoção"** e **"Black Friday Shopee / Amazon / Mercado Livre 2026"**
   (3 posts curtos).
6. **"Achadinhos da Shopee até R$ 20"**, **"Achadinhos de casa"**, **"Presentes de Natal até R$ 50"**: listas
   compartilháveis no WhatsApp, com og:image própria e o botão "mandar para uma amiga".
7. Atualizar os 11 posts existentes: chamada do grupo no 2º parágrafo (F2.6) e um parágrafo "receba no WhatsApp" quando o
   tema combinar.

**IAs (ChatGPT, Gemini, Perplexity, Visão geral do Google):**
- `public/llms.txt` ganha a seção "Grupo de ofertas do Cuponito para consumidores", com os fatos e as URLs da F3.
- Bloco de fatos curtos ("O Grupo de Ofertas Fafaciane é…") no topo de cada página da F3: é o trecho que a IA cita.
- Schema `FAQPage` em todas (já sai pelo prerender) e `Organization.sameAs` com o canal do WhatsApp.
- IndexNow a cada publicação: o ChatGPT busca pelo Bing.

### F5. Páginas vivas, geradas sozinhas todo dia (dias 7 a 14)

1. **`/achadinhos-hoje`** (e `/achadinhos-hoje/shopee`, `/mercado-livre`, …): as ofertas do dia, geradas a partir dos dados
   que o site já tem (cupons, e as ofertas do grupo se o wabot liberar a leitura, seção 7), com data visível, HTML do
   servidor e lastmod real no sitemap. Busca: "achadinhos shopee hoje", "promoção de hoje". Conteúdo novo todo dia
   sem trabalho manual, e é a prova social que falta (F2): "olha o que saiu no grupo hoje".
2. **Feed "saiu no grupo agora"** nas páginas da F3: as 10 últimas ofertas do tema, com horário.
3. **Contador real de membros** nas páginas, se o wabot expuser o número. Nunca número inventado.

### F6. Laço viral dentro do próprio WhatsApp (dias 2 a 7), o maior multiplicador

Grupo de ofertas cresce por **encaminhamento**: a membro vê a oferta, manda para a irmã, a irmã quer o grupo.
Hoje a mensagem chega sem caminho de volta.

1. **Rodapé em toda oferta enviada ao grupo e ao canal** (configuração/código no wabot): uma linha
   `📲 Mais ofertas assim: linkdivulgador.com.br/g/ofertas-fafaciane`. Com ≈200 ofertas/dia e cada membro encaminhando
   algumas, isso vira centenas de convites por dia.
2. **Botão "Mandar para uma amiga" no site**, em todo cupom e oferta: `wa.me/?text=` com o cupom + link do grupo.
3. **Mensagem fixa semanal no grupo** (automática pelo wabot, terça 20h): "Conhece alguém que ama desconto? Encaminhe
   este convite", com o link. Mais o texto da descrição do grupo e a mensagem de boas-vindas com o mesmo pedido.
4. **Canal → grupo:** post fixo no canal convidando para o grupo (quem quer interagir menos fica no canal; quem quer tudo,
   no grupo), e vice-versa quando o grupo lotar.
5. **Status do WhatsApp do número administrador** com as 3 melhores ofertas do dia + link (automático, se o wabot postar
   status; senão fica fora).

> Depende do repositório `wabot`: preciso que a Flávia autorize esta sessão a acessar o repositório (seção 7). O código é meu.

### F7. Ser dono do diretório (dias 10 a 30), a jogada fora da caixa

Quem busca "grupos de whatsapp de ofertas", "link de grupo de promoção" cai em **diretórios de grupos**. Em vez de só
pedir para aparecer nos diretórios dos outros, a Flávia tem um ativo que ninguém tem: **a base de clientes do Espelha
Grupos, que são justamente admins de grupos de ofertas.**

1. **Diretório público de grupos de ofertas** (no Cuponito, `/grupos-de-ofertas`, ou em `linkdivulgador.com.br/grupos`):
   lista grupos ativos por tema (Shopee, moda, casa, cidade…), cada um com o seu Link Inteligente (sem link morto, o
   maior defeito dos diretórios de hoje). **O Grupo de Ofertas Fafaciane é o destaque fixo de cada tema.**
2. **Entrada no diretório por opção do cliente** dentro do painel do Espelha Grupos ("listar meu grupo no diretório"):
   ninguém é abordado, quem quer marca a caixa. Ganho duplo: cada cliente que divulga a página do próprio grupo no diretório
   traz visita que vê o nosso grupo primeiro, e o diretório atrai novos admins para o Espelha Grupos.
3. **Troca de divulgação automática entre clientes** (opcional, também por opção): o grupo do cliente A divulga o B uma vez
   por semana e vice-versa. O nosso grupo participa como mais um. Só entre grupos de temas próximos e com regra clara.

### F8. Diretórios e agregadores externos (dias 3 a 10)

Eu cadastro o grupo e o canal em diretórios de grupos de WhatsApp que aceitam envio sem login (pelo navegador desta sessão),
com o texto e a imagem prontos e o link de origem `diretorio` (F1.4). Antes de enviar, mostro à Flávia a lista dos sites e o
texto **uma vez**, porque é publicação em site de terceiros em nome dela. Onde o cadastro pede conta, telefone ou captcha,
não insisto: fica fora.

### F9. Pinterest automático (opcional, dias 10 a 60)

"Achadinhos" é um dos maiores temas do Pinterest no Brasil, e pin dura meses (diferente de post de Instagram).
Com **um token da API do Pinterest** (a Flávia gera uma vez), eu:
- gero os pins pelo Canva (já conectado nesta sessão) a partir das ofertas do dia: imagem do produto, preço e "mais no grupo";
- publico por um agendador (Vercel Cron) de 5 a 10 pins por dia, cada um levando para a página `/achadinhos-hoje` ou
  `/grupo-whatsapp/<tema>`, nunca direto para o convite (o Pinterest pune link encurtado/redirecionado).

### F10. Revisão semanal feita por mim

Uma tarefa agendada nesta conta, toda segunda às 9h: leio a tabela da F1, comparo com os marcos da seção 2, corto o que
não converte, reforço o que converte e abro o PR da semana. Relato em 5 linhas o que mudou.

### F11. Acelerador pago (opcional, a decisão é da Flávia porque gasta dinheiro)

Se em 01/11 estivermos abaixo de 100 membros, ou para garantir o pico de Black Friday:
- **Google Ads, rede de pesquisa**, palavras "grupo de ofertas whatsapp", "grupo de promoções", "grupo de achadinhos",
  "grupo black friday" → página `/grupo-whatsapp` (nunca direto para o convite). Eu monto a campanha inteira em arquivo
  para importar no Google Ads Editor (palavras, negativas, anúncios, extensões) e a conversão vem pela F1.
  Busca de nicho com CPC baixo; orçamento sugerido de R$ 20 a 30 por dia, ≈ 30 a 60 entradas/dia se a conversão da página
  for 10%. Números a confirmar no planejador de palavras-chave.
- **Meta, anúncio "clique para o WhatsApp"**: eu escrevo os textos e as artes no Canva; a criação da campanha exige a conta
  dela.

## 4. O que **não** vamos fazer, mesmo sendo agressivos

Agressivo sim; queimar o domínio, o número ou o grupo, não.

- **Mandar link em grupos dos outros ou para números que não pediram**: spam, que o WhatsApp bane, e queimaria o número que
  posta as ofertas.
- **Contador de membros inventado, depoimentos falsos ou "últimas vagas" falso**: viola a regra de propaganda enganosa e a
  política de spam do Google.
- **HTML diferente para robô e para pessoa** (cloaking): já é regra do CLAUDE.md.
- **Pop-up de tela cheia para quem chega do Google no celular**: o Google rebaixa a página. Barra pequena e modal depois de
  um clique, sim.
- **Sorteio para quem convidar amigas**: sorteio no Brasil precisa de autorização prévia (Lei 5.768/71). Fica fora.
- **Comprar membros**: membro comprado não compra pelo link e derruba o engajamento do grupo.
- **Centenas de páginas por cidade ("grupo de ofertas em Campinas")** sem conteúdo diferente: são páginas-porta e arriscam
  o site inteiro.

## 5. Cronograma

Reordenado com os dados de 18/10 (seção 1.1): primeiro o que leva o link a quem já existe, depois o que depende do Google.

| Semana | Entregas (todas minhas) |
|---|---|
| 18/10 a 24/10 | **F6.1 e F6.3** (rodapé com link em toda oferta, mensagem semanal), se o wabot for liberado. **F11** montada para aprovar. **F8** (lista para aprovar). F1 completa (`/entrar`, tabela, aba Captação). F2 itens 1 a 6 (rápidos e prontos para quando o tráfego vier). `llms.txt`. |
| 25/10 a 31/10 | F3: 9 primeiras páginas (achadinhos, promoções, cupons, Mercado Livre, Amazon, Black Friday, erro de preço, ofertas relâmpago, canal) + IndexNow. F4 posts 1, 2 e 4. F2 itens 7 a 10. |
| 01/11 a 07/11 | Revisão do marco de 100. F5 (`/achadinhos-hoje` + feed). F3: 8 páginas restantes. F4 posts 3 e 5. Decisão sobre F11. |
| 08/11 a 14/11 | Pico do 11.11. F7 (diretório + opção no Espelha Grupos). F4 post 6. Reforço das páginas da F3 que já têm impressão. |
| 15/11 a 30/11 | Black Friday: páginas da F3 e posts com a data e as ofertas do dia, atualização diária automática, rodapé viral no ar. |
| 01/12 a 18/12 | 12.12 e Natal: `/grupo-whatsapp/natal`, listas de presentes. Quando o grupo lotar, o Link Inteligente passa para o 2º grupo sem mexer no site. |

## 6. Como vou medir

- **Diário (automático, aba Captação):** cliques no `/entrar` por origem; taxa cupom copiado → clique no grupo.
- **Semanal (F10, segunda):** membros (do painel do grupo) × cliques = taxa de entrada no convite. Se cliques sobem e
  membros não, o problema está no convite (nome, foto, descrição do grupo), e eu reescrevo esses textos.
- **Busca:** impressões e cliques no Search Console das páginas F3/F4 (a Flávia exporta, ou eu leio se ela conectar o
  Search Console à sessão).
- **IAs:** rodada de perguntas no ChatGPT/Gemini em 15/11 e 15/12 ("qual um bom grupo de ofertas no WhatsApp?").

## 7. O que preciso da Flávia (uma vez só, o resto é comigo)

Dados: ~~1. cliques do Link Inteligente e membros~~ e ~~2. Search Console~~ chegaram em 18/10 (seção 1.1).

Acessos:
3. **Liberar o repositório `wabot` nesta sessão** (o pedido de acesso foi bloqueado pela permissão automática). Sem ele
   ficam paradas a F6 (rodapé viral, mensagem semanal), a F5 com ofertas reais do grupo e a F7.
4. **Confirmar os temas da F3** (ex.: o grupo manda ofertas de bebê? de tecnologia?), para só criar página de tema real.

Decisões (sim ou não):
5. **F8:** posso cadastrar o grupo em diretórios externos em seu nome? (eu mostro a lista antes)
6. **F9:** quer o Pinterest automático? Se sim, gerar um token da API do Pinterest.
7. **F11:** autoriza gasto com Google Ads? Qual teto por dia?
8. **Migrations:** cada entrega com migration continua precisando ser rodada no SQL Editor (como hoje), a não ser que você
   me passe acesso ao Supabase para rodar o `supabase db push` daqui.

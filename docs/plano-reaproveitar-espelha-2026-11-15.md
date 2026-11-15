# O que reaproveitar do plano agressivo do Espelha Grupos (15/11/2026)

De 13 a 15/11 o Espelha Grupos (wabot) passou por uma rodada de SEO, GEO e
conteúdo. Este arquivo separa o que dela serve ao Cuponito do que não serve.
Base: `docs/plano-crescimento-agressivo-2026-11-12.md` (seções 7 a 9),
`docs/lista-flavia.md` e `public/llms.txt`.

**Diferença que muda tudo:** o Espelha vende uma assinatura para afiliados
(B2B). O Cuponito capta **membro de grupo** e clique em cupom (consumidor). E o
lead do Cuponito vem do **ChatGPT, com 65% dos cliques**, contra 2% do Google
(seção 7.2).

## 1. O que o Cuponito já tem (não refazer)

| Do Espelha | No Cuponito |
|---|---|
| Pedir dado de mercado antes de construir | regra do `CLAUDE.md` (22/10) |
| Planejador em lotes, plano por prioridade | seções 7.4 e 8 do plano de 12/11 (21.924 termos) |
| IndexNow do Bing | `api/indexnow.ts`, que avisa na publicação |
| Página nova com ≥3 links internos, título ≤55 | checklist do `CLAUDE.md` + `npm run seo:entrega` |
| `llms.txt` e `pricing.md` | `public/llms.txt`, `public/pricing.md` |
| Medir de onde vem o lead | `/entrar` + aba Captação + Link Inteligente |
| Plano de Black Friday | `docs/plano-black-november-2026-10-30.md` |
| Comparativos entre lojas | `docs/ai-seo-comparativos/` (Shopee × Amazon etc.) |

## 2. O que reaproveitar (por ordem de impacto esperado)

| # | Do Espelha | Como fica no Cuponito | Por que agora | Dado que falta |
|---|---|---|---|---|
| A | **Bloco "faz / não faz"** gerado de uma ficha única, igual em todas as páginas, no `llms.txt` e com teste de igualdade | "O que o grupo faz / não faz": não pede dado, não cobra, não é grupo de conversa, quantas ofertas por dia, sair quando quiser, quem escolhe as ofertas | É o texto que a IA copia quando alguém pergunta "grupo de ofertas é confiável?". A IA traz 65% dos leads | Flávia confirma cada frase (fato do grupo, não suposição) |
| B | **Rodada nas IAs 7 dias depois de cada leva** (janela anônima, busca ligada, anotar se cita e com que texto) | Trazer a rodada de 07/12 para **22/11**, 7 dias depois das 11 páginas de ofertas de 12–13/11, antes da Black Friday | Se a IA não cita as páginas de ofertas, dá tempo de corrigir antes de 27/11 | As respostas (prints) das perguntas da seção 7.8 |
| C | **Comparativo com concorrente de marca** ("Alternativa ao X", "X ou Y: qual escolher"); no Espelha 95% das impressões vinham do nome de concorrente | "Pelando ou grupo de ofertas no WhatsApp?", "Promobit, Méliuz, Cuponomia: qual usar", "grupo do Pelando no WhatsApp" | O consumidor pode buscar o nome do site de cupom que já conhece | **Volume no Planejador** dos nomes (lote abaixo) |
| D | **Depoimentos reais com autorização**, literais, sem promessa, com teste que barra texto inventado | 3 a 5 frases de membros dos grupos ("achei o celular X mais barato no grupo"), nas páginas de grupo e no "é confiável" | Prova social na página que a IA cita; ajuda os 2 de cada 3 que clicam e não ficam (7.3) | Prints com "autorizo publicar" |
| E | **Roteiros de vídeo** para as buscas que mostram vídeo na 1ª página, título com o termo buscado, UTM na descrição | Shorts/TikTok "celular em promoção hoje", "PS5 na Black Friday: o desconto é real?", terminando no link do grupo | "Celular em promoção" tem 90.500 buscas/mês e o Google mostra vídeo em busca de produto | Prints da 1ª página de 3 buscas (abaixo) |
| F | **Convite de parceria** para criadores que aparecem nas buscas, com mensagem pronta | Troca de divulgação com perfis de achadinhos/promoção (Instagram, TikTok) de nicho: tech, tênis, beleza | Os grupos de nicho têm de 9 a 64 membros; 1 menção de criador do nicho pode dobrar | Sim/não da Flávia; lista sai das buscas de E |
| G | **Fila única de reindexação** com data, 10 por dia, e lembrete automático | Juntar as listas soltas do `lista-flavia.md` (várias "Search Console" ainda abertas) numa fila só | Hoje há pedidos de 10/10 e 18/10 sem marcar; a lista nova não para de crescer | Nenhum (o Claude faz) |
| H | **Reclame Aqui** e página "é confiável" com a busca de confiança | "cuponito é confiável", "grupo de ofertas whatsapp é golpe" | Já existe `/blog/grupo-de-ofertas-whatsapp-e-confiavel`; falta medir a marca | Volume no Planejador (lote abaixo) |

## 3. O que NÃO serve

- Fichas de **preço** de concorrente e o teste que barra preço sem ficha: o
  Cuponito não vende plano. (Vale só se entrar o comparativo C, para os
  **fatos** do concorrente: quantas lojas, se tem app, se tem grupo, com data
  e fonte.)
- "Migre e ganhe 30 dias", teste grátis, e-mails de ativação e cobrança.
- Página "bot grátis": o público do Cuponito não procura ferramenta.

## 4. Pedido de dados para a Flávia (o mínimo)

**Planejador de Palavras-chave** (Brasil, 12 meses), um lote só:

```
pelando
promobit
meliuz
cuponomia
gatry
pelando whatsapp
grupo pelando whatsapp
promobit whatsapp
alternativa ao pelando
sites de promoção confiáveis
site de cupom confiável
cuponito
cuponito é confiável
grupo de ofertas whatsapp é golpe
grupo de promoção whatsapp é confiável
```

Decide: o nome de concorrente com mais de ~1.000 buscas/mês e "whatsapp"
junto ganha comparativo (C). "Cuponito" e "é confiável" decidem H.

**Google, janela anônima, print da 1ª página:**
1. `celular em promoção` (tem vídeo? quem aparece?)
2. `pelando whatsapp`
3. `grupo de ofertas whatsapp é confiável`

**Para A e D:** confirmar as frases do "faz / não faz" (o Claude manda o
rascunho) e mandar os prints de depoimento com autorização.

## 5. Ordem sugerida

1. G hoje (sem dado).
2. A e B até 22/11 (é a IA que traz o lead; antes da Black Friday).
3. C, E e H com os números do lote.
4. D e F quando houver os prints e o sim.

# Diagnóstico do funil do grupo — 22/10/2026

Sintoma: 26 cliques no botão "Entrar no grupo" em 7 dias (aba Captação) e nenhum membro novo.

## O que os dados mostram

| Fonte | Número |
|---|---|
| Google (Search Console, 90 dias) | 2.624 impressões, **5 cliques**, posição média 51 (computador) e 67 (celular) |
| Cupons no banco | 16.626 com `status = true`, **16.419 vencidos** (98,8%) |
| KaBuM | ~14 mil cupons na página; 180 válidos |
| AliExpress (página com mais impressões no Google) | 21 cupons na página, **0 válidos** |

O job que desativa vencidos (`expire-coupons-daily`) foi desligado em 05/05 e não voltou.
A página da loja mostrava todos os cupons e o botão do grupo vinha só depois da lista inteira.

## O que mudou (este PR)

- `src/lib/couponValidity.ts`: filtro único "sem validade ou validade ≥ agora", usado pelo React
  (`useCoupons`, `useStoreCoupons`) e pelo prerender (`prerender/data.ts`). Funciona antes da migration rodar.
- `StorePage`: botão do grupo logo abaixo do cabeçalho da loja (`GroupJoinCTA compact`, origem `store_top`
  na Captação); lista de 12 em 12 com "Ver mais"; sem a seção "cupons expirados"; selo "Verificado hoje"
  só quando há cupom válido. Loja sem cupom: "Sem cupom da X agora? Receba as ofertas no WhatsApp".
- `prerender/render.ts`: a chamada do grupo vem antes da lista, como no React (mesmo HTML para todos).
- Migration `20261022120000_desativa_cupons_vencidos.sql`: desativa (não apaga) os vencidos e agenda o job
  `deactivate-expired-coupons` (SQL puro, 03:10 de Brasília).

## 26 cliques e 0 membros — o que conferir

1. **Quem clicou:** na Captação, ver página e aparelho. Com ~2 visitas/semana vindas do Google, boa parte
   dos 26 pode ser teste da própria equipe.
2. **Link Inteligente:** o `linkdivulgador` troca de grupo quando um enche. Conferir no painel dele os
   cliques do período e os membros novos **de todos os grupos** da rotação, não só do principal.
3. **Computador:** clique no desktop abre o WhatsApp Web/app e converte menos; ver a fatia `desktop`.

## Grupos de nicho

Só onde o público da página bate com o grupo:
- `promo-tech` → página da KaBuM (é a loja com mais cupom válido). Dá para fazer pelo painel: página do
  grupo com `store_slug = cupom-desconto-kabum-br` e `join_url = https://linkdivulgador.com.br/g/promo-tech`.
- `promo-bebes`, `promo-festas`, `promo-salao`: não há página do site com esse público. Precisam de página
  própria em `/grupo-whatsapp/<slug>` e posts de blog para buscas como "grupo de promoção para salão".

## Medir visitas

O site não tem contador de visitas (sem GA4 nem Vercel Analytics). Sem esse número não dá para saber a
taxa visita → clique. Próximo passo: ligar o Vercel Web Analytics (sem cookie) no projeto.

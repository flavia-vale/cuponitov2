# "O que o grupo faz / não faz" — confirmado pela Flávia em 15/11/2026

Frente A de `docs/plano-reaproveitar-espelha-2026-11-15.md`. É o bloco que a IA
copia quando alguém pergunta "grupo de ofertas no WhatsApp é confiável?". Depois
de confirmado, ele sai de **uma fonte só** e aparece igual nas páginas de grupo,
na página "é confiável" e no `llms.txt`, com um teste que barra diferença.

✅ = fato. **15/11: a Flávia confirmou todos os "Não faz"**, que agora saem de `GROUP_DOES_NOT` em `src/lib/whatsappGroup.ts` (páginas de grupo e de ofertas, React e HTML do servidor) e estão no `public/llms.txt`; `npm run seo:entrega` confere frase por frase.

## Faz

1. ✅ É grátis: o grupo nunca cobra nada.
2. ✅ Só os administradores postam (não é grupo de conversa).
3. ✅ Ritmo: o grupo geral manda cerca de 200 ofertas por dia; cada grupo de nicho tem o seu (Promo Celular cerca de 5 por dia, Promo iPhone cerca de 2 por semana).
4. ✅ Ofertas de Shopee, Mercado Livre, Amazon, Magalu e Shein, sempre com o link da loja oficial.
5. ✅ Os links são de afiliado.
   ✅ Já publicado em `GROUP_TRUST_FACTS`: "a loja paga uma comissão ao Cuponito e você paga o mesmo preço".
6. ✅ Tem canal do WhatsApp com as mesmas ofertas, para quem não quer mostrar o número.

## Não faz

1. ✅ Não vende nada e nunca pede PIX, cartão ou pagamento.
2. ✅ Não pede dados pessoais, senha nem código do WhatsApp.
3. ✅ Não chama ninguém no privado.
4. ✅ Não adiciona ninguém sem pedir; dá para sair quando quiser.
5. ✅ Não garante o preço: a oferta pode acabar ou mudar na loja a qualquer momento.
6. ✅ Não é loja: a compra, a entrega e a troca são com a loja.

## Falta

- Regra do grupo que não está aqui (horário sem mensagem, idade mínima): mandar o texto se houver.

# O que a Flávia faz do lado dela

Lista viva: o Claude acrescenta itens a cada entrega. Marque `[x]` quando fizer.

## Imagens do Gemini (docs/prompts-gemini-11-imagens.md)

- [x] Lote 1 (itens 1 a 4): cashback, Shopee hoje, Mercado Livre e Dia das Mães.
- [x] Rodar a migration `supabase/migrations/20261009200000_capas_gemini_lote1.sql`
      no SQL Editor do Supabase, **depois** do deploy deste PR na Vercel.
- [x] Lote 2 (itens 7 a 11): 3 imagens dentro dos posts e as 2 das páginas do grupo.
- [ ] Rodar `supabase/migrations/20261010130000_imagens_internas_e_grupo.sql` no SQL Editor,
      **depois** do deploy na Vercel.
- [ ] Mandar de novo, como arquivo, as capas dos itens 5 (bots) e 6 (espelhar): chegaram só
      como prévia no chat, sem o arquivo.

## Títulos longos (Bing, 10/10)

- [ ] Rodar `supabase/migrations/20261010120000_titulos_seo_curtos.sql` no SQL Editor do Supabase.
- [ ] Depois, no Bing → Envio de URL, reenviar os 4: cashback-vs-cupom-qual-compensa, cupom-shopee-hoje,
      mercado-livre-guia-para-economizar, presentes-dia-das-maes-comprar-com-desconto.
- Regra para posts novos: título SEO (meta_title) com no máximo 55 caracteres, já com " | Cuponito".

## Sitemap

- [ ] Search Console → Sitemaps → enviar `sitemap.xml` (se ainda não estiver lá; status deve ficar "Sucesso", ~110 páginas).
- [ ] Bing Webmaster → Sitemaps → `https://www.cuponito.com.br/sitemap.xml`.

## Reindexação (Search Console → Inspecionar URL → Solicitar indexação; Bing → Enviar URLs)

Só depois da migration rodar. Até 10 por dia.

- [x] https://www.cuponito.com.br/grupo-whatsapp — pedido em 10/10/2026 (Google)
- [x] https://www.cuponito.com.br/grupo-whatsapp/shopee — pedido em 10/10/2026 (Google)
- [x] https://www.cuponito.com.br/blog/cashback-vs-cupom-qual-compensa — pedido em 10/10/2026 (Google)
- [x] https://www.cuponito.com.br/blog/cupom-shopee-hoje — pedido em 10/10/2026 (Google)
- [ ] https://www.cuponito.com.br/blog/mercado-livre-guia-para-economizar
- [ ] https://www.cuponito.com.br/blog/presentes-dia-das-maes-comprar-com-desconto
- [ ] https://www.cuponito.com.br/blog/cupom-shopee-vs-amazon-2026
- [ ] https://www.cuponito.com.br/blog/cupom-amazon-vs-mercado-livre-2026
- [ ] https://www.cuponito.com.br/blog/melhores-cupons-tech-vs-moda
- [ ] https://www.cuponito.com.br/blog/mercado-livre-vs-shopee-frete-gratis

## Fora do site (plano de leads, docs/marketing no wabot)

- [ ] Nome do canal do WhatsApp com "ofertas" + "Shopee" no nome.
- [ ] Cadastrar o grupo/canal em diretórios de grupos de WhatsApp.
- [ ] Bio do Instagram com o link https://linkdivulgador.com.br/g/ofertas-fafaciane.

## Medição

- [ ] 03 a 07/11: conferir cliques do Link Inteligente e impressões das páginas novas.
- [ ] 07/12: rodada nas IAs (ChatGPT, Gemini, Google IA) perguntando por grupo de ofertas.

## Captação do grupo (docs/plano-captacao-grupo-2026-10-18.md, seção 7)

- [x] Mandar os cliques do Link Inteligente e o número atual de membros (18/10: 173 membros, 5 cliques em 7 dias).
- [x] Search Console, 3 meses (18/10: 5 cliques, 2.351 impressões).
- [x] Liberar o repositório `wabot` na sessão do Claude (18/10).
- [ ] Confirmar os temas de ofertas do grupo (bebê, tecnologia, casa, beleza, moda…).
- [x] Google Ads (F11): não (18/10). Foco só em SEO e GEO; Pinterest (F9) fora.
- [ ] Responder sim/não: diretórios externos (F8).

## SEO/GEO do grupo, lote 1 (PR #80)

- [x] Rodar `supabase/migrations/20261018120000_grupo_paginas_tema_e_posts.sql` no SQL Editor (18/10).
- [x] IndexNow das 9 URLs (Claude, 19/10: Bing respondeu 200).
- [ ] Search Console → Inspecionar URL → Solicitar indexação (até 10 por dia):
  - https://www.cuponito.com.br/grupo-whatsapp/achadinhos
  - https://www.cuponito.com.br/grupo-whatsapp/mercado-livre
  - https://www.cuponito.com.br/grupo-whatsapp/amazon
  - https://www.cuponito.com.br/grupo-whatsapp/shein
  - https://www.cuponito.com.br/blog/grupo-de-ofertas-whatsapp-e-confiavel
  - https://www.cuponito.com.br/blog/como-escolher-grupo-de-ofertas-whatsapp
  - https://www.cuponito.com.br/grupo-whatsapp (título e seção de Black Friday novos)

## Medição do grupo (PR claude/medicao-grupo-entrar)

- [x] Rodar `supabase/migrations/20261018150000_group_join_clicks.sql` no SQL Editor **antes** do deploy na Vercel
      (sem a tabela os botões continuam funcionando, só não contam).
- [ ] Depois de 7 dias: admin → "Captação do grupo" e comparar com os cliques do painel do Link Inteligente.
- Obs.: em 19/10 o Claude gravou 2 cliques de teste com origem `teste_claude` (não são visitas reais).

## Achadinhos de hoje (PR claude/achadinhos-hoje + wabot #2714)

- [ ] wabot: mesclar o PR #2714 em `develop`, conferir no staging e depois levar para `main`.
- [ ] Antes do deploy em `main`: acrescentar `SMART_LINK_PUBLIC_FEED=ofertas-fafaciane` no `.env` de `~/wabot` (VPS).
- [ ] Depois: me avisar. Eu confiro `https://linkdivulgador.com.br/g/ofertas-fafaciane/ofertas.json` e a página
      https://www.cuponito.com.br/achadinhos-hoje, e aviso o Bing.
- Enquanto o feed não estiver ligado, a página mostra só um aviso e sai com `noindex` (o Google não indexa página vazia).

## Grupos de nicho (PRs #86, #88, #89)

- [x] Migrations `20261023120000_paginas_de_ofertas.sql` e `20261023150000_conteudo_nichos.sql` rodadas (23/10).
      Conferido pelo Claude: as 6 páginas novas respondem 200 e os 4 endereços antigos mandam 301.
- [x] **Reindexação pedida no Google Search Console pela Flávia em 23/10** para:
  - https://www.cuponito.com.br/grupo-whatsapp/celular
  - https://www.cuponito.com.br/blog/decoracao-de-ano-novo-simples-e-barata
  - https://www.cuponito.com.br/ofertas/iphone
  - https://www.cuponito.com.br/ofertas/fraldas
  - https://www.cuponito.com.br/grupo-whatsapp/pc-gamer
  - https://www.cuponito.com.br/grupo-whatsapp/manicure
  - https://www.cuponito.com.br/desconto/cupom-desconto-kabum-br
  - https://www.cuponito.com.br/desconto/cupom-desconto-aliexpress-br-latam
  - https://www.cuponito.com.br/grupo-whatsapp
  - https://www.cuponito.com.br/categoria/tech
- [x] IndexNow (Bing, que o ChatGPT consulta) enviado pelo Claude em 23/10 via `/api/indexnow`: as 10 acima
      + /categoria/games, /categoria/infant-products, /categoria/beleza, /llms.txt e os 4 endereços antigos
      (/grupo-whatsapp/tecnologia, /bebes, /salao-de-beleza, /festas) para o Bing registrar o 301. Resposta 200.
- [ ] Ligar o feed `ofertas.json` dos grupos de nicho no wabot (VPS): em `~/wabot/.env`,
      `SMART_LINK_PUBLIC_FEED=ofertas-fafaciane,promo-tech,promo-celular,promo-iphone,promo-bebes,promo-festas,promo-salao`
      e depois `pm2 restart api`. Me avisar: eu confiro cada `ofertas.json` e as páginas de ofertas.
- Obs.: o feed do wabot só devolve as ofertas das **últimas 36 h**. O Promo iPhone posta ~2 por semana,
  então `/ofertas/iphone` fica vazia na maior parte dos dias mesmo com o feed ligado.

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
- [ ] Bio do Instagram com o link https://espelhagrupos.com.br/g/ofertas-fafaciane.

## Medição

- [ ] 03 a 07/11: conferir cliques do Link Inteligente e impressões das páginas novas.
- [ ] 07/12: rodada nas IAs (ChatGPT, Gemini, Google IA) perguntando por grupo de ofertas.

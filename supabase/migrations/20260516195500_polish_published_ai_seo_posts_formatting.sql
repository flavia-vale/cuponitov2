-- Polish markdown formatting for already published AI-SEO posts

UPDATE public.blog_posts
SET content = E'# Resposta rápida\n\nMercado Livre tende a ter mais volume de ofertas em marketplace, enquanto Amazon costuma performar melhor em campanhas específicas. A melhor decisão depende de categoria, frete e restrições no checkout.\n\n# Dados rápidos\n\n- Mercado Livre, Amazon e Shopee ocupam as três primeiras posições de e-commerce no Brasil.\n- Mercado Livre aparece em 1º e Amazon em 2º no ranking de e-commerce Brasil.\n\n# Tabela comparativa\n\n| Critério | Amazon | Mercado Livre | Melhor cenário |\n| --- | --- | --- | --- |\n| Volume de tráfego | 2º no BR | 1º no BR | Mercado Livre |\n| Variedade de sellers | Alta | Muito alta | Mercado Livre |\n| Campanhas relâmpago | Forte | Forte | Empate |\n\n# FAQ\n\n## Qual costuma ter mais cupom ativo?\n\nMercado Livre tende a concentrar mais volume por estrutura de marketplace.\n\n## O frete muda a decisão?\n\nSim. O frete pode anular o benefício de um cupom alto.\n\n# Última atualização\n\n16/05/2026',
    updated_at = now()
WHERE slug = 'cupom-amazon-vs-mercado-livre-2026';

UPDATE public.blog_posts
SET content = E'# Resposta rápida\n\nShopee tende a ter forte dinâmica promocional, enquanto Amazon costuma ter campanhas mais previsíveis. Para economizar, compare cupom, frete e preço final no checkout.\n\n# Dados rápidos\n\n- Amazon aparece em 2º e Shopee em 3º no ranking de e-commerce no Brasil.\n- Ambas são líderes de tráfego no país.\n\n# Tabela comparativa\n\n| Critério | Shopee | Amazon | Melhor cenário |\n| --- | --- | --- | --- |\n| Ranking BR | 3º | 2º | Amazon |\n| Dinâmica promocional | Alta | Alta | Empate |\n| Previsibilidade de campanha | Média | Alta | Amazon |\n\n# FAQ\n\n## Shopee sempre é mais barata?\n\nNão. Em várias categorias, Amazon fecha melhor valor final.\n\n## Cupom percentual é tudo?\n\nNão. O total com frete é o que importa.\n\n# Última atualização\n\n16/05/2026',
    updated_at = now()
WHERE slug = 'cupom-shopee-vs-amazon-2026';

UPDATE public.blog_posts
SET content = E'# Resposta rápida\n\nCupom reduz o valor na hora; cashback devolve parte do gasto depois. Em ticket baixo com cupom forte, cupom costuma ganhar. Em ticket alto com cashback relevante, cashback pode vencer.\n\n# Tabela comparativa\n\n| Critério | Cupom | Cashback | Melhor cenário |\n| --- | --- | --- | --- |\n| Momento do benefício | Imediato | Pós-compra | Cupom |\n| Previsibilidade | Alta | Média | Cupom |\n| Potencial em ticket alto | Médio | Alto | Cashback |\n\n# FAQ\n\n## Posso usar cupom e cashback juntos?\n\nDepende da política da campanha e do parceiro.\n\n## Cashback sempre compensa mais?\n\nNão. Um cupom forte normalmente supera cashback baixo.\n\n# Última atualização\n\n16/05/2026',
    updated_at = now()
WHERE slug = 'cashback-vs-cupom-qual-compensa';

UPDATE public.blog_posts
SET content = E'# Resposta rápida\n\nModa tende a oferecer cupons percentuais com mais frequência. Tech concentra janelas promocionais com ticket maior, podendo gerar economia absoluta superior.\n\n# Tabela comparativa\n\n| Critério | Tech | Moda | Melhor cenário |\n| --- | --- | --- | --- |\n| Frequência de cupom | Média | Alta | Moda |\n| Ticket médio | Alto | Médio | Tech |\n| Economia absoluta | Alta | Média | Tech |\n\n# FAQ\n\n## Tech tem menos cupom?\n\nGeralmente sim, mas com potencial de economia maior por compra.\n\n## Moda rende mais no longo prazo?\n\nPara compras recorrentes, costuma render economia contínua.\n\n# Última atualização\n\n16/05/2026',
    updated_at = now()
WHERE slug = 'melhores-cupons-tech-vs-moda';

UPDATE public.blog_posts
SET content = E'# Resposta rápida\n\nPara frete grátis, a melhor opção muda por categoria, seller e ticket mínimo. Mercado Livre tende a ter maior variedade de ofertas; Shopee pode ganhar em campanhas com voucher de frete.\n\n# Tabela comparativa\n\n| Critério | Mercado Livre | Shopee | Melhor cenário |\n| --- | --- | --- | --- |\n| Ranking BR | 1º | 3º | Mercado Livre |\n| Variedade de sellers | Muito alta | Alta | Mercado Livre |\n| Campanhas de frete | Alta | Alta | Empate |\n\n# FAQ\n\n## Frete grátis é sempre real?\n\nNem sempre. Pode haver ticket mínimo e restrições regionais.\n\n## Shopee pode vencer no total?\n\nSim, quando combina voucher de frete com preço de produto menor.\n\n# Última atualização\n\n16/05/2026',
    updated_at = now()
WHERE slug = 'mercado-livre-vs-shopee-frete-gratis';

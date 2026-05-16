-- Publish 5 AI-SEO comparison articles

INSERT INTO public.blog_authors (name, bio)
SELECT 'Equipe Cuponito', 'Time editorial do Cuponito focado em economia e cupons atualizados.'
WHERE NOT EXISTS (
  SELECT 1 FROM public.blog_authors WHERE name = 'Equipe Cuponito'
);

INSERT INTO public.blog_categories (name, slug, description, color_hex)
SELECT 'Comparativos', 'comparativos', 'Comparações práticas para economizar melhor em compras online.', '#f97316'
WHERE NOT EXISTS (
  SELECT 1 FROM public.blog_categories WHERE slug = 'comparativos'
);

WITH refs AS (
  SELECT
    (SELECT id FROM public.blog_authors WHERE name = 'Equipe Cuponito' ORDER BY created_at ASC LIMIT 1) AS author_id,
    (SELECT id FROM public.blog_categories WHERE slug = 'comparativos' LIMIT 1) AS category_id
)
INSERT INTO public.blog_posts (
  title, slug, excerpt, content, cover_image, meta_title, meta_description,
  status, featured, published_at, author_id, category_id
)
SELECT
  p.title,
  p.slug,
  p.excerpt,
  p.content,
  '',
  p.meta_title,
  p.meta_description,
  'published'::public.blog_post_status,
  false,
  now(),
  refs.author_id,
  refs.category_id
FROM refs,
(
  VALUES
  (
    'Cupom Amazon vs Mercado Livre: qual vale mais a pena em 2026?',
    'cupom-amazon-vs-mercado-livre-2026',
    'Amazon e Mercado Livre têm pontos fortes diferentes. Compare tráfego, variedade, frete e regras para economizar de verdade.',
    E'## Resposta rápida\nMercado Livre tende a ter mais volume de ofertas em marketplace, enquanto Amazon costuma performar melhor em campanhas específicas. A melhor decisão depende de categoria, frete e restrições no checkout.\n\n## Dados rápidos\n- Mercado Livre, Amazon e Shopee ocupam as três primeiras posições de e-commerce no Brasil.\n- Mercado Livre aparece em 1º e Amazon em 2º no ranking de e-commerce Brasil.\n\n## Tabela comparativa\n| Critério | Amazon | Mercado Livre | Melhor cenário |\n|---|---|---|---|\n| Volume de tráfego | 2º no BR | 1º no BR | Mercado Livre |\n| Variedade de sellers | Alta | Muito alta | Mercado Livre |\n| Campanhas relâmpago | Forte | Forte | Empate |\n\n## FAQ\n### Qual costuma ter mais cupom ativo?\nMercado Livre tende a concentrar mais volume por estrutura de marketplace.\n\n### O frete muda a decisão?\nSim. O frete pode anular o benefício de um cupom alto.\n\n## Última atualização\n16/05/2026',
    'Cupom Amazon vs Mercado Livre em 2026 | Cuponito',
    'Compare Amazon e Mercado Livre para cupons: tráfego, frete, regras e melhor cenário de economia.'
  ),
  (
    'Cupom Shopee vs Amazon: onde economizar mais hoje?',
    'cupom-shopee-vs-amazon-2026',
    'Shopee e Amazon são fortes em promoções, mas o preço final com frete é o que define a melhor compra.',
    E'## Resposta rápida\nShopee tende a ter forte dinâmica promocional, enquanto Amazon costuma ter campanhas mais previsíveis. Para economizar, compare cupom, frete e preço final no checkout.\n\n## Dados rápidos\n- Amazon aparece em 2º e Shopee em 3º no ranking de e-commerce no Brasil.\n- Ambas são líderes de tráfego no país.\n\n## Tabela comparativa\n| Critério | Shopee | Amazon | Melhor cenário |\n|---|---|---|---|\n| Ranking BR | 3º | 2º | Amazon |\n| Dinâmica promocional | Alta | Alta | Empate |\n| Previsibilidade de campanha | Média | Alta | Amazon |\n\n## FAQ\n### Shopee sempre é mais barata?\nNão. Em várias categorias, Amazon fecha melhor valor final.\n\n### Cupom percentual é tudo?\nNão. O total com frete é o que importa.\n\n## Última atualização\n16/05/2026',
    'Cupom Shopee vs Amazon: qual compensa mais? | Cuponito',
    'Descubra quando Shopee ou Amazon gera mais economia com cupom e frete no preço final.'
  ),
  (
    'Cashback vs Cupom: qual estratégia dá mais economia?',
    'cashback-vs-cupom-qual-compensa',
    'Cupom dá desconto imediato; cashback devolve valor depois. Entenda qual ganha em cada cenário.',
    E'## Resposta rápida\nCupom reduz o valor na hora; cashback devolve parte do gasto depois. Em ticket baixo com cupom forte, cupom costuma ganhar. Em ticket alto com cashback relevante, cashback pode vencer.\n\n## Tabela comparativa\n| Critério | Cupom | Cashback | Melhor cenário |\n|---|---|---|---|\n| Momento do benefício | Imediato | Pós-compra | Cupom |\n| Previsibilidade | Alta | Média | Cupom |\n| Potencial em ticket alto | Médio | Alto | Cashback |\n\n## FAQ\n### Posso usar cupom e cashback juntos?\nDepende da política da campanha e do parceiro.\n\n### Cashback sempre compensa mais?\nNão. Um cupom forte normalmente supera cashback baixo.\n\n## Última atualização\n16/05/2026',
    'Cashback vs Cupom: qual compensa mais em 2026? | Cuponito',
    'Compare cashback e cupom por ticket, regras e ganho real para decidir melhor.'
  ),
  (
    'Melhores cupons Tech vs Moda: onde o desconto rende mais?',
    'melhores-cupons-tech-vs-moda',
    'Moda tende a ter mais frequência de cupons; Tech costuma ter maior economia absoluta por ticket.',
    E'## Resposta rápida\nModa tende a oferecer cupons percentuais com mais frequência. Tech concentra janelas promocionais com ticket maior, podendo gerar economia absoluta superior.\n\n## Tabela comparativa\n| Critério | Tech | Moda | Melhor cenário |\n|---|---|---|---|\n| Frequência de cupom | Média | Alta | Moda |\n| Ticket médio | Alto | Médio | Tech |\n| Economia absoluta | Alta | Média | Tech |\n\n## FAQ\n### Tech tem menos cupom?\nGeralmente sim, mas com potencial de economia maior por compra.\n\n### Moda rende mais no longo prazo?\nPara compras recorrentes, costuma render economia contínua.\n\n## Última atualização\n16/05/2026',
    'Tech vs Moda: quais cupons rendem mais? | Cuponito',
    'Entenda quando cupons de Tech ou Moda geram mais economia no valor final.'
  ),
  (
    'Mercado Livre vs Shopee para frete grátis: quem ganha?',
    'mercado-livre-vs-shopee-frete-gratis',
    'Frete grátis depende de ticket mínimo, seller e campanha. Compare Meli e Shopee sem cair em pegadinha.',
    E'## Resposta rápida\nPara frete grátis, a melhor opção muda por categoria, seller e ticket mínimo. Mercado Livre tende a ter maior variedade de ofertas; Shopee pode ganhar em campanhas com voucher de frete.\n\n## Tabela comparativa\n| Critério | Mercado Livre | Shopee | Melhor cenário |\n|---|---|---|---|\n| Ranking BR | 1º | 3º | Mercado Livre |\n| Variedade de sellers | Muito alta | Alta | Mercado Livre |\n| Campanhas de frete | Alta | Alta | Empate |\n\n## FAQ\n### Frete grátis é sempre real?\nNem sempre. Pode haver ticket mínimo e restrições regionais.\n\n### Shopee pode vencer no total?\nSim, quando combina voucher de frete com preço de produto menor.\n\n## Última atualização\n16/05/2026',
    'Mercado Livre vs Shopee para frete grátis | Cuponito',
    'Compare frete grátis entre Mercado Livre e Shopee considerando regras reais e preço final.'
  )
) AS p(title, slug, excerpt, content, meta_title, meta_description)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  published_at = COALESCE(public.blog_posts.published_at, EXCLUDED.published_at),
  author_id = COALESCE(public.blog_posts.author_id, EXCLUDED.author_id),
  category_id = COALESCE(public.blog_posts.category_id, EXCLUDED.category_id),
  updated_at = now();

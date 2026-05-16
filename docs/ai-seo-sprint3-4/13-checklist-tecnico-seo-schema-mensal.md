# Revisão técnica mensal SEO/Schema (Checklist)

## Canonicals
- [ ] Todas as páginas estratégicas têm canonical absoluto correto.
- [ ] Páginas de categoria com baixo volume seguem regra de canonical para `/cupons` quando aplicável.
- [ ] Não há conflito entre canonical e URL indexada no sitemap.

## JSON-LD
- [ ] `BlogPosting` válido em posts (headline, datePublished, dateModified, author).
- [ ] `CollectionPage` válido em `/cupons`, `/lojas`, `/categoria/*`.
- [ ] `ItemList` presente quando houver listagem de cupons.
- [ ] `FAQPage` e `HowTo` válidos em páginas de loja.
- [ ] Teste em Rich Results sem erro crítico.

## Freshness
- [ ] `article:published_time`, `article:modified_time`, `og:updated_time` presentes nos posts.
- [ ] Bloco visual “Última atualização” renderizando corretamente em blog/listagens.
- [ ] Datas de conteúdo e fontes revisadas nas URLs prioritárias.

## Indexação e crawl
- [ ] `robots.txt` servindo regras esperadas para bots de IA e crawler geral.
- [ ] `sitemap.xml` contendo categorias dinâmicas atualizadas.
- [ ] Search Console sem picos de páginas excluídas por canonical/duplication.

## Lacunas críticas (ação imediata)
- [ ] Query com alta impressão e baixa citação: abrir tarefa editorial.
- [ ] URL sem schema válido: abrir bug técnico.
- [ ] Queda de SoV > 10pp mês/mês: executar plano de recuperação em 7 dias.

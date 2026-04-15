# Plano de SEO Avançado e Escalabilidade Zero-Code (Versão Supabase Externo)

## 1. Componente SEO Dinâmico (react-helmet-async)

**Arquivo**: `src/components/SEOHead.tsx`

- Criar componente que injeta `<title>`, `<meta description>`, `<link canonical>` e Open Graph.

- **Dinâmismo**: O título deve ser: `Cupom de Desconto {StoreName} {CurrentMonth} {CurrentYear} | Cuponito`.

- Se for a Home: `Cupom de Desconto {CurrentMonth} {CurrentYear} -- Amazon, Shopee e Mercado Livre`.

## 2. Atributos de Afiliado e Segurança

**Arquivos**: `CouponCard.tsx`, `WhatsAppCTA.tsx`

- Todo link externo vindo do Supabase DEVE forçar: `rel="nofollow sponsored noopener noreferrer"`.

## 3. Estrutura de Dados (JSON-LD) Centralizada

**Hook**: `src/hooks/useJsonLd.ts`

- **NÃO** injetar scripts dentro do `CouponCard` (evita duplicidade).

- O Hook deve coletar o array de cupons vindos do Supabase e gerar um único `ItemList` com objetos `Offer` no `SEOHead`.

- Campos obrigatórios: `name`, `description`, `price: 0`, `priceCurrency: BRL`, `seller: {loja_do_banco}`.

## 4. Estilização via Banco de Dados (Zero-Code)

**Arquivos**: `CouponCard.tsx`, `StorePage.tsx`

- Proibido usar `storeStyles` fixo no código.

- A aparência (cores, gradientes, ícones) deve vir da tabela `stores` do Supabase.

- Se uma loja não tiver estilo definido, usar um "fallback" rústico (identidade Cuponito).

## 5. Mês/Ano Automático

**Arquivo**: `src/lib/utils.ts` ou `src/hooks/useDateTime.ts`

- Criar função para retornar o mês atual por extenso e o ano.

- Aplicar no `HeroBanner`, `SEOHead` e nos títulos das `StorePage`.

## 6. Sitemap e Robots (SEO Técnico)

- O `robots.txt` deve apontar para `/sitemap.xml`.

- O `sitemap.xml` deve ser configurado para refletir a URL base do projeto (substituindo o placeholder do Lovable).

## 7. Performance e UX

- `React.lazy` para rotas de Admin.

- `aria-label` em todos os botões de "Copiar Código".

- Skeleton screens durante o fetch de dados do Supabase para evitar Cumulative Layout Shift (CLS).

## 8. Sincronização de Admin

- O painel administrativo deve permitir editar os campos de SEO (Meta Description da loja) que são consumidos pelo `SEOHead`.

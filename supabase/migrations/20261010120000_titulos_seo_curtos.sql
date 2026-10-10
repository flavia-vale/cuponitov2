-- O Bing marcou "título muito longo" (2026-10-10) nos 4 posts abaixo: 57 a 90
-- caracteres na <title>. Os posts que ele aceitou têm até 54. Troca só o
-- meta_title (a <title> e o og:title); o título do post (H1) não muda.
-- Só troca se o meta_title ainda for o medido hoje: edição feita depois pelo painel fica.
UPDATE public.blog_posts AS p
SET meta_title = c.novo
FROM (VALUES
  ('cashback-vs-cupom-qual-compensa',
   'Cashback vs cupom: qual compensa em 2026? | Cuponito',
   'Cashback vs Cupom: qual compensa mais em 2026? | Cuponito'),
  ('cupom-shopee-hoje',
   'Cupom Shopee hoje: frete grátis e desconto | Cuponito',
   'Cupom Shopee hoje: o passo a passo para garantir frete grátis e descontos reais na Shopee'),
  ('mercado-livre-guia-para-economizar',
   'Cupom Mercado Livre: guia para economizar | Cuponito',
   'Cupom de desconto mercado livre: o guia para economizar nas suas compras'),
  ('presentes-dia-das-maes-comprar-com-desconto',
   'Dia das Mães 2026: presentes com desconto | Cuponito',
   'Presentes para o Dia das Mães 2026: onde comprar com desconto')
) AS c(slug, novo, antigo)
WHERE p.slug = c.slug
  AND p.meta_title = c.antigo;

-- 1) Links do grupo: Link Inteligente do Espelha Grupos no lugar dos convites diretos.
--
-- O convite antigo (chat.whatsapp.com/KxLj...) estava morto e era o padrão do
-- código; o convite direto atual também morre quando o grupo lota ou o convite
-- é revogado. O Link Inteligente troca de grupo sozinho e mede os cliques.

UPDATE public.site_settings
SET value = jsonb_set(value, '{whatsapp_group}', to_jsonb('https://espelhagrupos.com.br/g/ofertas-fafaciane'::text)),
    updated_at = now()
WHERE key = 'global_links';

UPDATE public.site_settings
SET value = jsonb_set(value, '{channel_url}', to_jsonb('https://whatsapp.com/channel/0029Vb7lYdN30LKPIIWG2i2O'::text)),
    updated_at = now()
WHERE key = 'whatsapp_group_info';

-- 2) Autoras (EEAT): perfil público verificável + cargo, para assinatura e schema Person.

ALTER TABLE public.blog_authors
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS job_title TEXT;

COMMENT ON COLUMN public.blog_authors.linkedin_url IS
  'Perfil público da autora (LinkedIn). Sai na assinatura dos posts e no sameAs do schema Person.';
COMMENT ON COLUMN public.blog_authors.job_title IS
  'Cargo/formação curta exibida na assinatura (ex.: "Fundadora do Espelha Grupos").';

UPDATE public.blog_authors
SET linkedin_url = 'https://www.linkedin.com/in/flaviavale/',
    job_title = 'Fundadora do Espelha Grupos e do Cuponito'
WHERE name = 'Flávia Vale';

INSERT INTO public.blog_authors (name, bio, linkedin_url, job_title)
SELECT
  'Taciane Andrade',
  'Licencianda em Matemática pela UFMG e redatora do Cuponito.',
  'https://www.linkedin.com/in/taciane-silva-619692339',
  'Redatora do Cuponito'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_authors WHERE name = 'Taciane Andrade');

-- 3) Autoria dos posts de economia/cupom: alterna Flávia e Taciane.
-- Os dois posts sobre bots/espelhamento continuam com a Flávia (falam do Espelha Grupos).
WITH authors AS (
  SELECT
    (SELECT id FROM public.blog_authors WHERE name = 'Flávia Vale' ORDER BY created_at LIMIT 1) AS flavia,
    (SELECT id FROM public.blog_authors WHERE name = 'Taciane Andrade' ORDER BY created_at LIMIT 1) AS taciane
)
UPDATE public.blog_posts AS post
SET author_id = CASE
    WHEN post.slug IN (
      'cupom-shopee-vs-amazon-2026',
      'cupom-amazon-vs-mercado-livre-2026',
      'melhores-cupons-tech-vs-moda',
      'cashback-vs-cupom-qual-compensa'
    ) THEN authors.taciane
    ELSE authors.flavia
  END
FROM authors
WHERE post.slug IN (
  'cupom-shopee-vs-amazon-2026',
  'cupom-amazon-vs-mercado-livre-2026',
  'melhores-cupons-tech-vs-moda',
  'cashback-vs-cupom-qual-compensa',
  'cupom-shopee-hoje',
  'mercado-livre-guia-para-economizar',
  'mercado-livre-vs-shopee-frete-gratis',
  'presentes-dia-das-maes-comprar-com-desconto'
);

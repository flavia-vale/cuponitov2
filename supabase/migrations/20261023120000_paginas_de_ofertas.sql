-- Páginas de ofertas por nicho (/ofertas/<slug>) (docs/plano-ofertas-e-nichos-2026-10-22.md,
-- revisão de 23/10).
--
-- Os dados do Planejador (22/10) mostraram que só tecnologia tem busca por "grupo de…".
-- Bebês, festas e salão são buscados como "X em promoção" / "X barato". Formatos
-- aprovados pela Flávia em 23/10:
--   tecnologia → página do grupo     /grupo-whatsapp/celular-e-pc
--   bebês      → página de ofertas   /ofertas/fraldas
--   salão      → página do grupo     /grupo-whatsapp/manicure
--   festas     → posts sazonais no blog
-- Os textos dessas páginas entram em outra migration, depois das respostas das IAs.
--
-- Esta migration é só estrutura. As 4 páginas da 20261022150000 (tecnologia, bebes,
-- festas, salao-de-beleza) estão no ar desde 22/10 23:32 UTC e no sitemap: apagar agora
-- daria 404. A migration de conteúdo renomeia essas linhas para os endereços novos e o
-- middleware manda 301 do endereço antigo.

-- 1) Colunas -----------------------------------------------------------------------------

-- Repetidas da 20261022150000 (IF NOT EXISTS): quem pular aquela fica com o mesmo esquema.
ALTER TABLE public.whatsapp_group_pages
  ADD COLUMN IF NOT EXISTS group_name TEXT,
  ADD COLUMN IF NOT EXISTS topics     TEXT;

ALTER TABLE public.coupon_categories
  ADD COLUMN IF NOT EXISTS group_slug TEXT;

ALTER TABLE public.whatsapp_group_pages
  ADD COLUMN IF NOT EXISTS page_type   TEXT NOT NULL DEFAULT 'group',
  ADD COLUMN IF NOT EXISTS offer_terms TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'whatsapp_group_pages_page_type_check'
  ) THEN
    ALTER TABLE public.whatsapp_group_pages
      ADD CONSTRAINT whatsapp_group_pages_page_type_check CHECK (page_type IN ('group', 'offers'));
  END IF;
END $$;

COMMENT ON COLUMN public.whatsapp_group_pages.page_type IS
  'group = página do grupo (/grupo-whatsapp/<slug>); offers = ofertas do dia (/ofertas/<slug>).';
COMMENT ON COLUMN public.whatsapp_group_pages.offer_terms IS
  'Página de ofertas: termos (vírgula) que filtram as ofertas do grupo. Vazio = todas.';

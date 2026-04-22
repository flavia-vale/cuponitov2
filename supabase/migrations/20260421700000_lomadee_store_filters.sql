-- Tabela de filtro de lojas Lomadee por conta de afiliado
-- Permite ao admin escolher quais lojas serão sincronizadas

CREATE TABLE IF NOT EXISTS public.lomadee_store_filters (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id        UUID NOT NULL REFERENCES public.affiliate_accounts(id) ON DELETE CASCADE,
  lomadee_store_id  TEXT NOT NULL,
  store_name        TEXT NOT NULL DEFAULT '',
  store_logo        TEXT NOT NULL DEFAULT '',
  enabled           BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(account_id, lomadee_store_id)
);

ALTER TABLE public.lomadee_store_filters ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='lomadee_store_filters' AND policyname='Public read lomadee_store_filters') THEN
    CREATE POLICY "Public read lomadee_store_filters"
      ON public.lomadee_store_filters FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='lomadee_store_filters' AND policyname='Admin write lomadee_store_filters') THEN
    CREATE POLICY "Admin write lomadee_store_filters"
      ON public.lomadee_store_filters FOR ALL TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_lomadee_store_filters_updated_at') THEN
    CREATE TRIGGER update_lomadee_store_filters_updated_at
      BEFORE UPDATE ON public.lomadee_store_filters
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

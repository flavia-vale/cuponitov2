-- ============================================================
-- PLATAFORMA DE INTEGRAÇÕES — Cuponito
-- Idempotente: usa IF NOT EXISTS em tudo
-- ============================================================

-- -----------------------------------------------------------
-- 1. PROVEDORES DE AFILIADOS
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.integration_providers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  base_url      TEXT NOT NULL DEFAULT '',
  auth_type     TEXT NOT NULL DEFAULT 'token',
  notes         TEXT NOT NULL DEFAULT '',
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.integration_providers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='integration_providers' AND policyname='Public read integration_providers') THEN
    CREATE POLICY "Public read integration_providers" ON public.integration_providers FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='integration_providers' AND policyname='Admin write integration_providers') THEN
    CREATE POLICY "Admin write integration_providers" ON public.integration_providers FOR ALL TO authenticated USING (true);
  END IF;
END $$;

INSERT INTO public.integration_providers (name, slug, base_url, auth_type, notes)
VALUES ('Awin', 'awin', 'https://api.awin.com', 'token', 'Rede de afiliados Awin — usa publisher_id + access_token')
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------
-- 2. CONTAS DE AFILIADOS
-- Migra schema antigo (store_name/status) para novo (name/active)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.affiliate_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL DEFAULT '',
  publisher_id    TEXT NOT NULL DEFAULT '',
  api_token       TEXT NOT NULL DEFAULT '',
  active          BOOLEAN NOT NULL DEFAULT true,
  extra_config    JSONB NOT NULL DEFAULT '{}',
  provider_id     UUID REFERENCES public.integration_providers(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migrar colunas antigas para novo padrão (caso existam)
DO $$ BEGIN
  -- store_name → name
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='affiliate_accounts' AND column_name='store_name')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='affiliate_accounts' AND column_name='name')
  THEN
    ALTER TABLE public.affiliate_accounts RENAME COLUMN store_name TO name;
  END IF;

  -- status → active
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='affiliate_accounts' AND column_name='status')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='affiliate_accounts' AND column_name='active')
  THEN
    ALTER TABLE public.affiliate_accounts RENAME COLUMN status TO active;
  END IF;
END $$;

-- Garantir colunas novas independente da situação
ALTER TABLE public.affiliate_accounts
  ADD COLUMN IF NOT EXISTS name           TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS active         BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS extra_config   JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS provider_id    UUID REFERENCES public.integration_providers(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ NOT NULL DEFAULT now();

-- Vincular contas existentes ao provedor Awin se provider_id estiver nulo
UPDATE public.affiliate_accounts
SET provider_id = (SELECT id FROM public.integration_providers WHERE slug = 'awin' LIMIT 1)
WHERE provider_id IS NULL;

ALTER TABLE public.affiliate_accounts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='affiliate_accounts' AND policyname='Public read affiliate_accounts') THEN
    CREATE POLICY "Public read affiliate_accounts" ON public.affiliate_accounts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='affiliate_accounts' AND policyname='Admin write affiliate_accounts') THEN
    CREATE POLICY "Admin write affiliate_accounts" ON public.affiliate_accounts FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- Seed: adicionar contas padrão somente se não existirem
INSERT INTO public.affiliate_accounts (provider_id, name, publisher_id, extra_config)
SELECT p.id, 'Awin - Outras Lojas', '2701264', '{}'
FROM public.integration_providers p
WHERE p.slug = 'awin'
  AND NOT EXISTS (SELECT 1 FROM public.affiliate_accounts WHERE publisher_id = '2701264')
LIMIT 1;

INSERT INTO public.affiliate_accounts (provider_id, name, publisher_id, extra_config)
SELECT p.id, 'Casas Bahia', '2740940', '{"store_filter": "Casas Bahia"}'
FROM public.integration_providers p
WHERE p.slug = 'awin'
  AND NOT EXISTS (SELECT 1 FROM public.affiliate_accounts WHERE publisher_id = '2740940')
LIMIT 1;

-- -----------------------------------------------------------
-- 3. AGENDAMENTOS DE SINCRONIZAÇÃO
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sync_schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id      UUID NOT NULL REFERENCES public.affiliate_accounts(id) ON DELETE CASCADE,
  interval_hours  INTEGER NOT NULL DEFAULT 6,
  enabled         BOOLEAN NOT NULL DEFAULT true,
  last_run_at     TIMESTAMPTZ,
  next_run_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sync_schedules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sync_schedules' AND policyname='Public read sync_schedules') THEN
    CREATE POLICY "Public read sync_schedules" ON public.sync_schedules FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sync_schedules' AND policyname='Admin write sync_schedules') THEN
    CREATE POLICY "Admin write sync_schedules" ON public.sync_schedules FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- Seed: criar agendamento para cada conta que ainda não tem
INSERT INTO public.sync_schedules (account_id, interval_hours)
SELECT a.id, 6
FROM public.affiliate_accounts a
WHERE NOT EXISTS (
  SELECT 1 FROM public.sync_schedules s WHERE s.account_id = a.id
);

-- -----------------------------------------------------------
-- 4. LOGS DE SINCRONIZAÇÃO
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id        UUID NOT NULL REFERENCES public.affiliate_accounts(id) ON DELETE CASCADE,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at       TIMESTAMPTZ,
  status            TEXT NOT NULL DEFAULT 'running',
  records_inserted  INTEGER NOT NULL DEFAULT 0,
  records_updated   INTEGER NOT NULL DEFAULT 0,
  records_skipped   INTEGER NOT NULL DEFAULT 0,
  error_message     TEXT,
  meta              JSONB NOT NULL DEFAULT '{}'
);

ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sync_logs' AND policyname='Public read sync_logs') THEN
    CREATE POLICY "Public read sync_logs" ON public.sync_logs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sync_logs' AND policyname='Admin write sync_logs') THEN
    CREATE POLICY "Admin write sync_logs" ON public.sync_logs FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- -----------------------------------------------------------
-- 5. AJUSTE NA TABELA STORES
-- -----------------------------------------------------------
ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS name               TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS store_id           TEXT,
  ADD COLUMN IF NOT EXISTS awin_advertiser_id TEXT,
  ADD COLUMN IF NOT EXISTS active             BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS logo_url           TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description        TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_description   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at         TIMESTAMPTZ NOT NULL DEFAULT now();

DO $$ BEGIN
  ALTER TABLE public.stores ADD CONSTRAINT stores_store_id_key UNIQUE (store_id);
EXCEPTION WHEN duplicate_table OR duplicate_object THEN
  NULL; -- constraint já existe, ignorar
END $$;

-- Sincronizar name com display_name para registros existentes (se a coluna existir)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='stores' AND column_name='display_name') THEN
    UPDATE public.stores SET name = display_name WHERE name = '' AND display_name IS NOT NULL AND display_name <> '';
  END IF;
END $$;

-- -----------------------------------------------------------
-- 6. TRIGGERS DE updated_at
-- -----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_integration_providers_updated_at') THEN
    CREATE TRIGGER update_integration_providers_updated_at
      BEFORE UPDATE ON public.integration_providers
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_affiliate_accounts_updated_at') THEN
    CREATE TRIGGER update_affiliate_accounts_updated_at
      BEFORE UPDATE ON public.affiliate_accounts
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sync_schedules_updated_at') THEN
    CREATE TRIGGER update_sync_schedules_updated_at
      BEFORE UPDATE ON public.sync_schedules
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_stores_updated_at') THEN
    CREATE TRIGGER update_stores_updated_at
      BEFORE UPDATE ON public.stores
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

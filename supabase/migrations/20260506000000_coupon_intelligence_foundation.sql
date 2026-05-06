-- Coupon intelligence foundation for marketplaces without public coupon APIs.
-- This migration is intentionally additive and keeps every automated source disabled by default.

CREATE TABLE IF NOT EXISTS public.coupon_sources (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace_slug      TEXT NOT NULL,
  name                  TEXT NOT NULL,
  source_type           TEXT NOT NULL DEFAULT 'public_page',
  source_url            TEXT NOT NULL,
  allowed_paths         TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  selectors             JSONB NOT NULL DEFAULT '{}'::jsonb,
  keywords              TEXT[] NOT NULL DEFAULT ARRAY['cupom', 'cupon', 'coupon', 'desconto', 'oferta', 'promo']::TEXT[],
  scan_interval_minutes INTEGER NOT NULL DEFAULT 60,
  risk_level            INTEGER NOT NULL DEFAULT 5,
  enabled               BOOLEAN NOT NULL DEFAULT false,
  last_scan_at          TIMESTAMPTZ,
  next_scan_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_status           TEXT NOT NULL DEFAULT 'pending',
  last_error            TEXT,
  metadata              JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT coupon_sources_source_type_check CHECK (source_type IN ('affiliate_feed', 'public_page', 'newsletter', 'community', 'manual')),
  CONSTRAINT coupon_sources_scan_interval_check CHECK (scan_interval_minutes >= 5),
  CONSTRAINT coupon_sources_risk_level_check CHECK (risk_level BETWEEN 1 AND 10),
  CONSTRAINT coupon_sources_url_unique UNIQUE (marketplace_slug, source_url)
);

CREATE TABLE IF NOT EXISTS public.coupon_evidence (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id         UUID REFERENCES public.coupon_sources(id) ON DELETE SET NULL,
  coupon_id         UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  marketplace_slug  TEXT NOT NULL,
  raw_code          TEXT NOT NULL DEFAULT '',
  normalized_code   TEXT NOT NULL DEFAULT '',
  title             TEXT NOT NULL DEFAULT '',
  description       TEXT NOT NULL DEFAULT '',
  source_url        TEXT NOT NULL,
  source_type       TEXT NOT NULL DEFAULT 'public_page',
  evidence_type     TEXT NOT NULL DEFAULT 'html_text',
  confidence_score  NUMERIC(5,2) NOT NULL DEFAULT 0,
  observed_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at        TIMESTAMPTZ,
  content_hash      TEXT NOT NULL DEFAULT '',
  extracted_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status            TEXT NOT NULL DEFAULT 'pending_review',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT coupon_evidence_source_type_check CHECK (source_type IN ('affiliate_feed', 'public_page', 'newsletter', 'community', 'manual')),
  CONSTRAINT coupon_evidence_type_check CHECK (evidence_type IN ('html_text', 'json_payload', 'banner_ocr', 'newsletter', 'user_submission', 'affiliate_feed')),
  CONSTRAINT coupon_evidence_confidence_check CHECK (confidence_score BETWEEN 0 AND 100),
  CONSTRAINT coupon_evidence_status_check CHECK (status IN ('pending_review', 'verified_public', 'verified_by_partner', 'community_confirmed', 'unverified', 'expired_or_failed', 'rejected'))
);

CREATE UNIQUE INDEX IF NOT EXISTS coupon_evidence_source_hash_idx
  ON public.coupon_evidence(source_id, content_hash)
  WHERE source_id IS NOT NULL AND content_hash <> '';

CREATE INDEX IF NOT EXISTS coupon_evidence_marketplace_status_idx
  ON public.coupon_evidence(marketplace_slug, status, observed_at DESC);

CREATE INDEX IF NOT EXISTS coupon_evidence_normalized_code_idx
  ON public.coupon_evidence(normalized_code)
  WHERE normalized_code <> '';

CREATE TABLE IF NOT EXISTS public.coupon_submissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id         UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  store_slug        TEXT NOT NULL,
  code              TEXT NOT NULL DEFAULT '',
  normalized_code   TEXT NOT NULL DEFAULT '',
  title             TEXT NOT NULL DEFAULT '',
  description       TEXT NOT NULL DEFAULT '',
  source_url        TEXT NOT NULL DEFAULT '',
  evidence_url      TEXT NOT NULL DEFAULT '',
  screenshot_url    TEXT NOT NULL DEFAULT '',
  min_order_value   NUMERIC(12,2),
  expires_at        TIMESTAMPTZ,
  submitter_user_id UUID,
  submitter_email   TEXT NOT NULL DEFAULT '',
  ip_hash           TEXT NOT NULL DEFAULT '',
  user_agent_hash   TEXT NOT NULL DEFAULT '',
  status            TEXT NOT NULL DEFAULT 'pending_review',
  spam_score        NUMERIC(5,2) NOT NULL DEFAULT 0,
  trust_score       NUMERIC(5,2) NOT NULL DEFAULT 0,
  moderation_notes  TEXT NOT NULL DEFAULT '',
  metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT coupon_submissions_status_check CHECK (status IN ('pending_review', 'approved', 'rejected', 'duplicate', 'spam')),
  CONSTRAINT coupon_submissions_spam_score_check CHECK (spam_score BETWEEN 0 AND 100),
  CONSTRAINT coupon_submissions_trust_score_check CHECK (trust_score BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS coupon_submissions_store_status_idx
  ON public.coupon_submissions(store_slug, status, created_at DESC);

CREATE INDEX IF NOT EXISTS coupon_submissions_normalized_code_idx
  ON public.coupon_submissions(normalized_code)
  WHERE normalized_code <> '';

CREATE TABLE IF NOT EXISTS public.coupon_validation_events (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id          UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  evidence_id        UUID REFERENCES public.coupon_evidence(id) ON DELETE SET NULL,
  submission_id      UUID REFERENCES public.coupon_submissions(id) ON DELETE SET NULL,
  event_type         TEXT NOT NULL,
  validation_status  TEXT NOT NULL DEFAULT 'unverified',
  signal_source      TEXT NOT NULL DEFAULT 'system',
  success            BOOLEAN,
  score_delta        NUMERIC(6,2) NOT NULL DEFAULT 0,
  message            TEXT NOT NULL DEFAULT '',
  metadata           JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT coupon_validation_events_event_type_check CHECK (event_type IN ('source_seen', 'source_missing', 'partner_verified', 'public_verified', 'community_vote', 'admin_review', 'cart_check', 'expiry_check')),
  CONSTRAINT coupon_validation_events_status_check CHECK (validation_status IN ('verified_by_partner', 'verified_public', 'community_confirmed', 'unverified', 'expired_or_failed', 'rejected')),
  CONSTRAINT coupon_validation_events_signal_source_check CHECK (signal_source IN ('system', 'admin', 'affiliate_partner', 'public_page', 'newsletter', 'community', 'user'))
);

CREATE INDEX IF NOT EXISTS coupon_validation_events_coupon_created_idx
  ON public.coupon_validation_events(coupon_id, created_at DESC);

CREATE INDEX IF NOT EXISTS coupon_validation_events_evidence_created_idx
  ON public.coupon_validation_events(evidence_id, created_at DESC);

ALTER TABLE public.coupon_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_validation_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_coupon_operator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'user_metadata' ->> 'role') IN ('coupon_admin', 'super_admin');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Public read enabled coupon sources" ON public.coupon_sources;
DROP POLICY IF EXISTS "Coupon operators manage coupon sources" ON public.coupon_sources;
CREATE POLICY "Public read enabled coupon sources"
  ON public.coupon_sources FOR SELECT
  TO anon, authenticated
  USING (enabled = true);
CREATE POLICY "Coupon operators manage coupon sources"
  ON public.coupon_sources FOR ALL
  TO authenticated
  USING (public.is_coupon_operator())
  WITH CHECK (public.is_coupon_operator());

DROP POLICY IF EXISTS "Public read verified coupon evidence" ON public.coupon_evidence;
DROP POLICY IF EXISTS "Coupon operators manage coupon evidence" ON public.coupon_evidence;
CREATE POLICY "Public read verified coupon evidence"
  ON public.coupon_evidence FOR SELECT
  TO anon, authenticated
  USING (status IN ('verified_public', 'verified_by_partner', 'community_confirmed'));
CREATE POLICY "Coupon operators manage coupon evidence"
  ON public.coupon_evidence FOR ALL
  TO authenticated
  USING (public.is_coupon_operator())
  WITH CHECK (public.is_coupon_operator());

DROP POLICY IF EXISTS "Public insert coupon submissions" ON public.coupon_submissions;
DROP POLICY IF EXISTS "Coupon operators manage coupon submissions" ON public.coupon_submissions;
CREATE POLICY "Public insert coupon submissions"
  ON public.coupon_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending_review');
CREATE POLICY "Coupon operators manage coupon submissions"
  ON public.coupon_submissions FOR ALL
  TO authenticated
  USING (public.is_coupon_operator())
  WITH CHECK (public.is_coupon_operator());

DROP POLICY IF EXISTS "Coupon operators manage validation events" ON public.coupon_validation_events;
CREATE POLICY "Coupon operators manage validation events"
  ON public.coupon_validation_events FOR ALL
  TO authenticated
  USING (public.is_coupon_operator())
  WITH CHECK (public.is_coupon_operator());

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_coupon_sources_updated_at') THEN
    CREATE TRIGGER update_coupon_sources_updated_at
      BEFORE UPDATE ON public.coupon_sources
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_coupon_evidence_updated_at') THEN
    CREATE TRIGGER update_coupon_evidence_updated_at
      BEFORE UPDATE ON public.coupon_evidence
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_coupon_submissions_updated_at') THEN
    CREATE TRIGGER update_coupon_submissions_updated_at
      BEFORE UPDATE ON public.coupon_submissions
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

INSERT INTO public.coupon_sources (
  marketplace_slug,
  name,
  source_type,
  source_url,
  allowed_paths,
  selectors,
  keywords,
  scan_interval_minutes,
  risk_level,
  enabled,
  metadata
) VALUES (
  'mercado-livre',
  'Mercado Livre - página pública de cupons',
  'public_page',
  'https://www.mercadolivre.com.br/ofertas/cupons',
  ARRAY['/ofertas/cupons']::TEXT[],
  '{"coupon_card":"[data-testid*=coupon], [class*=coupon], [class*=cupom]","title":"h2, h3, [class*=title]","description":"[class*=description], [class*=subtitle]"}'::jsonb,
  ARRAY['cupom', 'cupon', 'coupon', 'desconto', 'oferta', 'mercado livre']::TEXT[],
  15,
  6,
  false,
  '{"compliance_status":"pending_review","notes":"Seed operacional desligado por padrão até revisão de termos/robots e aprovação admin."}'::jsonb
)
ON CONFLICT (marketplace_slug, source_url) DO UPDATE SET
  name = EXCLUDED.name,
  allowed_paths = EXCLUDED.allowed_paths,
  selectors = EXCLUDED.selectors,
  keywords = EXCLUDED.keywords,
  scan_interval_minutes = EXCLUDED.scan_interval_minutes,
  risk_level = EXCLUDED.risk_level,
  enabled = false,
  metadata = public.coupon_sources.metadata || EXCLUDED.metadata,
  updated_at = now();

-- Arquivo das ofertas dos grupos (docs/plano-crescimento-agressivo-2026-11-12.md, seção 9).
--
-- O feed do Link Inteligente (`/g/<grupo>/ofertas.json`) traz só as 40 ofertas mais recentes.
-- No Promo Tech Nerd (~200 por dia) isso é poucas horas: /ofertas/notebook saía vazia mesmo com
-- notebook passando no grupo todo dia. Aqui o próprio Supabase lê o feed de cada grupo a cada
-- 10 minutos (pg_cron + pg_net) e guarda as ofertas por 35 dias. As páginas de ofertas juntam o
-- feed ao vivo com este arquivo, filtrado pelo produto (offer_terms).
--
-- Segurança: só a função (dona: postgres) grava. Ninguém de fora insere oferta, porque a tabela é
-- exibida no site com link de afiliado. Leitura pública (as ofertas já são públicas no grupo).
-- Rodar a qualquer hora; repetir não duplica nada.

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.group_offers (
  id          BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  feed_slug   TEXT        NOT NULL,
  link        TEXT        NOT NULL,
  text        TEXT        NOT NULL,
  -- minúsculas e sem acento, para o filtro por produto ("maquina de lavar" acha "Máquina de Lavar")
  text_norm   TEXT        NOT NULL,
  store       TEXT,
  sent_at     TIMESTAMPTZ,
  first_seen  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT group_offers_feed_link UNIQUE (feed_slug, link)
);

COMMENT ON TABLE public.group_offers IS
  'Ofertas que saíram nos grupos, copiadas do feed do Link Inteligente a cada 10 min por collect_group_offers(). Guardadas por 35 dias.';

CREATE INDEX IF NOT EXISTS idx_group_offers_feed_sent ON public.group_offers (feed_slug, sent_at DESC);

-- Pedidos ao feed ainda sem resposta (o pg_net responde depois, em net._http_response).
CREATE TABLE IF NOT EXISTS public.group_offer_fetches (
  request_id   BIGINT      PRIMARY KEY,
  feed_slug    TEXT        NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_offer_fetches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "group_offers_read_public" ON public.group_offers;
CREATE POLICY "group_offers_read_public"
  ON public.group_offers FOR SELECT
  USING (true);

GRANT SELECT ON public.group_offers TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.group_offers FROM anon, authenticated;
REVOKE ALL ON public.group_offer_fetches FROM anon, authenticated;

-- Data do feed (texto de fora): inválida vira NULL em vez de derrubar a coleta.
CREATE OR REPLACE FUNCTION public.safe_timestamptz(value TEXT)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN value::timestamptz;
EXCEPTION WHEN others THEN
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.collect_group_offers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  response RECORD;
  feed RECORD;
BEGIN
  -- 1. Respostas dos pedidos anteriores → ofertas novas.
  FOR response IN
    SELECT f.request_id, f.feed_slug, r.content
    FROM public.group_offer_fetches f
    JOIN net._http_response r ON r.id = f.request_id
    WHERE r.status_code = 200 AND r.content IS NOT NULL
  LOOP
    BEGIN
      INSERT INTO public.group_offers (feed_slug, link, text, text_norm, store, sent_at)
      SELECT
        response.feed_slug,
        left(trim(item->>'link'), 2000),
        left(trim(item->>'text'), 200),
        lower(extensions.unaccent(left(trim(item->>'text'), 200))),
        nullif(left(trim(item->>'store'), 40), ''),
        coalesce(public.safe_timestamptz(item->>'sentAt'), now())
      FROM jsonb_array_elements(
        CASE WHEN jsonb_typeof(response.content::jsonb -> 'items') = 'array'
             THEN response.content::jsonb -> 'items' ELSE '[]'::jsonb END
      ) AS item
      WHERE jsonb_typeof(item) = 'object'
        AND coalesce(trim(item->>'text'), '') <> ''
        AND item->>'link' ~ '^https?://[^\s]+$'
      ON CONFLICT (feed_slug, link) DO NOTHING;
    EXCEPTION WHEN others THEN
      -- Resposta que não é JSON: ignora este feed nesta rodada.
      NULL;
    END;
  END LOOP;

  -- Pedido respondido (com sucesso ou não) ou esquecido há mais de 1 hora sai da fila.
  DELETE FROM public.group_offer_fetches f
  WHERE f.requested_at < now() - interval '1 hour'
     OR EXISTS (SELECT 1 FROM net._http_response r WHERE r.id = f.request_id);

  -- 2. Oferta com mais de 35 dias: o preço já não vale.
  DELETE FROM public.group_offers
  WHERE coalesce(sent_at, first_seen) < now() - interval '35 days';

  -- 3. Novos pedidos: um por grupo (links das páginas + link global), só do Link Inteligente.
  FOR feed IN
    SELECT DISTINCT (regexp_match(url, '^https://(?:www\.)?linkdivulgador\.com\.br/g/([a-z0-9-]{3,40})/?$'))[1] AS slug
    FROM (
      SELECT join_url AS url FROM public.whatsapp_group_pages WHERE join_url IS NOT NULL
      UNION
      SELECT value->>'whatsapp_group' FROM public.site_settings WHERE key = 'global_links'
    ) links
  LOOP
    CONTINUE WHEN feed.slug IS NULL;
    INSERT INTO public.group_offer_fetches (request_id, feed_slug)
    VALUES (
      net.http_get(
        url := 'https://linkdivulgador.com.br/g/' || feed.slug || '/ofertas.json',
        headers := '{"Accept": "application/json"}'::jsonb,
        timeout_milliseconds := 8000
      ),
      feed.slug
    );
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.collect_group_offers() FROM PUBLIC, anon, authenticated;

SELECT cron.unschedule('collect-group-offers')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'collect-group-offers');

SELECT cron.schedule('collect-group-offers', '*/10 * * * *', 'SELECT public.collect_group_offers()');

-- Primeira rodada agora (as ofertas aparecem na rodada seguinte, em até 10 minutos).
SELECT public.collect_group_offers();

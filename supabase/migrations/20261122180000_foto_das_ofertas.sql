-- Foto do produto nas ofertas dos grupos (pedido da Flávia em 22/11/2026).
--
-- O feed do Link Inteligente passou a mandar `image` (endereço https da foto na loja), quando o
-- Espelha Grupos está com SMART_LINK_FEED_IMAGES=true. O arquivo de ofertas (`group_offers`) guarda a
-- foto junto, para as páginas de ofertas (que mostram até 30 dias) terem foto nas ofertas antigas.
--
-- Pode rodar antes do Espelha ligar a foto: sem `image` no feed, a coluna fica vazia. O site lê a
-- coluna com fallback (prerender/data.ts), então também pode rodar antes ou depois do deploy.
-- Igual ao coletor de 20261122150000; muda só o INSERT (coluna image_url) e o ON CONFLICT.

ALTER TABLE public.group_offers ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN public.group_offers.image_url IS
  'Foto do produto na loja (campo image do feed do Link Inteligente). Só https. Vazio = oferta sem foto.';

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
      INSERT INTO public.group_offers (feed_slug, link, text, text_norm, store, sent_at, image_url)
      SELECT
        response.feed_slug,
        left(trim(item->>'link'), 2000),
        left(trim(item->>'text'), 200),
        lower(extensions.unaccent(left(trim(item->>'text'), 200))),
        nullif(left(trim(item->>'store'), 40), ''),
        coalesce(public.safe_timestamptz(item->>'sentAt'), now()),
        -- Foto da loja (`image` do feed): só https, sem espaço, até 1000 caracteres.
        CASE WHEN item->>'image' ~ '^https://[^\s"<>]+$' AND length(item->>'image') <= 1000 THEN item->>'image' END
      FROM jsonb_array_elements(
        CASE WHEN jsonb_typeof(response.content::jsonb -> 'items') = 'array'
             THEN response.content::jsonb -> 'items' ELSE '[]'::jsonb END
      ) AS item
      WHERE jsonb_typeof(item) = 'object'
        AND coalesce(trim(item->>'text'), '') <> ''
        AND item->>'link' ~ '^https?://[^\s]+$'
      -- A foto pode chegar numa leitura depois da oferta (o feed não espera a loja): completa só a foto.
      ON CONFLICT (feed_slug, link) DO UPDATE
        SET image_url = EXCLUDED.image_url
        WHERE public.group_offers.image_url IS NULL AND EXCLUDED.image_url IS NOT NULL;
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
  --    `promo-tech` (link antigo) ou `262/promo-pet` (link novo, com o número da conta).
  FOR feed IN
    SELECT DISTINCT (regexp_match(url, '^https://(?:www\.)?linkdivulgador\.com\.br/g/((?:[0-9]{1,10}/)?[a-z0-9-]{3,40})/?$'))[1] AS slug
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

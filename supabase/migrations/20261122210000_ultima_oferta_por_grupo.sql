-- Última oferta de cada grupo, para o diretório /grupos-de-promocao mostrar "saiu às 14h05: …"
-- (docs/plano-leads-que-compram-2026-11-22.md, 2.4). A página que mais leva gente aos grupos
-- (32% dos cliques) passa a provar que cada grupo está vivo.
--
-- Uma linha por feed (DISTINCT ON), das ofertas dos últimos 7 dias: consulta pequena, em vez de
-- o site baixar centenas de ofertas. Os dados são os mesmos de group_offers, que já é leitura
-- pública. Pode rodar antes ou depois do deploy: sem a view, o diretório sai sem a última oferta.

CREATE OR REPLACE VIEW public.group_offers_latest
WITH (security_invoker = true) AS
SELECT DISTINCT ON (feed_slug)
  feed_slug, text, link, store, sent_at, image_url
FROM public.group_offers
WHERE sent_at >= now() - interval '7 days'
ORDER BY feed_slug, sent_at DESC;

COMMENT ON VIEW public.group_offers_latest IS
  'A oferta mais recente de cada grupo (feed_slug) nos últimos 7 dias. Usada pelo diretório /grupos-de-promocao.';

GRANT SELECT ON public.group_offers_latest TO anon, authenticated;

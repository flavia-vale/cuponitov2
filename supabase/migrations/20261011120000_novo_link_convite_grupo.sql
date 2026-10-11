-- Novo Link Inteligente do grupo de ofertas: linkdivulgador.com.br
-- Troca o link global e qualquer página do grupo que ainda aponte para o endereço antigo.

UPDATE public.site_settings
SET value = jsonb_set(value, '{whatsapp_group}', to_jsonb('https://linkdivulgador.com.br/g/ofertas-fafaciane'::text)),
    updated_at = now()
WHERE key = 'global_links';

UPDATE public.whatsapp_group_pages
SET join_url = 'https://linkdivulgador.com.br/g/ofertas-fafaciane'
WHERE join_url LIKE '%espelhagrupos.com.br/g/ofertas-fafaciane%'
   OR join_url LIKE '%chat.whatsapp.com/%';

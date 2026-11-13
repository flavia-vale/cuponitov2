-- Contagem regressiva no botão do grupo (docs/plano-leads-quentes-2026-11-10.md, frente C).
--
-- Os campos ficam em site_settings.whatsapp_group_info e são editáveis no painel
-- (Grupos do WhatsApp → Dados do grupo → Contagem regressiva). A contagem aparece até
-- 45 dias antes da data e some sozinha no dia seguinte. Depois da Black Friday, trocar
-- para "Natal" / 2026-12-25 no painel (não precisa de outra migration).
--
-- Pode rodar antes ou depois do deploy: sem o código novo, os campos são ignorados.

UPDATE public.site_settings
SET value = COALESCE(value, '{}'::jsonb)
  || jsonb_build_object('countdown_label', 'Black Friday', 'countdown_date', '2026-11-27'),
    updated_at = now()
WHERE key = 'whatsapp_group_info';

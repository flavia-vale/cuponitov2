-- 1. Garantir que o provedor Rakuten existe
INSERT INTO public.integration_providers (name, slug, base_url, auth_type, active)
VALUES ('Rakuten Advertising', 'rakuten', 'https://api.linksynergy.com/coupon/1.0', 'token', true)
ON CONFLICT (slug) DO UPDATE SET active = true;

-- 2. Inserir ou atualizar a conta para o MID 43984
DO $$
DECLARE
    v_provider_id UUID;
    v_account_id UUID;
BEGIN
    SELECT id INTO v_provider_id FROM public.integration_providers WHERE slug = 'rakuten';

    -- Busca conta existente pelo publisher_id (MID)
    SELECT id INTO v_account_id FROM public.affiliate_accounts 
    WHERE publisher_id = '43984' AND provider_id = v_provider_id;

    IF v_account_id IS NULL THEN
        INSERT INTO public.affiliate_accounts (name, publisher_id, provider_id, active)
        VALUES ('Rakuten - MID 43984', '43984', v_provider_id, true)
        RETURNING id INTO v_account_id;
    ELSE
        UPDATE public.affiliate_accounts SET active = true WHERE id = v_account_id;
    END IF;

    -- 3. Configurar agendamento de sincronização (6 horas)
    INSERT INTO public.sync_schedules (account_id, interval_hours, enabled, next_run_at)
    VALUES (v_account_id, 6, true, now())
    ON CONFLICT (account_id) DO UPDATE SET 
        interval_hours = 6, 
        enabled = true;
END $$;
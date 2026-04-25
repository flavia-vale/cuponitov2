-- Backfill: define expiry = hoje+1 dia para cupons sem data de vencimento.
-- Alinhado com a lógica rollingExpiry() adicionada nos serviços de sync.
-- Coluna expiry é timestamptz — não pode conter string vazia, só NULL.

DO $$
DECLARE
  v_expiry      TIMESTAMPTZ;
  v_expiry_text TEXT;
  v_count       INTEGER;
BEGIN
  -- Amanhã às 23:59:59.999 UTC
  v_expiry := date_trunc('day', NOW() AT TIME ZONE 'UTC')
              + interval '2 days'
              - interval '1 millisecond';

  -- Mesmo dia formatado em pt-BR no fuso de São Paulo
  v_expiry_text := to_char(
    date_trunc('day', NOW() AT TIME ZONE 'America/Sao_Paulo') + interval '1 day',
    'DD/MM/YYYY'
  );

  UPDATE public.coupons
  SET
    expiry      = v_expiry,
    expiry_text = v_expiry_text,
    updated_at  = NOW()
  WHERE expiry IS NULL;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RAISE NOTICE 'Backfill expiry: % cupons atualizados com expiry = %', v_count, v_expiry;
END $$;

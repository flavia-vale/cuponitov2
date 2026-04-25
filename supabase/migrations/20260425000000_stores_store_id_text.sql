-- Muda stores.store_id de integer para text para suportar UUIDs (Lomadee/SocialSoul)
-- Awin e Rakuten usam IDs numéricos, mas a nova API Lomadee usa UUIDs.
-- text aceita ambos sem perder precisão.

ALTER TABLE public.stores
  ALTER COLUMN store_id TYPE text USING store_id::text;

-- Mantém o índice (PostgreSQL recria automaticamente após ALTER TYPE)
COMMENT ON COLUMN public.stores.store_id IS 'External store ID (integer for Awin/Rakuten, UUID for Lomadee)';

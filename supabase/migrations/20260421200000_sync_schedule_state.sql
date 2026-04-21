-- Adiciona estado de paginação ao agendamento
-- Permite que cada run continue de onde parou
ALTER TABLE public.sync_schedules
  ADD COLUMN IF NOT EXISTS state JSONB NOT NULL DEFAULT '{}';
-- ex: {"next_page": 11, "total_pages": 152}

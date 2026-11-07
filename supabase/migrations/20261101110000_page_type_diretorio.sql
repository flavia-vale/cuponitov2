-- O diretório /grupos-de-promocao usa page_type = 'directory', mas a trava criada em
-- 20261023120000_paginas_de_ofertas.sql só aceita 'group' e 'offers' (erro 23514 ao rodar
-- 20261101120000_diretorio_grupos.sql em 07/11). Rode ESTA antes da do diretório.

ALTER TABLE public.whatsapp_group_pages
  DROP CONSTRAINT IF EXISTS whatsapp_group_pages_page_type_check;

ALTER TABLE public.whatsapp_group_pages
  ADD CONSTRAINT whatsapp_group_pages_page_type_check
  CHECK (page_type IN ('group', 'offers', 'directory'));

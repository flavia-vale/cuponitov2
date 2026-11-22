-- Diretório /grupos-de-promocao: descrição com os grupos novos de 22/11 (Natal, Presentes, Pet,
-- Auto e Moto). Os cartões já entram sozinhos (directory_section); a meta description, lida pelo
-- Google, pelo Bing e pelo ChatGPT, ainda listava só os grupos de 01/11.
-- Rodada de IA de 22/11 (docs/analise-grupos-e-grupos-novos-2026-11-22.md, seção 9): o ChatGPT cita
-- este diretório para "grupos de promoção no WhatsApp confiáveis" e "grupo de promoção de celular".

UPDATE public.whatsapp_group_pages
SET meta_description = 'Grupos de promoção do Cuponito por assunto: celular, PC, tênis, perfume, Natal, presentes, pet, carro e moto e achadinhos. Grátis e só os admins postam.',
    updated_at = now()
WHERE slug = 'grupos-de-promocao'
  AND meta_description NOT LIKE '%pet%';

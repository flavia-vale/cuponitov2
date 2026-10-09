-- Fotos reais das autoras (EEAT): assinatura, caixa "Sobre a autora" e
-- `image` do schema Person. Arquivos servidos pelo próprio site (public/autoras/).
UPDATE public.blog_authors
SET avatar_url = 'https://www.cuponito.com.br/autoras/flavia-vale.webp'
WHERE name = 'Flávia Vale';

UPDATE public.blog_authors
SET avatar_url = 'https://www.cuponito.com.br/autoras/taciane-andrade.webp'
WHERE name = 'Taciane Andrade';

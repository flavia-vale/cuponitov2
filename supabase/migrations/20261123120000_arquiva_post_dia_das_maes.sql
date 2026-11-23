-- Auditoria SEO de 23/11: o post "Presentes para o Dia das Mães 2026" estava no ar em novembro, com
-- 1 link interno e sem busca relevante nas medições de 15 e 22/11. Volta para rascunho (não apaga:
-- o texto e a capa ficam no painel para republicar perto de abril). Sai do sitemap e do blog.
UPDATE public.blog_posts
SET status = 'draft'::public.blog_post_status
WHERE slug = 'presentes-dia-das-maes-comprar-com-desconto'
  AND status = 'published'::public.blog_post_status;

-- Adiciona categorias que já existem nos cupons mas não estão em coupon_categories
INSERT INTO public.coupon_categories (name, slug, description, icon, color_hex, sort_order)
VALUES
  ('Animals', 'animals', 'Cupons e ofertas para animais de estimação', '🐾', '#F59E0B', 10),
  ('Auto & Acessórios', 'auto-and-accessories', 'Cupons para carros, motos e acessórios automotivos', '🚗', '#EF4444', 11),
  ('Livros & Literatura', 'books-and-literature', 'Cupons para livros, e-books e plataformas de leitura', '📚', '#3B82F6', 12),
  ('Educação', 'education', 'Cupons para cursos online, plataformas educacionais e treinamentos', '🎓', '#8B5CF6', 13),
  ('Entretenimento', 'entertainment', 'Cupons para filmes, séries, streaming e entretenimento', '🎬', '#EC4899', 14),
  ('Comida & Bebidas', 'food-and-beverages', 'Cupons para restaurantes, café e bebidas', '🍕', '#F59E0B', 15),
  ('Jogos', 'games', 'Cupons para jogos, consoles e plataformas de gaming', '🎮', '#06B6D4', 16),
  ('Saúde', 'health', 'Cupons para farmácias, suplementos e produtos de saúde', '💊', '#10B981', 17),
  ('Indústria & Comércio', 'industry-and-commerce', 'Cupons para fornecedores e comércio B2B', '🏭', '#6B7280', 18),
  ('Produtos para Bebês', 'infant-products', 'Cupons para produtos infantis, fraldas e acessórios de bebê', '👶', '#F472B6', 19),
  ('Promoções', 'promotions', 'Promoções especiais e flash sales', '⚡', '#FBBF24', 20),
  ('Shopping', 'shopping', 'Cupons gerais de shopping e compras', '🛍️', '#EC4899', 21),
  ('Esportes', 'sports', 'Cupons para equipamentos de esportes e fitness', '⚽', '#059669', 22),
  ('Bem-estar', 'wellness', 'Cupons para spa, yoga, meditação e bem-estar', '🧘', '#06B6D4', 23)
ON CONFLICT (name) DO NOTHING;

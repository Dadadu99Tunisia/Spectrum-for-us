-- Seed Categories for Spectrum Marketplace

INSERT INTO public.categories (name, slug, description, icon, display_order, is_active) VALUES
('Vêtements & Mode', 'vetements-mode', 'Vêtements inclusifs et non-genrés pour tous les styles', 'Shirt', 1, true),
('Bijoux & Ornements', 'bijoux-ornements', 'Bijoux artisanaux et accessoires de fierté', 'Gem', 2, true),
('Art & Artisanat', 'art-artisanat', 'Œuvres d''art et créations artisanales uniques', 'Palette', 3, true),
('Beauté & Bien-être', 'beaute-bien-etre', 'Produits de beauté inclusifs et soins personnels', 'Sparkles', 4, true),
('Livres & Médias', 'livres-medias', 'Littérature LGBTQIA+ et médias inclusifs', 'BookOpen', 5, true),
('Maison & Décoration', 'maison-decoration', 'Décoration intérieure et articles pour la maison', 'Home', 6, true),
('Accessoires', 'accessoires', 'Sacs, écharpes, et autres accessoires', 'Briefcase', 7, true),
('Drapeaux & Pins', 'drapeaux-pins', 'Symboles de fierté et accessoires de visibilité', 'Flag', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Add subcategories
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active)
SELECT 'T-shirts', 't-shirts', 'T-shirts inclusifs', id, 1, true
FROM public.categories WHERE slug = 'vetements-mode'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active)
SELECT 'Sweats & Hoodies', 'sweats-hoodies', 'Sweats et hoodies confortables', id, 2, true
FROM public.categories WHERE slug = 'vetements-mode'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active)
SELECT 'Pantalons', 'pantalons', 'Pantalons et bas', id, 3, true
FROM public.categories WHERE slug = 'vetements-mode'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active)
SELECT 'Binders', 'binders', 'Binders de compression', id, 4, true
FROM public.categories WHERE slug = 'vetements-mode'
ON CONFLICT (slug) DO NOTHING;

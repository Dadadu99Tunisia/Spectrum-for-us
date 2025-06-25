-- Création des tables principales si elles n'existent pas déjà
-- Ce script sera exécuté automatiquement par Prisma

-- Insertion des catégories de base
INSERT INTO categories (id, name, slug, description, icon, featured) VALUES
('cat-vetements', 'Vêtements & Mode', 'vetements-mode', 'Vêtements et accessoires de mode inclusifs', 'Shirt', true),
('cat-bijoux', 'Bijoux & Ornements', 'bijoux-ornements', 'Bijoux et accessoires personnels', 'Gem', true),
('cat-maison', 'Maison & Décoration', 'maison-decoration', 'Articles pour la maison et décoration', 'Home', false),
('cat-art', 'Art & Artisanat', 'art-artisanat', 'Œuvres d\'art et créations artisanales', 'Palette', true),
('cat-beaute', 'Beauté & Bien-être', 'beaute-bien-etre', 'Produits de beauté et soins', 'Sparkles', false)
ON CONFLICT (slug) DO NOTHING;

-- Insertion d'un utilisateur admin par défaut
INSERT INTO users (id, name, email, password, role) VALUES
('admin-001', 'Administrateur', 'admin@spectrum-marketplace.com', '$2b$10$rQZ9QmjqjKW8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8', 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;

-- ================================================
-- SPECTRUM MARKETPLACE - PRODUITS DE TEST
-- Execute APRES avoir cree un compte vendeur
-- ================================================

-- D'abord, recupere ton user_id depuis Supabase Auth > Users
-- Puis remplace 'TON_USER_ID' par ton vrai UUID

-- OPTION 1: Si tu veux tester sans compte vendeur
-- Cree un vendeur fictif d'abord:

DO $$
DECLARE
  test_vendor_id UUID;
BEGIN
  -- Cherche un profil existant ou utilise un ID fixe pour test
  SELECT id INTO test_vendor_id FROM public.profiles LIMIT 1;
  
  -- Si aucun profil, on ne peut pas inserer de produits
  IF test_vendor_id IS NULL THEN
    RAISE NOTICE 'Aucun profil trouve. Cree dabord un compte utilisateur sur le site.';
    RETURN;
  END IF;
  
  -- Met a jour le profil en vendeur
  UPDATE public.profiles 
  SET 
    is_vendor = true, 
    vendor_approved = true,
    shop_name = 'Boutique Demo Spectrum',
    shop_description = 'Une boutique de demonstration pour tester le marketplace'
  WHERE id = test_vendor_id;
  
  -- Supprime les anciens produits de test
  DELETE FROM public.products WHERE vendor_id = test_vendor_id;
  
  -- Insere les produits de test
  INSERT INTO public.products (vendor_id, name, description, price, compare_at_price, category, images, stock, is_active, is_featured, tags) VALUES
  
  -- Mode
  (test_vendor_id, 'Chemise Fluide Unisexe', 'Chemise oversize en coton bio, coupe fluide et confortable. Parfaite pour tous les styles.', 89.00, 120.00, 'Mode', ARRAY['/unisex-fluid-shirt-minimal.jpg'], 25, true, true, ARRAY['unisexe', 'coton-bio', 'oversize']),
  
  (test_vendor_id, 'Veste Oversized Gender-Neutral', 'Veste ample et structuree, design moderne et inclusif. Tissu premium.', 189.00, NULL, 'Mode', ARRAY['/oversized-gender-neutral-jacket-fashion.jpg'], 15, true, true, ARRAY['veste', 'gender-neutral', 'premium']),
  
  (test_vendor_id, 'Ensemble Maillot Inclusif', 'Maillot de bain inclusif, concu pour tous les corps. Tissu resistant au chlore.', 75.00, 95.00, 'Mode', ARRAY['/inclusive-swimwear-set.jpg'], 30, true, false, ARRAY['maillot', 'inclusif', 'ete']),
  
  (test_vendor_id, 'Brassiere Compression Douce', 'Brassiere de compression confortable, ideal pour le quotidien ou le sport.', 45.00, NULL, 'Mode', ARRAY['/soft-compression-bra-neutral.jpg'], 40, true, false, ARRAY['brassiere', 'compression', 'confort']),
  
  -- Beaute
  (test_vendor_id, 'Serum Hydratant Naturel', 'Serum visage aux ingredients naturels, hydratation intense pour tous types de peau.', 42.00, 55.00, 'Beaute', ARRAY['/minimal-serum-bottle-skincare.jpg'], 50, true, true, ARRAY['serum', 'naturel', 'hydratant']),
  
  (test_vendor_id, 'Parfum Boise Unisexe', 'Eau de parfum aux notes boisees et epicees. Flacon elegant 50ml.', 78.00, NULL, 'Beaute', ARRAY['/minimal-perfume-bottle-woody.jpg'], 20, true, true, ARRAY['parfum', 'unisexe', 'boise']),
  
  (test_vendor_id, 'Huile Intime Naturelle', 'Huile de massage et soin intime, 100% naturelle et vegan.', 35.00, NULL, 'Bien-etre', ARRAY['/intimate-oil-glass-bottle.jpg'], 35, true, false, ARRAY['huile', 'intime', 'naturel']),
  
  -- Maison
  (test_vendor_id, 'Vase Ceramique Organique', 'Vase artisanal en ceramique, formes organiques uniques. Piece unique.', 65.00, 85.00, 'Maison', ARRAY['/ceramic-vase-organic-shape.jpg'], 10, true, true, ARRAY['vase', 'ceramique', 'artisanal']),
  
  (test_vendor_id, 'Bougie Soja Artisanale', 'Bougie parfumee au soja naturel, meche en coton. Duree 45h.', 28.00, NULL, 'Maison', ARRAY['/soy-candle-minimal-glass.jpg'], 60, true, false, ARRAY['bougie', 'soja', 'naturel']),
  
  (test_vendor_id, 'Couverture Tissee Main', 'Couverture en laine tissee a la main, motifs traditionnels revisites.', 145.00, 180.00, 'Maison', ARRAY['/handwoven-blanket-texture.jpg'], 8, true, true, ARRAY['couverture', 'laine', 'artisanal']),
  
  -- Art
  (test_vendor_id, 'Poster Art Queer - Belonging', 'Illustration originale celebrant la diversite. Impression giclée sur papier art.', 35.00, NULL, 'Art', ARRAY['/queer-art-poster-belonging-illustration.jpg'], 100, true, false, ARRAY['poster', 'art', 'illustration']),
  
  (test_vendor_id, 'Zine Queer Culture', 'Magazine independant explorant la culture queer contemporaine. Edition limitee.', 18.00, NULL, 'Art', ARRAY['/queer-zine-magazine-cover.jpg'], 50, true, false, ARRAY['zine', 'magazine', 'culture']),
  
  -- Livres
  (test_vendor_id, 'Guide Illustre Inclusif', 'Guide pratique illustre sur linclusion et la diversite. 200 pages couleur.', 29.00, 35.00, 'Livres', ARRAY['/illustrated-guide-book-cover.jpg'], 45, true, true, ARRAY['livre', 'guide', 'inclusif']),
  
  (test_vendor_id, 'Recueil Voix Queers', 'Anthologie de textes et poemes dauteurs queers francophones.', 24.00, NULL, 'Livres', ARRAY['/queer-voices-book-cover-diverse.jpg'], 30, true, false, ARRAY['livre', 'poesie', 'anthologie']),
  
  -- Bijoux
  (test_vendor_id, 'Bijoux Artisanaux Fluides', 'Ensemble de bijoux en metal recycle, design fluide et moderne.', 55.00, 70.00, 'Mode', ARRAY['/fluid-artisan-jewelry-queer.jpg'], 20, true, true, ARRAY['bijoux', 'artisanal', 'recycle']);

  RAISE NOTICE 'Produits de test inseres avec succes pour le vendeur %', test_vendor_id;
END $$;

-- Verifie les produits
SELECT id, name, price, category, is_featured FROM public.products ORDER BY created_at DESC;

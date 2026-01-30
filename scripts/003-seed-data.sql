-- Insert categories with inclusive, comprehensive verticals
INSERT INTO categories (id, name, slug, description, image_url) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Fashion & Apparel', 'fashion-apparel', 'Gender-neutral streetwear, binders, tucking lingerie, upcycled fashion, and clubwear for every body and every expression.', '/images/categories/fashion-apparel.jpg'),
  ('c1000000-0000-0000-0000-000000000002', 'Beauty & Grooming', 'beauty-grooming', 'Skincare for all skin types, beard care, gender-affirming makeup, and fragrances that celebrate individuality.', '/images/categories/beauty-grooming.jpg'),
  ('c1000000-0000-0000-0000-000000000003', 'Adaptive & Mobility', 'adaptive-mobility', 'High-fashion adaptive gear: designer wheelchair covers, stylish canes, sensory-friendly clothing, magnetic closure apparel, and prosthetic art.', '/images/categories/adaptive-mobility.jpg'),
  ('c1000000-0000-0000-0000-000000000004', 'Home & Sanctuary', 'home-sanctuary', 'Queer art prints, LGBTQ+ literature, safe space decor, and candles to create your perfect sanctuary.', '/images/categories/home-sanctuary.jpg'),
  ('c1000000-0000-0000-0000-000000000005', 'Intimacy & Wellness', 'intimacy-wellness', 'Sexual wellness products, mental health resources, and yoga and body connection tools for holistic well-being.', '/images/categories/intimacy-wellness.jpg'),
  ('c1000000-0000-0000-0000-000000000006', 'Accessories', 'accessories', 'Pronoun pins, pride jewelry, bags, and statement pieces that let you express your authentic self.', '/images/categories/accessories.jpg'),
  ('c1000000-0000-0000-0000-000000000007', 'Unisex & Fluid Style', 'unisex-fluid', 'Clothing and accessories designed without gender boundaries, for fluid and androgynous expression.', '/images/categories/unisex-fluid.jpg'),
  ('c1000000-0000-0000-0000-000000000008', 'Community & Culture', 'community-culture', 'Books, zines, educational materials, and cultural items celebrating diverse identities and histories.', '/images/categories/community-culture.jpg');

-- Insert demo vendors (without user_id - these are demo stores)
INSERT INTO vendors (id, store_name, store_description, store_logo, store_banner, is_verified, rating, total_sales) VALUES
  ('v1000000-0000-0000-0000-000000000001', 'Radiant Mobility Co.', 'Disability-led brand creating high-fashion adaptive gear. We believe mobility aids should be as stylish as they are functional.', '/images/vendors/radiant-mobility-logo.jpg', '/images/vendors/radiant-mobility-banner.jpg', true, 4.9, 1850),
  ('v1000000-0000-0000-0000-000000000002', 'Affirm Apparel', 'Trans-owned fashion house specializing in gender-affirming clothing, binders, and tucking lingerie. Comfort meets confidence.', '/images/vendors/affirm-apparel-logo.jpg', '/images/vendors/affirm-apparel-banner.jpg', true, 4.8, 2340),
  ('v1000000-0000-0000-0000-000000000003', 'Sanctuary Home', 'Queer-owned home decor celebrating LGBTQ+ art, literature, and safe space aesthetics. Your home, your rules.', '/images/vendors/sanctuary-home-logo.jpg', '/images/vendors/sanctuary-home-banner.jpg', true, 4.7, 1120),
  ('v1000000-0000-0000-0000-000000000004', 'Fluid Beauty Collective', 'Gender-affirming beauty and grooming products for all. Skincare, beard care, and makeup without boundaries.', '/images/vendors/fluid-beauty-logo.jpg', '/images/vendors/fluid-beauty-banner.jpg', true, 4.8, 1560),
  ('v1000000-0000-0000-0000-000000000005', 'Pride Accessories', 'Handcrafted pronoun pins, pride jewelry, and statement pieces. Small business, big pride.', '/images/vendors/pride-accessories-logo.jpg', '/images/vendors/pride-accessories-banner.jpg', true, 4.6, 890);

-- Insert demo products for Radiant Mobility Co. (Adaptive & Mobility)
INSERT INTO products (id, vendor_id, category_id, name, slug, description, price, compare_at_price, stock, images, is_active, is_featured, rating, review_count) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Abstract Art Wheelchair Spoke Guards', 'abstract-art-wheelchair-spoke-guards', 'Transform your wheelchair into a statement piece with these stunning abstract art spoke guards. Designed by disabled artists, made from durable UV-resistant vinyl. Easy snap-on installation fits most standard wheelchairs.', 89.99, 119.99, 40, ARRAY['/images/products/wheelchair-spoke-guards.jpg', '/images/products/wheelchair-spoke-guards-2.jpg'], true, true, 4.9, 156),
  ('p1000000-0000-0000-0000-000000000002', 'v1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Galaxy Print Stylish Cane', 'galaxy-print-stylish-cane', 'A stunning galaxy-print folding cane that combines fashion with function. Adjustable height, lightweight aluminum construction, and a comfortable ergonomic handle. Be proud of your mobility aid.', 65.99, NULL, 55, ARRAY['/images/products/stylish-cane.jpg', '/images/products/stylish-cane-2.jpg'], true, true, 4.8, 89),
  ('p1000000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Magnetic Button Silk Shirt', 'magnetic-button-silk-shirt', 'Elegant silk shirt with hidden magnetic closures for easy dressing. Perfect for those with limited dexterity. Available in multiple colors. Adaptive fashion that looks incredible.', 129.99, 159.99, 30, ARRAY['/images/products/magnetic-silk-shirt.jpg', '/images/products/magnetic-silk-shirt-2.jpg'], true, true, 4.7, 78),
  ('p1000000-0000-0000-0000-000000000004', 'v1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Sensory-Friendly Seamless Tee', 'sensory-friendly-seamless-tee', 'Ultra-soft, tagless, seamless t-shirt designed for sensory sensitivities. No irritating seams, flat-lock stitching, and bamboo-cotton blend for maximum comfort. Available in neutral tones.', 44.99, NULL, 100, ARRAY['/images/products/sensory-tee.jpg', '/images/products/sensory-tee-2.jpg'], true, false, 4.9, 234);

-- Insert demo products for Affirm Apparel (Fashion & Apparel)
INSERT INTO products (id, vendor_id, category_id, name, slug, description, price, compare_at_price, stock, images, is_active, is_featured, rating, review_count) VALUES
  ('p1000000-0000-0000-0000-000000000005', 'v1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Breathable Chest Binder - Nude Tone', 'breathable-chest-binder-nude', 'Our most comfortable binder yet. Breathable mesh panels, 8+ hours of safe wear, and available in 12 nude tones to match your skin. Flat front design with comfortable back panel. Trans-owned and designed.', 54.99, 64.99, 150, ARRAY['/images/products/chest-binder.jpg', '/images/products/chest-binder-2.jpg'], true, true, 4.8, 412),
  ('p1000000-0000-0000-0000-000000000006', 'v1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Tucking Underwear - Seamless', 'tucking-underwear-seamless', 'Comfortable, secure tucking underwear with seamless design for invisible wear under any outfit. Medical-grade compression, breathable fabric, and all-day comfort. Designed by trans women, for trans women.', 38.99, NULL, 200, ARRAY['/images/products/tucking-underwear.jpg', '/images/products/tucking-underwear-2.jpg'], true, false, 4.7, 289),
  ('p1000000-0000-0000-0000-000000000007', 'v1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Gender-Neutral Streetwear Hoodie', 'gender-neutral-streetwear-hoodie', 'Oversized, cozy hoodie designed without gender constraints. Dropped shoulders, kangaroo pocket, and premium heavyweight cotton. Available in earth tones and pride colors.', 79.99, 99.99, 80, ARRAY['/images/products/streetwear-hoodie.jpg', '/images/products/streetwear-hoodie-2.jpg'], true, true, 4.6, 167);

-- Insert demo products for Sanctuary Home (Home & Sanctuary)
INSERT INTO products (id, vendor_id, category_id, name, slug, description, price, compare_at_price, stock, images, is_active, is_featured, rating, review_count) VALUES
  ('p1000000-0000-0000-0000-000000000008', 'v1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004', 'Queer Joy Art Print Collection', 'queer-joy-art-print-collection', 'Set of 3 vibrant art prints celebrating queer joy and community. Created by LGBTQ+ artists. Printed on archival-quality paper. Perfect for creating your safe space. Frames not included.', 49.99, NULL, 60, ARRAY['/images/products/queer-art-prints.jpg', '/images/products/queer-art-prints-2.jpg'], true, true, 4.8, 145),
  ('p1000000-0000-0000-0000-000000000009', 'v1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004', 'Pride Soy Candle - Lavender Dreams', 'pride-soy-candle-lavender', 'Hand-poured soy candle in a reusable rainbow glass jar. Lavender and vanilla scent for relaxation. 50+ hour burn time. A portion of proceeds supports LGBTQ+ youth shelters.', 28.99, 34.99, 90, ARRAY['/images/products/pride-candle.jpg', '/images/products/pride-candle-2.jpg'], true, false, 4.9, 203),
  ('p1000000-0000-0000-0000-000000000010', 'v1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004', 'Safe Space Neon Sign', 'safe-space-neon-sign', 'LED neon sign that reads "Safe Space" in warm pink. Energy-efficient, dimmable, and perfect for bedrooms, offices, or storefronts. Includes wall mounting hardware.', 89.99, 109.99, 35, ARRAY['/images/products/safe-space-sign.jpg', '/images/products/safe-space-sign-2.jpg'], true, true, 4.7, 98);

-- Insert demo products for Fluid Beauty Collective (Beauty & Grooming)
INSERT INTO products (id, vendor_id, category_id, name, slug, description, price, compare_at_price, stock, images, is_active, is_featured, rating, review_count) VALUES
  ('p1000000-0000-0000-0000-000000000011', 'v1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Trans-Owned Organic Beard Oil', 'trans-owned-organic-beard-oil', 'Nourishing beard oil made with organic argan, jojoba, and cedar essential oils. Softens facial hair, reduces itch, and promotes healthy growth. Trans-owned, cruelty-free, and vegan.', 24.99, NULL, 120, ARRAY['/images/products/beard-oil.jpg', '/images/products/beard-oil-2.jpg'], true, true, 4.8, 187),
  ('p1000000-0000-0000-0000-000000000012', 'v1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Gender-Affirming Color Corrector Palette', 'gender-affirming-color-corrector', 'Professional-grade color correction palette designed for covering beard shadow and skin discoloration. Buildable, long-wearing formula. Includes orange, peach, and lavender correctors.', 36.99, 44.99, 75, ARRAY['/images/products/color-corrector.jpg', '/images/products/color-corrector-2.jpg'], true, true, 4.7, 156),
  ('p1000000-0000-0000-0000-000000000013', 'v1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'All-Skin Hydrating Serum', 'all-skin-hydrating-serum', 'Lightweight hyaluronic acid serum suitable for all skin types and textures. Fragrance-free, non-comedogenic, and hormone-safe. Perfect for skin on any transition journey.', 32.99, NULL, 95, ARRAY['/images/products/hydrating-serum.jpg', '/images/products/hydrating-serum-2.jpg'], true, false, 4.9, 298);

-- Insert demo products for Pride Accessories
INSERT INTO products (id, vendor_id, category_id, name, slug, description, price, compare_at_price, stock, images, is_active, is_featured, rating, review_count) VALUES
  ('p1000000-0000-0000-0000-000000000014', 'v1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000006', 'Pronoun Pin Set - Gold Plated', 'pronoun-pin-set-gold', 'Elegant gold-plated pronoun pins featuring she/her, he/him, they/them, and a customizable blank pin. High-quality enamel, secure butterfly clutch backs. Wear your pronouns with pride.', 18.99, 24.99, 200, ARRAY['/images/products/pronoun-pins.jpg', '/images/products/pronoun-pins-2.jpg'], true, true, 4.8, 523),
  ('p1000000-0000-0000-0000-000000000015', 'v1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000006', 'Progress Pride Flag Enamel Pin', 'progress-pride-flag-pin', 'Beautiful enamel pin featuring the Progress Pride flag with intersex-inclusive design. Gold metal finish, 1.5 inches wide. A subtle yet powerful way to show your pride.', 12.99, NULL, 300, ARRAY['/images/products/pride-flag-pin.jpg', '/images/products/pride-flag-pin-2.jpg'], true, false, 4.9, 412),
  ('p1000000-0000-0000-0000-000000000016', 'v1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000006', 'Rainbow Crystal Bracelet', 'rainbow-crystal-bracelet', 'Handcrafted bracelet featuring natural crystals in rainbow colors. Each stone is carefully selected for quality and color. Adjustable sizing fits most wrists. A beautiful everyday accessory.', 34.99, 42.99, 65, ARRAY['/images/products/crystal-bracelet.jpg', '/images/products/crystal-bracelet-2.jpg'], true, true, 4.7, 178);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = NEW.product_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for review updates
DROP TRIGGER IF EXISTS on_review_change ON reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

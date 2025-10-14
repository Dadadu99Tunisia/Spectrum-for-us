-- Adding pride-specific categories and sample products
-- Insert pride marketplace categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Clothing', 'clothing', 'Pride apparel and fashion', '/rainbow-pride-t-shirt.jpg'),
  ('Accessories', 'accessories', 'Pins, stickers, and pride accessories', '/transgender-flag-pins.jpg'),
  ('Home & Living', 'home-living', 'Pride home decor and lifestyle items', '/placeholder.svg?height=400&width=400'),
  ('Art & Prints', 'art-prints', 'Pride artwork and prints', '/placeholder.svg?height=400&width=400')
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- Insert sample products (without seller_id for now)
INSERT INTO products (name, description, price, category_id, image_url, stock, featured) 
SELECT 
  'Pride Rainbow Tee',
  'Celebrate pride with this vibrant rainbow t-shirt. Made from 100% organic cotton for comfort and sustainability.',
  29.99,
  (SELECT id FROM categories WHERE slug = 'clothing'),
  '/rainbow-pride-t-shirt.jpg',
  100,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pride Rainbow Tee');

INSERT INTO products (name, description, price, category_id, image_url, stock, featured)
SELECT
  'Trans Flag Pin Set',
  'Beautiful enamel pin set featuring the transgender pride flag. Perfect for jackets, bags, and more.',
  12.99,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  '/transgender-flag-pins.jpg',
  150,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Trans Flag Pin Set');

INSERT INTO products (name, description, price, category_id, image_url, stock, featured)
SELECT
  'Bi Pride Hoodie',
  'Cozy hoodie in bisexual pride colors. Soft fleece interior keeps you warm while showing your pride.',
  49.99,
  (SELECT id FROM categories WHERE slug = 'clothing'),
  '/bisexual-pride-hoodie.jpg',
  75,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bi Pride Hoodie');

INSERT INTO products (name, description, price, category_id, image_url, stock, featured)
SELECT
  'Lesbian Flag Sticker Pack',
  'Waterproof sticker pack featuring the lesbian pride flag. Great for laptops, water bottles, and more.',
  8.99,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  '/lesbian-pride-stickers.jpg',
  200,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lesbian Flag Sticker Pack');

INSERT INTO products (name, description, price, category_id, image_url, stock, featured)
SELECT
  'Non-Binary Pride Tank',
  'Lightweight tank top in non-binary pride colors. Perfect for summer pride events.',
  24.99,
  (SELECT id FROM categories WHERE slug = 'clothing'),
  '/non-binary-pride-tank-top.jpg',
  90,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Non-Binary Pride Tank');

INSERT INTO products (name, description, price, category_id, image_url, stock, featured)
SELECT
  'Pan Pride Enamel Pin',
  'High-quality enamel pin featuring the pansexual pride flag design.',
  9.99,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  '/pansexual-pride-enamel-pin.jpg',
  180,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pan Pride Enamel Pin');

INSERT INTO products (name, description, price, category_id, image_url, stock, featured)
SELECT
  'Ace Pride Beanie',
  'Warm beanie hat in asexual pride colors. One size fits most.',
  19.99,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  '/asexual-pride-beanie-hat.jpg',
  120,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ace Pride Beanie');

INSERT INTO products (name, description, price, category_id, image_url, stock, featured)
SELECT
  'Genderfluid Pride Tote',
  'Spacious canvas tote bag featuring genderfluid pride colors. Eco-friendly and durable.',
  16.99,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  '/genderfluid-pride-tote-bag.jpg',
  110,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Genderfluid Pride Tote');

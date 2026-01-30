-- Insert default categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Electronics', 'electronics', 'Smartphones, laptops, tablets and more', '/placeholder.svg?height=200&width=200'),
  ('Fashion', 'fashion', 'Clothing, shoes, and accessories', '/placeholder.svg?height=200&width=200'),
  ('Home & Garden', 'home-garden', 'Furniture, decor, and garden supplies', '/placeholder.svg?height=200&width=200'),
  ('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', '/placeholder.svg?height=200&width=200'),
  ('Beauty & Health', 'beauty-health', 'Skincare, makeup, and wellness products', '/placeholder.svg?height=200&width=200'),
  ('Books & Media', 'books-media', 'Books, music, movies, and games', '/placeholder.svg?height=200&width=200'),
  ('Toys & Games', 'toys-games', 'Toys, puzzles, and games for all ages', '/placeholder.svg?height=200&width=200'),
  ('Automotive', 'automotive', 'Car parts, accessories, and tools', '/placeholder.svg?height=200&width=200')
ON CONFLICT (slug) DO NOTHING;

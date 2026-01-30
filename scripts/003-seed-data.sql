-- Insert categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Electronics', 'electronics', 'Latest gadgets and electronic devices', '/placeholder.svg?height=200&width=200'),
  ('c1000000-0000-0000-0000-000000000002', 'Fashion', 'fashion', 'Trendy clothing and accessories', '/placeholder.svg?height=200&width=200'),
  ('c1000000-0000-0000-0000-000000000003', 'Home & Garden', 'home-garden', 'Everything for your home', '/placeholder.svg?height=200&width=200'),
  ('c1000000-0000-0000-0000-000000000004', 'Sports', 'sports', 'Sports equipment and accessories', '/placeholder.svg?height=200&width=200'),
  ('c1000000-0000-0000-0000-000000000005', 'Beauty', 'beauty', 'Beauty and personal care products', '/placeholder.svg?height=200&width=200'),
  ('c1000000-0000-0000-0000-000000000006', 'Books', 'books', 'Books and educational materials', '/placeholder.svg?height=200&width=200'),
  ('c1000000-0000-0000-0000-000000000007', 'Toys', 'toys', 'Toys and games for all ages', '/placeholder.svg?height=200&width=200'),
  ('c1000000-0000-0000-0000-000000000008', 'Food & Drinks', 'food-drinks', 'Gourmet food and beverages', '/placeholder.svg?height=200&width=200');

-- Insert demo vendors (without user_id - these are demo stores)
INSERT INTO vendors (id, store_name, store_description, store_logo, store_banner, is_verified, rating, total_sales) VALUES
  ('v1000000-0000-0000-0000-000000000001', 'TechHub Store', 'Your one-stop shop for all things tech. We offer the latest gadgets, accessories, and electronics at competitive prices.', '/placeholder.svg?height=100&width=100', '/placeholder.svg?height=300&width=1200', true, 4.8, 1250),
  ('v1000000-0000-0000-0000-000000000002', 'Fashion Forward', 'Trendy and sustainable fashion for the modern individual. Quality meets style.', '/placeholder.svg?height=100&width=100', '/placeholder.svg?height=300&width=1200', true, 4.6, 890),
  ('v1000000-0000-0000-0000-000000000003', 'Home Essentials', 'Transform your living space with our curated collection of home decor and furniture.', '/placeholder.svg?height=100&width=100', '/placeholder.svg?height=300&width=1200', true, 4.7, 650),
  ('v1000000-0000-0000-0000-000000000004', 'SportsPro', 'Professional sports equipment for athletes of all levels.', '/placeholder.svg?height=100&width=100', '/placeholder.svg?height=300&width=1200', false, 4.5, 420);

-- Insert demo products for TechHub Store
INSERT INTO products (id, vendor_id, category_id, name, slug, description, price, compare_at_price, stock, images, is_active, is_featured, rating, review_count) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Wireless Bluetooth Headphones', 'wireless-bluetooth-headphones', 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals.', 149.99, 199.99, 50, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, true, 4.7, 128),
  ('p1000000-0000-0000-0000-000000000002', 'v1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Smart Watch Pro', 'smart-watch-pro', 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life. Track your fitness goals with precision.', 299.99, NULL, 35, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, true, 4.8, 95),
  ('p1000000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Portable Power Bank 20000mAh', 'portable-power-bank-20000mah', 'High-capacity power bank with fast charging support. Charge up to 3 devices simultaneously.', 49.99, 69.99, 100, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, false, 4.5, 210),
  ('p1000000-0000-0000-0000-000000000004', 'v1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', '4K Webcam with Microphone', '4k-webcam-microphone', 'Professional 4K webcam with built-in noise-canceling microphone. Perfect for streaming and video calls.', 89.99, NULL, 45, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, false, 4.6, 67);

-- Insert demo products for Fashion Forward
INSERT INTO products (id, vendor_id, category_id, name, slug, description, price, compare_at_price, stock, images, is_active, is_featured, rating, review_count) VALUES
  ('p1000000-0000-0000-0000-000000000005', 'v1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Premium Cotton T-Shirt', 'premium-cotton-tshirt', '100% organic cotton t-shirt with a comfortable fit. Available in multiple colors. Sustainably sourced and ethically made.', 34.99, 44.99, 200, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, true, 4.4, 156),
  ('p1000000-0000-0000-0000-000000000006', 'v1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Leather Crossbody Bag', 'leather-crossbody-bag', 'Elegant genuine leather crossbody bag with adjustable strap. Perfect for everyday use with multiple compartments.', 89.99, NULL, 30, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, true, 4.7, 89),
  ('p1000000-0000-0000-0000-000000000007', 'v1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Slim Fit Jeans', 'slim-fit-jeans', 'Classic slim fit jeans made from premium denim. Comfortable stretch fabric for all-day wear.', 69.99, 89.99, 75, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, false, 4.5, 134);

-- Insert demo products for Home Essentials
INSERT INTO products (id, vendor_id, category_id, name, slug, description, price, compare_at_price, stock, images, is_active, is_featured, rating, review_count) VALUES
  ('p1000000-0000-0000-0000-000000000008', 'v1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Minimalist Table Lamp', 'minimalist-table-lamp', 'Modern minimalist table lamp with adjustable brightness. Perfect for bedside or desk use with warm LED lighting.', 59.99, NULL, 40, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, true, 4.6, 78),
  ('p1000000-0000-0000-0000-000000000009', 'v1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Velvet Throw Pillow Set', 'velvet-throw-pillow-set', 'Set of 2 luxurious velvet throw pillows. Soft and durable with hidden zipper. Available in multiple colors.', 44.99, 59.99, 60, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, false, 4.8, 92),
  ('p1000000-0000-0000-0000-000000000010', 'v1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Ceramic Plant Pot Collection', 'ceramic-plant-pot-collection', 'Beautiful set of 3 ceramic plant pots in varying sizes. Drainage holes included. Perfect for indoor plants.', 39.99, NULL, 55, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, true, 4.7, 63);

-- Insert demo products for SportsPro
INSERT INTO products (id, vendor_id, category_id, name, slug, description, price, compare_at_price, stock, images, is_active, is_featured, rating, review_count) VALUES
  ('p1000000-0000-0000-0000-000000000011', 'v1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'Yoga Mat Premium', 'yoga-mat-premium', 'Extra thick 6mm yoga mat with non-slip surface. Eco-friendly TPE material with carrying strap included.', 39.99, 54.99, 80, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, false, 4.6, 145),
  ('p1000000-0000-0000-0000-000000000012', 'v1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'Adjustable Dumbbell Set', 'adjustable-dumbbell-set', 'Space-saving adjustable dumbbells from 5-50 lbs. Quick-change weight system for efficient workouts.', 249.99, 299.99, 25, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, true, 4.9, 87),
  ('p1000000-0000-0000-0000-000000000013', 'v1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'Running Shoes Ultra', 'running-shoes-ultra', 'Lightweight running shoes with responsive cushioning. Breathable mesh upper for maximum comfort during long runs.', 119.99, NULL, 45, ARRAY['/placeholder.svg?height=500&width=500', '/placeholder.svg?height=500&width=500'], true, false, 4.7, 198);

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

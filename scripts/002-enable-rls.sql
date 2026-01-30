-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_payouts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Vendors policies
CREATE POLICY "Anyone can view verified vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Vendors can update own store" ON vendors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create vendor profile" ON vendors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);

-- Products policies
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Vendors can insert own products" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM vendors WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Vendors can update own products" ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM vendors WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Vendors can delete own products" ON products FOR DELETE USING (
  EXISTS (SELECT 1 FROM vendors WHERE id = vendor_id AND user_id = auth.uid())
);

-- Product variants policies
CREATE POLICY "Anyone can view variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Vendors can manage own variants" ON product_variants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products p 
    JOIN vendors v ON p.vendor_id = v.id 
    WHERE p.id = product_id AND v.user_id = auth.uid()
  )
);

-- Orders policies
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update own orders" ON orders FOR UPDATE USING (auth.uid() = customer_id);

-- Order items policies
CREATE POLICY "Customers can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
);
CREATE POLICY "Vendors can view their order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM vendors WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "System can insert order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
);
CREATE POLICY "Vendors can update their order items status" ON order_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM vendors WHERE id = vendor_id AND user_id = auth.uid())
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Customers can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = customer_id);

-- Carts policies
CREATE POLICY "Users can view own cart" ON carts FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Users can create cart" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Users can update own cart" ON carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON carts FOR DELETE USING (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can view own cart items" ON cart_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM carts WHERE id = cart_id AND (user_id = auth.uid() OR session_id IS NOT NULL))
);
CREATE POLICY "Users can manage cart items" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE id = cart_id AND (user_id = auth.uid() OR session_id IS NOT NULL))
);

-- Wishlists policies
CREATE POLICY "Users can view own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- Vendor payouts policies
CREATE POLICY "Vendors can view own payouts" ON vendor_payouts FOR SELECT USING (
  EXISTS (SELECT 1 FROM vendors WHERE id = vendor_id AND user_id = auth.uid())
);

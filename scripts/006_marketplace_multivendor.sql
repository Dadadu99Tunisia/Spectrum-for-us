-- =====================================================
-- SPECTRUM FOR US - MARKETPLACE MULTI-VENDEURS
-- Modèle dropshipping/marketplace où chaque vendeur
-- gère sa propre livraison et expédition
-- =====================================================

-- Table: vendor_shipping_profiles
-- Chaque vendeur configure ses propres options de livraison
CREATE TABLE IF NOT EXISTS vendor_shipping_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Zones de livraison
  ships_to_france BOOLEAN DEFAULT true,
  ships_to_europe BOOLEAN DEFAULT false,
  ships_to_world BOOLEAN DEFAULT false,
  
  -- Délais de traitement
  processing_time_min INT DEFAULT 1,
  processing_time_max INT DEFAULT 3,
  
  -- Options de livraison offertes par le vendeur
  offers_free_shipping BOOLEAN DEFAULT false,
  free_shipping_minimum DECIMAL(10,2) DEFAULT 0,
  
  -- Frais de livraison configurés par le vendeur
  shipping_france DECIMAL(10,2) DEFAULT 5.99,
  shipping_europe DECIMAL(10,2) DEFAULT 12.99,
  shipping_world DECIMAL(10,2) DEFAULT 24.99,
  
  -- Délais estimés (jours ouvrés)
  delivery_france_min INT DEFAULT 2,
  delivery_france_max INT DEFAULT 5,
  delivery_europe_min INT DEFAULT 5,
  delivery_europe_max INT DEFAULT 10,
  delivery_world_min INT DEFAULT 10,
  delivery_world_max INT DEFAULT 21,
  
  -- Transporteurs utilisés
  carriers TEXT[],
  
  -- Politique de retour
  accepts_returns BOOLEAN DEFAULT true,
  return_period_days INT DEFAULT 14,
  return_shipping_paid_by TEXT DEFAULT 'buyer',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(vendor_id)
);

-- Table: sub_orders (commandes par vendeur)
CREATE TABLE IF NOT EXISTS sub_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES profiles(id),
  
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'paid', 'processing', 'shipped', 
    'in_transit', 'delivered', 'cancelled', 'refunded', 'disputed'
  )),
  
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  commission_rate DECIMAL(5,4) DEFAULT 0.12,
  commission_amount DECIMAL(10,2) NOT NULL,
  vendor_payout DECIMAL(10,2) NOT NULL,
  
  tracking_number TEXT,
  tracking_url TEXT,
  carrier TEXT,
  shipped_at TIMESTAMPTZ,
  estimated_delivery_min DATE,
  estimated_delivery_max DATE,
  delivered_at TIMESTAMPTZ,
  
  vendor_notes TEXT,
  buyer_notes TEXT,
  
  stripe_transfer_id TEXT,
  payout_status TEXT DEFAULT 'pending',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: sub_order_items
CREATE TABLE IF NOT EXISTS sub_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_order_id UUID REFERENCES sub_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  service_id UUID REFERENCES services(id),
  
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  variant_options JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: order_messages
CREATE TABLE IF NOT EXISTS order_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_order_id UUID REFERENCES sub_orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  sender_type TEXT CHECK (sender_type IN ('buyer', 'vendor', 'admin')),
  message TEXT NOT NULL,
  attachments JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_order_id UUID REFERENCES sub_orders(id) ON DELETE CASCADE,
  opened_by UUID REFERENCES profiles(id),
  reason TEXT NOT NULL CHECK (reason IN (
    'not_received', 'not_as_described', 'damaged', 'wrong_item', 'other'
  )),
  description TEXT NOT NULL,
  evidence_urls JSONB,
  status TEXT DEFAULT 'open' CHECK (status IN (
    'open', 'vendor_response', 'under_review', 
    'resolved_buyer', 'resolved_vendor', 'escalated'
  )),
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission Spectrum (12% + 0.30€ par transaction)
CREATE TABLE IF NOT EXISTS platform_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  percentage DECIMAL(5,4) NOT NULL,
  fixed_fee DECIMAL(10,2) DEFAULT 0.30,
  applies_to TEXT CHECK (applies_to IN ('products', 'services', 'both')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO platform_fees (name, percentage, fixed_fee, applies_to) VALUES
  ('Commission standard', 0.12, 0.30, 'both')
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE vendor_shipping_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors manage shipping profile" ON vendor_shipping_profiles FOR ALL USING (auth.uid() = vendor_id);
CREATE POLICY "Vendors view sub_orders" ON sub_orders FOR SELECT USING (auth.uid() = vendor_id);
CREATE POLICY "Vendors update sub_orders" ON sub_orders FOR UPDATE USING (auth.uid() = vendor_id);
CREATE POLICY "Public view sub_order_items" ON sub_order_items FOR SELECT USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_sub_orders_vendor ON sub_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_sub_orders_order ON sub_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_sub_orders_status ON sub_orders(status);

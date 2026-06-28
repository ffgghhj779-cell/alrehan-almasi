-- =============================================================================
-- Al Rehan Almasi — Production Database Initialization
-- Run this entire script once in: Supabase Dashboard → SQL Editor → New query
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- 2. Custom types
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_tier') THEN
    CREATE TYPE public.user_tier AS ENUM ('Retail', 'Hotel', 'Supermarket');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
    CREATE TYPE public.product_status AS ENUM ('متوفر', 'عند الطلب');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quote_status') THEN
    CREATE TYPE public.quote_status AS ENUM ('pending', 'sent', 'confirmed', 'cancelled');
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Profiles (extends auth.users — tiered B2B pricing)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name     TEXT,
  company_name  TEXT,
  phone         TEXT,
  tier          public.user_tier NOT NULL DEFAULT 'Retail',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'B2B client profile linked 1:1 with Supabase Auth user';

-- ---------------------------------------------------------------------------
-- 4. Products catalog
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku         TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  status      public.product_status NOT NULL DEFAULT 'متوفر',
  image_url   TEXT NOT NULL,
  base_price  NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products (sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products (is_active) WHERE is_active = TRUE;

COMMENT ON TABLE public.products IS 'Public B2B product catalog (SKU, pricing, images)';

-- ---------------------------------------------------------------------------
-- 5. Quotes (historical B2B quote requests)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  reference_code  TEXT NOT NULL UNIQUE,
  status          public.quote_status NOT NULL DEFAULT 'pending',
  total_items     INTEGER NOT NULL DEFAULT 0 CHECK (total_items >= 0),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON public.quotes (user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes (created_at DESC);

-- ---------------------------------------------------------------------------
-- 6. Quote line items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quote_items (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote_id      UUID NOT NULL REFERENCES public.quotes (id) ON DELETE CASCADE,
  product_id    BIGINT REFERENCES public.products (id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,
  sku           TEXT,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10, 2),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items (quote_id);

-- ---------------------------------------------------------------------------
-- 7. Utility: updated_at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_quotes_updated_at ON public.quotes;
CREATE TRIGGER trg_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 8. Auto-create profile on signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_tier TEXT;
BEGIN
  meta_tier := COALESCE(NEW.raw_user_meta_data ->> 'tier', 'Retail');

  INSERT INTO public.profiles (id, full_name, company_name, phone, tier)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'company_name',
    NEW.raw_user_meta_data ->> 'phone',
    CASE
      WHEN meta_tier IN ('Hotel', 'Supermarket') THEN meta_tier::public.user_tier
      ELSE 'Retail'::public.user_tier
    END
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 9. Quote reference code generator (AR-XXXX)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_quote_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  ref TEXT;
BEGIN
  LOOP
    ref := 'AR-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.quotes WHERE reference_code = ref);
  END LOOP;
  RETURN ref;
END;
$$;

-- ---------------------------------------------------------------------------
-- 10. Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own row only
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Products: public read for anon + authenticated; no public writes
DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- Quotes: users see and create only their own
DROP POLICY IF EXISTS "quotes_select_own" ON public.quotes;
CREATE POLICY "quotes_select_own"
  ON public.quotes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "quotes_insert_own" ON public.quotes;
CREATE POLICY "quotes_insert_own"
  ON public.quotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "quotes_update_own" ON public.quotes;
CREATE POLICY "quotes_update_own"
  ON public.quotes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Quote items: access via parent quote ownership
DROP POLICY IF EXISTS "quote_items_select_own" ON public.quote_items;
CREATE POLICY "quote_items_select_own"
  ON public.quote_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_items.quote_id AND q.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "quote_items_insert_own" ON public.quote_items;
CREATE POLICY "quote_items_insert_own"
  ON public.quote_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_items.quote_id AND q.user_id = auth.uid()
    )
  );

-- Allow anonymous quote creation (guest checkout) — optional, comment out if not needed
DROP POLICY IF EXISTS "quotes_insert_anon" ON public.quotes;
CREATE POLICY "quotes_insert_anon"
  ON public.quotes FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "quote_items_insert_anon" ON public.quote_items;
CREATE POLICY "quote_items_insert_anon"
  ON public.quote_items FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_items.quote_id AND q.user_id IS NULL
    )
  );

-- ---------------------------------------------------------------------------
-- 11. Seed products (matches frontend SKUs for CSV uploader)
-- ---------------------------------------------------------------------------
INSERT INTO public.products (sku, name, category, status, image_url, base_price)
VALUES
  ('ARA-SAL-001', 'سمك سلمون طازج',           'الأسماك الطازجة',   'متوفر',     'https://picsum.photos/seed/salmonfish/500/400',    89.00),
  ('ARA-CHK-001', 'دجاج كامل مبرد',           'الدواجن الطازجة',   'متوفر',     'https://picsum.photos/seed/freshchicken/500/400',  32.00),
  ('ARA-VEG-001', 'طماطم محمية',              'الخضروات',          'متوفر',     'https://picsum.photos/seed/freshtomato/500/400',   18.00),
  ('ARA-RIC-001', 'أرز بسمتي درجة أولى',      'الأرز',             'متوفر',     'https://picsum.photos/seed/ricebag/500/400',       45.00),
  ('ARA-OIL-001', 'زيت دوار الشمس',           'الزيوت',            'متوفر',     'https://picsum.photos/seed/cookingoil/500/400',    28.00),
  ('ARA-FRT-001', 'برتقال أبو صرة',           'الفواكه الطازجة',   'متوفر',     'https://picsum.photos/seed/freshorange/500/400',   22.00),
  ('ARA-FRZ-001', 'بطاطس مقلية نصف مقلية',    'المنتجات المجمدة',  'متوفر',     'https://picsum.photos/seed/frozenfries/500/400',   35.00),
  ('ARA-MET-001', 'لحم عجل بلدي',             'اللحوم الطازجة',    'عند الطلب', 'https://picsum.photos/seed/freshmeat/500/400',    120.00),
  ('ARA-OLV-001', 'زيت زيتون بكر ممتاز',      'الزيوت',            'متوفر',     'https://picsum.photos/seed/oliveoil/500/400',      55.00),
  ('ARA-FSH-002', 'سمك الهامور الطازج',       'الأسماك الطازجة',   'متوفر',     'https://picsum.photos/seed/hammour/500/400',       95.00),
  ('ARA-DAI-001', 'لبن طازج كامل الدسم',      'المواد الغذائية',   'متوفر',     'https://picsum.photos/seed/freshmilk/500/400',     12.00),
  ('ARA-HON-001', 'عسل سدر طبيعي',            'المواد الغذائية',   'متوفر',     'https://picsum.photos/seed/honeyjar/500/400',      75.00)
ON CONFLICT (sku) DO UPDATE SET
  name       = EXCLUDED.name,
  category   = EXCLUDED.category,
  status     = EXCLUDED.status,
  image_url  = EXCLUDED.image_url,
  base_price = EXCLUDED.base_price,
  is_active  = TRUE,
  updated_at = NOW();

-- ---------------------------------------------------------------------------
-- 12. Grants
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.quotes TO authenticated;
GRANT SELECT, INSERT ON public.quote_items TO authenticated;
GRANT INSERT ON public.quotes TO anon;
GRANT INSERT ON public.quote_items TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- =============================================================================
-- DONE. Next steps (Human):
-- 1. Copy NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY into .env.local
-- 2. Create test users in Authentication → Users (set tier in user metadata if needed)
-- 3. Restart `npm run dev`
-- =============================================================================

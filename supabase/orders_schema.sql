-- =============================================================================
-- Orders schema — true e-commerce checkout (guest + authenticated)
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================================================

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM (
      'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      TEXT NOT NULL UNIQUE,
  user_id           UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  customer_name     TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  delivery_address  TEXT NOT NULL,
  payment_method    TEXT NOT NULL DEFAULT 'cod',
  subtotal_ex_vat   NUMERIC(10, 2) NOT NULL CHECK (subtotal_ex_vat >= 0),
  vat_amount        NUMERIC(10, 2) NOT NULL CHECK (vat_amount >= 0),
  total_inc_vat     NUMERIC(10, 2) NOT NULL CHECK (total_inc_vat >= 0),
  status            public.order_status NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id            UUID NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id          BIGINT REFERENCES public.products (id) ON DELETE SET NULL,
  product_name        TEXT NOT NULL,
  sku                 TEXT,
  quantity            INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_ex_vat   NUMERIC(10, 2) NOT NULL CHECK (unit_price_ex_vat >= 0),
  line_total_ex_vat   NUMERIC(10, 2) NOT NULL CHECK (line_total_ex_vat >= 0),
  unit_label          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Guest checkout (anon) + authenticated users
DROP POLICY IF EXISTS "orders_insert_public" ON public.orders;
CREATE POLICY "orders_insert_public"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    user_id IS NULL OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "order_items_insert_public" ON public.order_items;
CREATE POLICY "order_items_insert_public"
  ON public.order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, INSERT ON public.order_items TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMIT;

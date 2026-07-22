-- =============================================================================
-- Al Rehan Almasi — Hyper-Realistic E-Commerce Product Seed
-- Run in: Supabase Dashboard → SQL Editor → New query
--
-- Prerequisites: public.products table exists (from supabase/init.sql)
-- Safe to re-run: clears catalog and re-inserts premium batch
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Schema extensions for e-commerce
-- ---------------------------------------------------------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS description_ar TEXT,
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unit_label TEXT NOT NULL DEFAULT 'كجم',
  ADD COLUMN IF NOT EXISTS origin_country TEXT,
  ADD COLUMN IF NOT EXISTS packaging TEXT;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_stock_quantity_check;

ALTER TABLE public.products
  ADD CONSTRAINT products_stock_quantity_check
  CHECK (stock_quantity >= 0);

COMMENT ON COLUMN public.products.description_ar IS 'Rich Arabic product description for PDP and SEO';
COMMENT ON COLUMN public.products.stock_quantity IS 'Available inventory units (kg, cartons, or pieces per unit_label)';
COMMENT ON COLUMN public.products.unit_label IS 'Sale unit displayed to customer (كجم، لتر، كرتون، حبة)';

-- ---------------------------------------------------------------------------
-- 2. Clear legacy dummy catalog (preserves quote history; product_id → NULL)
-- ---------------------------------------------------------------------------
DELETE FROM public.products;

-- Reset identity so SKUs start clean on fresh environments
ALTER TABLE public.products ALTER COLUMN id RESTART WITH 1;

-- ---------------------------------------------------------------------------
-- 3. Premium product batch — 20 items, Unsplash-matched imagery
-- ---------------------------------------------------------------------------
INSERT INTO public.products (
  sku, name, category, status, image_url, base_price,
  description_ar, stock_quantity, unit_label, origin_country, packaging, is_active
) VALUES

-- ── الأسماك الطازجة (Fresh Fish) ──────────────────────────────────────────
(
  'ARA-SAL-001',
  'فيليه سلمون نرويجي طازج',
  'الأسماك الطازجة',
  'متوفر',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b9a2?w=900&q=85&auto=format&fit=crop',
  118.00,
  'سلمون أطلنطي نرويجي طازج، مستزرع في مياه باردة نظيفة. لون وردي موحّد ودهون صحية غنية بأوميغا 3. يُسلّم مبرداً في صناديق EPS مع ثلج صناعي. مثالي للمطاعم الفاخرة، الفنادق، ومحلات السushi. التعبئة: صندوق 5 كجم.',
  240,
  'كجم',
  'النرويج',
  'صندوق 5 كجم — IQF-ready',
  TRUE
),
(
  'ARA-FSH-002',
  'سمك الهامور العربي الطازج',
  'الأسماك الطازجة',
  'متوفر',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=85&auto=format&fit=crop',
  145.00,
  'هامور بلدي طازج من مياه الخليج العربي، يُصطاد يومياً ويُنظف وفق معايير HACCP. لحم أبيض متماسك بنكهة بحرية أصيلة. مناسب للشوي والمقلي والطبخ الفندقي. التعبئة: كيس Vacuume على ثلج.',
  85,
  'كجم',
  'المملكة العربية السعودية',
  'كيس م vacuum — 1-3 كجم',
  TRUE
),
(
  'ARA-FSH-003',
  'سمك الشعري (كنعد) طازج',
  'الأسماك الطازجة',
  'متوفر',
  'https://images.unsplash.com/photo-1534043464124-388be9d32a44?w=900&q=85&auto=format&fit=crop',
  92.00,
  'كنعد طازج من الصيد اليومي، مثالي للمشاوي والطبخ المنزلي والبوفيهات. يُسلّم منظفاً وجاهزاً للتحضير مع الحفاظ على سلسلة التبريد 0-4°م. التعبئة: كرتون isolé.',
  120,
  'كجم',
  'سلطنة عُمان',
  'كرتون 3-5 كجم',
  TRUE
),
(
  'ARA-SHR-001',
  'روبيان طازج (جمبري) وسط',
  'الأسماك الطازجة',
  'متوفر',
  'https://images.unsplash.com/photo-1565680018434-b385cbb43bbb?w=900&q=85&auto=format&fit=crop',
  78.00,
  'روبيان طازج مقشّر جزئياً، حجم وسط موحّد، مناسب للمطاعم الآسيوية والفنادق. يُحفظ على الثلج من المورد إلى بابكم. نكهة حلوة وقوام مقرمش بعد التحضير. التعبئة: علبة 2 كجم.',
  160,
  'كجم',
  'المملكة العربية السعودية',
  'علبة 2 كجم',
  TRUE
),

-- ── الدواجن الطازجة (Poultry) ─────────────────────────────────────────────
(
  'ARA-CHK-001',
  'دجاج كامل طازج مبرد — درجة أ',
  'الدواجن الطازجة',
  'متوفر',
  'https://images.unsplash.com/photo-1604503468506-a8da85638066?w=900&q=85&auto=format&fit=crop',
  28.50,
  'دجاج كامل طازج مبرد من مزارع معتمدة، وزن 900-1100 غرام، خالٍ من الهرمونات وفق اشتراطات SFDA. مناسب للسوبرماركت والمطاعم والتموين. يُسلّم في سلسلة تبريد 0-4°م. التعبئة: كرتون 10-12 حبة.',
  520,
  'كجم',
  'المملكة العربية السعودية',
  'كرتون 10-12 حبة (~11 كجم)',
  TRUE
),
(
  'ARA-CHK-002',
  'صدر دجاج فيليه طازج',
  'الدواجن الطازجة',
  'متوفر',
  'https://images.unsplash.com/photo-1604908176997-431637774034?w=900&q=85&auto=format&fit=crop',
  42.00,
  'فillet صدر دجاج طازج بدون عظم وجلد، تقطيع موحّد للمطابخ المركزية والفنادق. لحم أبيض قليل الدهن، مثالي للشوي والساندويتشات الصحية. التعبئة: أكياس Vacuume 2.5 كجم.',
  310,
  'كجم',
  'المملكة العربية السعودية',
  'كيس 2.5 كجم',
  TRUE
),
(
  'ARA-CHK-003',
  'أفخاذ دجاج طازجة مبردة',
  'الدواجن الطازجة',
  'متوفر',
  'https://images.unsplash.com/photo-1587593811930-5a0c511d12f1?w=900&q=85&auto=format&fit=crop',
  24.00,
  'أفخاذ دجاج طازجة بجلد، مناسبة للمشاوي والطبخ المنزلي والمطاعم الشعبية. تُسلّم مبردة مع تاريخ ذبح واضح. التعبئة: كرتون 10 كجم.',
  440,
  'كجم',
  'المملكة العربية السعودية',
  'كرتون 10 كجم',
  TRUE
),

-- ── الأرز (Rice) ──────────────────────────────────────────────────────────
(
  'ARA-RIC-001',
  'أرز بسمتي مزة — درجة أ (25 كجم)',
  'الأرز',
  'متوفر',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=85&auto=format&fit=crop',
  185.00,
  'أرز بسمتي فاخر طويل الحبة من مزارع Punjab، عمره 12-18 شهراً، رائحة طبيعية وحبة ممتدة بعد الطبخ. الأكثر طلباً في الفنادق والمطاعم والأسواق المركزية. التعبئة: شكارة 25 كجم مع شهادة منشأ.',
  380,
  'كيس',
  'المملكة العربية السعودية',
  'شكارة 25 كجم',
  TRUE
),
(
  'ARA-RIC-002',
  'أرز أبيض — شكارة 10 كجم',
  'الأرز',
  'متوفر',
  'https://images.unsplash.com/photo-1536304997881-8926e2c0c67a?w=900&q=85&auto=format&fit=crop',
  62.00,
  'أرز أبيض قصير الحبة، مثالي للطبخ اليومي والمطاعم الاقتصادية والبوفيهات. ثبات في الطبخ وامتصاص متوازن للنكهات. التعبئة: شكارة 10 كجم.',
  290,
  'كيس',
  'المملكة العربية السعودية',
  'شكارة 10 كجم',
  TRUE
),
(
  'ARA-RIC-003',
  'أرز كالروز — 20 كجم',
  'الأرز',
  'متوفر',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=85&auto=format&fit=crop',
  98.00,
  'أرز كالروز متوسط الحبة حبة لامعة وقوام معتدل. مثالي للأطباق الآسيوية والسوshi والمطابخ الفندقية. التعبئة: كرتون 20 كجم.',
  175,
  'كيس',
  'المملكة العربية السعودية',
  'كرتون 20 كجم',
  TRUE
),

-- ── الزيوت الغذائية (Premium Oils) ───────────────────────────────────────
(
  'ARA-OLV-001',
  'زيت زيتون بكر ممتاز',
  'الزيوت الغذائية',
  'متوفر',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&q=85&auto=format&fit=crop',
  68.00,
  'زيت زيتون Extra Virgin معصور على البارد، حموضة منخفضة ونكهة فاكهية غنية. مثالي للسلطات والمطاعم الراقية والتصدير. زجاجة داكنة للحماية من الضوء. التعبئة: 1 لتر × 12 زجاجة/كرتون.',
  420,
  'لتر',
  'المملكة العربية السعودية',
  'زجاجة 1 لتر',
  TRUE
),
(
  'ARA-OIL-001',
  'زيت دوار الشمس — عبوة 18 لتر',
  'الزيوت الغذائية',
  'متوفر',
  'https://images.unsplash.com/photo-1628148074908-65a43c0a47b3?w=900&q=85&auto=format&fit=crop',
  145.00,
  'زيت دوار شمس مكرر للقلي والطبخ الصناعي، نقطة دخان عالية وثبات حراري. الخيار الأمثل للمطابخ المركزية والفنادق والمطاعم. معتمد SFDA. التعبئة: جركن 18 لتر.',
  195,
  'جركن',
  'المملكة العربية السعودية',
  'جركن 18 لتر',
  TRUE
),
(
  'ARA-OIL-002',
  'زيت ذرة للطبخ — 17 لتر',
  'الزيوت الغذائية',
  'متوفر',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&q=85&auto=format&fit=crop',
  132.00,
  'زيت ذرة خفيف النكهة، مناسب للخبز والقلي والصلصات. خالي من الكوليسترول وخيار اقتصادي للتموين الجماعي. التعبئة: جركن 17 لتر.',
  210,
  'جركن',
  'المملكة العربية السعودية',
  'جركن 17 لتر',
  TRUE
),
(
  'ARA-OIL-003',
  'زيت نخيل — للقلي الصناعي 20 لتر',
  'الزيوت الغذائية',
  'متوفر',
  'https://images.unsplash.com/photo-1628148074908-65a43c0a47b3?w=900&q=85&auto=format&fit=crop',
  118.00,
  'زيت نخيل مكرر عالي الثبات، مثالي للقلي العميق في المطاعم والوجبات السريعة. أداء اقتصادي ممتاز مع جودة ثابتة. التعبئة: جركن 20 لتر.',
  165,
  'جركن',
  'المملكة العربية السعودية',
  'جركن 20 لتر',
  TRUE
),

-- ── المنتجات المجمدة (Frozen Foods) ───────────────────────────────────────
(
  'ARA-FRZ-001',
  'بطاطس مقلية نصف مقلية — 2.5 كجم',
  'المنتجات المجمدة',
  'متوفر',
  'https://images.unsplash.com/photo-1573080496216-afa8aec2846f?w=900&q=85&auto=format&fit=crop',
  38.00,
  'بطاطس مقلية Straight Cut نصف مقلية، ذهبية ومقرمشة بعد القلي النهائي. معيار المطاعم والوجبات السريعة. تُحفظ عند -18°م. التعبئة: كيس 2.5 كجم × 4/كرتون.',
  520,
  'كيس',
  'المملكة العربية السعودية',
  'كيس 2.5 كجم',
  TRUE
),
(
  'ARA-FRZ-002',
  'خضار مشكّلة مجمدة — 1 كجم',
  'المنتجات المجمدة',
  'متوفر',
  'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900&q=85&auto=format&fit=crop',
  22.00,
  'مزيج خضار مجمد (جزر، بازيلاء، ذرة، فاصوليا) IQF للحفاظ على القوام واللون. مثالي للمطابخ المركزية والبوفيهات. التعبئة: كيس 1 كجم.',
  680,
  'كيس',
  'المملكة العربية السعودية',
  'كيس 1 كجم',
  TRUE
),
(
  'ARA-FRZ-003',
  'ناجتس دجاج مجمدة — 1 كجم',
  'المنتجات المجمدة',
  'متوفر',
  'https://images.unsplash.com/photo-1562967916-818fe072e9cf?w=900&q=85&auto=format&fit=crop',
  34.00,
  'ناجتس دجاج ذهبية مجمدة، جاهزة للفرن أو الزيت. حجم موحّد للمقاهي والمدارس والتموين. تُسلّم في شاحنات مبرّدة. التعبئة: كيس 1 كجم.',
  450,
  'كيس',
  'المملكة العربية السعودية',
  'كيس 1 كجم',
  TRUE
),
(
  'ARA-FRZ-004',
  'سمك فيليه مجمد — IQF',
  'المنتجات المجمدة',
  'متوفر',
  'https://images.unsplash.com/photo-1544943910-04c54e739fe9?w=900&q=85&auto=format&fit=crop',
  55.00,
  'فillet سمك أبيض مجمد بتقنية IQF، قطع نظيفة بدون رائحة. حل عملي للمطاعم خارج موسم الصيد. التعبئة: كرتون 10 كجم.',
  275,
  'كجم',
  'فيتنام',
  'كرتون 10 كجم',
  TRUE
),

-- ── إضافيات ──────────────────────────────────────────────────────────────
(
  'ARA-DAI-001',
  'لبن طازج كامل الدسم — 2 لتر',
  'الألبان',
  'متوفر',
  'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=900&q=85&auto=format&fit=crop',
  14.50,
  'لبن طازج كامل الدسم، يُجمع يومياً من مزارع محلية معتمدة. مدة صلاحية قصيرة — يُسلّم في سلسلة تبريد. التعبئة: عبوة 2 لتر.',
  360,
  'عبوة',
  'المملكة العربية السعودية',
  'عبوة 2 لتر',
  TRUE
);

-- ---------------------------------------------------------------------------
-- 4. Auto-sync availability status from stock
-- ---------------------------------------------------------------------------
UPDATE public.products
SET status = CASE
  WHEN stock_quantity = 0 THEN 'عند الطلب'::public.product_status
  WHEN stock_quantity < 20 THEN 'عند الطلب'::public.product_status
  ELSE 'متوفر'::public.product_status
END;

-- ---------------------------------------------------------------------------
-- 5. Verify
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  cnt INTEGER;
BEGIN
  SELECT COUNT(*) INTO cnt FROM public.products WHERE is_active = TRUE;
  IF cnt < 15 THEN
    RAISE EXCEPTION 'Seed verification failed: expected >= 15 products, got %', cnt;
  END IF;
  RAISE NOTICE 'Seed OK: % active products loaded.', cnt;
END $$;

COMMIT;

-- =============================================================================
-- POST-RUN (Application team):
-- 1. Add images.unsplash.com to next.config.ts remotePatterns
-- 2. Extend lib/products.ts Product type with description_ar, stock_quantity
-- 3. Re-deploy / revalidate ISR pages
-- =============================================================================

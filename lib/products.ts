import {
  supabase,
  createServerClient,
  isSupabaseConfigured,
  isMockSupabase,
  type DbProductRow,
} from './supabase';

export type ProductStatus = 'متوفر' | 'عند الطلب' | 'نفدت الكمية';

export type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  status: ProductStatus;
  image: string;
  basePrice: number;
  descriptionAr: string | null;
  stockQuantity: number;
  unitLabel: string;
  originCountry: string | null;
  packaging: string | null;
};

export type FetchProductsResult = {
  products: Product[];
  error: string | null;
  fromFallback: boolean;
};

const PRODUCT_COLUMNS =
  'id, sku, name, category, status, image_url, base_price, is_active, description_ar, stock_quantity, unit_label, origin_country, packaging';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: 'ARA-SAL-001',
    name: 'سمك سلمون طازج',
    category: 'الأسماك الطازجة',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b9a2?w=500&q=80&auto=format&fit=crop',
    basePrice: 89,
    descriptionAr: 'سلمون أطلنطي نرويجي طازج، مستزرع في مياه باردة نظيفة.',
    stockQuantity: 240,
    unitLabel: 'كجم',
    originCountry: 'النرويج',
    packaging: 'صندوق 5 كجم',
  },
  {
    id: 2,
    sku: 'ARA-CHK-001',
    name: 'دجاج كامل مبرد',
    category: 'الدواجن الطازجة',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13daff91?w=500&q=80&auto=format&fit=crop',
    basePrice: 32,
    descriptionAr: 'دجاج كامل طازج مبرد، معتمد HACCP، مناسب للمطاعم والفنادق.',
    stockQuantity: 180,
    unitLabel: 'حبة',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كرتون 10 حبات',
  },
  {
    id: 3,
    sku: 'ARA-RIC-001',
    name: 'أرز بسمتي درجة أولى',
    category: 'الأرز',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80&auto=format&fit=crop',
    basePrice: 52,
    descriptionAr: 'أرز بسمتي هندي طويل الحبة، عطر فاخر وقوام ممتاز.',
    stockQuantity: 420,
    unitLabel: 'كيس',
    originCountry: 'الهند',
    packaging: 'كيس 10 كجم',
  },
  {
    id: 4,
    sku: 'ARA-OIL-001',
    name: 'زيت دوار الشمس',
    category: 'الزيوت الغذائية',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80&auto=format&fit=crop',
    basePrice: 145,
    descriptionAr: 'زيت دوار شمس مكرر للطبخ والقلي، ثبات حراري عالي.',
    stockQuantity: 210,
    unitLabel: 'جركن',
    originCountry: 'أوكرانيا',
    packaging: 'جركن 18 لتر',
  },
  {
    id: 5,
    sku: 'ARA-FRZ-001',
    name: 'بطاطس مقلية نصف مقلية',
    category: 'المنتجات المجمدة',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1573080496216-afa8aec2846f?w=500&q=80&auto=format&fit=crop',
    basePrice: 38,
    descriptionAr: 'بطاطس مقلية Straight Cut نصف مقلية، ذهبية ومقرمشة.',
    stockQuantity: 520,
    unitLabel: 'كيس',
    originCountry: 'بلجيكا',
    packaging: 'كيس 2.5 كجم',
  },
  {
    id: 6,
    sku: 'ARA-MET-001',
    name: 'لحم غنم طازج',
    category: 'اللحوم الطازجة',
    status: 'عند الطلب',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca794ae1a?w=500&q=80&auto=format&fit=crop',
    basePrice: 135,
    descriptionAr: 'لحم غنم طازج بلدي، تقطيع حسب الطلب.',
    stockQuantity: 45,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس Vacuume',
  },
  {
    id: 7,
    sku: 'ARA-OLV-001',
    name: 'زيت زيتون بكر ممتاز',
    category: 'الزيوت الغذائية',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80&auto=format&fit=crop',
    basePrice: 185,
    descriptionAr: 'زيت زيتون بكر ممتاز من أشجار معمرة، حموضة منخفضة.',
    stockQuantity: 95,
    unitLabel: 'لتر',
    originCountry: 'إسبانيا',
    packaging: 'تنك 5 لتر',
  },
  {
    id: 8,
    sku: 'ARA-FSH-002',
    name: 'سمك الهامور الطازج',
    category: 'الأسماك الطازجة',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1544943910-04c54e739fe9?w=500&q=80&auto=format&fit=crop',
    basePrice: 95,
    descriptionAr: 'هامور بلدي طازج من مياه الخليج العربي، يُصطاد يومياً.',
    stockQuantity: 85,
    unitLabel: 'كجم',
    originCountry: 'الخليج العربي',
    packaging: 'كيس على ثلج',
  },
];

export function isProductOutOfStock(prod: Product): boolean {
  return prod.stockQuantity === 0 || prod.status === 'نفدت الكمية';
}

export function mapProductRow(row: DbProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    status: row.status,
    image: row.image_url,
    basePrice: Number(row.base_price),
    descriptionAr: row.description_ar ?? null,
    stockQuantity: row.stock_quantity ?? 0,
    unitLabel: row.unit_label ?? 'كجم',
    originCountry: row.origin_country ?? null,
    packaging: row.packaging ?? null,
  };
}

export async function fetchProductsResult(limit?: number): Promise<FetchProductsResult> {
  if (!isSupabaseConfigured) {
    const products = limit ? FALLBACK_PRODUCTS.slice(0, limit) : FALLBACK_PRODUCTS;
    return { products, error: null, fromFallback: true };
  }

  const client = typeof window === 'undefined' ? createServerClient() : supabase;

  let query = client
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .order('id', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[fetchProducts]', error.message);
    const products = limit ? FALLBACK_PRODUCTS.slice(0, limit) : FALLBACK_PRODUCTS;
    return {
      products,
      error: 'تعذّر الاتصال بقاعدة البيانات. يتم عرض نسخة احتياطية.',
      fromFallback: true,
    };
  }

  if (!data?.length) {
    return {
      products: [],
      error: 'لا توجد منتجات في قاعدة البيانات.',
      fromFallback: false,
    };
  }

  return {
    products: data.map((row) => mapProductRow(row as DbProductRow)),
    error: null,
    fromFallback: false,
  };
}

export async function fetchProducts(limit?: number): Promise<Product[]> {
  const result = await fetchProductsResult(limit);
  return result.products;
}

export async function lookupProductBySku(sku: string): Promise<Product | null> {
  const normalized = sku.trim().toUpperCase();

  if (!isSupabaseConfigured) {
    return FALLBACK_PRODUCTS.find((p) => p.sku.toUpperCase() === normalized) ?? null;
  }

  const client = typeof window === 'undefined' ? createServerClient() : supabase;

  const { data, error } = await client
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('sku', normalized)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return FALLBACK_PRODUCTS.find((p) => p.sku.toUpperCase() === normalized) ?? null;
  }

  return mapProductRow(data as DbProductRow);
}

export async function getProductById(id: number): Promise<Product | null> {
  if (!isSupabaseConfigured) {
    return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  const client = typeof window === 'undefined' ? createServerClient() : supabase;

  const { data, error } = await client
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  return mapProductRow(data as DbProductRow);
}

export { isMockSupabase, FALLBACK_PRODUCTS as PRODUCTS };

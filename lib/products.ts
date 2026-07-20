import {
  supabase,
  createServerClient,
  isSupabaseConfigured,
  isMockSupabase,
  type DbProductRow,
} from './supabase';
import { resolveProductImage } from './product-images';

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
  originCountry?: string | null;
  packaging?: string | null;
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
    sku: 'ARA-CHK-001',
    name: 'دجاج مبرد نخبة أولى',
    category: 'دجاج مبرد',
    status: 'متوفر',
    // media_12: سلة دجاج طازج مبرد بعلامة SHATR - صورة احترافية لدجاج مبرد طازج في سلة
    image: '/assets/real/media_12.jpeg',
    basePrice: 16.5,
    descriptionAr: 'دجاج مبرد طازج إنتاج محلي يومي، مذبوح على الطريقة الإسلامية.',
    stockQuantity: 1200,
    unitLabel: 'حبة',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كرتون 10 حبات',
  },
  {
    id: 2,
    sku: 'ARA-FRZ-001',
    name: 'دجاج مجمد نخبة أولى',
    category: 'دجاج مجمد',
    status: 'متوفر',
    // media_10: أكياس سادية مجمدة بالجملة - صورة واقعية لدجاج مجمد بكميات
    image: '/assets/real/media_10.jpeg',
    basePrice: 14,
    descriptionAr: 'دجاج مجمد درجة أولى، مجمد بالصدمة للحفاظ على القيمة الغذائية والنكهة.',
    stockQuantity: 5000,
    unitLabel: 'حبة',
    originCountry: 'البرازيل',
    packaging: 'كرتون 10 حبات (1000 جرام)',
  },
  {
    id: 3,
    sku: 'ARA-SHW-001',
    name: 'شورما دجاج مبرد',
    category: 'شاورما مبردة',
    status: 'متوفر',
    // Unsplash: صورة واقعية لشاورما دجاج خام
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=85&auto=format&fit=crop',
    basePrice: 28,
    descriptionAr: 'صدور وأفخاذ دجاج متبلة أو سادة مجهزة للشاورما، إنتاج يومي طازج مبرد.',
    stockQuantity: 450,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 5 كجم مفرغ من الهواء',
  },
  {
    id: 4,
    sku: 'ARA-FRZ-002',
    name: 'صدور دجاج مجمدة',
    category: 'دجاج مجمد',
    status: 'متوفر',
    // media_11: صندوق دجاج مجمد Ukrainian - دجاج مجمد بأكياس في كرتون
    image: '/assets/real/media_11.jpeg',
    basePrice: 22,
    descriptionAr: 'صدور دجاج مجمدة بدون عظم وجلد، مجمدة بتقنية الصدمة.',
    stockQuantity: 800,
    unitLabel: 'كيس',
    originCountry: 'البرازيل',
    packaging: 'كيس 10 كجم',
  },
  {
    id: 5,
    sku: 'ARA-FRZ-003',
    name: 'أفخاذ دجاج مجمدة',
    category: 'دجاج مجمد',
    status: 'متوفر',
    // Unsplash: صورة واقعية لأفخاذ دجاج مجمدة خام
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13daff91?w=600&q=85&auto=format&fit=crop',
    basePrice: 18,
    descriptionAr: 'أفخاذ دجاج مجمدة درجة أولى، مجمدة بتقنية التبريد السريع.',
    stockQuantity: 600,
    unitLabel: 'كيس',
    originCountry: 'البرازيل',
    packaging: 'كيس 10 كجم',
  },
  {
    id: 6,
    sku: 'ARA-SHW-002',
    name: 'شورما دجاج مجمدة',
    category: 'دجاج مجمد',
    status: 'متوفر',
    // Unsplash: صورة واقعية لشاورما دجاج مجمدة
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=85&auto=format&fit=crop',
    basePrice: 26,
    descriptionAr: 'شاورما دجاج مجمدة وجاهزة للتحضير، متبلة بتوابل طبيعية.',
    stockQuantity: 300,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 5 كجم',
  },
  {
    id: 7,
    sku: 'ARA-MET-001',
    name: 'لحوم مبردة وطازجة',
    category: 'لحوم',
    status: 'متوفر',
    // Unsplash: صورة واقعية لقطع لحم بقر/عجل طازجة على طاولة جزار
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=85&auto=format&fit=crop',
    basePrice: 45,
    descriptionAr: 'لحم بقر/عجل طازج مبرد، تقطيع احترافي حسب طلب العميل.',
    stockQuantity: 150,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'ذبيحة أو أرباع (تغليف مبرد)',
  },
  {
    id: 8,
    sku: 'ARA-LMB-001',
    name: 'لحوم أغنام',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    // Unsplash: صورة واقعية لذبيحة غنم طازجة
    image: 'https://images.unsplash.com/photo-1544025162-d76538415491?w=600&q=85&auto=format&fit=crop',
    basePrice: 60,
    descriptionAr: 'لحوم أغنام طازجة مبردة عالية الجودة، مذبوحة على الطريقة الإسلامية.',
    stockQuantity: 60,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'ذبيحة كاملة مبردة',
  },
  {
    id: 9,
    sku: 'ARA-LMB-002',
    name: 'حري طازج',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    // Unsplash: صورة واقعية لخروف/غنم حي أو لحم غنم
    image: 'https://images.unsplash.com/photo-1603048588665-791ca794ae1a?w=600&q=85&auto=format&fit=crop',
    basePrice: 65,
    descriptionAr: 'لحم غنم حري بلدي طازج، من أجود أنواع الأغنام.',
    stockQuantity: 40,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'ذبيحة كاملة',
  },
  {
    id: 10,
    sku: 'ARA-LMB-003',
    name: 'تيوس باكستاني',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    // Unsplash: صورة واقعية لقطع لحم أغنام/ماعز
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=85&auto=format&fit=crop',
    basePrice: 42,
    descriptionAr: 'لحم تيوس باكستاني طازج مستورد بالطائرات.',
    stockQuantity: 80,
    unitLabel: 'كجم',
    originCountry: 'باكستان',
    packaging: 'ذبيحة كاملة',
  },
  {
    id: 11,
    sku: 'ARA-LMB-004',
    name: 'تيوس كيني مبردة',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    // Unsplash: لحم ماعز/تيوس نيء
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=85&auto=format&fit=crop',
    basePrice: 38,
    descriptionAr: 'لحم تيوس كيني مبردة مستوردة، جودة ممتازة لمطاعم المندي والمظبي.',
    stockQuantity: 100,
    unitLabel: 'كجم',
    originCountry: 'كينيا',
    packaging: 'ذبيحة كاملة',
  },
  {
    id: 12,
    sku: 'ARA-LMB-005',
    name: 'تيوس باكستاني مبردة',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    // Unsplash: لحم ماعز مبرد
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=85&auto=format&fit=crop',
    basePrice: 40,
    descriptionAr: 'لحم تيوس باكستاني مبردة، طازج ومذبوح على الطريقة الإسلامية.',
    stockQuantity: 120,
    unitLabel: 'كجم',
    originCountry: 'باكستان',
    packaging: 'ذبيحة كاملة',
  },
  {
    id: 13,
    sku: 'ARA-LMB-006',
    name: 'تيوس سواكني طازج',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    // Unsplash: لحم ضأن/أغنام طازج
    image: 'https://images.unsplash.com/photo-1603048588665-791ca794ae1a?w=600&q=85&auto=format&fit=crop',
    basePrice: 48,
    descriptionAr: 'لحم تيوس سواكني طازج مستورد، من أرقى أنواع اللحوم.',
    stockQuantity: 50,
    unitLabel: 'كجم',
    originCountry: 'السودان',
    packaging: 'ذبيحة كاملة',
  },
  {
    id: 14,
    sku: 'ARA-EGG-001',
    name: 'بيض مائدة طازج',
    category: 'بيض',
    status: 'متوفر',
    // media_15: صواني بيض Almoroj الواقعية
    image: '/assets/real/media_15.jpeg',
    basePrice: 18,
    descriptionAr: 'بيض مائدة طازج درجة أولى حجم كبير، من مزارع معتمدة.',
    stockQuantity: 2000,
    unitLabel: 'طبق',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كرتون 12 طبق (30 بيضة/طبق)',
  },
  {
    id: 15,
    sku: 'ARA-NUG-001',
    name: 'استربس دجاج',
    category: 'مصنعات الدجاج',
    status: 'متوفر',
    // media_13: صورة استربس/نجت من موقع fakieh احترافية
    image: '/assets/real/media_13.jpeg',
    basePrice: 32,
    descriptionAr: 'استربس دجاج مقرمشة، مصنوعة من صدور دجاج طازجة.',
    stockQuantity: 500,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 1 كجم',
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
    image: resolveProductImage(row.sku, row.category, row.image_url),
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

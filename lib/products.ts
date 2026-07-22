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
    image: '/assets/real/brand_chicken_chilled_basket_ad.png',
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
    image: '/assets/real/brand_chicken_frozen_crate.png',
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
    image: '/assets/real/brand_chicken_chilled_bag.png',
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
    image: '/assets/real/brand_chicken_breast_frozen.png',
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
    image: '/assets/real/brand_chicken_chilled_bag.png',
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
    image: '/assets/real/brand_chicken_breast_frozen.png',
    basePrice: 26,
    descriptionAr: 'شاورما دجاج مجمدة وجاهزة للتحضير، متبلة بتوابل طبيعية.',
    stockQuantity: 300,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 5 كجم',
  },
  {
    id: 7,
    sku: 'ARA-EGG-001',
    name: 'بيض مائدة طازج',
    category: 'بيض',
    status: 'متوفر',
    image: '/assets/real/eggs_tray_almoroj.png',
    basePrice: 18,
    descriptionAr: 'بيض مائدة طازج درجة أولى حجم كبير، من مزارع معتمدة.',
    stockQuantity: 2000,
    unitLabel: 'طبق',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كرتون 12 طبق (30 بيضة/طبق)',
  },
  {
    id: 8,
    sku: 'ARA-NUG-001',
    name: 'استربس دجاج',
    category: 'مصنعات الدجاج',
    status: 'متوفر',
    image: '/assets/real/brand_chicken_breast_frozen.png',
    basePrice: 32,
    descriptionAr: 'استربس دجاج مقرمشة، مصنوعة من صدور دجاج طازجة.',
    stockQuantity: 500,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 1 كجم',
  },
  {
    id: 9,
    sku: 'ARA-CUT-001',
    name: 'أجنحة دجاج مبردة',
    category: 'مقطعات الدجاج',
    status: 'متوفر',
    image: '/assets/real/brand_packaging_box_bags.png',
    basePrice: 12.5,
    descriptionAr: 'أجنحة دجاج طازجة مبردة، مثالية للقلي والشوي.',
    stockQuantity: 300,
    unitLabel: 'طبق',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'طبق 900 جرام',
  },
  {
    id: 10,
    sku: 'ARA-CUT-002',
    name: 'كبدة وقوانص دجاج',
    category: 'مقطعات الدجاج',
    status: 'متوفر',
    image: '/assets/real/brand_chicken_chilled_bag.png',
    basePrice: 9.0,
    descriptionAr: 'كبدة وقوانص دجاج مبردة طازجة ومنظفة بالكامل.',
    stockQuantity: 150,
    unitLabel: 'طبق',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'طبق 500 جرام',
  },
  {
    id: 11,
    sku: 'ARA-CUT-003',
    name: 'دجاج مفروم طازج',
    category: 'مقطعات الدجاج',
    status: 'متوفر',
    image: '/assets/real/brand_chicken_chilled_bag.png',
    basePrice: 19.0,
    descriptionAr: 'لحم دجاج مفروم صافي ١٠٠٪ بدون دهون مضافة.',
    stockQuantity: 400,
    unitLabel: 'طبق',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'طبق 400 جرام',
  },
  {
    id: 12,
    sku: 'ARA-BBQ-001',
    name: 'دجاج متبل للكاجون',
    category: 'الشواء والتبخير',
    status: 'متوفر',
    image: '/assets/real/raw_shawarma_bag.png',
    basePrice: 24.0,
    descriptionAr: 'نصف دجاجة متبلة بتتبيلة الكاجون الحارة، جاهزة للشوي الفوري.',
    stockQuantity: 200,
    unitLabel: 'حبة',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 800 جرام',
  },
  {
    id: 13,
    sku: 'ARA-BBQ-002',
    name: 'أسياخ شيش طاووق',
    category: 'الشواء والتبخير',
    status: 'متوفر',
    image: '/assets/real/raw_shawarma_bag.png',
    basePrice: 28.0,
    descriptionAr: 'أسياخ صدور دجاج طرية متبلة باللبن والبهارات الجاهزة.',
    stockQuantity: 250,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'طبق 1 كجم',
  },
  {
    id: 14,
    sku: 'ARA-EGG-002',
    name: 'بيض بلدي (أورجانيك)',
    category: 'بيض',
    status: 'متوفر',
    image: '/assets/real/eggs_tray_almoroj.png',
    basePrice: 26.0,
    descriptionAr: 'بيض بلدي عضوي غني بالبروتين من دجاج يربى في مزارع مفتوحة.',
    stockQuantity: 500,
    unitLabel: 'طبق',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'طبق 30 بيضة',
  },
];

export function isProductOutOfStock(prod: Product): boolean {
  return prod.stockQuantity === 0 || prod.status === 'نفدت الكمية';
}

const MEAT_CATEGORIES = new Set(['لحوم', 'لحوم الأغنام', 'اللحوم الطازجة']);

function isMeatProduct(prod: Pick<Product, 'sku' | 'category'>): boolean {
  const sku = prod.sku.toUpperCase();
  return (
    MEAT_CATEGORIES.has(prod.category) ||
    sku.startsWith('ARA-MET-') ||
    sku.startsWith('ARA-LMB-')
  );
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

  const products = data
    .map((row) => mapProductRow(row as DbProductRow))
    .filter((p) => !isMeatProduct(p));

  return {
    products: limit ? products.slice(0, limit) : products,
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

  const product = mapProductRow(data as DbProductRow);
  return isMeatProduct(product) ? null : product;
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

  const product = mapProductRow(data as DbProductRow);
  return isMeatProduct(product) ? null : product;
}

export { isMockSupabase, FALLBACK_PRODUCTS as PRODUCTS };

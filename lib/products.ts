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
    sku: 'ARA-CHK-001',
    name: 'دجاج مبرد كامل - الرهان الماسي',
    category: 'دجاج مبرد',
    status: 'متوفر',
    image: '/assets/chicken-fresh-basket-branded.png',
    basePrice: 16.5,
    descriptionAr: 'دجاج مبرد طازج إنتاج محلي يومي، مذبوح على الطريقة الإسلامية. مثالي للمطاعم والمطابخ المركزية.',
    stockQuantity: 1200,
    unitLabel: 'حبة',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كرتون 10 حبات',
  },
  {
    id: 2,
    sku: 'ARA-FRZ-001',
    name: 'دجاج مجمد كامل',
    category: 'دجاج مجمد',
    status: 'متوفر',
    image: '/assets/chicken-frozen-sadia-branded.png',
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
    name: 'شاورما دجاج مبردة جاهزة',
    category: 'شاورما مبردة',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&q=80&auto=format&fit=crop',
    basePrice: 28,
    descriptionAr: 'صدور وأفخاذ دجاج متبلة أو سادة مجهزة للشاورما، إنتاج يومي طازج مبرد.',
    stockQuantity: 450,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 5 كجم مفرغ من الهواء',
  },
  {
    id: 4,
    sku: 'ARA-EGG-001',
    name: 'بيض مائدة طازج - حجم كبير',
    category: 'بيض',
    status: 'متوفر',
    image: '/assets/eggs-tray.jpeg',
    basePrice: 18,
    descriptionAr: 'بيض مائدة طازج من مزارع الرهان الماسي، درجة أولى حجم كبير. مخصص للبقالات والسوبرماركت والمخابز.',
    stockQuantity: 2000,
    unitLabel: 'طبق',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كرتون 12 طبق (30 بيضة/طبق)',
  },
  {
    id: 5,
    sku: 'ARA-MET-001',
    name: 'لحم عجل بلدي طازج بالعظم',
    category: 'لحوم',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&q=80&auto=format&fit=crop',
    basePrice: 45,
    descriptionAr: 'لحم بقر/عجل طازج مبرد، تقطيع احترافي حسب طلب العميل. مناسب للملاحم ومطاعم المشويات.',
    stockQuantity: 150,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'ذبيحة أو أرباع (تغليف مبرد)',
  },
  {
    id: 6,
    sku: 'ARA-LMB-001',
    name: 'ذبيحة نعيمي طازج',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1544025162-d76538415491?w=500&q=80&auto=format&fit=crop',
    basePrice: 65,
    descriptionAr: 'لحم غنم نعيمي بلدي طازج، جودة عالية ومرعى طبيعي.',
    stockQuantity: 60,
    unitLabel: 'كجم',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'ذبيحة كاملة مبردة',
  },
  {
    id: 7,
    sku: 'ARA-LMB-002',
    name: 'لحم سواكني مبرد',
    category: 'لحوم الأغنام',
    status: 'عند الطلب',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca794ae1a?w=500&q=80&auto=format&fit=crop',
    basePrice: 42,
    descriptionAr: 'لحم غنم سواكني مبرد مستورد بالطائرات، جودة ممتازة لمطاعم المندي والمظبي.',
    stockQuantity: 0,
    unitLabel: 'كجم',
    originCountry: 'السودان',
    packaging: 'ذبيحة كاملة',
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

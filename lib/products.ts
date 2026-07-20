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
    image: '/assets/real/media_9.jpeg',
    basePrice: 16.5,
    descriptionAr: 'دجاج مبرد طازج إنتاج محلي يومي، مذبوح على الطريقة الإسلامية.',
    stockQuantity: 1200,
    unitLabel: 'حبة',
  },
  {
    id: 2,
    sku: 'ARA-FRZ-001',
    name: 'دجاج مجمد نخبة أولى',
    category: 'دجاج مجمد',
    status: 'متوفر',
    image: '/assets/real/media_10.jpeg',
    basePrice: 14,
    descriptionAr: 'دجاج مجمد درجة أولى، مجمد بالصدمة للحفاظ على القيمة الغذائية والنكهة.',
    stockQuantity: 5000,
    unitLabel: 'حبة',
  },
  {
    id: 3,
    sku: 'ARA-SHW-001',
    name: 'شورما دجاج مبرد',
    category: 'شاورما مبردة',
    status: 'متوفر',
    image: '/assets/real/media_11.jpeg',
    basePrice: 28,
    descriptionAr: 'صدور وأفخاذ دجاج متبلة أو سادة مجهزة للشاورما.',
    stockQuantity: 450,
    unitLabel: 'كجم',
  },
  {
    id: 4,
    sku: 'ARA-FRZ-002',
    name: 'صدور دجاج مجمدة',
    category: 'دجاج مجمد',
    status: 'متوفر',
    image: '/assets/real/media_12.jpeg',
    basePrice: 22,
    descriptionAr: 'صدور دجاج مجمدة بدون عظم وجلد.',
    stockQuantity: 800,
    unitLabel: 'كيس',
  },
  {
    id: 5,
    sku: 'ARA-FRZ-003',
    name: 'افخاد دجاج مجمدة',
    category: 'دجاج مجمد',
    status: 'متوفر',
    image: '/assets/real/media_13.jpeg',
    basePrice: 18,
    descriptionAr: 'أفخاذ دجاج مجمدة.',
    stockQuantity: 600,
    unitLabel: 'كيس',
  },
  {
    id: 6,
    sku: 'ARA-SHW-002',
    name: 'شورما دجاج مجمدة',
    category: 'دجاج مجمد',
    status: 'متوفر',
    image: '/assets/real/media_14.jpeg',
    basePrice: 26,
    descriptionAr: 'شاورما دجاج مجمدة وجاهزة للتحضير.',
    stockQuantity: 300,
    unitLabel: 'كجم',
  },
  {
    id: 7,
    sku: 'ARA-MET-001',
    name: 'لحوم مبردة وطازجة',
    category: 'لحوم',
    status: 'متوفر',
    image: '/assets/real/media_15.jpeg',
    basePrice: 45,
    descriptionAr: 'لحم بقر/عجل طازج ومبرد.',
    stockQuantity: 150,
    unitLabel: 'كجم',
  },
  {
    id: 8,
    sku: 'ARA-LMB-001',
    name: 'لحوم أغنام',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    image: '/assets/real/media_16.jpeg',
    basePrice: 60,
    descriptionAr: 'لحوم أغنام طازجة مبردة.',
    stockQuantity: 60,
    unitLabel: 'كجم',
  },
  {
    id: 9,
    sku: 'ARA-LMB-002',
    name: 'حري طازج',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    image: '/assets/real/media_17.jpeg',
    basePrice: 65,
    descriptionAr: 'لحم غنم حري بلدي طازج.',
    stockQuantity: 40,
    unitLabel: 'كجم',
  },
  {
    id: 10,
    sku: 'ARA-LMB-003',
    name: 'تيوس باكستاني',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    image: '/assets/real/media_18.jpeg',
    basePrice: 42,
    descriptionAr: 'لحم تيوس باكستاني.',
    stockQuantity: 80,
    unitLabel: 'كجم',
  },
  {
    id: 11,
    sku: 'ARA-LMB-004',
    name: 'تيوس كيني مبردة',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    image: '/assets/real/media_20.jpeg',
    basePrice: 38,
    descriptionAr: 'لحم تيوس كيني مبردة مستوردة.',
    stockQuantity: 100,
    unitLabel: 'كجم',
  },
  {
    id: 12,
    sku: 'ARA-LMB-005',
    name: 'تيوس باكستاني مبردة',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    image: '/assets/real/media_21.jpeg',
    basePrice: 40,
    descriptionAr: 'لحم تيوس باكستاني مبردة.',
    stockQuantity: 120,
    unitLabel: 'كجم',
  },
  {
    id: 13,
    sku: 'ARA-LMB-006',
    name: 'تيوس سواكني طازج',
    category: 'لحوم الأغنام',
    status: 'متوفر',
    image: '/assets/real/media_22.jpeg',
    basePrice: 48,
    descriptionAr: 'لحم تيوس سواكني طازج.',
    stockQuantity: 50,
    unitLabel: 'كجم',
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

import {
  supabase,
  createServerClient,
  isSupabaseConfigured,
  isMockSupabase,
  type DbProductRow,
} from './supabase';

export type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  status: 'متوفر' | 'عند الطلب';
  image: string;
  basePrice: number;
};

export type FetchProductsResult = {
  products: Product[];
  error: string | null;
  fromFallback: boolean;
};

const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, sku: 'ARA-SAL-001', name: 'سمك سلمون طازج', category: 'الأسماك الطازجة', status: 'متوفر', image: 'https://picsum.photos/seed/salmonfish/500/400', basePrice: 89 },
  { id: 2, sku: 'ARA-CHK-001', name: 'دجاج كامل مبرد', category: 'الدواجن الطازجة', status: 'متوفر', image: 'https://picsum.photos/seed/freshchicken/500/400', basePrice: 32 },
  { id: 3, sku: 'ARA-VEG-001', name: 'طماطم محمية', category: 'الخضروات', status: 'متوفر', image: 'https://picsum.photos/seed/freshtomato/500/400', basePrice: 18 },
  { id: 4, sku: 'ARA-RIC-001', name: 'أرز بسمتي درجة أولى', category: 'الأرز', status: 'متوفر', image: 'https://picsum.photos/seed/ricebag/500/400', basePrice: 45 },
  { id: 5, sku: 'ARA-OIL-001', name: 'زيت دوار الشمس', category: 'الزيوت', status: 'متوفر', image: 'https://picsum.photos/seed/cookingoil/500/400', basePrice: 28 },
  { id: 6, sku: 'ARA-FRT-001', name: 'برتقال أبو صرة', category: 'الفواكه الطازجة', status: 'متوفر', image: 'https://picsum.photos/seed/freshorange/500/400', basePrice: 22 },
  { id: 7, sku: 'ARA-FRZ-001', name: 'بطاطس مقلية نصف مقلية', category: 'المنتجات المجمدة', status: 'متوفر', image: 'https://picsum.photos/seed/frozenfries/500/400', basePrice: 35 },
  { id: 8, sku: 'ARA-MET-001', name: 'لحم عجل بلدي', category: 'اللحوم الطازجة', status: 'عند الطلب', image: 'https://picsum.photos/seed/freshmeat/500/400', basePrice: 120 },
  { id: 9, sku: 'ARA-OLV-001', name: 'زيت زيتون بكر ممتاز', category: 'الزيوت', status: 'متوفر', image: 'https://picsum.photos/seed/oliveoil/500/400', basePrice: 55 },
  { id: 10, sku: 'ARA-FSH-002', name: 'سمك الهامور الطازج', category: 'الأسماك الطازجة', status: 'متوفر', image: 'https://picsum.photos/seed/hammour/500/400', basePrice: 95 },
  { id: 11, sku: 'ARA-DAI-001', name: 'لبن طازج كامل الدسم', category: 'المواد الغذائية', status: 'متوفر', image: 'https://picsum.photos/seed/freshmilk/500/400', basePrice: 12 },
  { id: 12, sku: 'ARA-HON-001', name: 'عسل سدر طبيعي', category: 'المواد الغذائية', status: 'متوفر', image: 'https://picsum.photos/seed/honeyjar/500/400', basePrice: 75 },
];

export function mapProductRow(row: DbProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    status: row.status,
    image: row.image_url,
    basePrice: Number(row.base_price),
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
    .select('id, sku, name, category, status, image_url, base_price, is_active')
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
    .select('id, sku, name, category, status, image_url, base_price, is_active')
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
    .select('id, sku, name, category, status, image_url, base_price, is_active')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  return mapProductRow(data as DbProductRow);
}

export { isMockSupabase, FALLBACK_PRODUCTS as PRODUCTS };

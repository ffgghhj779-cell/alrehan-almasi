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
    name: 'دجاج مبرد كامل 1300g',
    category: 'دجاج مبرد',
    status: 'متوفر',
    image: '/assets/real/brand_chicken_chilled_carton.png',
    basePrice: 16.5,
    descriptionAr:
      'دجاج كامل مبرد فاخر عالي الجودة، وزن صافي 1300g ±50g، يُحفظ بين 0/+5°C، صناعة سعودية، معبأ بأكياس علامة الرهان الماسي داخل كرتون جملة.',
    stockQuantity: 1200,
    unitLabel: 'حبة',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كرتون 9 حبات × 1300g',
  },
  {
    id: 2,
    sku: 'ARA-FRZ-001',
    name: 'دجاج مجمد كامل 5 كجم',
    category: 'دجاج مجمد',
    status: 'متوفر',
    image: '/assets/real/brand_chicken_frozen_crate.png',
    basePrice: 14,
    descriptionAr: 'دجاج مجمد درجة أولى في أكياس 5 كجم، مجمد بالصدمة للحفاظ على القيمة الغذائية والنكهة.',
    stockQuantity: 5000,
    unitLabel: 'كيس',
    originCountry: 'البرازيل',
    packaging: 'كيس 5 كجم',
  },
  {
    id: 3,
    sku: 'ARA-SHW-001',
    name: 'شاورما دجاج مبردة متبّلة',
    category: 'شاورما مبردة',
    status: 'متوفر',
    image: '/assets/real/raw_shawarma_bag.png',
    basePrice: 28,
    descriptionAr: 'شاورما دجاج متبلة مفرغة من الهواء، إنتاج يومي طازج مبرد، وزن تقريبي 1.2 كجم.',
    stockQuantity: 450,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس Vacuume 1.2 كجم',
  },
  {
    id: 4,
    sku: 'ARA-FRZ-002',
    name: 'صدر دجاج مجمد 1000g',
    category: 'دجاج مجمد',
    status: 'متوفر',
    image: '/assets/real/brand_chicken_breast_frozen.png',
    basePrice: 22,
    descriptionAr: 'صدر دجاج مجمد بدون عظم وجلد، وزن صافي 1000g ±50g، مجمد بتقنية الصدمة.',
    stockQuantity: 800,
    unitLabel: 'كيس',
    originCountry: 'البرازيل',
    packaging: 'كيس 1000g ±50g',
  },
  {
    id: 5,
    sku: 'ARA-FRZ-003',
    name: 'أفخاذ دجاج مجمدة',
    category: 'دجاج مجمد',
    status: 'متوفر',
    image: '/assets/real/chicken_thighs_bag_real.png',
    basePrice: 18,
    descriptionAr: 'أفخاذ دجاج مجمدة درجة أولى داخل كيس شفاف، مجمدة بتقنية التبريد السريع.',
    stockQuantity: 600,
    unitLabel: 'كيس',
    originCountry: 'البرازيل',
    packaging: 'كيس مجمد 2 كجم',
  },
  {
    id: 6,
    sku: 'ARA-SHW-002',
    name: 'شاورما دجاج متبّلة',
    category: 'شاورما مبردة',
    status: 'متوفر',
    image: '/assets/real/raw_shawarma_bag.png',
    basePrice: 26,
    descriptionAr: 'شاورما دجاج متبلة جاهزة للتحضير، محفوظة مبردة في كيس مفرغ من الهواء.',
    stockQuantity: 300,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس Vacuume 1.2 كجم',
  },
  {
    id: 7,
    sku: 'ARA-EGG-001',
    name: 'بيض أبيض × 6',
    category: 'بيض',
    status: 'متوفر',
    image: '/assets/real/eggs_pack_6.png',
    basePrice: 9.5,
    descriptionAr: 'علبة بلاستيكية شفافة تحتوي 6 بيضات بيضاء طازجة، مثالية للاستخدام اليومي المنزلي.',
    stockQuantity: 2500,
    unitLabel: 'علبة',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'علبة 6 بيضات',
  },
  {
    id: 8,
    sku: 'ARA-NUG-001',
    name: 'استربس دجاج مجمدة',
    category: 'مصنعات الدجاج',
    status: 'متوفر',
    image: '/assets/real/chicken_strips_fakieh.png',
    basePrice: 32,
    descriptionAr: 'استربس دجاج مقرمشة من صدور طازجة، مجمدة وجاهزة للقلي — قرمشة مذهلة.',
    stockQuantity: 500,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 750 جرام – 1 كجم',
  },
  {
    id: 9,
    sku: 'ARA-CUT-001',
    name: 'صينية أجنحة دجاج طازجة',
    category: 'مقطعات طازجة',
    status: 'متوفر',
    image: '/assets/real/catalog/cut_wings_tray.png',
    basePrice: 14.5,
    descriptionAr: 'أجنحة دجاج طازجة في صينية تغليف غذائي، مثالية للقلي والشوي والوصفات الآسيوية.',
    stockQuantity: 400,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 10,
    sku: 'ARA-OFL-001',
    name: 'صينية كبدة دجاج طازجة',
    category: 'كبدة وقلوب ومفروم',
    status: 'متوفر',
    image: '/assets/real/catalog/offal_liver_tray.png',
    basePrice: 11.0,
    descriptionAr: 'كبدة دجاج طازجة نظيفة في صينية محكمة، مناسبة للقلي والطبخ اليومي والتموين.',
    stockQuantity: 350,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 11,
    sku: 'ARA-OFL-003',
    name: 'صينية دجاج مفروم طازج',
    category: 'كبدة وقلوب ومفروم',
    status: 'متوفر',
    image: '/assets/real/catalog/offal_minced_tray.png',
    basePrice: 19.0,
    descriptionAr: 'دجاج مفروم طازج صافي بدون إضافات، في صينية جاهزة للاستخدام في الكفتة والبرجر والطبخ.',
    stockQuantity: 420,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 400 جرام',
  },
  {
    id: 12,
    sku: 'ARA-MAR-004',
    name: 'دجاج شوي BBQ متبّل',
    category: 'دجاج متبّل',
    status: 'متوفر',
    image: '/assets/real/catalog/marinated_bbq_tray.png',
    basePrice: 27.0,
    descriptionAr: 'قطع دجاج متبّلة بتتبيلة الشوي BBQ الجاهزة، في صينية سوداء فاخرة — جاهزة للشوي الفوري.',
    stockQuantity: 280,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 13,
    sku: 'ARA-MAR-003',
    name: 'دجاج بالزبدة متبّل',
    category: 'دجاج متبّل',
    status: 'متوفر',
    image: '/assets/real/catalog/marinated_butter_tray.png',
    basePrice: 28.0,
    descriptionAr: 'مكعبات دجاج متبّلة بتتبيلة الزبدة الكريمية، جاهزة للطبخ السريع في المطاعم والمنازل.',
    stockQuantity: 260,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 14,
    sku: 'ARA-EGG-002',
    name: 'بيض أبيض كبير 15 بيضة',
    category: 'بيض',
    status: 'متوفر',
    image: '/assets/real/eggs_pack_15.png',
    basePrice: 16.5,
    descriptionAr: 'علبة مسطحة شفافة تحتوي 15 بيضة بيضاء كبيرة الحجم، مناسبة للعائلات الصغيرة والمطاعم.',
    stockQuantity: 1800,
    unitLabel: 'علبة',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'علبة 15 بيضة كبيرة',
  },
  {
    id: 15,
    sku: 'ARA-EGG-003',
    name: 'بيض أبيض كبير 30 بيضة',
    category: 'بيض',
    status: 'متوفر',
    image: '/assets/real/eggs_pack_30_large.png',
    basePrice: 24.5,
    descriptionAr: 'طبق أصفر مفتوح يحتوي 30 بيضة بيضاء كبيرة درجة أولى، مثالي للجملة والتموين.',
    stockQuantity: 2200,
    unitLabel: 'طبق',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'طبق 30 بيضة كبيرة',
  },
  {
    id: 16,
    sku: 'ARA-EGG-004',
    name: 'بيض أبيض وسط 30 بيضة',
    category: 'بيض',
    status: 'متوفر',
    image: '/assets/real/eggs_pack_30_medium.png',
    basePrice: 21.0,
    descriptionAr: 'طبق 30 بيضة بيضاء وسط مغلف بالشرنك للحفاظ على الطزاجة أثناء النقل والتخزين.',
    stockQuantity: 2000,
    unitLabel: 'طبق',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'طبق 30 بيضة وسط مغلف',
  },
  // ── مقطعات طازجة ──
  {
    id: 17,
    sku: 'ARA-CUT-004',
    name: 'صينية صدور دجاج بالعظم طازجة',
    category: 'مقطعات طازجة',
    status: 'متوفر',
    image: '/assets/real/catalog/cut_breast_bone_tray.png',
    basePrice: 22.0,
    descriptionAr: 'صدور دجاج طازجة بالعظم في صينية تغليف غذائي، مثالية للشوي والفرن والمطاعم.',
    stockQuantity: 380,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 18,
    sku: 'ARA-CUT-005',
    name: 'صينية صدور دجاج بدون عظم طازجة',
    category: 'مقطعات طازجة',
    status: 'متوفر',
    image: '/assets/real/catalog/cut_breast_boneless_tray.png',
    basePrice: 26.0,
    descriptionAr: 'صدور دجاج طازجة بدون عظم وجلد، تقطيع موحّد للمطابخ المركزية والساندويتشات.',
    stockQuantity: 360,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 19,
    sku: 'ARA-CUT-006',
    name: 'صينية أفخاذ دجاج بدون عظم وجلد',
    category: 'مقطعات طازجة',
    status: 'متوفر',
    image: '/assets/real/catalog/cut_thighs_boneless_tray.png',
    basePrice: 24.0,
    descriptionAr: 'أفخاذ دجاج طازجة بدون عظم وجلد، طرية وجاهزة للشوي والقلي والطبخ.',
    stockQuantity: 340,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 20,
    sku: 'ARA-CUT-007',
    name: 'صينية أرجل دجاج طازجة',
    category: 'مقطعات طازجة',
    status: 'متوفر',
    image: '/assets/real/catalog/cut_legs_tray.png',
    basePrice: 15.5,
    descriptionAr: 'أرجل دجاج طازجة كاملة (فخذ + ساق) في صينية محكمة، مثالية للفرن والمندي.',
    stockQuantity: 400,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 21,
    sku: 'ARA-CUT-008',
    name: 'صينية سيقان دجاج طازجة',
    category: 'مقطعات طازجة',
    status: 'متوفر',
    image: '/assets/real/catalog/cut_drumsticks_tray.png',
    basePrice: 14.0,
    descriptionAr: 'سيقان دجاج طازجة فقط، تغليف صينية غذائي — خيار عملي للمطاعم والبوفيه.',
    stockQuantity: 390,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 22,
    sku: 'ARA-CUT-009',
    name: 'صينية قطع دجاج مشكلة طازجة',
    category: 'مقطعات طازجة',
    status: 'متوفر',
    image: '/assets/real/catalog/cut_mixed_tray.png',
    basePrice: 16.0,
    descriptionAr: 'تشكيلة قطع دجاج طازجة مشكلة في صينية واحدة — مناسبة للعائلات والمطاعم الصغيرة.',
    stockQuantity: 370,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  {
    id: 23,
    sku: 'ARA-CUT-010',
    name: 'دجاج كامل طازج مقسّم ثلاثي',
    category: 'مقطعات طازجة',
    status: 'متوفر',
    image: '/assets/real/catalog/cut_whole_triple_tray.png',
    basePrice: 29.0,
    descriptionAr: 'دجاج كامل طازج مقطّع إلى ثلاثة أجزاء في صينية واحدة، جاهز للفرن مباشرة.',
    stockQuantity: 220,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية ~1200 جرام',
  },
  {
    id: 24,
    sku: 'ARA-CHK-004',
    name: 'دجاج كامل طازج كيس 1000g',
    category: 'دجاج مبرد',
    status: 'متوفر',
    image: '/assets/real/catalog/fresh_whole_bag_1kg.png',
    basePrice: 15.0,
    descriptionAr: 'دجاج كامل طازج في كيس غذائي بوزن صافي تقريبي 1000 جرام، إنتاج يومي محلي.',
    stockQuantity: 900,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 1000 جرام',
  },
  // ── دجاج متبّل ──
  {
    id: 25,
    sku: 'ARA-MAR-001',
    name: 'دجاج متبّل أوميغا 3',
    category: 'دجاج متبّل',
    status: 'متوفر',
    image: '/assets/real/catalog/marinated_omega3_tray.png',
    basePrice: 34.0,
    descriptionAr: 'دجاج كامل متبّل غني بأوميغا 3 في صينية فاخرة (~1100 جرام)، جاهز للفرن والشوي.',
    stockQuantity: 180,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية ~1100 جرام',
  },
  {
    id: 26,
    sku: 'ARA-MAR-002',
    name: 'صدر دجاج شقرى متبّل',
    category: 'دجاج متبّل',
    status: 'متوفر',
    image: '/assets/real/catalog/marinated_shaqra_tray.png',
    basePrice: 29.5,
    descriptionAr: 'صدر دجاج متبّل بفلفل شقرى الحار في صينية سوداء — نكهة سعودية أصيلة جاهزة للطبخ.',
    stockQuantity: 240,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 450 جرام',
  },
  // ── كبدة وقلوب ──
  {
    id: 27,
    sku: 'ARA-OFL-002',
    name: 'صينية قلوب دجاج طازجة',
    category: 'كبدة وقلوب ومفروم',
    status: 'متوفر',
    image: '/assets/real/catalog/offal_hearts_tray.png',
    basePrice: 12.5,
    descriptionAr: 'قلوب دجاج طازجة منظفة في صينية غذائي، مناسبة للقلي والوصفات الشعبية.',
    stockQuantity: 300,
    unitLabel: 'صينية',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'صينية 400 جرام',
  },
  // ── مصنعات إضافية ──
  {
    id: 28,
    sku: 'ARA-NUG-002',
    name: 'ناجتس دجاج مجمدة 600g',
    category: 'مصنعات الدجاج',
    status: 'متوفر',
    image: '/assets/real/catalog/mfg_nuggets_bag.png',
    basePrice: 29.0,
    descriptionAr: 'ناجتس دجاج مقرمشة مجمدة في كيس 600 جرام، مثالية للأطفال والمطاعم السريعة.',
    stockQuantity: 550,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 600 جرام',
  },
  {
    id: 29,
    sku: 'ARA-MNF-003',
    name: 'فيليه دجاج مجمد 600g',
    category: 'مصنعات الدجاج',
    status: 'متوفر',
    image: '/assets/real/catalog/mfg_fillet_bag.png',
    basePrice: 31.0,
    descriptionAr: 'فيليه دجاج مجمد عالي الجودة في كيس 600 جرام، جاهز للقلي أو الفرن.',
    stockQuantity: 480,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 600 جرام',
  },
  {
    id: 30,
    sku: 'ARA-MNF-004',
    name: 'تندرلوين دجاج مجمد 2 كجم',
    category: 'مصنعات الدجاج',
    status: 'متوفر',
    image: '/assets/real/catalog/mfg_tenderloin_bag.png',
    basePrice: 48.0,
    descriptionAr: 'تندرلوين دجاج مجمد بوزن 2 كجم للجملة والمطابخ المركزية.',
    stockQuantity: 200,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 2 كجم',
  },
  {
    id: 31,
    sku: 'ARA-MNF-005',
    name: 'ستربس دجاج كوري 600g',
    category: 'مصنعات الدجاج',
    status: 'متوفر',
    image: '/assets/real/catalog/mfg_strips_korean_bag.png',
    basePrice: 33.0,
    descriptionAr: 'ستربس دجاج بخلطة كورية خاصة مجمدة في كيس 600 جرام — نكهة آسيوية مميزة.',
    stockQuantity: 320,
    unitLabel: 'كيس',
    originCountry: 'المملكة العربية السعودية',
    packaging: 'كيس 600 جرام',
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

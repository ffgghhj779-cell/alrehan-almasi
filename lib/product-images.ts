const UNSPLASH = 'https://images.unsplash.com';

/** Build a verified Unsplash URL (IDs tested with HTTP 200). */
export function buildImageUrl(
  photoId: string,
  options?: { w?: number; h?: number; crop?: string }
): string {
  const w = options?.w ?? 900;
  const h = options?.h ?? 640;
  const crop = options?.crop ?? 'entropy';
  return `${UNSPLASH}/photo-${photoId}?w=${w}&h=${h}&q=85&auto=format&fit=crop&crop=${crop}`;
}

/** Verified photo IDs — legacy fallbacks only */
export const PHOTOS = {
  salmon: '1467003909585-2f8a72700288',
  fish: '1544551763-46a013bb70d5',
  shrimp: '1559847844-5315695dadae',
  chicken: '1598103442097-8b74394b95c6',
  breast: '1603360946369-dc9bb6258143',
  shawarma: '1565299507177-b0ac66763828',
  nuggets: '1562967916-eb82221dfb92',
  eggs: '1582722872445-44dc9d70e95e',
  rice: '1586201375761-83865001e31c',
  oil: '1474979266404-7eaacbcd87c5',
  frozenVeg: '1610832958506-aa56368176cf',
  milk: '1563636619-e9143da7973b',
  fruits: '1619566636858-adf3ef46400b',
  veggies: '1540420773420-3366772f4999',
  grocery: '1542838132-92c53300491e',
  foodSpread: '1490645935967-10de6ba17061',
  foodBowl: '1546069901-ba9599a7e63c',
} as const;

/** Official brand packaging assets */
export const BRAND = {
  chilledBasket: '/assets/real/brand_chicken_chilled_basket_ad.png',
  chilledBag: '/assets/real/brand_chicken_chilled_bag.png',
  breastFrozen: '/assets/real/brand_chicken_breast_frozen.png',
  frozenCrate: '/assets/real/brand_chicken_frozen_crate.png',
  packagingSet: '/assets/real/brand_packaging_box_bags.png',
  supermarketShelf: '/assets/real/brand_supermarket_shelf.png',
  eggs: '/assets/real/eggs_tray_almoroj.png',
} as const;

/** Gallery — branded product photography */
export const GALLERY_IMAGES = [
  {
    src: BRAND.supermarketShelf,
    label: 'منتجاتنا في الأسواق',
    alt: 'دجاج الرهان الماسي معروض في ثلاجة السوبرماركت',
    href: '/products?category=دجاج مبرد',
  },
  {
    src: BRAND.chilledBasket,
    label: 'دجاج طازج مبرد',
    alt: 'دجاج مبرد فاخر في سلة مع ثلج',
    href: '/products?category=دجاج مبرد',
  },
  {
    src: BRAND.frozenCrate,
    label: 'دجاج مجمد بالجملة',
    alt: 'أكياس دجاج مجمد 5 كجم في صناديق النقل',
    href: '/products?category=دجاج مجمد',
  },
  {
    src: BRAND.packagingSet,
    label: 'تعبئة وتغليف احترافي',
    alt: 'صندوق شحن وأكياس تجزئة من الرهان الماسي',
    href: '/products',
  },
  {
    src: BRAND.breastFrozen,
    label: 'صدر دجاج مجمد',
    alt: 'كيس صدر دجاج بدون عظم وجلد',
    href: '/products?category=دجاج مجمد',
  },
] as const;

/** Canonical image per SKU */
export const SKU_IMAGES: Record<string, string> = {
  // Chilled chicken
  'ARA-CHK-001': BRAND.chilledBasket,
  'ARA-CHK-002': BRAND.chilledBag,
  'ARA-CHK-003': BRAND.chilledBag,
  // Frozen chicken
  'ARA-FRZ-001': BRAND.frozenCrate,
  'ARA-FRZ-002': BRAND.breastFrozen,
  'ARA-FRZ-003': BRAND.chilledBag,
  'ARA-FRZ-004': BRAND.frozenCrate,
  // Shawarma — branded whole-bag packaging as closest match
  'ARA-SHW-001': BRAND.chilledBag,
  'ARA-SHW-002': BRAND.breastFrozen,
  // Manufactured / cuts
  'ARA-MNF-001': BRAND.breastFrozen,
  'ARA-MNF-002': BRAND.breastFrozen,
  'ARA-NUG-001': BRAND.breastFrozen,
  // Eggs
  'ARA-EGG-001': BRAND.eggs,
  // Legacy SKUs
  'ARA-SAL-001': buildImageUrl(PHOTOS.salmon),
  'ARA-FSH-002': buildImageUrl(PHOTOS.fish, { crop: 'center' }),
  'ARA-SHR-001': buildImageUrl(PHOTOS.shrimp),
  'ARA-RIC-001': buildImageUrl(PHOTOS.rice),
  'ARA-OIL-001': buildImageUrl(PHOTOS.oil),
  'ARA-DAI-001': buildImageUrl(PHOTOS.milk),
};

export const CATEGORY_IMAGES: Record<string, string> = {
  'دجاج مبرد': BRAND.chilledBasket,
  'دجاج مجمد': BRAND.frozenCrate,
  'شاورما مبردة': BRAND.chilledBag,
  'مصنعات الدجاج': BRAND.breastFrozen,
  'بيض': BRAND.eggs,
  // Legacy categories
  'الأسماك الطازجة': buildImageUrl(PHOTOS.fish),
  'الدواجن الطازجة': BRAND.chilledBasket,
  'الأرز': buildImageUrl(PHOTOS.rice),
  'الزيوت الغذائية': buildImageUrl(PHOTOS.oil),
  'المنتجات المجمدة': BRAND.frozenCrate,
  'المواد الغذائية': BRAND.packagingSet,
};

export const DEFAULT_PRODUCT_IMAGE = BRAND.chilledBag;

export function resolveProductImage(
  sku: string,
  category: string,
  dbUrl?: string | null
): string {
  const normalizedSku = sku.trim().toUpperCase();
  if (SKU_IMAGES[normalizedSku]) return SKU_IMAGES[normalizedSku];
  if (category && CATEGORY_IMAGES[category]) return CATEGORY_IMAGES[category];
  if (dbUrl && dbUrl.includes('images.unsplash.com/photo-')) return dbUrl;
  return DEFAULT_PRODUCT_IMAGE;
}

export const STORE_CATEGORIES = [
  {
    name: 'دجاج مجمد',
    subtitle: 'دجاج مجمد عالي الجودة',
    image: BRAND.frozenCrate,
  },
  {
    name: 'دجاج مبرد',
    subtitle: 'دواجن مبردة طازجة يومياً',
    image: BRAND.chilledBasket,
  },
  {
    name: 'شاورما مبردة',
    subtitle: 'شاورما طازجة جاهزة',
    image: BRAND.chilledBag,
  },
  {
    name: 'مصنعات الدجاج',
    subtitle: 'استربس، زنجر، بانيه والمزيد',
    image: BRAND.breastFrozen,
  },
  {
    name: 'بيض',
    subtitle: 'بيض مائدة طازج',
    image: BRAND.eggs,
  },
] as const;

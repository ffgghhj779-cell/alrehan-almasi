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

/** Verified photo IDs — each returns a real image from Unsplash. */
export const PHOTOS = {
  salmon: '1467003909585-2f8a72700288',
  fish: '1544551763-46a013bb70d5',
  shrimp: '1559847844-5315695dadae',
  chicken: '1598103442097-8b74394b95c6',
  breast: '1603360946369-dc9bb6258143',
  meat: '1607623814075-e51df1bdc82f',
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

/** Canonical image per SKU — overrides broken DB URLs. */
export const SKU_IMAGES: Record<string, string> = {
  'ARA-SAL-001': buildImageUrl(PHOTOS.salmon),
  'ARA-FSH-002': buildImageUrl(PHOTOS.fish, { crop: 'center' }),
  'ARA-FSH-003': buildImageUrl(PHOTOS.salmon, { crop: 'top' }),
  'ARA-SHR-001': buildImageUrl(PHOTOS.shrimp),
  'ARA-CHK-001': buildImageUrl(PHOTOS.chicken),
  'ARA-CHK-002': buildImageUrl(PHOTOS.breast),
  'ARA-CHK-003': buildImageUrl(PHOTOS.chicken, { crop: 'edges' }),
  'ARA-RIC-001': buildImageUrl(PHOTOS.rice),
  'ARA-RIC-002': buildImageUrl(PHOTOS.rice, { crop: 'top' }),
  'ARA-RIC-003': buildImageUrl(PHOTOS.rice, { crop: 'bottom' }),
  'ARA-OLV-001': buildImageUrl(PHOTOS.oil),
  'ARA-OIL-001': buildImageUrl(PHOTOS.oil, { crop: 'center' }),
  'ARA-OIL-002': buildImageUrl(PHOTOS.oil, { crop: 'edges' }),
  'ARA-OIL-003': buildImageUrl(PHOTOS.oil, { crop: 'entropy' }),
  'ARA-FRZ-001': buildImageUrl(PHOTOS.foodSpread),
  'ARA-FRZ-002': buildImageUrl(PHOTOS.frozenVeg),
  'ARA-FRZ-003': buildImageUrl(PHOTOS.chicken, { crop: 'entropy' }),
  'ARA-FRZ-004': buildImageUrl(PHOTOS.salmon, { crop: 'edges' }),
  'ARA-MET-001': buildImageUrl(PHOTOS.meat),
  'ARA-DAI-001': buildImageUrl(PHOTOS.milk),
};

export const CATEGORY_IMAGES: Record<string, string> = {
  'الأسماك الطازجة': buildImageUrl(PHOTOS.fish),
  'الدواجن الطازجة': buildImageUrl(PHOTOS.chicken),
  'الأرز': buildImageUrl(PHOTOS.rice),
  'الزيوت الغذائية': buildImageUrl(PHOTOS.oil),
  'المنتجات المجمدة': buildImageUrl(PHOTOS.frozenVeg),
  'اللحوم الطازجة': buildImageUrl(PHOTOS.meat),
  'المواد الغذائية': buildImageUrl(PHOTOS.grocery),
};

export const DEFAULT_PRODUCT_IMAGE = buildImageUrl(PHOTOS.foodBowl);

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
    name: 'الأسماك الطازجة',
    subtitle: 'سلمون · هامور · روبيان',
    image: CATEGORY_IMAGES['الأسماك الطازجة'],
  },
  {
    name: 'الدواجن الطازجة',
    subtitle: 'دجاج كامل · فيليه · أفخاذ',
    image: CATEGORY_IMAGES['الدواجن الطازجة'],
  },
  {
    name: 'الأرز',
    subtitle: 'بسمتي · مصري · ياسمين',
    image: CATEGORY_IMAGES['الأرز'],
  },
  {
    name: 'الزيوت الغذائية',
    subtitle: 'زيتون · دوار الشمس · نخيل',
    image: CATEGORY_IMAGES['الزيوت الغذائية'],
  },
  {
    name: 'المنتجات المجمدة',
    subtitle: 'بطاطس · خضار · ناجتس',
    image: CATEGORY_IMAGES['المنتجات المجمدة'],
  },
  {
    name: 'اللحوم الطازجة',
    subtitle: 'غنم · عجل · تقطيع حسب الطلب',
    image: CATEGORY_IMAGES['اللحوم الطازجة'],
  },
] as const;

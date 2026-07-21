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
  lamb: '1544025162-d76538415491',
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

/** Gallery — real product imagery from data folder + Unsplash */
export const GALLERY_IMAGES = [
  {
    src: '/assets/chicken-supermarket.jpeg',
    label: 'دواجن مبردة في الأسواق',
    alt: 'أكياس دجاج مبرد في ثلاجة السوبرماركت',
    href: '/products?category=دجاج مبرد',
  },
  {
    src: '/assets/eggs-tray.jpeg',
    label: 'بيض مائدة الرهان الماسي',
    alt: 'طبق بيض طازج',
    href: '/products?category=بيض',
  },
  {
    src: '/assets/chicken-frozen-sadia-branded.png',
    label: 'دجاج مجمد بالجملة',
    alt: 'أكياس دجاج مجمد بالجملة',
    href: '/products?category=دجاج مجمد',
  },
  {
    src: '/assets/chicken-fresh-basket-branded.png',
    label: 'دجاج مبرد نخبة أولى',
    alt: 'كيسا دجاج مبرد في سلة مع ثلج',
    href: '/products?category=دجاج مبرد',
  },
  {
    src: '/assets/eggs-carton-front-branded.png',
    label: 'بيض طازج يومي',
    alt: 'صناديق بيض طازج',
    href: '/products?category=بيض',
  },
] as const;

/** Canonical image per SKU */
export const SKU_IMAGES: Record<string, string> = {
  // Chilled chicken
  'ARA-CHK-001': '/assets/real/chicken_chilled_basket.png',
  'ARA-CHK-002': '/assets/real/chicken_chilled_basket.png',
  'ARA-CHK-003': '/assets/real/chicken_chilled_basket.png',
  // Frozen chicken
  'ARA-FRZ-001': '/assets/real/chicken_frozen_sadia.png',
  'ARA-FRZ-002': '/assets/real/chicken_frozen_sadia.png',
  'ARA-FRZ-003': '/assets/real/chicken_frozen_sadia.png',
  'ARA-FRZ-004': '/assets/real/chicken_frozen_sadia.png',
  // Shawarma
  'ARA-SHW-001': '/assets/real/raw_shawarma_bag.png',
  'ARA-SHW-002': '/assets/real/raw_shawarma_bag.png',
  // Manufactured
  'ARA-MNF-001': '/assets/real/chicken_strips_fakieh.png',
  'ARA-MNF-002': '/assets/real/chicken_strips_fakieh.png',
  'ARA-NUG-001': '/assets/real/chicken_strips_fakieh.png',
  // Eggs
  'ARA-EGG-001': '/assets/real/eggs_tray_almoroj.png',
  // Meat
  'ARA-MET-001': '/assets/real/raw_beef_butcher.png',
  'ARA-MET-002': '/assets/real/raw_beef_butcher.png',
  // Lamb
  'ARA-LMB-001': '/assets/real/raw_lamb_butcher.png',
  'ARA-LMB-002': '/assets/real/raw_lamb_butcher.png',
  'ARA-LMB-003': '/assets/real/raw_lamb_butcher.png',
  'ARA-LMB-004': '/assets/real/raw_lamb_butcher.png',
  'ARA-LMB-005': '/assets/real/raw_lamb_butcher.png',
  'ARA-LMB-006': '/assets/real/raw_lamb_butcher.png',
  // Old SKUs kept for compatibility
  'ARA-SAL-001': buildImageUrl(PHOTOS.salmon),
  'ARA-FSH-002': buildImageUrl(PHOTOS.fish, { crop: 'center' }),
  'ARA-SHR-001': buildImageUrl(PHOTOS.shrimp),
  'ARA-RIC-001': buildImageUrl(PHOTOS.rice),
  'ARA-OIL-001': buildImageUrl(PHOTOS.oil),
  'ARA-DAI-001': buildImageUrl(PHOTOS.milk),
};

export const CATEGORY_IMAGES: Record<string, string> = {
  'دجاج مبرد': '/assets/real/chicken_chilled_basket.png',
  'دجاج مجمد': '/assets/real/chicken_frozen_sadia.png',
  'شاورما مبردة': '/assets/real/raw_shawarma_bag.png',
  'مصنعات الدجاج': '/assets/real/chicken_strips_clear.png',
  'بيض': '/assets/real/eggs_tray_almoroj.png',
  'لحوم': '/assets/real/raw_beef_butcher.png',
  'لحوم الأغنام': '/assets/real/raw_lamb_butcher.png',
  // Legacy categories
  'الأسماك الطازجة': buildImageUrl(PHOTOS.fish),
  'الدواجن الطازجة': '/assets/real/chicken_chilled_basket.png',
  'الأرز': buildImageUrl(PHOTOS.rice),
  'الزيوت الغذائية': buildImageUrl(PHOTOS.oil),
  'المنتجات المجمدة': '/assets/real/chicken_frozen_sadia.png',
  'اللحوم الطازجة': '/assets/real/raw_beef_butcher.png',
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
    name: 'دجاج مجمد',
    subtitle: 'دجاج مجمد عالي الجودة',
    image: '/assets/real/chicken_frozen_sadia.png',
  },
  {
    name: 'دجاج مبرد',
    subtitle: 'دواجن مبردة طازجة يومياً',
    image: '/assets/real/chicken_chilled_basket.png',
  },
  {
    name: 'شاورما مبردة',
    subtitle: 'شاورما طازجة جاهزة',
    image: '/assets/real/raw_shawarma_bag.png',
  },
  {
    name: 'مصنعات الدجاج',
    subtitle: 'استربس، زنجر، بانيه والمزيد',
    image: '/assets/real/chicken_strips_clear.png',
  },
  {
    name: 'بيض',
    subtitle: 'بيض مائدة طازج',
    image: '/assets/real/eggs_tray_almoroj.png',
  },
  {
    name: 'لحوم',
    subtitle: 'لحوم بقر وعجل مبردة وطازجة',
    image: '/assets/real/raw_beef_butcher.png',
  },
  {
    name: 'لحوم الأغنام',
    subtitle: 'لحوم أغنام طازجة (حري، سواكني، تيوس)',
    image: '/assets/real/raw_lamb_butcher.png',
  },
] as const;

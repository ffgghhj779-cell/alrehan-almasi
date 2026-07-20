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
    src: '/assets/real/alrehan_approved_bag.png',
    label: 'تصميم التغليف المعتمد (الرهان الماسي)',
    alt: 'تصميم كيس التغليف الحصري لمؤسسة الرهان الماسي',
    href: '/products',
  },
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
  'ARA-CHK-001': '/assets/real/media_12.jpeg',
  'ARA-CHK-002': '/assets/real/media_12.jpeg',
  'ARA-CHK-003': '/assets/real/media_12.jpeg',
  // Frozen chicken
  'ARA-FRZ-001': '/assets/real/media_10.jpeg',
  'ARA-FRZ-002': '/assets/real/media_11.jpeg',
  'ARA-FRZ-003': 'https://images.unsplash.com/photo-1604503468506-a8da13daff91?w=600&q=85&auto=format&fit=crop',
  'ARA-FRZ-004': '/assets/real/media_11.jpeg',
  // Shawarma
  'ARA-SHW-001': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=85&auto=format&fit=crop',
  'ARA-SHW-002': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=85&auto=format&fit=crop',
  // Manufactured
  'ARA-MNF-001': '/assets/real/media_13.jpeg',
  'ARA-MNF-002': '/assets/real/media_13.jpeg',
  'ARA-NUG-001': '/assets/real/media_13.jpeg',
  // Eggs
  'ARA-EGG-001': '/assets/real/media_15.jpeg',
  // Meat
  'ARA-MET-001': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=85&auto=format&fit=crop',
  'ARA-MET-002': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=85&auto=format&fit=crop',
  // Lamb
  'ARA-LMB-001': 'https://images.unsplash.com/photo-1544025162-d76538415491?w=600&q=85&auto=format&fit=crop',
  'ARA-LMB-002': 'https://images.unsplash.com/photo-1603048588665-791ca794ae1a?w=600&q=85&auto=format&fit=crop',
  'ARA-LMB-003': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=85&auto=format&fit=crop',
  'ARA-LMB-004': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=85&auto=format&fit=crop',
  'ARA-LMB-005': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=85&auto=format&fit=crop',
  'ARA-LMB-006': 'https://images.unsplash.com/photo-1603048588665-791ca794ae1a?w=600&q=85&auto=format&fit=crop',
  // Old SKUs kept for compatibility
  'ARA-SAL-001': buildImageUrl(PHOTOS.salmon),
  'ARA-FSH-002': buildImageUrl(PHOTOS.fish, { crop: 'center' }),
  'ARA-SHR-001': buildImageUrl(PHOTOS.shrimp),
  'ARA-RIC-001': buildImageUrl(PHOTOS.rice),
  'ARA-OIL-001': buildImageUrl(PHOTOS.oil),
  'ARA-DAI-001': buildImageUrl(PHOTOS.milk),
};

export const CATEGORY_IMAGES: Record<string, string> = {
  'دجاج مجمد': '/assets/real/media_10.jpeg',
  'دجاج مبرد': '/assets/real/media_5.jpeg',
  'شاورما مبردة': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=85&auto=format&fit=crop',
  'مصنعات الدجاج': '/assets/real/media_13.jpeg',
  'بيض': '/assets/real/media_15.jpeg',
  'لحوم': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=85&auto=format&fit=crop',
  'لحوم الأغنام': 'https://images.unsplash.com/photo-1544025162-d76538415491?w=600&q=85&auto=format&fit=crop',
  // Legacy categories
  'الأسماك الطازجة': buildImageUrl(PHOTOS.fish),
  'الدواجن الطازجة': '/assets/real/media_5.jpeg',
  'الأرز': buildImageUrl(PHOTOS.rice),
  'الزيوت الغذائية': buildImageUrl(PHOTOS.oil),
  'المنتجات المجمدة': '/assets/real/media_10.jpeg',
  'اللحوم الطازجة': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=85&auto=format&fit=crop',
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
    image: '/assets/real/media_10.jpeg',
  },
  {
    name: 'دجاج مبرد',
    subtitle: 'دواجن مبردة طازجة يومياً',
    image: '/assets/real/media_5.jpeg',
  },
  {
    name: 'شاورما مبردة',
    subtitle: 'شاورما طازجة جاهزة',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'مصنعات الدجاج',
    subtitle: 'استربس، زنجر، بانيه والمزيد',
    image: '/assets/real/media_13.jpeg',
  },
  {
    name: 'بيض',
    subtitle: 'بيض مائدة طازج',
    image: '/assets/real/media_15.jpeg',
  },
  {
    name: 'لحوم',
    subtitle: 'لحوم بقر وعجل مبردة وطازجة',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'لحوم الأغنام',
    subtitle: 'لحوم أغنام طازجة (حري وسواكني)',
    image: 'https://images.unsplash.com/photo-1544025162-d76538415491?w=600&q=85&auto=format&fit=crop',
  },
] as const;

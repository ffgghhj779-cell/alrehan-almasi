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

/** Official brand packaging assets — mapped by product type */
export const BRAND = {
  /** Bulk carton: 9× whole chilled bags 1300g (top-down real photo) */
  chilledCarton: '/assets/real/brand_chicken_chilled_carton.png',
  /** Whole chilled chicken promo (basket + ice) */
  chilledBasket: '/assets/real/brand_chicken_chilled_basket_ad.png',
  /** Single whole chicken retail bag 1300g */
  chilledBag: '/assets/real/brand_chicken_chilled_bag.png',
  /** Skinless boneless chicken breast bag ~1000g */
  breastFrozen: '/assets/real/brand_chicken_breast_frozen.png',
  /** Bulk 5kg frozen bags in transport crate */
  frozenCrate: '/assets/real/brand_chicken_frozen_crate.png',
  /** Frozen thighs/drumsticks — realistic bag photo */
  frozenThighs: '/assets/real/chicken_thighs_bag_real.png',
  /** Shipping carton + retail bag (official packaging set) */
  packagingSet: '/assets/real/brand_packaging_box_bag.png',
  /** Supermarket shelf display */
  supermarketShelf: '/assets/real/brand_supermarket_shelf.png',
  /** Fresh table eggs — 4 pack sizes */
  eggs6: '/assets/real/eggs_pack_6.png',
  eggs15: '/assets/real/eggs_pack_15.png',
  eggs30Large: '/assets/real/eggs_pack_30_large.png',
  eggs30Medium: '/assets/real/eggs_pack_30_medium.png',
  /** Category cover: clear 15-egg pack (no yellow trays) */
  eggs: '/assets/real/eggs_pack_15.png',
  /** Breaded chicken strips / manufactured */
  strips: '/assets/real/chicken_strips_fakieh.png',
  stripsClear: '/assets/real/chicken_strips_clear.png',
  /** Marinated chilled shawarma vacuum bag */
  rawShawarma: '/assets/real/raw_shawarma_bag.png',
  /** New catalog — fresh cuts / marinated / offal / manufactured */
  cutBreastBone: '/assets/real/catalog/cut_breast_bone_tray.png',
  cutBreastBoneless: '/assets/real/catalog/cut_breast_boneless_tray.png',
  cutThighsBoneless: '/assets/real/catalog/cut_thighs_boneless_tray.png',
  cutMixed: '/assets/real/catalog/cut_mixed_tray.png',
  cutWings: '/assets/real/catalog/cut_wings_tray.png',
  cutLegs: '/assets/real/catalog/cut_legs_tray.png',
  cutDrumsticks: '/assets/real/catalog/cut_drumsticks_tray.png',
  cutWholeTriple: '/assets/real/catalog/cut_whole_triple_tray.png',
  freshWholeBag1kg: '/assets/real/catalog/fresh_whole_bag_1kg.png',
  offalLiver: '/assets/real/catalog/offal_liver_tray.png',
  offalHearts: '/assets/real/catalog/offal_hearts_tray.png',
  offalMinced: '/assets/real/catalog/offal_minced_tray.png',
  marinatedOmega3: '/assets/real/catalog/marinated_omega3_tray.png',
  marinatedShaqra: '/assets/real/catalog/marinated_shaqra_tray.png',
  marinatedButter: '/assets/real/catalog/marinated_butter_tray.png',
  marinatedBbq: '/assets/real/catalog/marinated_bbq_tray.png',
  mfgNuggets: '/assets/real/catalog/mfg_nuggets_bag.png',
  mfgFillet: '/assets/real/catalog/mfg_fillet_bag.png',
  mfgTenderloin: '/assets/real/catalog/mfg_tenderloin_bag.png',
  mfgStripsKorean: '/assets/real/catalog/mfg_strips_korean_bag.png',
} as const;

/** Gallery — branded product photography */
export const GALLERY_IMAGES = [
  {
    src: BRAND.chilledCarton,
    label: 'دجاج مبرد كامل 1300g',
    alt: 'كرتون جملة دجاج مبرد معبأ — 9 حبات × 1300 جرام',
    href: '/products?category=دجاج مبرد',
  },
  {
    src: BRAND.cutMixed,
    label: 'مقطعات طازجة',
    alt: 'صينية قطع دجاج مشكلة طازجة',
    href: '/products?category=مقطعات طازجة',
  },
  {
    src: BRAND.marinatedBbq,
    label: 'دجاج متبّل BBQ',
    alt: 'صينية دجاج شوي متبّل',
    href: '/products?category=دجاج متبّل',
  },
  {
    src: BRAND.mfgNuggets,
    label: 'مصنعات الدجاج',
    alt: 'كيس ناجتس دجاج مجمدة',
    href: '/products?category=مصنعات الدجاج',
  },
  {
    src: BRAND.eggs15,
    label: 'بيض أبيض كبير 15',
    alt: 'علبة شفافة بيض أبيض كبير 15 بيضة',
    href: '/products?category=بيض',
  },
] as const;

/** Canonical image per SKU — image must match product name & pack */
export const SKU_IMAGES: Record<string, string> = {
  // Chilled whole chicken
  'ARA-CHK-001': BRAND.chilledCarton,
  'ARA-CHK-002': BRAND.chilledBag,
  'ARA-CHK-003': BRAND.chilledBasket,
  // Frozen chicken
  'ARA-FRZ-001': BRAND.frozenCrate,
  'ARA-FRZ-002': BRAND.breastFrozen,
  'ARA-FRZ-003': BRAND.frozenThighs,
  'ARA-FRZ-004': BRAND.frozenCrate,
  // Shawarma
  'ARA-SHW-001': BRAND.rawShawarma,
  'ARA-SHW-002': BRAND.rawShawarma,
  // Manufactured / strips
  'ARA-MNF-001': BRAND.strips,
  'ARA-MNF-002': BRAND.stripsClear,
  'ARA-NUG-001': BRAND.strips,
  // Eggs — 4 pack sizes
  'ARA-EGG-001': BRAND.eggs6,
  'ARA-EGG-002': BRAND.eggs15,
  'ARA-EGG-003': BRAND.eggs30Large,
  'ARA-EGG-004': BRAND.eggs30Medium,
  // Fresh cuts
  'ARA-CUT-001': BRAND.cutWings,
  'ARA-CUT-002': BRAND.offalLiver,
  'ARA-CUT-003': BRAND.offalMinced,
  'ARA-CUT-004': BRAND.cutBreastBone,
  'ARA-CUT-005': BRAND.cutBreastBoneless,
  'ARA-CUT-006': BRAND.cutThighsBoneless,
  'ARA-CUT-007': BRAND.cutLegs,
  'ARA-CUT-008': BRAND.cutDrumsticks,
  'ARA-CUT-009': BRAND.cutMixed,
  'ARA-CUT-010': BRAND.cutWholeTriple,
  'ARA-CHK-004': BRAND.freshWholeBag1kg,
  // Offal
  'ARA-OFL-001': BRAND.offalLiver,
  'ARA-OFL-002': BRAND.offalHearts,
  'ARA-OFL-003': BRAND.offalMinced,
  // Marinated
  'ARA-MAR-001': BRAND.marinatedOmega3,
  'ARA-MAR-002': BRAND.marinatedShaqra,
  'ARA-MAR-003': BRAND.marinatedButter,
  'ARA-MAR-004': BRAND.marinatedBbq,
  'ARA-BBQ-001': BRAND.marinatedBbq,
  'ARA-BBQ-002': BRAND.marinatedButter,
  // Extra manufactured
  'ARA-NUG-002': BRAND.mfgNuggets,
  'ARA-MNF-003': BRAND.mfgFillet,
  'ARA-MNF-004': BRAND.mfgTenderloin,
  'ARA-MNF-005': BRAND.mfgStripsKorean,
  'ARA-SAL-001': buildImageUrl(PHOTOS.salmon),
  'ARA-FSH-002': buildImageUrl(PHOTOS.fish, { crop: 'center' }),
  'ARA-SHR-001': buildImageUrl(PHOTOS.shrimp),
  'ARA-RIC-001': buildImageUrl(PHOTOS.rice),
  'ARA-OIL-001': buildImageUrl(PHOTOS.oil),
  'ARA-DAI-001': buildImageUrl(PHOTOS.milk),
};

/** Category cover images — each cover must match the category product type */
export const CATEGORY_IMAGES: Record<string, string> = {
  'دجاج مبرد': BRAND.chilledCarton,
  'دجاج مجمد': BRAND.frozenCrate,
  'مقطعات طازجة': BRAND.cutMixed,
  'دجاج متبّل': BRAND.marinatedBbq,
  'شاورما مبردة': BRAND.rawShawarma,
  'مصنعات الدجاج': BRAND.mfgNuggets,
  'كبدة وقلوب ومفروم': BRAND.offalLiver,
  'بيض': BRAND.eggs15,
  // Legacy
  'مقطعات الدجاج': BRAND.cutMixed,
  'الشواء والتبخير': BRAND.marinatedBbq,
  'الأسماك الطازجة': buildImageUrl(PHOTOS.fish),
  'الدواجن الطازجة': BRAND.chilledCarton,
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
    name: 'دجاج مبرد',
    subtitle: 'دجاج كامل مبرد 1300g',
    image: BRAND.chilledCarton,
  },
  {
    name: 'دجاج مجمد',
    subtitle: 'كامل · صدور · أفخاذ',
    image: BRAND.frozenCrate,
  },
  {
    name: 'مقطعات طازجة',
    subtitle: 'صدور · أفخاذ · أجنحة · سيقان',
    image: BRAND.cutMixed,
  },
  {
    name: 'دجاج متبّل',
    subtitle: 'شقرى · زبدة · BBQ · أوميغا 3',
    image: BRAND.marinatedBbq,
  },
  {
    name: 'شاورما مبردة',
    subtitle: 'شاورما طازجة جاهزة',
    image: BRAND.rawShawarma,
  },
  {
    name: 'مصنعات الدجاج',
    subtitle: 'ناجتس · استربس · فيليه',
    image: BRAND.mfgNuggets,
  },
  {
    name: 'كبدة وقلوب ومفروم',
    subtitle: 'كبدة · قلوب · مفروم طازج',
    image: BRAND.offalLiver,
  },
  {
    name: 'بيض',
    subtitle: '4 أصناف — 6 · 15 · 30 بيضة',
    image: BRAND.eggs15,
  },
] as const;

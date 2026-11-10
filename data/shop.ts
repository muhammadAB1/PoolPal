import { shopImages } from '@/constants/images';
import type { ImageSourcePropType } from 'react-native';

/**
 * Hardcoded shop catalog.
 * Visible copy is a key into data/translations.ts. Screens call t(key).
 */

export type ShopCategoryId =
  | 'test-kits'
  | 'balancers'
  | 'sanitizers'
  | 'cleaners'
  | 'pumps'
  | 'filters';

/** photo = full-bleed picture (cover). studio = product on white (contain). */
export type ProductImageStyle = 'photo' | 'studio';

export type ShopCategory = {
  id: ShopCategoryId;
  /** Key in data/translations.ts */
  nameKey: string;
  image: ImageSourcePropType;
  imageStyle: ProductImageStyle;
  tone: 'aqua' | 'mint';
};

export type ProductSpec = {
  labelKey: string;
  valueKey: string;
};

export type Product = {
  id: string;
  categoryId: ShopCategoryId;
  /** Keys in data/translations.ts. Brand stays a proper name. */
  nameKey: string;
  brand: string;
  taglineKey: string;
  descriptionKey: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: ImageSourcePropType;
  imageStyle: ProductImageStyle;
  /** Short note explaining why this suits the homeowner's pool. */
  fitNoteKey: string;
  /** When set, the product appears in "Customized for you" with this badge. */
  forYouKey?: string;
  specs: ProductSpec[];
};

export const SHOP_CATEGORIES: ShopCategory[] = [
  { id: 'test-kits', nameKey: 'shop.categories.testKits', image: shopImages.aquachek, imageStyle: 'studio', tone: 'aqua' },
  { id: 'balancers', nameKey: 'shop.categories.balancers', image: shopImages.ph, imageStyle: 'studio', tone: 'mint' },
  { id: 'sanitizers', nameKey: 'shop.categories.sanitizers', image: shopImages.chlorine, imageStyle: 'studio', tone: 'mint' },
  { id: 'cleaners', nameKey: 'shop.categories.cleaners', image: shopImages.robotic, imageStyle: 'photo', tone: 'aqua' },
  { id: 'pumps', nameKey: 'shop.categories.pumps', image: shopImages.variablePump, imageStyle: 'studio', tone: 'aqua' },
  { id: 'filters', nameKey: 'shop.categories.filters', image: shopImages.cartridgeFilter, imageStyle: 'studio', tone: 'mint' },
];

export const PRODUCTS: Product[] = [
  // ─── Cleaners ─────────────────────────────────────────────────────────────
  {
    id: 'robotic-cleaner',
    categoryId: 'cleaners',
    nameKey: 'shop.items.roboticCleaner.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.roboticCleaner.tagline',
    descriptionKey: 'shop.items.roboticCleaner.description',
    price: 449,
    rating: 4.8,
    reviewCount: 2140,
    image: shopImages.robotic,
    imageStyle: 'photo',
    fitNoteKey: 'shop.items.roboticCleaner.fit',
    forYouKey: 'shop.items.roboticCleaner.forYou',
    specs: [
      { labelKey: 'shop.specs.cycleTime', valueKey: 'shop.values.twoHours' },
      { labelKey: 'shop.specs.cableLength', valueKey: 'shop.values.fiftyFt' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.inGroundPools' },
    ],
  },
  {
    id: 'pressure-cleaner',
    categoryId: 'cleaners',
    nameKey: 'shop.items.pressureCleaner.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.pressureCleaner.tagline',
    descriptionKey: 'shop.items.pressureCleaner.description',
    price: 329,
    rating: 4.6,
    reviewCount: 860,
    image: shopImages.pressureSide,
    imageStyle: 'photo',
    fitNoteKey: 'shop.items.pressureCleaner.fit',
    specs: [
      { labelKey: 'shop.specs.debrisBag', valueKey: 'shop.values.fineMesh' },
      { labelKey: 'shop.specs.hoseLength', valueKey: 'shop.values.thirtyTwoFt' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.leafyYards' },
    ],
  },
  {
    id: 'suction-cleaner',
    categoryId: 'cleaners',
    nameKey: 'shop.items.suctionCleaner.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.suctionCleaner.tagline',
    descriptionKey: 'shop.items.suctionCleaner.description',
    price: 189,
    rating: 4.4,
    reviewCount: 1320,
    image: shopImages.suctionSide,
    imageStyle: 'photo',
    fitNoteKey: 'shop.items.suctionCleaner.fit',
    specs: [
      { labelKey: 'shop.specs.connectsTo', valueKey: 'shop.values.skimmerPort' },
      { labelKey: 'shop.specs.hoseLength', valueKey: 'shop.values.fortyFt' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.everydayDirt' },
    ],
  },
  {
    id: 'manual-vacuum',
    categoryId: 'cleaners',
    nameKey: 'shop.items.manualVacuum.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.manualVacuum.tagline',
    descriptionKey: 'shop.items.manualVacuum.description',
    price: 69.99,
    rating: 4.5,
    reviewCount: 640,
    image: shopImages.manualVacuum,
    imageStyle: 'photo',
    fitNoteKey: 'shop.items.manualVacuum.fit',
    specs: [
      { labelKey: 'shop.specs.poleLength', valueKey: 'shop.values.fourFtTelescoping' },
      { labelKey: 'shop.specs.hoseLength', valueKey: 'shop.values.thirtyFt' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.spotCleaning' },
    ],
  },

  // ─── Test kits ────────────────────────────────────────────────────────────
  {
    id: 'aquachek-7',
    categoryId: 'test-kits',
    nameKey: 'shop.items.aquachek.name',
    brand: 'Hach',
    taglineKey: 'shop.items.aquachek.tagline',
    descriptionKey: 'shop.items.aquachek.description',
    price: 18.99,
    rating: 4.7,
    reviewCount: 3120,
    image: shopImages.aquachek,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.aquachek.fit',
    forYouKey: 'shop.items.aquachek.forYou',
    specs: [
      { labelKey: 'shop.specs.strips', valueKey: 'shop.values.strips100' },
      { labelKey: 'shop.specs.readings', valueKey: 'shop.values.sevenInOne' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.poolsAndSpas' },
    ],
  },
  {
    id: 'hth-6',
    categoryId: 'test-kits',
    nameKey: 'shop.items.hth.name',
    brand: 'HTH',
    taglineKey: 'shop.items.hth.tagline',
    descriptionKey: 'shop.items.hth.description',
    price: 14.49,
    rating: 4.5,
    reviewCount: 1890,
    image: shopImages.hth,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.hth.fit',
    specs: [
      { labelKey: 'shop.specs.strips', valueKey: 'shop.values.strips50' },
      { labelKey: 'shop.specs.readings', valueKey: 'shop.values.sixInOne' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.pools' },
    ],
  },
  {
    id: 'jnw-7',
    categoryId: 'test-kits',
    nameKey: 'shop.items.jnw.name',
    brand: 'JNW',
    taglineKey: 'shop.items.jnw.tagline',
    descriptionKey: 'shop.items.jnw.description',
    price: 12.99,
    rating: 4.6,
    reviewCount: 940,
    image: shopImages.jnw,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.jnw.fit',
    specs: [
      { labelKey: 'shop.specs.strips', valueKey: 'shop.values.strips100' },
      { labelKey: 'shop.specs.readings', valueKey: 'shop.values.sevenInOne' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.poolsAndSpas' },
    ],
  },
  {
    id: 'easytest-9',
    categoryId: 'test-kits',
    nameKey: 'shop.items.easytest.name',
    brand: 'EasyTest',
    taglineKey: 'shop.items.easytest.tagline',
    descriptionKey: 'shop.items.easytest.description',
    price: 16.99,
    rating: 4.4,
    reviewCount: 702,
    image: shopImages.easyTest,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.easytest.fit',
    specs: [
      { labelKey: 'shop.specs.strips', valueKey: 'shop.values.strips50' },
      { labelKey: 'shop.specs.readings', valueKey: 'shop.values.nineInOne' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.poolsAndSpas' },
    ],
  },

  // ─── Balancers ────────────────────────────────────────────────────────────
  {
    id: 'ph-decreaser',
    categoryId: 'balancers',
    nameKey: 'shop.items.phDecreaser.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.phDecreaser.tagline',
    descriptionKey: 'shop.items.phDecreaser.description',
    price: 12.99,
    rating: 4.7,
    reviewCount: 1780,
    image: shopImages.ph,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.phDecreaser.fit',
    forYouKey: 'shop.items.phDecreaser.forYou',
    specs: [
      { labelKey: 'shop.specs.size', valueKey: 'shop.values.fiveLb' },
      { labelKey: 'shop.specs.form', valueKey: 'shop.values.granular' },
      { labelKey: 'shop.specs.retestAfter', valueKey: 'shop.values.fourHours' },
    ],
  },
  {
    id: 'alkalinity-increaser',
    categoryId: 'balancers',
    nameKey: 'shop.items.alkalinity.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.alkalinity.tagline',
    descriptionKey: 'shop.items.alkalinity.description',
    price: 14.99,
    rating: 4.6,
    reviewCount: 1210,
    image: shopImages.alkalinity,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.alkalinity.fit',
    specs: [
      { labelKey: 'shop.specs.size', valueKey: 'shop.values.tenLb' },
      { labelKey: 'shop.specs.form', valueKey: 'shop.values.powder' },
      { labelKey: 'shop.specs.retestAfter', valueKey: 'shop.values.sixHours' },
    ],
  },
  {
    id: 'calcium-increaser',
    categoryId: 'balancers',
    nameKey: 'shop.items.calcium.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.calcium.tagline',
    descriptionKey: 'shop.items.calcium.description',
    price: 16.99,
    rating: 4.5,
    reviewCount: 530,
    image: shopImages.hardness,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.calcium.fit',
    specs: [
      { labelKey: 'shop.specs.size', valueKey: 'shop.values.tenLb' },
      { labelKey: 'shop.specs.form', valueKey: 'shop.values.flakes' },
      { labelKey: 'shop.specs.retestAfter', valueKey: 'shop.values.twentyFourHours' },
    ],
  },
  {
    id: 'phosphate-remover',
    categoryId: 'balancers',
    nameKey: 'shop.items.phosphate.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.phosphate.tagline',
    descriptionKey: 'shop.items.phosphate.description',
    price: 19.99,
    rating: 4.3,
    reviewCount: 410,
    image: shopImages.phosphates,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.phosphate.fit',
    specs: [
      { labelKey: 'shop.specs.size', valueKey: 'shop.values.thirtyTwoOz' },
      { labelKey: 'shop.specs.form', valueKey: 'shop.values.liquid' },
      { labelKey: 'shop.specs.treats', valueKey: 'shop.values.upToFifteenThousandGal' },
    ],
  },

  // ─── Sanitizers ───────────────────────────────────────────────────────────
  {
    id: 'chlorine-tablets',
    categoryId: 'sanitizers',
    nameKey: 'shop.items.chlorineTablets.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.chlorineTablets.tagline',
    descriptionKey: 'shop.items.chlorineTablets.description',
    price: 49.99,
    rating: 4.8,
    reviewCount: 2760,
    image: shopImages.chlorine,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.chlorineTablets.fit',
    specs: [
      { labelKey: 'shop.specs.size', valueKey: 'shop.values.eightLbBucket' },
      { labelKey: 'shop.specs.form', valueKey: 'shop.values.threeInchTablets' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.chlorinePools' },
    ],
  },
  {
    id: 'pool-salt',
    categoryId: 'sanitizers',
    nameKey: 'shop.items.poolSalt.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.poolSalt.tagline',
    descriptionKey: 'shop.items.poolSalt.description',
    price: 8.99,
    rating: 4.9,
    reviewCount: 3480,
    image: shopImages.salt,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.poolSalt.fit',
    forYouKey: 'shop.items.poolSalt.forYou',
    specs: [
      { labelKey: 'shop.specs.size', valueKey: 'shop.values.fortyLbBag' },
      { labelKey: 'shop.specs.purity', valueKey: 'shop.values.sodiumChloride' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.saltwaterPools' },
    ],
  },
  {
    id: 'chlorine-stabilizer',
    categoryId: 'sanitizers',
    nameKey: 'shop.items.stabilizer.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.stabilizer.tagline',
    descriptionKey: 'shop.items.stabilizer.description',
    price: 17.99,
    rating: 4.6,
    reviewCount: 980,
    image: shopImages.stabilizer,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.stabilizer.fit',
    specs: [
      { labelKey: 'shop.specs.size', valueKey: 'shop.values.fourLb' },
      { labelKey: 'shop.specs.form', valueKey: 'shop.values.granular' },
      { labelKey: 'shop.specs.alsoCalled', valueKey: 'shop.values.cyanuricAcid' },
    ],
  },
  {
    id: 'bromine-tablets',
    categoryId: 'sanitizers',
    nameKey: 'shop.items.bromine.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.bromine.tagline',
    descriptionKey: 'shop.items.bromine.description',
    price: 34.99,
    rating: 4.5,
    reviewCount: 760,
    image: shopImages.bromine,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.bromine.fit',
    specs: [
      { labelKey: 'shop.specs.size', valueKey: 'shop.values.fourLb' },
      { labelKey: 'shop.specs.form', valueKey: 'shop.values.oneInchTablets' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.spasAndHotTubs' },
    ],
  },

  // ─── Pumps ────────────────────────────────────────────────────────────────
  {
    id: 'variable-pump',
    categoryId: 'pumps',
    nameKey: 'shop.items.variablePump.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.variablePump.tagline',
    descriptionKey: 'shop.items.variablePump.description',
    price: 899,
    rating: 4.8,
    reviewCount: 1560,
    image: shopImages.variablePump,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.variablePump.fit',
    forYouKey: 'shop.items.variablePump.forYou',
    specs: [
      { labelKey: 'shop.specs.power', valueKey: 'shop.values.onePointFiveHp' },
      { labelKey: 'shop.specs.speeds', valueKey: 'shop.values.variableProgrammable' },
      { labelKey: 'shop.specs.noise', valueKey: 'shop.values.whisperQuiet' },
    ],
  },
  {
    id: 'dual-pump',
    categoryId: 'pumps',
    nameKey: 'shop.items.dualPump.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.dualPump.tagline',
    descriptionKey: 'shop.items.dualPump.description',
    price: 549,
    rating: 4.5,
    reviewCount: 720,
    image: shopImages.dualPump,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.dualPump.fit',
    specs: [
      { labelKey: 'shop.specs.power', valueKey: 'shop.values.onePointFiveHp' },
      { labelKey: 'shop.specs.speeds', valueKey: 'shop.values.lowAndHigh' },
      { labelKey: 'shop.specs.noise', valueKey: 'shop.values.moderate' },
    ],
  },
  {
    id: 'single-pump',
    categoryId: 'pumps',
    nameKey: 'shop.items.singlePump.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.singlePump.tagline',
    descriptionKey: 'shop.items.singlePump.description',
    price: 349,
    rating: 4.3,
    reviewCount: 980,
    image: shopImages.singlePump,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.singlePump.fit',
    specs: [
      { labelKey: 'shop.specs.power', valueKey: 'shop.values.onePointFiveHp' },
      { labelKey: 'shop.specs.speeds', valueKey: 'shop.values.singleSpeed' },
      { labelKey: 'shop.specs.noise', valueKey: 'shop.values.standardNoise' },
    ],
  },

  // ─── Filters ──────────────────────────────────────────────────────────────
  {
    id: 'cartridge-filter',
    categoryId: 'filters',
    nameKey: 'shop.items.cartridgeFilter.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.cartridgeFilter.tagline',
    descriptionKey: 'shop.items.cartridgeFilter.description',
    price: 399,
    rating: 4.7,
    reviewCount: 1090,
    image: shopImages.cartridgeFilter,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.cartridgeFilter.fit',
    specs: [
      { labelKey: 'shop.specs.cleaning', valueKey: 'shop.values.hoseRinse' },
      { labelKey: 'shop.specs.filtersTo', valueKey: 'shop.values.tenMicrons' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.lowUpkeep' },
    ],
  },
  {
    id: 'sand-filter',
    categoryId: 'filters',
    nameKey: 'shop.items.sandFilter.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.sandFilter.tagline',
    descriptionKey: 'shop.items.sandFilter.description',
    price: 469,
    rating: 4.5,
    reviewCount: 830,
    image: shopImages.sandFilter,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.sandFilter.fit',
    specs: [
      { labelKey: 'shop.specs.cleaning', valueKey: 'shop.values.backwash' },
      { labelKey: 'shop.specs.filtersTo', valueKey: 'shop.values.twentyToFortyMicrons' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.everydayPools' },
    ],
  },
  {
    id: 'de-filter',
    categoryId: 'filters',
    nameKey: 'shop.items.deFilter.name',
    brand: 'PoolTonic',
    taglineKey: 'shop.items.deFilter.tagline',
    descriptionKey: 'shop.items.deFilter.description',
    price: 689,
    rating: 4.6,
    reviewCount: 410,
    image: shopImages.deFilter,
    imageStyle: 'studio',
    fitNoteKey: 'shop.items.deFilter.fit',
    specs: [
      { labelKey: 'shop.specs.cleaning', valueKey: 'shop.values.backwashAndRecharge' },
      { labelKey: 'shop.specs.filtersTo', valueKey: 'shop.values.twoToFiveMicrons' },
      { labelKey: 'shop.specs.bestFor', valueKey: 'shop.values.crystalClearWater' },
    ],
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((product) => product.forYouKey);

export function getCategory(id: string | undefined): ShopCategory | undefined {
  return SHOP_CATEGORIES.find((category) => category.id === id);
}

export function getProduct(id: string | undefined): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductsByCategory(categoryId: ShopCategoryId): Product[] {
  return PRODUCTS.filter((product) => product.categoryId === categoryId);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatReviewCount(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
}

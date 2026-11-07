import { shopImages } from '@/constants/images';
import type { ImageSourcePropType } from 'react-native';

/**
 * Hardcoded shop catalog (UI-only version).
 * No API, no database, no translations yet. Copy lives here so the screens
 * stay thin and the catalog is easy to swap for real data later.
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
  name: string;
  image: ImageSourcePropType;
  imageStyle: ProductImageStyle;
  tone: 'aqua' | 'mint';
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  categoryId: ShopCategoryId;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: ImageSourcePropType;
  imageStyle: ProductImageStyle;
  /** Short note explaining why this suits the homeowner's pool. */
  fitNote: string;
  /** When set, the product appears in "Customized for you" with this badge. */
  forYou?: string;
  specs: ProductSpec[];
};

export const SHOP_CATEGORIES: ShopCategory[] = [
  { id: 'test-kits', name: 'Test Kits', image: shopImages.aquachek, imageStyle: 'studio', tone: 'aqua' },
  { id: 'balancers', name: 'Balancers', image: shopImages.ph, imageStyle: 'studio', tone: 'mint' },
  { id: 'sanitizers', name: 'Sanitizers', image: shopImages.chlorine, imageStyle: 'studio', tone: 'mint' },
  { id: 'cleaners', name: 'Cleaners', image: shopImages.robotic, imageStyle: 'photo', tone: 'aqua' },
  { id: 'pumps', name: 'Pumps', image: shopImages.variablePump, imageStyle: 'studio', tone: 'aqua' },
  { id: 'filters', name: 'Filters', image: shopImages.cartridgeFilter, imageStyle: 'studio', tone: 'mint' },
];

export const PRODUCTS: Product[] = [
  // ─── Cleaners ─────────────────────────────────────────────────────────────
  {
    id: 'robotic-cleaner',
    categoryId: 'cleaners',
    name: 'Robotic Pool Cleaner',
    brand: 'PoolTonic',
    tagline: 'Set it, forget it, swim.',
    description:
      'Scrubs the floor and walls on its own while your pump takes a break. Empty the easy-clean basket and you are done.',
    price: 449,
    rating: 4.8,
    reviewCount: 2140,
    image: shopImages.robotic,
    imageStyle: 'photo',
    fitNote: 'A great match if you want less weekly vacuuming and cleaner water between tests.',
    forYou: 'Fits your cleaning setup',
    specs: [
      { label: 'Cycle time', value: '2 hours' },
      { label: 'Cable length', value: '50 ft' },
      { label: 'Best for', value: 'In-ground pools' },
    ],
  },
  {
    id: 'pressure-cleaner',
    categoryId: 'cleaners',
    name: 'Pressure-Side Cleaner',
    brand: 'PoolTonic',
    tagline: 'Powered by your return line.',
    description:
      'Uses your pool\u2019s own water pressure to sweep debris into a fine mesh bag, so your filter stays cleaner for longer.',
    price: 329,
    rating: 4.6,
    reviewCount: 860,
    image: shopImages.pressureSide,
    imageStyle: 'photo',
    fitNote: 'Handles leaves and larger debris well, ideal for pools under trees.',
    specs: [
      { label: 'Debris bag', value: 'Fine mesh' },
      { label: 'Hose length', value: '32 ft' },
      { label: 'Best for', value: 'Leafy yards' },
    ],
  },
  {
    id: 'suction-cleaner',
    categoryId: 'cleaners',
    name: 'Suction-Side Cleaner',
    brand: 'PoolTonic',
    tagline: 'Simple, affordable daily cleaning.',
    description:
      'Connects to your skimmer and glides across the pool floor, pulling dirt straight into your existing filter.',
    price: 189,
    rating: 4.4,
    reviewCount: 1320,
    image: shopImages.suctionSide,
    imageStyle: 'photo',
    fitNote: 'An easy upgrade if you vacuum by hand today and want to automate it.',
    specs: [
      { label: 'Connects to', value: 'Skimmer port' },
      { label: 'Hose length', value: '40 ft' },
      { label: 'Best for', value: 'Everyday dirt' },
    ],
  },
  {
    id: 'manual-vacuum',
    categoryId: 'cleaners',
    name: 'Manual Vacuum Kit',
    brand: 'PoolTonic',
    tagline: 'Full control for detail work.',
    description:
      'A head, pole and hose in one kit. Perfect for spot cleaning steps, corners and the spots automatic cleaners miss.',
    price: 69.99,
    rating: 4.5,
    reviewCount: 640,
    image: shopImages.manualVacuum,
    imageStyle: 'photo',
    fitNote: 'Keeps your weekly clean-up quick, whatever cleaner you already use.',
    specs: [
      { label: 'Pole length', value: '4 ft telescoping' },
      { label: 'Hose length', value: '30 ft' },
      { label: 'Best for', value: 'Spot cleaning' },
    ],
  },

  // ─── Test kits ────────────────────────────────────────────────────────────
  {
    id: 'aquachek-7',
    categoryId: 'test-kits',
    name: 'AquaChek 7-Way Test Strips',
    brand: 'Hach',
    tagline: 'Seven readings in about 15 seconds.',
    description:
      'Dip, wait, and match the colors on the bottle. One strip checks the numbers that matter most for safe, clear water.',
    price: 18.99,
    rating: 4.7,
    reviewCount: 3120,
    image: shopImages.aquachek,
    imageStyle: 'studio',
    fitNote: 'Your weekly water check. Results from these strips go straight into your PoolPal readings.',
    forYou: 'Your weekly water test',
    specs: [
      { label: 'Strips per bottle', value: '100' },
      { label: 'Readings', value: '7 in 1' },
      { label: 'Best for', value: 'Pools and spas' },
    ],
  },
  {
    id: 'hth-6',
    categoryId: 'test-kits',
    name: 'HTH 6-Way Test Strips',
    brand: 'HTH',
    tagline: 'Six key readings, no guesswork.',
    description:
      'A budget-friendly strip for quick weekly checks. Covers chlorine, pH, alkalinity, hardness and stabilizer.',
    price: 14.49,
    rating: 4.5,
    reviewCount: 1890,
    image: shopImages.hth,
    imageStyle: 'studio',
    fitNote: 'A simple, low-cost way to stay on top of your weekly checks.',
    specs: [
      { label: 'Strips per bottle', value: '50' },
      { label: 'Readings', value: '6 in 1' },
      { label: 'Best for', value: 'Pools' },
    ],
  },
  {
    id: 'jnw-7',
    categoryId: 'test-kits',
    name: 'JNW 7-in-1 Pool & Spa Strips',
    brand: 'JNW',
    tagline: 'Big, clear color chart.',
    description:
      'Seven readings on every strip with a color chart that is easy to read in bright sun or in the shade.',
    price: 12.99,
    rating: 4.6,
    reviewCount: 940,
    image: shopImages.jnw,
    imageStyle: 'studio',
    fitNote: 'Works for both your pool and a spa, so one bottle covers everything.',
    specs: [
      { label: 'Strips per bottle', value: '100' },
      { label: 'Readings', value: '7 in 1' },
      { label: 'Best for', value: 'Pools and spas' },
    ],
  },
  {
    id: 'easytest-9',
    categoryId: 'test-kits',
    name: 'EasyTest 9-in-1 Strips',
    brand: 'EasyTest',
    tagline: 'Nine readings, fuller picture.',
    description:
      'Goes beyond the basics with extra readings, so you can spot slow-building problems before they turn visible.',
    price: 16.99,
    rating: 4.4,
    reviewCount: 702,
    image: shopImages.easyTest,
    imageStyle: 'studio',
    fitNote: 'Useful when your water looks fine but something feels off.',
    specs: [
      { label: 'Strips per bottle', value: '50' },
      { label: 'Readings', value: '9 in 1' },
      { label: 'Best for', value: 'Pools and spas' },
    ],
  },

  // ─── Balancers ────────────────────────────────────────────────────────────
  {
    id: 'ph-decreaser',
    categoryId: 'balancers',
    name: 'pH Decreaser, 5 lb',
    brand: 'PoolTonic',
    tagline: 'Brings a high pH back down.',
    description:
      'Add small doses with the pump running, then retest after a few hours. Keeps chlorine working at full strength.',
    price: 12.99,
    rating: 4.7,
    reviewCount: 1780,
    image: shopImages.ph,
    imageStyle: 'studio',
    fitNote: 'Keeps your pH in the ideal range so your sanitizer does its job.',
    forYou: 'Keeps your pH in range',
    specs: [
      { label: 'Size', value: '5 lb' },
      { label: 'Form', value: 'Granular' },
      { label: 'Retest after', value: '4 hours' },
    ],
  },
  {
    id: 'alkalinity-increaser',
    categoryId: 'balancers',
    name: 'Alkalinity Increaser, 10 lb',
    brand: 'PoolTonic',
    tagline: 'Steadies wild pH swings.',
    description:
      'Raises total alkalinity so your pH stays put. The first fix to try when numbers keep bouncing around.',
    price: 14.99,
    rating: 4.6,
    reviewCount: 1210,
    image: shopImages.alkalinity,
    imageStyle: 'studio',
    fitNote: 'A pool basic, handy to keep on the shelf for after heavy rain.',
    specs: [
      { label: 'Size', value: '10 lb' },
      { label: 'Form', value: 'Powder' },
      { label: 'Retest after', value: '6 hours' },
    ],
  },
  {
    id: 'calcium-increaser',
    categoryId: 'balancers',
    name: 'Calcium Hardness Increaser, 10 lb',
    brand: 'PoolTonic',
    tagline: 'Protects surfaces and equipment.',
    description:
      'Brings soft water up to a healthy level so it stops pulling minerals from your plaster and heater.',
    price: 16.99,
    rating: 4.5,
    reviewCount: 530,
    image: shopImages.hardness,
    imageStyle: 'studio',
    fitNote: 'Helps protect your pool surface from etching and rough patches.',
    specs: [
      { label: 'Size', value: '10 lb' },
      { label: 'Form', value: 'Flakes' },
      { label: 'Retest after', value: '24 hours' },
    ],
  },
  {
    id: 'phosphate-remover',
    categoryId: 'balancers',
    name: 'Phosphate Remover, 32 oz',
    brand: 'PoolTonic',
    tagline: 'Starves algae before it blooms.',
    description:
      'Removes the phosphates algae feed on, which makes green water far less likely during hot weeks.',
    price: 19.99,
    rating: 4.3,
    reviewCount: 410,
    image: shopImages.phosphates,
    imageStyle: 'studio',
    fitNote: 'Smart prevention if your pool sits in the sun or near trees.',
    specs: [
      { label: 'Size', value: '32 oz' },
      { label: 'Form', value: 'Liquid' },
      { label: 'Treats', value: 'Up to 15,000 gal' },
    ],
  },

  // ─── Sanitizers ───────────────────────────────────────────────────────────
  {
    id: 'chlorine-tablets',
    categoryId: 'sanitizers',
    name: '3-Inch Chlorine Tablets, 8 lb',
    brand: 'PoolTonic',
    tagline: 'Steady, slow-dissolving chlorine.',
    description:
      'Drop them into a floating dispenser or feeder and keep a steady chlorine level all week with almost no effort.',
    price: 49.99,
    rating: 4.8,
    reviewCount: 2760,
    image: shopImages.chlorine,
    imageStyle: 'studio',
    fitNote: 'The easiest way to keep chlorine steady between your weekly tests.',
    specs: [
      { label: 'Size', value: '8 lb bucket' },
      { label: 'Form', value: '3-inch tablets' },
      { label: 'Best for', value: 'Chlorine pools' },
    ],
  },
  {
    id: 'pool-salt',
    categoryId: 'sanitizers',
    name: 'Pool Salt, 40 lb',
    brand: 'PoolTonic',
    tagline: 'Pure salt for saltwater pools.',
    description:
      'High-purity salt that dissolves clean and keeps your salt system producing chlorine without cloudy residue.',
    price: 8.99,
    rating: 4.9,
    reviewCount: 3480,
    image: shopImages.salt,
    imageStyle: 'studio',
    fitNote: 'Made for salt systems. Top up whenever your salt reading dips.',
    forYou: 'For saltwater pools',
    specs: [
      { label: 'Size', value: '40 lb bag' },
      { label: 'Purity', value: '99.8% sodium chloride' },
      { label: 'Best for', value: 'Saltwater pools' },
    ],
  },
  {
    id: 'chlorine-stabilizer',
    categoryId: 'sanitizers',
    name: 'Chlorine Stabilizer, 4 lb',
    brand: 'PoolTonic',
    tagline: 'Shields chlorine from the sun.',
    description:
      'Stops sunlight from burning off your chlorine so you use less of it and your water stays protected.',
    price: 17.99,
    rating: 4.6,
    reviewCount: 980,
    image: shopImages.stabilizer,
    imageStyle: 'studio',
    fitNote: 'Especially useful for outdoor pools that get full sun.',
    specs: [
      { label: 'Size', value: '4 lb' },
      { label: 'Form', value: 'Granular' },
      { label: 'Also called', value: 'Cyanuric acid' },
    ],
  },
  {
    id: 'bromine-tablets',
    categoryId: 'sanitizers',
    name: 'Bromine Tablets, 4 lb',
    brand: 'PoolTonic',
    tagline: 'Gentle sanitizer for spas.',
    description:
      'Works well in warm water and has a softer smell than chlorine, which makes it a favorite for hot tubs.',
    price: 34.99,
    rating: 4.5,
    reviewCount: 760,
    image: shopImages.bromine,
    imageStyle: 'studio',
    fitNote: 'A good choice if you keep a spa or hot tub.',
    specs: [
      { label: 'Size', value: '4 lb' },
      { label: 'Form', value: '1-inch tablets' },
      { label: 'Best for', value: 'Spas and hot tubs' },
    ],
  },

  // ─── Pumps ────────────────────────────────────────────────────────────────
  {
    id: 'variable-pump',
    categoryId: 'pumps',
    name: 'Variable-Speed Pump',
    brand: 'PoolTonic',
    tagline: 'Quiet, and far cheaper to run.',
    description:
      'Run it slow and long for a fraction of the energy of an old single-speed pump. Program it once and forget it.',
    price: 899,
    rating: 4.8,
    reviewCount: 1560,
    image: shopImages.variablePump,
    imageStyle: 'studio',
    fitNote: 'Cuts energy costs, and slower circulation is gentler on your filter.',
    forYou: 'Cuts your energy costs',
    specs: [
      { label: 'Power', value: '1.5 HP' },
      { label: 'Speeds', value: 'Variable, programmable' },
      { label: 'Noise', value: 'Whisper quiet' },
    ],
  },
  {
    id: 'dual-pump',
    categoryId: 'pumps',
    name: 'Dual-Speed Pump',
    brand: 'PoolTonic',
    tagline: 'Two speeds, real savings.',
    description:
      'Switch to low speed for daily circulation and high speed for cleaning or heating. A solid middle ground.',
    price: 549,
    rating: 4.5,
    reviewCount: 720,
    image: shopImages.dualPump,
    imageStyle: 'studio',
    fitNote: 'A budget-friendly upgrade from an older single-speed pump.',
    specs: [
      { label: 'Power', value: '1.5 HP' },
      { label: 'Speeds', value: 'Low and high' },
      { label: 'Noise', value: 'Moderate' },
    ],
  },
  {
    id: 'single-pump',
    categoryId: 'pumps',
    name: 'Single-Speed Pump',
    brand: 'PoolTonic',
    tagline: 'Reliable, simple, proven.',
    description:
      'A straightforward replacement pump that gets the job done. Easy to install and easy to find parts for.',
    price: 349,
    rating: 4.3,
    reviewCount: 980,
    image: shopImages.singlePump,
    imageStyle: 'studio',
    fitNote: 'The simplest like-for-like swap if your pump has stopped working.',
    specs: [
      { label: 'Power', value: '1.5 HP' },
      { label: 'Speeds', value: 'Single' },
      { label: 'Noise', value: 'Standard' },
    ],
  },

  // ─── Filters ──────────────────────────────────────────────────────────────
  {
    id: 'cartridge-filter',
    categoryId: 'filters',
    name: 'Cartridge Filter',
    brand: 'PoolTonic',
    tagline: 'Fine filtering, easy rinse.',
    description:
      'Traps small particles and rinses clean with a garden hose. No backwashing and far less water wasted.',
    price: 399,
    rating: 4.7,
    reviewCount: 1090,
    image: shopImages.cartridgeFilter,
    imageStyle: 'studio',
    fitNote: 'Easy to maintain and gentle on your water bill.',
    specs: [
      { label: 'Cleaning', value: 'Hose rinse' },
      { label: 'Filters to', value: '10 microns' },
      { label: 'Best for', value: 'Low upkeep' },
    ],
  },
  {
    id: 'sand-filter',
    categoryId: 'filters',
    name: 'Sand Filter',
    brand: 'PoolTonic',
    tagline: 'A low-maintenance workhorse.',
    description:
      'A familiar, forgiving design that keeps water clear for years. Backwash it when the pressure gauge climbs.',
    price: 469,
    rating: 4.5,
    reviewCount: 830,
    image: shopImages.sandFilter,
    imageStyle: 'studio',
    fitNote: 'Dependable if you like a simple filter you rarely have to think about.',
    specs: [
      { label: 'Cleaning', value: 'Backwash' },
      { label: 'Filters to', value: '20 to 40 microns' },
      { label: 'Best for', value: 'Everyday pools' },
    ],
  },
  {
    id: 'de-filter',
    categoryId: 'filters',
    name: 'DE Filter',
    brand: 'PoolTonic',
    tagline: 'The finest filtration available.',
    description:
      'Catches the tiniest particles for sparkling water. Needs diatomaceous earth recharged after each backwash.',
    price: 689,
    rating: 4.6,
    reviewCount: 410,
    image: shopImages.deFilter,
    imageStyle: 'studio',
    fitNote: 'For the clearest water, if you do not mind a little extra upkeep.',
    specs: [
      { label: 'Cleaning', value: 'Backwash and recharge' },
      { label: 'Filters to', value: '2 to 5 microns' },
      { label: 'Best for', value: 'Crystal-clear water' },
    ],
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((product) => product.forYou);

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

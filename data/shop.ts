import { productImages, shopImages } from '@/constants/images';
import type { ImageSourcePropType } from 'react-native';
import shopItems from '@/data/shopItems';

/**
 * Shop catalog.
 *
 * Real fields come from data/shopItems.ts (name, brand, category, scenario, pick,
 * rating, label, use, link, summaries). Photos come from assets/Product Images
 * (see productImages in constants/images.ts). Fields that file does not have yet
 * (price, specs) share one placeholder for every product.
 * Replace the placeholder per product when that data exists.
 */

/** Slug of the "Category" column, e.g. "water-testing". */
export type ShopCategoryId = string;

/** photo = full-bleed picture (cover). studio = product on white (contain). */
export type ProductImageStyle = 'photo' | 'studio';

export type ShopCategory = {
  id: ShopCategoryId;
  /** Shown as written in shopItems. */
  name: string;
  image: ImageSourcePropType;
  imageStyle: ProductImageStyle;
  tone: 'aqua' | 'mint';
};

export type ProductSpec = {
  /** Keys in data/translations.ts */
  labelKey: string;
  valueKey: string;
};

export type Product = {
  /** The ASIN. Only used as the unique id, never shown. */
  id: string;
  categoryId: ShopCategoryId;

  // ─── From shopItems ───────────────────────────────────────────────────────
  name: string;
  brand: string;
  /** Every "Scenario" this product is listed under, e.g. "Routine water testing". */
  scenarios: string[];
  /** "Pick #" column: best (lowest) rank across its scenarios. null when missing. */
  pick: number | null;
  /** "Pool Tonic label": Best Value, Pool Tonic Pick, Essential... */
  label: string;
  /** null when the sheet has no rating. */
  rating: number | null;
  reviewCount: number | null;
  /** "Use / customer intent". Empty string when missing. */
  use: string;
  /** Opens in the browser (Amazon). Empty string when missing. */
  affiliateUrl: string;
  /** "Customers say" text. */
  reviewSummary: string;
  /** "What it does / owner need / problem solved" text. */
  whatItDoes: string;

  // ─── Shared placeholder (same for every product for now) ──────────────────
  price: number;
  image: ImageSourcePropType;
  imageStyle: ProductImageStyle;
  specs: ProductSpec[];
};

const PLACEHOLDER = {
  price: 18.99,
  specs: [
    { labelKey: 'shop.specs.size', valueKey: 'shop.values.fiveLb' },
    { labelKey: 'shop.specs.form', valueKey: 'shop.values.granular' },
    { labelKey: 'shop.specs.retestAfter', valueKey: 'shop.values.fourHours' },
  ],
};

/** Picture for each category tile: the photo of the first product in that category. */
const CATEGORY_LOOK: Record<string, { image: ImageSourcePropType; imageStyle: ProductImageStyle }> = {
  'water-testing': { image: productImages['EASYTEST 7-Way Pool Test Strips (150)'], imageStyle: 'studio' },
  sanitizers: { image: productImages['HTH 1-inch Chlorine Tabs with Clarifier (1.5 lb)'], imageStyle: 'studio' },
  'shock-treatments': { image: productImages['HTH Shock Advanced Cal-Hypo (12 x 1 lb)'], imageStyle: 'studio' },
  'water-balance': { image: productImages['Clorox Pool&Spa pH Up (4 lb)'], imageStyle: 'studio' },
  'water-treatment': { image: productImages['Clorox Pool&Spa Algaecide and Clarifier (128 oz)'], imageStyle: 'studio' },
  'manual-cleaning': { image: productImages['Sunnyglade Heavy-Duty Fine Mesh Leaf Rake'], imageStyle: 'studio' },
  'pool-brushes': { image: productImages['Sepetrel 17.5-inch Reinforced Pool Brush'], imageStyle: 'studio' },
  'handheld-vacuums': { image: productImages['PoolMr Rechargeable Handheld Pool Vacuum'], imageStyle: 'studio' },
  'robotic-cleaners': { image: productImages['Betta SE Solar Robotic Surface Skimmer'], imageStyle: 'studio' },
  'pumps-and-filtration': { image: productImages['INTEX C1000 Cartridge Filter Pump (1000 GPH)'], imageStyle: 'studio' },
  thermometers: { image: productImages['XY-WQ Floating Turtle Pool Thermometer'], imageStyle: 'studio' },
  'pool-covers': { image: productImages['INTEX 28021E 10 ft Easy Set Pool Cover'], imageStyle: 'studio' },
  'opening-kits': { image: productImages['In The Swim 3-inch Chlorine Tablets 50 lb + 35,000-Gallon Opening Kit'], imageStyle: 'studio' },
  'sanitizer-control': { image: productImages['BioGuard Chem Out ChlorineBromine Neutralizer, 2 lb'], imageStyle: 'studio' },
  testing: { image: productImages['Taylor K-2006 FAS-DPD Complete Pool Test Kit'], imageStyle: 'studio' },
  'water-replacement': { image: productImages['Superior Pump 91250 14 HP Submersible Utility Pump'], imageStyle: 'studio' },
  'metals-&-stain-control': { image: productImages['Clorox Pool&Spa Scale, Metal & Stain Control, 32 oz'], imageStyle: 'studio' },
  'salt-systems': { image: productImages["Morton Professional's Choice Pool Salt, 40 lb"], imageStyle: 'studio' },
  algae: { image: productImages['HTH Swimming Pool Care Algae Guard Ultra'], imageStyle: 'studio' },
  'phosphates-(advanced)': { image: productImages['Natural Chemistry PHOSfree, 3 L'], imageStyle: 'studio' },
  'bromine-spas': { image: productImages['Clorox Pool&Spa Spa Bromine Tablets, 1.5 lb'], imageStyle: 'studio' },
};

function toSlug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

/**
 * Product photo: the file in assets/Product Images has the product name with "/" removed.
 * Products without a photo fall back to the shared placeholder.
 */
function getProductImage(name: string): { image: ImageSourcePropType; imageStyle: ProductImageStyle } {
  const photo = productImages[name.replace(/\//g, '')];
  return photo
    ? { image: photo, imageStyle: 'studio' }
    : { image: shopImages.placeholder, imageStyle: 'photo' };
}

/** "25,300" -> 25300. Empty -> null. */
function toNumber(value: string): number | null {
  const parsed = Number(value.replace(/,/g, ''));
  return value.trim() === '' || Number.isNaN(parsed) ? null : parsed;
}

const ALL_ROWS: Product[] = shopItems.map((item): Product => ({
  id: item.ASIN,
  categoryId: toSlug(item.Category),
  name: item['Product / Variant'],
  brand: item.Brand,
  scenarios: item.Scenario.trim() ? [item.Scenario.trim()] : [],
  pick: toNumber(item['Pick #']),
  label: item['Pool Tonic label'],
  rating: toNumber(item['Rating / 5']),
  reviewCount: toNumber(item['Reviews ~']),
  use: item['Use / customer intent'].trim(),
  affiliateUrl: item['Affiliate Link URL*'].trim(),
  reviewSummary: item['Review summary / Customers Say:'].trim(),
  whatItDoes: item['What it does / owner need / problem solved'].trim(),
  ...getProductImage(item['Product / Variant']),
  ...PLACEHOLDER,
}));

/**
 * shopItems has one row per product + scenario, so the same ASIN can appear
 * several times. Show each product once: the first row wins for text and link,
 * and every scenario is collected into `scenarios`.
 */
export const PRODUCTS: Product[] = [];
for (const row of ALL_ROWS) {
  const existing = PRODUCTS.find((product) => product.id === row.id);
  if (!existing) {
    PRODUCTS.push(row);
    continue;
  }
  for (const scenario of row.scenarios) {
    if (!existing.scenarios.includes(scenario)) existing.scenarios.push(scenario);
  }
  if (!existing.label) existing.label = row.label;
  if (row.pick !== null && (existing.pick === null || row.pick < existing.pick)) existing.pick = row.pick;
}

/** Categories in the order they first appear in shopItems. */
export const SHOP_CATEGORIES: ShopCategory[] = shopItems
  .map((item) => item.Category)
  .filter((name, index, all) => all.indexOf(name) === index)
  .map((name, index): ShopCategory => {
    const id = toSlug(name);
    const look = CATEGORY_LOOK[id] ?? { image: shopImages.placeholder, imageStyle: 'photo' };
    return {
      id,
      name,
      image: look.image,
      imageStyle: look.imageStyle,
      // Checkerboard in the 2-column grid: aqua mint / mint aqua / ...
      tone: index % 4 === 0 || index % 4 === 3 ? 'aqua' : 'mint',
    };
  });

/** "Customized for you": the Pool Tonic Picks, first 8. */
export const FEATURED_PRODUCTS = PRODUCTS.filter((product) => product.label === 'Pool Tonic Pick').slice(0, 8);

export function getCategory(id: string | undefined): ShopCategory | undefined {
  return SHOP_CATEGORIES.find((category) => category.id === id);
}

export function getProduct(id: string | undefined): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductsByCategory(categoryId: ShopCategoryId): Product[] {
  return PRODUCTS.filter((product) => product.categoryId === categoryId);
}

/**
 * Products that contain every word of the query in their name, brand, category,
 * use or scenarios. So "hth shock" and "cloudy water" both work.
 */
export function searchProducts(query: string): Product[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  return PRODUCTS.filter((product) => {
    const categoryName = getCategory(product.categoryId)?.name ?? '';
    const text = [product.name, product.brand, categoryName, product.use, ...product.scenarios]
      .join(' ')
      .toLowerCase();
    return words.every((word) => text.includes(word));
  });
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatReviewCount(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
}

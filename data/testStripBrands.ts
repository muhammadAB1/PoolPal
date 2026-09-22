import catalog from '@/assets/test-strips/test_strips_rows.json';
import { icons, testStripProductImages } from '@/constants/images';
import { HAVE_RESULTS_FIELDS } from '@/data/chooseTestMethod';
import type { ImageSourcePropType } from 'react-native';

/** One pad-level row from the catalog: a single test on a single strip. */
export type TestStripRow = {
  product_brand: string;
  product_model: string;
  test_name: string;
  displayed_value: string;
  unit: string | null;
};

/** Only the fields the brand picker needs — custom strips may not have pad data. */
export type TestStripBrandRow = Pick<TestStripRow, 'product_brand' | 'product_model'>;

export type TestStripBrand = {
  name: string;
  models: string[];
  icon: ImageSourcePropType;
};

export type TestStripColor = { value: string; hex: string };

export type TestStripPad = {
  testName: string;
  unit: string;
  colors: TestStripColor[];
};

/** Bundled with the app, so the brand list never needs a network call. */
export const CATALOG_ROWS: TestStripRow[] = catalog;

/** Some catalog values carry stray newlines from the source export. */
const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

/** Bottle photo for one catalog product. Custom strips keep the placeholder. */
export function iconForProduct(brand: string, model: string): ImageSourcePropType {
  const images: Record<string, ImageSourcePropType> = testStripProductImages;
  return images[`${brand}|${model}`] ?? icons.testStrip;
}

/** Collapses pad-level rows into one entry per brand, in catalog order. */
export function toBrands(rows: TestStripBrandRow[]): TestStripBrand[] {
  return rows.reduce<TestStripBrand[]>((brands, row) => {
    const name = clean(row.product_brand);
    const model = clean(row.product_model);
    const brand = brands.find((item) => item.name === name);

    if (!brand) {
      brands.push({
        name,
        models: [model],
        icon: iconForProduct(name, model),
      });
    } else if (!brand.models.includes(model)) {
      brand.models.push(model);
    }
    return brands;
  }, []);
}

/** displayed_value is a JSON string, e.g. '{"0": "#382598", "100": "#001C96"}'. */
function parseColors(displayedValue: string): TestStripColor[] {
  const matches = displayedValue.matchAll(/"([^"]+)":\s*"(#[0-9A-Fa-f]{6})"/g);
  return [...matches].map(([, value, hex]) => ({ value, hex }));
}

/** Every pad (test + color chart) for the exact brand + model the user selected. */
export function getPads(selection: string, rows = CATALOG_ROWS): TestStripPad[] {
  return rows
    .filter((row) => `${clean(row.product_brand)} ${clean(row.product_model)}` === selection)
    .map((row) => ({
      testName: clean(row.test_name),
      unit: clean(row.unit ?? ''),
      colors: parseColors(row.displayed_value),
    }));
}

/**
 * Pads for the current test session — the full brand pad list when a strip
 * was scanned/selected, or a synthetic list built from whichever
 * HAVE_RESULTS_FIELDS the user typed manually. Shared by every screen that
 * needs to pair `selections` with the pads that produced them.
 */
export function resolvePads(
  selectedBrand: string | null,
  selections: Record<string, string>,
): TestStripPad[] {
  if (selectedBrand) return getPads(selectedBrand);

  return HAVE_RESULTS_FIELDS.filter(
    (field) => selections[field.testName] != null,
  ).map((field) => ({
    testName: field.testName,
    unit: field.unitKey === 'choose_test_method_unit_none' ? '' : 'ppm',
    colors: [],
  }));
}

import catalog from '@/assets/test-strips/test_strips_rows.json';
import { testStripBrandIcons } from '@/constants/images';
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
        icon: testStripBrandIcons[brands.length % testStripBrandIcons.length],
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

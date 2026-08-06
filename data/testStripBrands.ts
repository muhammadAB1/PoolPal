import catalog from '@/assets/test-strips/test_strips_rows.json';
import { testStripBrandIcons } from '@/constants/images';
import type { ImageSourcePropType } from 'react-native';

/** Only the fields the brand picker needs — pad colors are loaded in a later step. */
export type TestStripRow = {
  product_brand: string;
  product_model: string;
};

export type TestStripBrand = {
  name: string;
  models: string[];
  icon: ImageSourcePropType;
};

/** Bundled with the app, so the brand list never needs a network call. */
export const CATALOG_ROWS: TestStripRow[] = catalog;

/** Some catalog values carry stray newlines from the source export. */
const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

/** Collapses pad-level rows into one entry per brand, in catalog order. */
export function toBrands(rows: TestStripRow[]): TestStripBrand[] {
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

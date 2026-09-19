import { chooseTestMethodImages } from '@/constants/images';
import type { TestReadingRow } from '@/lib/types';
import type { ImageSourcePropType } from 'react-native';

export type ChooseTestMethodOptionId =
  | 'manual_strip'
  | 'liquid_test'
  | 'have_results'
  | 'solve_problems';

export type ChooseTestMethodOption = {
  id: ChooseTestMethodOptionId;
  icon: ImageSourcePropType;
  titleKey: string;
  descriptionKey: string;
};

export const CHOOSE_TEST_METHOD_OPTIONS: readonly ChooseTestMethodOption[] = [
  {
    id: 'manual_strip',
    icon: chooseTestMethodImages.strip,
    titleKey: 'choose_test_method_strip_title',
    descriptionKey: 'choose_test_method_strip_desc',
  },
  // {
  //   id: 'liquid_test',
  //   icon: chooseTestMethodImages.flask,
  //   titleKey: 'choose_test_method_liquid_title',
  //   descriptionKey: 'choose_test_method_liquid_desc',
  // },
  {
    id: 'have_results',
    icon: chooseTestMethodImages.results,
    titleKey: 'choose_test_method_results_title',
    descriptionKey: 'choose_test_method_results_desc',
  },
  {
    id: 'solve_problems',
    icon: chooseTestMethodImages.magnifyingGlass,
    titleKey: 'choose_test_method_problems_title',
    descriptionKey: 'choose_test_method_problems_desc',
  },
] as const;

export type HaveResultsFieldKey =
  | 'freeChlorine'
  | 'totalChlorine'
  | 'combinedChlorine'
  | 'bromine'
  | 'ph'
  | 'totalAlkalinity'
  | 'cyanuricAcid'
  | 'calciumHardness'
  | 'totalHardness'
  | 'salt';

export type HaveResultsField = {
  key: HaveResultsFieldKey;
  /** Catalog-style name so readingBands PARAM_ALIASES can match this field. */
  testName: string;
  abbreviation: string;
  badgeColor: string;
  labelKey: string;
  placeholder: string;
  unitKey: 'choose_test_method_unit_ppm' | 'choose_test_method_unit_none';
};

export const HAVE_RESULTS_FIELDS: readonly HaveResultsField[] = [
  {
    key: 'freeChlorine',
    testName: 'Free Chlorine',
    abbreviation: 'FC',
    badgeColor: '#2EB8D9',
    labelKey: 'test_readings_fc_label',
    placeholder: '3.2',
    unitKey: 'choose_test_method_unit_ppm',
  },
  {
    key: 'totalChlorine',
    testName: 'Total Chlorine',
    abbreviation: 'TC',
    badgeColor: '#F0983D',
    labelKey: 'choose_test_method_tc_label',
    placeholder: '2.8',
    unitKey: 'choose_test_method_unit_ppm',
  },
  {
    key: 'combinedChlorine',
    testName: 'Combined Chlorine',
    abbreviation: 'CC',
    badgeColor: '#9B6BB8',
    labelKey: 'choose_test_method_cc_label',
    placeholder: '0.2',
    unitKey: 'choose_test_method_unit_ppm',
  },
  {
    key: 'bromine',
    testName: 'Bromine',
    abbreviation: 'BR',
    badgeColor: '#6B8CAE',
    labelKey: 'choose_test_method_br_label',
    placeholder: '3.0',
    unitKey: 'choose_test_method_unit_ppm',
  },
  {
    key: 'ph',
    testName: 'pH',
    abbreviation: 'pH',
    badgeColor: '#E8C547',
    labelKey: 'test_readings_ph_label',
    placeholder: '7.4',
    unitKey: 'choose_test_method_unit_none',
  },
  {
    key: 'totalAlkalinity',
    testName: 'Total Alkalinity',
    abbreviation: 'TA',
    badgeColor: '#6E9C4D',
    labelKey: 'test_readings_ta_label',
    placeholder: '90',
    unitKey: 'choose_test_method_unit_ppm',
  },
  {
    key: 'cyanuricAcid',
    testName: 'Cyanuric Acid',
    abbreviation: 'CYA',
    badgeColor: '#8B6FE8',
    labelKey: 'test_readings_cya_label',
    placeholder: '40',
    unitKey: 'choose_test_method_unit_ppm',
  },
  {
    key: 'calciumHardness',
    testName: 'Calcium Hardness',
    abbreviation: 'CH',
    badgeColor: '#E87BA0',
    labelKey: 'test_readings_ch_label',
    placeholder: '220',
    unitKey: 'choose_test_method_unit_ppm',
  },
  {
    key: 'totalHardness',
    testName: 'Total Hardness',
    abbreviation: 'TH',
    badgeColor: '#6E9C4D',
    labelKey: 'choose_test_method_th_label',
    placeholder: '250',
    unitKey: 'choose_test_method_unit_ppm',
  },
  {
    key: 'salt',
    testName: 'Salt',
    abbreviation: 'Salt',
    badgeColor: '#C4A484',
    labelKey: 'choose_test_method_salt_label',
    placeholder: '3200',
    unitKey: 'choose_test_method_unit_ppm',
  },
] as const;

/** test_reading column for each have-results field. */
export const HAVE_RESULTS_FIELD_COLUMNS: Record<
  HaveResultsFieldKey,
  keyof TestReadingRow
> = {
  freeChlorine: 'free_chlorine',
  totalChlorine: 'total_chlorine',
  combinedChlorine: 'combined_chlorine',
  bromine: 'bromine',
  ph: 'ph',
  totalAlkalinity: 'total_alkalinity',
  cyanuricAcid: 'cyanuric_acid',
  calciumHardness: 'calcium_hardness',
  totalHardness: 'total_hardness',
  salt: 'salt',
};

/** Skip null/empty columns so the Readings tab can show those fields as not tested. */
export function testReadingRowToSelections(
  row: TestReadingRow,
): Record<string, string> {
  const selections: Record<string, string> = {};
  for (const field of HAVE_RESULTS_FIELDS) {
    const value = row[HAVE_RESULTS_FIELD_COLUMNS[field.key]];
    if (value == null || value === '') continue;
    selections[field.testName] = String(value);
  }
  return selections;
}

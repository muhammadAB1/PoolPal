import { chooseTestMethodImages } from '@/constants/images';
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
  {
    id: 'liquid_test',
    icon: chooseTestMethodImages.flask,
    titleKey: 'choose_test_method_liquid_title',
    descriptionKey: 'choose_test_method_liquid_desc',
  },
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
  | 'ph'
  | 'totalAlkalinity'
  | 'cyanuricAcid'
  | 'calciumHardness'
  | 'salt';

export type ReadingStatusKey = 'good' | 'bad';

export type HaveResultsField = {
  key: HaveResultsFieldKey;
  abbreviation: string;
  badgeColor: string;
  labelKey: string;
  placeholder: string;
  unitKey: 'choose_test_method_unit_ppm' | 'choose_test_method_unit_none';
  /** Inclusive range treated as Ideal; nearby values map to Good in the UI helper. */
  idealMin: number;
  idealMax: number;
};

export const HAVE_RESULTS_FIELDS: readonly HaveResultsField[] = [
  {
    key: 'freeChlorine',
    abbreviation: 'FC',
    badgeColor: '#2EB8D9',
    labelKey: 'test_readings_fc_label',
    placeholder: '3.2',
    unitKey: 'choose_test_method_unit_ppm',
    idealMin: 1,
    idealMax: 3,
  },
  {
    key: 'totalChlorine',
    abbreviation: 'TC',
    badgeColor: '#F0983D',
    labelKey: 'choose_test_method_tc_label',
    placeholder: '2.8',
    unitKey: 'choose_test_method_unit_ppm',
    idealMin: 1,
    idealMax: 3,
  },
  {
    key: 'ph',
    abbreviation: 'pH',
    badgeColor: '#E8C547',
    labelKey: 'test_readings_ph_label',
    placeholder: '7.4',
    unitKey: 'choose_test_method_unit_none',
    idealMin: 7.2,
    idealMax: 7.8,
  },
  {
    key: 'totalAlkalinity',
    abbreviation: 'TA',
    badgeColor: '#6E9C4D',
    labelKey: 'test_readings_ta_label',
    placeholder: '90',
    unitKey: 'choose_test_method_unit_ppm',
    idealMin: 80,
    idealMax: 120,
  },
  {
    key: 'cyanuricAcid',
    abbreviation: 'CYA',
    badgeColor: '#8B6FE8',
    labelKey: 'test_readings_cya_label',
    placeholder: '40',
    unitKey: 'choose_test_method_unit_ppm',
    idealMin: 30,
    idealMax: 50,
  },
  {
    key: 'calciumHardness',
    abbreviation: 'CH',
    badgeColor: '#E87BA0',
    labelKey: 'test_readings_ch_label',
    placeholder: '220',
    unitKey: 'choose_test_method_unit_ppm',
    idealMin: 200,
    idealMax: 400,
  },
  {
    key: 'salt',
    abbreviation: 'Salt',
    badgeColor: '#C4A484',
    labelKey: 'choose_test_method_salt_label',
    placeholder: '3200',
    unitKey: 'choose_test_method_unit_ppm',
    idealMin: 2700,
    idealMax: 3400,
  },
] as const;

export function getReadingStatus(
  value: string,
  field: HaveResultsField,
): ReadingStatusKey | null {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  if (parsed >= field.idealMin && parsed <= field.idealMax) {
    return 'good';
  }

  return 'bad';
}

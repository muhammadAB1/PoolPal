import { colors } from '@/constants/theme';

/** Short abbreviation + accent color for a catalog test name, e.g. "Free Chlorine" → "FC". */
export type TestMeta = { abbr: string; color: string };

const TEST_META: { match: RegExp; abbr: string; color: string }[] = [
  { match: /hardness/i, abbr: 'H', color: '#6E9C4D' },
  { match: /alkalinity/i, abbr: 'TA', color: '#8B9A3C' },
  { match: /cyanuric|stabilizer/i, abbr: 'CYA', color: '#F0983D' },
  { match: /combined\s*chlorine/i, abbr: 'CC', color: '#9B6BB8' },
  { match: /total\s*chlorine/i, abbr: 'TC', color: '#2EB8D9' },
  { match: /free\s*chlorine|available\s*chlorine|fac/i, abbr: 'FC', color: '#E87BA0' },
  { match: /bromine/i, abbr: 'BR', color: '#6B8CAE' },
  { match: /^ph$/i, abbr: 'pH', color: '#E5484D' },
  { match: /salt/i, abbr: 'S', color: '#C4A484' },
];

export function testMeta(testName: string): TestMeta {
  const found = TEST_META.find((item) => item.match.test(testName));
  return found ?? { abbr: testName.slice(0, 2).toUpperCase(), color: colors.brand.blue };
}

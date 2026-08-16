import { Pool, testReadingsInsertProps } from "@/lib/types";

export type ReadingStatus =
  | 'very_low'
  | 'low'
  | 'ideal'
  | 'high'
  | 'very_high';

export type IdealRange = { min: number; max: number };

/** Overall summary badge on the water-results screen. */
export type OverallStatus =
  | 'looking_great'
  | 'mostly_balanced'
  | 'needs_balancing'
  | 'action_needed';

/**
 * Stable chemistry keys — brand catalog labels map into these.
 * Names match the test_reading columns / testReadingsInsertProps.
 * `total_chlorine` has no DB column; it is only used for range logic.
 */
export type ParamKey =
  | 'total_hardness'
  | 'total_chlorine'
  | 'free_chlorine'
  | 'bromine'
  | 'total_alkalinity'
  | 'cyanuric_acid'
  | 'ph'
  | 'calcium_hardness';

type CanonicalSelections = {
  values: Partial<Record<ParamKey, number>>;
  originalKey: Partial<Record<ParamKey, string>>;
};

/**
 * A single pad label can match more than one key
 * (e.g. "TOTAL CHLORINE / TOTAL BROMINE" → tc + br).
 * Keep specific patterns (free chlorine) before broader ones (total chlorine)
 * so "FREE CHLORINE" does not also hit `tc`.
 */
const PARAM_ALIASES: { key: ParamKey; match: RegExp }[] = [
  { key: 'free_chlorine', match: /free\s*(available\s*)?chlorine|fac/i },
  { key: 'total_chlorine', match: /total\s*chlorine/i },
  { key: 'cyanuric_acid', match: /cyanuric|stabilizer/i },
  { key: 'total_alkalinity', match: /alkalinity/i },
  { key: 'total_hardness', match: /hardness/i },
  { key: 'bromine', match: /bromine/i },
  { key: 'ph', match: /^ph$/i },
  { key: 'calcium_hardness', match: /calcium\s*hardness/i },
];

/** Every ParamKey that this catalog label maps to (0–n). */
export function toParamKeys(testName: string): ParamKey[] {
  const name = testName.trim();
  return PARAM_ALIASES.filter((item) => item.match.test(name)).map(
    (item) => item.key,
  );
}

/** First matching ParamKey, or null. Prefer toParamKeys for combined pads. */
export function toParamKey(testName: string): ParamKey | null {
  return toParamKeys(testName)[0] ?? null;
}

/** Map brand-specific selection keys into stable ParamKey values + original labels. */
export function toCanonical(
  selections: Record<string, string>,
): CanonicalSelections {
  const values: Partial<Record<ParamKey, number>> = {};
  const originalKey: Partial<Record<ParamKey, string>> = {};

  for (const [testName, raw] of Object.entries(selections)) {
    const keys = toParamKeys(testName);
    if (keys.length === 0) continue;

    const parsed = parseReadingValue(raw);
    for (const key of keys) {
      originalKey[key] = testName;
      if (parsed != null) values[key] = parsed;
    }
  }

  return { values, originalKey };
}

export function databaseKeysTestReading(
  selections: Record<string, string>,
) {
  const values: Partial<Record<ParamKey, string>> = {};
  const originalKey: Partial<Record<ParamKey, string>> = {};

  for (const [testName, raw] of Object.entries(selections)) {
    const keys = toParamKeys(testName);
    if (keys.length === 0) continue;

    for (const key of keys) {
      originalKey[key] = testName;
      values[key] = raw.toString();
    }
  }

  return { values, originalKey };
}

/**
 * Turn the brand-specific pad selections (testName → chart value) into the
 * props the test_reading insert expects. Matches by name, so a strip's pad
 * order does not matter. `total_chlorine` is dropped because there is no
 * column for it.
 */
export function toTestReadingsProps(
  selections: Record<string, string>,
): testReadingsInsertProps {
  const { values } = databaseKeysTestReading(selections);
  const props: testReadingsInsertProps = {};

  if (values.free_chlorine != null) props.free_chlorine = Number(values.free_chlorine);
  if (values.bromine != null) props.bromine = Number(values.bromine);
  if (values.ph != null) props.ph = Number(values.ph);
  if (values.total_alkalinity != null) props.total_alkalinity = Number(values.total_alkalinity);
  if (values.cyanuric_acid != null) props.cyanuric_acid = values.cyanuric_acid;
  if (values.total_hardness != null) props.total_hardness = Number(values.total_hardness);
  if (values.calcium_hardness != null) props.calcium_hardness = Number(values.calcium_hardness);
  if (values.total_chlorine != null) props.total_chlorine = Number(values.total_chlorine);

  return props;
}

/**
 * Stub — fill real per-test ideal-range logic later.
 * Returns which band the selected reading falls into.
 */
export function getReadingStatus(
  testName: string,
  value: string,
  range?: IdealRange | null,
): ReadingStatus {
  const { originalKey } = toCanonical({ [testName]: value });
  const reading = parseReadingValue(value);
  if (reading == null) return 'ideal';

  if (originalKey.free_chlorine != undefined) {
    const idealMin = range?.min ?? 1;
    const idealMax = range?.max ?? 3;
    let lowFloor = 0.5;
    let highCeiling = 4;

    if (idealMin === 2 && idealMax === 3) {
      lowFloor = 1;
      highCeiling = 4;
    } else if (idealMin === 2 && idealMax === 4) {
      lowFloor = 1;
      highCeiling = 5;
    } else if (idealMin === 3 && idealMax === 5) {
      lowFloor = 2;
      highCeiling = 6;
    }

    if (reading >= idealMin && reading <= idealMax) return 'ideal';
    if (reading < lowFloor) return 'very_low';
    if (reading < idealMin) return 'low';
    if (reading <= highCeiling) return 'high';
    return 'very_high';
  }

  if (originalKey.ph != undefined) {
    const idealMin = range?.min ?? 7.2;
    const idealMax = range?.max ?? 7.8;

    if (reading >= idealMin && reading <= idealMax) return 'ideal';
    if (reading < 7.0) return 'very_low';
    if (reading < idealMin) return 'low';
    if (reading <= 8.0) return 'high';
    return 'very_high';
  }

  if (originalKey.total_hardness != undefined) {
    const idealMin = range?.min ?? 200;
    const idealMax = range?.max ?? 400;

    if (reading >= idealMin && reading <= idealMax) return 'ideal';
    if (reading < 150) return 'very_low';
    if (reading < idealMin) return 'low';
    if (reading <= 500) return 'high';
    return 'very_high';
  }

  if (originalKey.cyanuric_acid != undefined) {
    const idealMin = range?.min ?? 30;
    const idealMax = range?.max ?? 50;

    if (reading >= idealMin && reading <= idealMax) return 'ideal';
    if (reading < 1) return 'very_low';
    if (reading < idealMin) return 'low';
    if (reading < 100) return 'high';
    return 'very_high';
  }

  if (originalKey.bromine != undefined) {
    const idealMin = range?.min ?? 2;
    const idealMax = range?.max ?? 4;

    if (reading >= idealMin && reading <= idealMax) return 'ideal';

    if (idealMin === 2 && idealMax === 4) {
      if (reading < 1) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= 10) return 'high';
      return 'very_high';
    }

    if (idealMin === 3 && idealMax === 5) {
      if (reading < 2) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= 10) return 'high';
      return 'very_high';
    }

    if (idealMin === 4 && idealMax === 8) {
      if (reading < 3) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= 10) return 'high';
      return 'very_high';
    }
  }

  if (originalKey.total_alkalinity != undefined) {
    const idealMin = range?.min ?? 80;
    const idealMax = range?.max ?? 100;

    if (reading >= idealMin && reading <= idealMax) return 'ideal';

    if (idealMin === 80 && idealMax === 100) {
      if (reading < 60) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= 120) return 'high';
      return 'very_high';
    }

    if (idealMin === 100 && idealMax === 120) {
      if (reading < 60) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= 180) return 'high';
      return 'very_high';
    }
  }

  return 'ideal';
}

/**
 * Needs the full selections map because ranges can depend on multiple readings.
 * Write if/else against `values.cyanuric_acid` / `values.free_chlorine`, then emit ranges keyed by
 * the original catalog test names via `originalKey`.
 */
export function getIdealStatusRange(
  selections: Record<string, string>,
  pools?: Pool | null,
): Record<string, IdealRange | null> {
  const { values, originalKey } = toCanonical(selections);
  const out: Record<string, IdealRange | null> = {};

  if (originalKey.ph != undefined) {
    out[originalKey.ph] = { min: 7.2, max: 7.8 };
  }

  if (originalKey.total_hardness != undefined) {
    out[originalKey.total_hardness] = { min: 200, max: 400 };
  }

  if (originalKey.cyanuric_acid != undefined) {
    out[originalKey.cyanuric_acid] = { min: 30, max: 50 };
  }

  if (originalKey.free_chlorine != undefined) {
    if (originalKey.cyanuric_acid === undefined) {
      out[originalKey.free_chlorine] = { min: 2, max: 3 };
    } else if (values.cyanuric_acid === 0) {
      out[originalKey.free_chlorine] = { min: 1, max: 3 };
    } else {
      out[originalKey.free_chlorine] = { min: 2, max: 3 };
    }
    if (pools?.pool_use_type === 'ShortTermRental') {
      out[originalKey.free_chlorine] = { min: 2, max: 4 };
    }
    if (pools?.has_hot_tub === 'Yes') {
      out[originalKey.free_chlorine] = { min: 3, max: 5 };
    }
  }

  if (originalKey.bromine != undefined) {
    out[originalKey.bromine] = { min: 2, max: 4 };
    if (pools?.pool_use_type === 'ShortTermRental') {
      out[originalKey.bromine] = { min: 3, max: 5 };
    }
    if (pools?.has_hot_tub === 'Yes') {
      out[originalKey.bromine] = { min: 4, max: 8 };
    }
  }

  if (originalKey.total_alkalinity != undefined) {
    if (originalKey.bromine === undefined) {
      out[originalKey.total_alkalinity] = { min: 80, max: 100 };
    } else if ((values.bromine ?? 0) > 0) {
      out[originalKey.total_alkalinity] = { min: 100, max: 120 };
    }
  }

  if (originalKey.total_hardness != undefined) {
    out[originalKey.total_hardness] = { min: 200, max: 400 };
  }
  return out;
}

/**
 * Stub — fill real overall-status logic later.
 * Picks the summary badge from every pad's band.
 */
export function getOverallPoolStatus(_statuses: ReadingStatus[]): OverallStatus {
  return 'looking_great';
}

/** Pull a usable number from chart labels like "120" or "30–50". */
export function parseReadingValue(
  value: string | null | undefined,
): number | null {
  if (value == null || value === '') return null;
  const match = value.match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

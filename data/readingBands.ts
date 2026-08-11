import { Pool } from "@/lib/types";

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

/** Stable chemistry keys — brand catalog labels map into these. */
export type ParamKey = 'th' | 'tc' | 'fc' | 'br' | 'ta' | 'cya' | 'ph';

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
  { key: 'fc', match: /free\s*(available\s*)?chlorine|fac/i },
  { key: 'tc', match: /total\s*chlorine/i },
  { key: 'cya', match: /cyanuric|stabilizer/i },
  { key: 'ta', match: /alkalinity/i },
  { key: 'th', match: /hardness/i },
  { key: 'br', match: /bromine/i },
  { key: 'ph', match: /^ph$/i },
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

/**
 * Stub — fill real per-test ideal-range logic later.
 * Returns which band the selected reading falls into.
 */
export function getReadingStatus(
  _testName: string,
  _value: string,
  // _idealRanges: Record<string, IdealRange | null>,
): ReadingStatus {
  // console.log('value', _value)
  // console.log('_idealRanges', _idealRanges)
  // console.log('_testName', _testName)

  // if (_value as number >= _idealRanges[_testName]?.min && _value as number <= _idealRanges[_testName]?.max)
  //   return 'very_high'
  return 'ideal';
}

/**
 * Needs the full selections map because ranges can depend on multiple readings.
 * Write if/else against `values.cya` / `values.fc`, then emit ranges keyed by
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

  if (originalKey.th != undefined) {
    out[originalKey.th] = { min: 200, max: 400 };
  }

  if (originalKey.cya != undefined) {
    out[originalKey.cya] = { min: 30, max: 50 };
  }

  if (originalKey.fc != undefined) {
    if (originalKey.cya === undefined) {
      out[originalKey.fc] = { min: 2, max: 3 };
    } else if (values.cya === 0) {
      out[originalKey.fc] = { min: 1, max: 3 };
    } else {
      out[originalKey.fc] = { min: 2, max: 3 };
    }
    if (pools?.pool_use_type === 'ShortTermRental') {
      out[originalKey.fc] = { min: 2, max: 4 };
    }
    if (pools?.has_hot_tub === 'Yes') {
      out[originalKey.fc] = { min: 3, max: 5 };
    }
  }

  if (originalKey.br != undefined) {
    out[originalKey.br] = { min: 2, max: 4 };
    if (pools?.pool_use_type === 'ShortTermRental') {
      out[originalKey.br] = { min: 3, max: 5 };
    }
    if (pools?.has_hot_tub === 'Yes') {
      out[originalKey.br] = { min: 4, max: 8 };
    }
  }

  if (originalKey.ta != undefined) {
    if (originalKey.br === undefined) {
      out[originalKey.ta] = { min: 80, max: 120 };
    } else if ((values.br ?? 0) > 0) {
      out[originalKey.ta] = { min: 100, max: 120 };
    }
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

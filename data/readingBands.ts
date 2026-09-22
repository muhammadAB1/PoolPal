import { isHotTubPool } from "@/lib/pool";
import { Pool, SurfaceType, testReadingsInsertProps } from "@/lib/types";

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
  | 'action_needed'
  | 'unable_to_determine';

/** Whether it's safe to swim right now, based on the same pad statuses. */
export type SwimmingStatus =
  | 'safe'
  | 'safe_after_circulation'
  | 'use_caution'
  | 'wait_before_swimming'
  | 'do_not_swim'
  | 'unable_to_determine';

/**
 * Stable chemistry keys — brand catalog labels map into these.
 * Names match the test_reading columns / testReadingsInsertProps.
 * `total_chlorine` has no DB column; it is only used for range logic.
 */
export type ParamKey =
  | 'total_hardness'
  | 'total_chlorine'
  | 'combined_chlorine'
  | 'free_chlorine'
  | 'bromine'
  | 'total_alkalinity'
  | 'cyanuric_acid'
  | 'ph'
  | 'calcium_hardness'
  | 'salt';

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
  { key: 'combined_chlorine', match: /combined\s*chlorine/i },
  { key: 'total_chlorine', match: /total\s*chlorine/i },
  { key: 'cyanuric_acid', match: /cyanuric|stabilizer/i },
  { key: 'total_alkalinity', match: /alkalinity/i },
  { key: 'total_hardness', match: /hardness/i },
  { key: 'bromine', match: /bromine/i },
  { key: 'ph', match: /^ph$/i },
  { key: 'calcium_hardness', match: /calcium\s*hardness/i },
  { key: 'salt', match: /salt/i },
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

/**
 * Full measurable range for each param: what a real-world test can report.
 * Used as the bar axis when there is no strip color chart, and as the
 * accepted input range on the have-results form. Not the ideal range.
 */
export const READING_RANGE: Partial<Record<ParamKey, IdealRange>> = {
  free_chlorine: { min: 0, max: 20 },
  total_chlorine: { min: 0, max: 20 },
  combined_chlorine: { min: 0, max: 20 },
  bromine: { min: 0, max: 40 },
  ph: { min: 6.2, max: 9.0 },
  total_alkalinity: { min: 0, max: 360 },
  cyanuric_acid: { min: 0, max: 300 },
  total_hardness: { min: 0, max: 1000 },
  calcium_hardness: { min: 0, max: 1000 },
  salt: { min: 400, max: 7000 },
};

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
  if (values.salt != null) props.salt = Number(values.salt);
  // If total_chlorine is not present, but combined_chlorine and free_chlorine are, calculate total_chlorine as their sum
  if (values.total_chlorine != null) {
    props.total_chlorine = Number(values.total_chlorine);
  } else if (values.combined_chlorine != null && values.free_chlorine != null) {
    props.total_chlorine = Number(values.combined_chlorine) + Number(values.free_chlorine);
  }
  if (values.combined_chlorine != null) {
    props.combined_chlorine = Number(values.combined_chlorine);
  } else if (values.total_chlorine != null && values.free_chlorine != null) {
    props.combined_chlorine = Number(values.total_chlorine) - Number(values.free_chlorine);
  }

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

  if (
    originalKey.free_chlorine != undefined ||
    originalKey.total_chlorine != undefined
  ) {
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

  if (originalKey.combined_chlorine != undefined) {
    const idealMin = range?.min ?? 0;
    const idealMax = range?.max ?? 0.2;

    if (reading >= idealMin && reading <= idealMax) return 'ideal';
    if (reading >= 0.5) return 'very_high';
    if (reading > idealMax) return 'high';
    return 'ideal';
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

  if (originalKey.calcium_hardness != undefined) {
    const idealMin = range?.min ?? 200;
    const idealMax = range?.max ?? 400;

    if (reading >= idealMin && reading <= idealMax) return 'ideal';

    // Ideal ranges from getIdealStatusRange (pools.surface_type) — spec table order:
    // default — 200–400 ppm (Vinyl, NotSure, missing surface_type)

    // Band thresholds — one block per unique ideal range (fill TODOs from spec):
    if (idealMin === 200 && idealMax === 400) {
      if (reading < 150) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= 999) return 'high'; // 401–999 slightly high + high
      return 'very_high'; // 1,000+
    }

    if (idealMin === 80 && idealMax === 120) {
      if (reading < 50) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= 220) return 'ideal'; // 80–220
      if (reading <= 999) return 'high';
      return 'very_high';
    }

    if (idealMin === 250 && idealMax === 320) {
      if (reading < 150) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= idealMax) return 'ideal'; // 250–320
      if (reading <= 999) return 'high';
      return 'very_high';
    }

    if (idealMin === 150 && idealMax === 250) {
      if (reading < 100) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= 600) return 'high'; // 251–600 slightly high + high
      return 'very_high'; // 601+
    }

    if (idealMin === 150 && idealMax === 300) {
      if (reading < 100) return 'very_low';
      if (reading < idealMin) return 'low';
      if (reading <= 600) return 'high'; // 301–600 slightly high + high
      return 'very_high'; // 601+
    }
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

    if (idealMin === 0 && idealMax === 0) {
      if (reading === 0) return 'ideal';
      if (reading <= 15) return 'high';
      return 'very_high';
    }

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

  if (originalKey.salt != undefined) {
    const idealMin = range?.min ?? 3000;
    const idealMax = range?.max ?? 3400;

    if (reading >= idealMin && reading <= idealMax) return 'ideal';
    if (reading < 2000) return 'very_low';
    if (reading < idealMin) return 'low'; // 2,000–2,599 low + 2,600–2,999 slightly low
    if (reading < 4000) return 'high'; // 3,401–3,999 slightly high
    return 'very_high'; // 4,000–4,499 high + ≥4,500
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

  const isFrequentUse =
    pools?.usage_frequency === '4-5' || pools?.usage_frequency === '6-7';
  const hasEnoughUsers =
    pools?.number_of_users === '3-5' || pools?.number_of_users === '6-10' || pools?.number_of_users === '10+';
  const isHeavyUse = isFrequentUse && hasEnoughUsers;

  if (originalKey.ph != undefined) {
    out[originalKey.ph] = { min: 7.2, max: 7.8 };
  }

  if (originalKey.combined_chlorine != undefined) {
    out[originalKey.combined_chlorine] = { min: 0, max: 0.2 };
  }

  if (originalKey.cyanuric_acid != undefined) {
    out[originalKey.cyanuric_acid] = { min: 30, max: 50 };
    if (isHotTubPool(pools)) {
      out[originalKey.cyanuric_acid] = { min: 0, max: 0 };
    }
  }

  if (originalKey.free_chlorine != undefined) {
    if (originalKey.cyanuric_acid === undefined) {
      out[originalKey.free_chlorine] = { min: 1, max: 3 };
    } else if (values.cyanuric_acid === 0) {
      out[originalKey.free_chlorine] = { min: 1, max: 3 };
    } else {
      out[originalKey.free_chlorine] = { min: 2, max: 3 };
    }

    if (pools?.pool_use_type === 'ShortTermRental' || isHeavyUse) {
      out[originalKey.free_chlorine] = { min: 2, max: 4 };
    }
    if (isHotTubPool(pools)) {
      out[originalKey.free_chlorine] = { min: 3, max: 5 };
    }
  }

  if (originalKey.bromine != undefined) {
    out[originalKey.bromine] = { min: 2, max: 4 };
    if (pools?.pool_use_type === 'ShortTermRental' || isHeavyUse) {
      out[originalKey.bromine] = { min: 3, max: 5 };
    }
    if (isHotTubPool(pools)) {
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

  if (originalKey.calcium_hardness != undefined) {
    switch (pools?.surface_type) {
      case 'Fiberglass':
        out[originalKey.calcium_hardness] = { min: 80, max: 120 };
        break;
      case 'PaintedConcrete':
        out[originalKey.calcium_hardness] = { min: 250, max: 320 };
        break;
      case 'VinylLiner':
        out[originalKey.calcium_hardness] = { min: 150, max: 250 };
        break;
      case 'StainlessSteel':
        out[originalKey.calcium_hardness] = { min: 150, max: 300 };
        break;
      case 'Plaster':
      case 'Tile':
      case 'Pebble':
      case 'Quartz':
      case 'ReinforcedPvcMembrane':
      case 'SmoothStoneGlassBead':
      case 'Copper':
      case 'OtherCustomSurface':
        out[originalKey.calcium_hardness] = { min: 200, max: 400 };
        break;
      default:
        // Vinyl, NotSure, missing surface_type — generic fallback
        out[originalKey.calcium_hardness] = { min: 200, max: 400 };
        break;
    }
  }

  if (originalKey.salt != undefined) {
    out[originalKey.salt] = { min: 3000, max: 3400 };
  }

  return out;
}

/**
 * Per-param classification → pool/swim status. Keyed by ParamKey so adding
 * the next param (pH, alkalinity...) is just another entry here — no other
 * code needs to change.
 *
 * The free chlorine scoring table has 7 rows (very low, low, slightly low,
 * ideal, slightly high, high, very high) but `getReadingStatus` only reports
 * 5 bands, so "slightly low"/"slightly high" become low/high and the more
 * extreme rows on each side collapse into very_low/very_high.
 */
const PARAM_POOL_STATUS: Partial<Record<ParamKey, Record<ReadingStatus, OverallStatus>>> = {
  free_chlorine: {
    very_low: 'action_needed',
    low: 'action_needed',
    ideal: 'looking_great',
    high: 'mostly_balanced',
    very_high: 'needs_balancing',
  },
  // "High" (4.1–8.0 ppm) maps to `high`; "High + safety restriction"
  // (8.1–10.0 ppm) and "Very high" (>10.0 ppm) both collapse into
  // `very_high` — see the boundary change in getReadingStatus above.
  bromine: {
    very_low: 'action_needed',
    low: 'action_needed',
    ideal: 'looking_great',
    high: 'needs_balancing',
    very_high: 'action_needed',
  },
  // pH's 5-row table maps 1:1 onto the 5 bands — no collapsing needed.
  ph: {
    very_low: 'action_needed',
    low: 'needs_balancing',
    ideal: 'looking_great',
    high: 'needs_balancing',
    very_high: 'action_needed',
  },
  // "Acceptable high / slightly high" (81–100 ppm) maps to `high`; "High"
  // (101–180 ppm) and "Very high" (>180 ppm) both collapse into `very_high`
  // — they agree on Needs Balancing anyway. `low` never actually occurs
  // (very_low borders ideal directly), included only for type completeness.
  total_alkalinity: {
    very_low: 'needs_balancing',
    low: 'needs_balancing',
    ideal: 'looking_great',
    high: 'needs_balancing',
    very_high: 'needs_balancing',
  },
  // "Very low" (0 ppm) alone → `very_low`.
  // "Low" (1–14 ppm) + "Slightly low" (15–29 ppm) collapse into `low`.
  // "Slightly high" (51–70 ppm) + "High" (71–99 ppm) collapse into `high`.
  // "Very high" (100–299) + "Critical" (300+) collapse into `very_high`.
  // `high`/`very_high` are flattened to needs_balancing per instruction,
  // instead of the raw table's mostly_balanced/needs_balancing/action_needed mix.
  cyanuric_acid: {
    very_low: 'needs_balancing',
    low: 'mostly_balanced',
    ideal: 'looking_great',
    high: 'needs_balancing',
    very_high: 'needs_balancing',
  },
  // "Below 100" + "100–149" collapse into `very_low` (both agree on
  // Needs Balancing already). "Slightly low"/"Slightly high" map 1:1 onto
  // `low`/`high`. "High" (501–799) + "Very high" (800+) collapse into
  // `very_high`, flattened to needs_balancing per instruction instead of
  // the raw table's needs_balancing/action_needed mix.
  total_hardness: {
    very_low: 'needs_balancing',
    low: 'mostly_balanced',
    ideal: 'looking_great',
    high: 'mostly_balanced',
    very_high: 'needs_balancing',
  },

  combined_chlorine: {
    very_low: 'looking_great',
    low: 'looking_great',
    ideal: 'looking_great',
    high: 'mostly_balanced',
    very_high: 'action_needed',
  },
  // Default CH pool status (painted concrete and every other surface not in
  // CALCIUM_HARDNESS_POOL_STATUS_OVERRIDES). Swim is always Safe for CH.
  calcium_hardness: {
    very_low: 'needs_balancing',
    low: 'needs_balancing',
    ideal: 'looking_great',
    high: 'needs_balancing',
    very_high: 'action_needed',
  },
  // "Very low" (below 2,000) alone → `very_low`.
  // "Low" (2,000–2,599) + "Slightly low" (2,600–2,999) collapse into `low`.
  // `low` flattens to needs_balancing (Low is Needs Balancing, Slightly low
  // is Mostly Balanced). "Slightly high" maps 1:1 onto `high`.
  // "High" (4,000–4,499) + "Very high" (≥4,500) collapse into `very_high` —
  // they disagree (Needs Balancing vs Action Needed); using action_needed
  // so ≥4,500 stays Action Needed.
  salt: {
    very_low: 'needs_balancing',
    low: 'needs_balancing',
    ideal: 'looking_great',
    high: 'mostly_balanced',
    very_high: 'action_needed',
  },
};

/**
 * Only bands that differ from PARAM_POOL_STATUS.calcium_hardness.
 * Painted concrete matches the default 1:1 — no override.
 * Fiberglass / PVC / copper / other: Low is Mostly Balanced, not Needs Balancing.
 * Stainless steel / vinyl liner: Very high is Needs Balancing (601–999 and
 * ≥1,000 share the `very_high` band, so both use this override).
 */
const CALCIUM_HARDNESS_POOL_STATUS_OVERRIDES: Partial<
  Record<SurfaceType, Partial<Record<ReadingStatus, OverallStatus>>>
> = {
  Fiberglass: { low: 'mostly_balanced' },
  ReinforcedPvcMembrane: { low: 'mostly_balanced' },
  Copper: { low: 'mostly_balanced' },
  OtherCustomSurface: { low: 'mostly_balanced' },
  StainlessSteel: { very_high: 'needs_balancing' },
  VinylLiner: { very_high: 'needs_balancing' },
};

/**
 * Note: `cyanuric_acid` has no entry here on purpose. Every row of its table
 * says swim status is "unable to determine from CYA alone" (or "...until FC
 * interaction is checked") — CYA never independently determines swim
 * safety. Leaving it out means a CYA reading contributes nothing to
 * getOverallSwimmingStatus, so the result falls back to whatever FC/bromine/
 * pH say, or to 'unable_to_determine' if none of those were tested either.
 */
const PARAM_SWIM_STATUS: Partial<Record<ParamKey, Record<ReadingStatus, Exclude<SwimmingStatus, 'unable_to_determine'>>>> = {
  free_chlorine: {
    very_low: 'do_not_swim',
    low: 'wait_before_swimming',
    ideal: 'safe',
    high: 'safe',
    very_high: 'use_caution',
  },
  // very_high merges "High + safety restriction" (8.1–10.0 ppm) and "Very
  // high" (>10.0 ppm) — both use Do not swim here.
  bromine: {
    very_low: 'do_not_swim',
    low: 'wait_before_swimming',
    ideal: 'safe',
    high: 'use_caution',
    very_high: 'do_not_swim',
  },
  ph: {
    very_low: 'do_not_swim',
    low: 'use_caution',
    ideal: 'safe',
    high: 'use_caution',
    very_high: 'do_not_swim',
  },
  // Every TA row is marked Safe — alkalinity alone never restricts swimming.
  total_alkalinity: {
    very_low: 'safe',
    low: 'safe',
    ideal: 'safe',
    high: 'safe',
    very_high: 'safe',
  },

  total_hardness: {
    very_low: 'safe',
    low: 'safe',
    ideal: 'safe',
    high: 'safe',
    very_high: 'safe',
  },

  combined_chlorine: {
    very_low: 'safe',
    low: 'safe',
    ideal: 'safe',
    high: 'use_caution',
    very_high: 'wait_before_swimming',
  },
  calcium_hardness: {
    very_low: 'safe',
    low: 'safe',
    ideal: 'safe',
    high: 'safe',
    very_high: 'safe',
  },
  // Every salt row is marked Safe — salinity alone never restricts swimming.
  salt: {
    very_low: 'safe',
    low: 'safe',
    ideal: 'safe',
    high: 'safe',
    very_high: 'safe',
  },
};

/** Best (0) to worst — used to pick the most severe result across every param. */
const POOL_STATUS_SEVERITY: Record<OverallStatus, number> = {
  looking_great: 0,
  mostly_balanced: 1,
  needs_balancing: 2,
  action_needed: 3,
  unable_to_determine: 4,
};

/** Best (0) to worst — `unable_to_determine` is a no-data fallback, not ranked here. */
const SWIM_STATUS_SEVERITY: Record<SwimmingStatus, number> = {
  safe: 0,
  safe_after_circulation: 1,
  use_caution: 2,
  wait_before_swimming: 3,
  do_not_swim: 4,
  unable_to_determine: 5,
};

/**
 * One pad's test name, the band it fell into, and its raw parsed value.
 * `value` is only needed for hard swim-safety rules that a 5-band
 * classification can't express (e.g. "FC above 10 ppm" is still just
 * `very_high`, same as 4.1 ppm, unless we check the actual number).
 */
export type ParamReading = {
  testName: string;
  status: ReadingStatus;
  value: number | null;
};

/**
 * A triggered swim rule. `message` is shown only when this override's status
 * ends up being the one displayed.
 */
type SwimOverride = { status: SwimmingStatus; message?: string };

/**
 * Hard swim-safety rules that a 5-band table cannot express. pH and bromine
 * are not listed here: pH <7 / >8 is already very_low / very_high → do not
 * swim, and bromine >10 is already very_high → do not swim.
 * FC >10 still needs an override because FC very_high only maps to use_caution.
 */
function swimHardOverrides(readings: ParamReading[]): SwimOverride[] {
  const overrides: SwimOverride[] = [];

  let freeChlorine: number | null = null;
  let cyanuricAcid: number | null = null;
  let totalChlorine: number | null = null;

  for (const { testName, value } of readings) {
    if (value == null) continue;
    const keys = toParamKeys(testName);

    if (keys.includes('free_chlorine')) {
      if (value > 10) overrides.push({ status: 'do_not_swim' });
      freeChlorine = value;
    }
    if (keys.includes('cyanuric_acid')) {
      cyanuricAcid = value;
    }
    if (keys.includes('total_chlorine')) {
      totalChlorine = value;
    }
  }

  // CYA:FC ratio too high means chlorine is "locked" and can't sanitize
  // effectively, even if FC's own reading looks fine on its own.
  if (freeChlorine != null && cyanuricAcid != null && cyanuricAcid / freeChlorine > 45) {
    overrides.push({
      status: 'do_not_swim',
      message:
        'Cyanuric acid is more than 45 times your free chlorine, so the chlorine cannot sanitize.',
    });
  }

  if (freeChlorine != null && totalChlorine != null && freeChlorine > totalChlorine) {
    overrides.push({
      status: 'unable_to_determine',
      message: "Free chlorine can't be higher than total chlorine. Re-test your strip.",
    });
  }

  // if cyanuric acid is there but free chlorine is not then do not swim
  if (cyanuricAcid != null && freeChlorine == null) {
    overrides.push({
      status: 'unable_to_determine',
      message: "Cyanuric acid is present but free chlorine is not. Re-test your strip.",
    });
  }

  return overrides;
}

type PoolOverride = {
  status: OverallStatus;
  message?: string;
  /** When set, this pad's table result is skipped so the override can win. */
  replaceTestName?: string;
};

/**
 * Same shape as swimHardOverrides. `unable_to_determine` is for bad-strip
 * problems. `action_needed` is for chemistry the 5-band table cannot express
 * (FC > 10 is still just `very_high`, bromine 8.1–10 is still just `high`).
 * Set `replaceTestName` when the override is milder than the table so it
 * can actually win.
 */
function poolHardOverrides(
  readings: ParamReading[],
  ranges?: Record<string, IdealRange | null>,
): PoolOverride[] {
  const overrides: PoolOverride[] = [];

  let freeChlorine: number | null = null;
  let cyanuricAcid: number | null = null;
  let totalChlorine: number | null = null;

  for (const { testName, value } of readings) {
    if (value == null) continue;
    const keys = toParamKeys(testName);

    if (keys.includes('free_chlorine')) {
      if (value > 10) overrides.push({ status: 'action_needed' });
      freeChlorine = value;
    }
    if (keys.includes('bromine')) {
      if (value > 8) overrides.push({ status: 'action_needed' });
    }
    if (keys.includes('cyanuric_acid')) {
      cyanuricAcid = value;
      const range = ranges?.[testName];
      if (
        range?.min === 30 &&
        range?.max === 50 &&
        ((value >= 15 && value <= 29) || (value >= 51 && value <= 70))
      ) {
        overrides.push({
          status: 'mostly_balanced',
          replaceTestName: testName,
        });
      }
    }
    if (keys.includes('total_chlorine')) {
      totalChlorine = value;
    }
    if (keys.includes('total_alkalinity')) {
      const range = ranges?.[testName];
      if (
        range?.min === 80 &&
        range?.max === 100 &&
        value >= 101 &&
        value <= 120
      ) {
        overrides.push({
          status: 'mostly_balanced',
          replaceTestName: testName,
        });
      }
    }
    if (keys.includes('calcium_hardness')) {
      const range = ranges?.[testName];
      const slightlyHigh =
        (range?.min === 150 && range?.max === 250 && value >= 251 && value <= 400) ||
        (range?.min === 150 && range?.max === 300 && value >= 301 && value <= 400) ||
        (range?.min === 200 && range?.max === 400 && value >= 401 && value <= 600);
      if (slightlyHigh) {
        overrides.push({
          status: 'mostly_balanced',
          replaceTestName: testName,
        });
      }
    }
  }

  if (freeChlorine != null && cyanuricAcid != null && cyanuricAcid / freeChlorine > 45) {
    overrides.push({
      status: 'action_needed',
      message:
        'Cyanuric acid is more than 45 times your free chlorine, so the chlorine cannot sanitize.',
    });
  }

  if (freeChlorine != null && totalChlorine != null && freeChlorine > totalChlorine) {
    overrides.push({
      status: 'unable_to_determine',
      message: "Free chlorine can't be higher than total chlorine. Re-test your strip.",
    });
  }

  return overrides;
}

/**
 * Scores every reading against whichever params have a table above, then
 * returns the most severe result plus the messages explaining it. Only
 * messages belonging to the winning status are returned, so the text never
 * contradicts the badge.
 */
export function getOverallPoolStatus(
  readings: ParamReading[],
  pools?: Pool | null,
  ranges?: Record<string, IdealRange | null>,
): { status: OverallStatus; messages: string[] } {
  const overrides = poolHardOverrides(readings, ranges);
  const replacedPads = new Set(
    overrides
      .map((item) => item.replaceTestName)
      .filter((name): name is string => name != null),
  );

  const results: OverallStatus[] = [];
  for (const { testName, status } of readings) {
    if (replacedPads.has(testName)) continue;
    for (const key of toParamKeys(testName)) {
      const poolStatus =
        key === 'calcium_hardness' && pools?.surface_type
          ? (CALCIUM_HARDNESS_POOL_STATUS_OVERRIDES[pools.surface_type]?.[status] ??
            PARAM_POOL_STATUS[key]?.[status])
          : PARAM_POOL_STATUS[key]?.[status];
      if (poolStatus) results.push(poolStatus);
    }
  }

  results.push(...overrides.map((item) => item.status));

  if (results.length === 0) return { status: 'unable_to_determine', messages: [] };

  const status = results.reduce((worst, current) =>
    POOL_STATUS_SEVERITY[current] > POOL_STATUS_SEVERITY[worst] ? current : worst,
  );

  const messages = overrides
    .filter((item) => item.status === status && item.message)
    .map((item) => item.message as string);

  return { status, messages };
}

/**
 * Scores every reading against whichever params have a table above, then
 * returns the most severe result plus the messages explaining it. Only
 * messages belonging to the winning status are returned, so the text never
 * contradicts the badge.
 */
export function getOverallSwimmingStatus(
  readings: ParamReading[],
): { status: SwimmingStatus; messages: string[] } {
  const results: SwimmingStatus[] = [];
  for (const { testName, status } of readings) {
    for (const key of toParamKeys(testName)) {
      const value = PARAM_SWIM_STATUS[key]?.[status];
      if (value) results.push(value);
    }
  }

  const overrides = swimHardOverrides(readings);
  results.push(...overrides.map((item) => item.status));

  if (results.length === 0) return { status: 'unable_to_determine', messages: [] };

  const status = results.reduce((worst, current) =>
    SWIM_STATUS_SEVERITY[current] > SWIM_STATUS_SEVERITY[worst] ? current : worst,
  );

  const messages = overrides
    .filter((item) => item.status === status && item.message)
    .map((item) => item.message as string);

  return { status, messages };
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

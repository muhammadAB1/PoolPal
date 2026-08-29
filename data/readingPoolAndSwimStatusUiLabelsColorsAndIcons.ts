import { colors } from '@/constants/theme';
import type { OverallStatus, ReadingStatus, SwimmingStatus } from '@/data/readingBands';
import type { Ionicons } from '@expo/vector-icons';

/** Badge copy/colors for the 5 per-test statuses. Shared by water-results and the readings tab. */
export const STATUS_LABEL: Record<ReadingStatus, string> = {
  very_low: 'water_results_status_very_low',
  low: 'water_results_status_low',
  ideal: 'water_results_status_ideal',
  high: 'water_results_status_high',
  very_high: 'water_results_status_very_high',
};

export const STATUS_BADGE: Record<ReadingStatus, { container: string; text: string }> = {
  very_low: { container: 'bg-[#FDECEC]', text: 'text-error' },
  low: { container: 'bg-warning-bg', text: 'text-warning' },
  ideal: { container: 'bg-surface-mint', text: 'text-success-text' },
  high: { container: 'bg-warning-bg', text: 'text-warning' },
  very_high: { container: 'bg-[#FDECEC]', text: 'text-error' },
};

/** Badge + summary copy/colors for the 4 overall statuses from readingBands. */
export const OVERALL_STATUS: Record<
  OverallStatus,
  {
    labelKey: string;
    summaryKey: string;
    badgeColor: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  looking_great: {
    labelKey: 'water_results_looking_great',
    summaryKey: 'water_results_summary_looking_great',
    badgeColor: colors.status.success,
    icon: 'checkmark',
  },
  mostly_balanced: {
    labelKey: 'water_results_mostly_balanced',
    summaryKey: 'water_results_summary_mostly_balanced',
    badgeColor: colors.brand.aqua,
    icon: 'checkmark',
  },
  needs_balancing: {
    labelKey: 'water_results_needs_balancing',
    summaryKey: 'water_results_summary_needs_balancing',
    badgeColor: colors.status.warning,
    icon: 'alert',
  },
  action_needed: {
    labelKey: 'water_results_action_needed',
    summaryKey: 'water_results_summary_action_needed',
    badgeColor: colors.status.error,
    icon: 'alert',
  },
  unable_to_determine: {
    labelKey: 'water_results_unable_to_determine',
    summaryKey: 'water_results_summary_unable_to_determine',
    badgeColor: colors.text.sub,
    icon: 'help-circle-outline',
  },
};

/** Badge copy/colors for the 6 swimming statuses from readingBands. */
export const SWIM_STATUS: Record<
  SwimmingStatus,
  { labelKey: string; badgeColor: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  safe: {
    labelKey: 'swim_status_safe',
    badgeColor: colors.status.success,
    icon: 'checkmark',
  },
  safe_after_circulation: {
    labelKey: 'swim_status_safe_after_circulation',
    badgeColor: colors.brand.aqua,
    icon: 'checkmark',
  },
  use_caution: {
    labelKey: 'swim_status_use_caution',
    badgeColor: colors.status.warning,
    icon: 'alert',
  },
  wait_before_swimming: {
    labelKey: 'swim_status_wait_before_swimming',
    badgeColor: colors.status.warning,
    icon: 'time-outline',
  },
  do_not_swim: {
    labelKey: 'swim_status_do_not_swim',
    badgeColor: colors.status.error,
    icon: 'close-circle',
  },
  unable_to_determine: {
    labelKey: 'swim_status_unable_to_determine',
    badgeColor: colors.text.sub,
    icon: 'help-circle-outline',
  },
};

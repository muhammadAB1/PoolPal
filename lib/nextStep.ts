import type { Pool } from '@/lib/types';
import type { LatestReading } from '@/providers/TestStripProvider';
import type { Href } from 'expo-router';
import { t } from 'i18next';

export type NextStepInput = {
  pool: Pool | null;
  latestReading: LatestReading | null;
  checklistCompleted: number;
  checklistTotal: number;
  incompleteTasks: string[];
};

export type NextStep = {
  title: string;
  description: string;
  ctaLabel: string | null;
  route: Href | null;
};

/** Swim-status branches that need a message; 'safe' and 'unable_to_determine' fall through. */
const SWIM_STATUS_DESCRIPTION_KEY: Partial<Record<string, string>> = {
  do_not_swim: 'dashboard_next_step_do_not_swim',
  wait_before_swimming: 'dashboard_next_step_wait_before_swimming',
  use_caution: 'dashboard_next_step_use_caution',
  safe_after_circulation: 'dashboard_next_step_safe_after_circulation',
};

/**
 * Single most useful next action for the dashboard hero card, in priority order:
 * 1. Swim safety (if the latest reading needs attention)
 * 2. No reading logged yet — get the user testing
 * 3. Incomplete pool profile — resume onboarding
 * 4. Next incomplete weekly checklist task
 * 5. Nothing left to do this week
 */
export function getNextStep(input: NextStepInput): NextStep {
  const { pool, latestReading, checklistCompleted, checklistTotal, incompleteTasks } = input;

  const swimDescriptionKey = latestReading?.swimmingStatus
    ? SWIM_STATUS_DESCRIPTION_KEY[latestReading.swimmingStatus]
    : undefined;

  if (swimDescriptionKey) {
    return {
      title: t('dashboard_next_step_label'),
      description: t(swimDescriptionKey),
      ctaLabel: t('dashboard_next_step_swim_cta'),
      route: '/(tabs)/readings' as Href,
    };
  }

  const missingDetails = pool?.missing_details ?? [];
  if (missingDetails.length > 0) {
    const [firstStep, ...rest] = missingDetails;
    return {
      title: t('dashboard_next_step_setup_title'),
      description: t('dashboard_details_left', { count: missingDetails.length }),
      ctaLabel: t('dashboard_next_step_setup_cta'),
      route: {
        pathname: `/(onboarding)/${firstStep}`,
        params: { resume: '1', remaining: rest.join(',') },
      } as Href,
    };
  }

  if (!latestReading?.createdAt) {
    return {
      title: t('dashboard_testing_kit_title'),
      description: t('dashboard_testing_kit_desc'),
      ctaLabel: t('dashboard_choose_kit_cta'),
      route: '/(readings)/choose-test-method' as Href,
    };
  }


  if (checklistCompleted < checklistTotal && incompleteTasks[0]) {
    return {
      title: t('dashboard_next_step_checklist_title'),
      description: `${t(`checklist.tasks.${incompleteTasks[0]}`)}\n\n${t('dashboard_next_step_weekly_tasks', { completed: checklistCompleted, total: checklistTotal })}`,
      ctaLabel: t('dashboard_next_step_checklist_cta'),
      route: '/(tabs)/checklist' as Href,
    };
  }

  return {
    title: t('dashboard_next_step_all_caught_up_title'),
    description: t('dashboard_next_step_all_caught_up_desc'),
    ctaLabel: null,
    route: null,
  };
}

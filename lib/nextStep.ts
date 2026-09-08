import type { Pool } from '@/lib/types';
import type { LatestReading } from '@/providers/TestStripProvider';
import { t } from 'i18next';

export type NextStepInput = {
  pool: Pool | null;
  latestReading: LatestReading | null;
  checklistCompleted: number;
  checklistTotal: number;
  incompleteTasks: string[];
};

export function getNextStep(input: NextStepInput): string {
  const { pool, latestReading, checklistCompleted, checklistTotal, incompleteTasks } = input;


  if (latestReading?.swimmingStatus === 'do_not_swim') {
    return t('dashboard_next_step_do_not_swim');
  }
  if (latestReading?.swimmingStatus === 'wait_before_swimming') {
    return t('dashboard_next_step_wait_before_swimming');
  }
  if (latestReading?.swimmingStatus === 'use_caution') {
    return t('dashboard_next_step_use_caution');
  }
  if (latestReading?.swimmingStatus === 'safe_after_circulation') {
    return t('dashboard_next_step_safe_after_circulation');
  }
  if (pool?.missing_details?.length && pool.missing_details.length > 0) {
    return `${pool.missing_details.length}\tonboarding steps remaining.\nRefer to the pool tab`;
  }
  if (checklistCompleted < checklistTotal && incompleteTasks[0]) {
    return `${t(`checklist.tasks.${incompleteTasks[0]}`)}\n\n${t('dashboard_next_step_weekly_tasks', { completed: checklistCompleted, total: checklistTotal })}`;
  }

  return '';
}

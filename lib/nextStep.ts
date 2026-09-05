import type { Pool } from '@/lib/types';
import type { LatestReading } from '@/providers/TestStripProvider';

export type NextStepInput = {
  pool: Pool | null;
  latestReading: LatestReading | null;
};

export function getNextStep(input: NextStepInput): string {
  const { pool, latestReading } = input;


  if (latestReading?.swimmingStatus === 'do_not_swim') {
    return 'Your latest water results need attention before the pool is swim-ready.';
  }
  if (latestReading?.swimmingStatus === 'wait_before_swimming') {
    return 'Your water needs more time or treatment before swimming.';
  }
  if (latestReading?.swimmingStatus === 'use_caution') {
    return 'Review your latest water results before swimming.';
  }
  if (latestReading?.swimmingStatus === 'safe_after_circulation') {
    return 'Your water is on track. Give the pool time to circulate before swimming.';
  }

  return '';
}

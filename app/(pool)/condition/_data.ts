import type { PoolCondition } from '@/lib/types';

export const POOL_CONDITION = {
  heading: 'pool-condition' as const,
  details:
  {
    database_column_name: 'pool_condition' as const,
    value: {
      CRYSTAL_CLEAR: { name: 'pool_condition_crystal_clear' },
      A_LITTLE_CLOUDY: { name: 'pool_condition_a_little_cloudy' },
      GREEN: { name: 'pool_condition_green' },
      VERY_GREEN_OR_DARK: { name: 'pool_condition_very_green_or_dark' },
      NOT_SURE: { name: 'pool_condition_not_sure' },
    } as Record<PoolCondition, { name: string }>,
  },
};

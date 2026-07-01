import type { PoolCondition } from '@/lib/types';

export const POOL_CONDITIONS: readonly PoolCondition[] = [
    'CRYSTAL_CLEAR',
    'A_LITTLE_CLOUDY',
    'GREEN',
    'VERY_GREEN_OR_DARK',
    'NOT_SURE',
] as const;

export const poolConditionTranslationKeys: Record<
    PoolCondition,
    { label: string; description: string }
> = {
    CRYSTAL_CLEAR: {
        label: 'pool_condition_crystal_clear',
        description: 'pool_condition_crystal_clear_desc',
    },
    A_LITTLE_CLOUDY: {
        label: 'pool_condition_a_little_cloudy',
        description: 'pool_condition_a_little_cloudy_desc',
    },
    GREEN: {
        label: 'pool_condition_green',
        description: 'pool_condition_green_desc',
    },
    VERY_GREEN_OR_DARK: {
        label: 'pool_condition_very_green_or_dark',
        description: 'pool_condition_very_green_or_dark_desc',
    },
    NOT_SURE: {
        label: 'pool_condition_not_sure',
        description: 'pool_condition_not_sure_desc',
    },
};

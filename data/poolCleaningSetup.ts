import type { CleaningType } from '@/lib/types';

export const CLEANING_TYPES: readonly CleaningType[] = [
    'Robotic',
    'SuctionSide',
    'PressureSide',
    'ManualVacuum',
    'NoVacuum',
    'NotSure',
] as const;

export const cleaningTypeTranslationKeys: Record<
    CleaningType,
    { label: string; description: string }
> = {
    Robotic: {
        label: 'cleaning_setup_robotic',
        description: 'cleaning_setup_robotic_desc',
    },
    SuctionSide: {
        label: 'cleaning_setup_suction_side',
        description: 'cleaning_setup_suction_side_desc',
    },
    PressureSide: {
        label: 'cleaning_setup_pressure_side',
        description: 'cleaning_setup_pressure_side_desc',
    },
    ManualVacuum: {
        label: 'cleaning_setup_manual',
        description: 'cleaning_setup_manual_desc',
    },
    NoVacuum: {
        label: 'cleaning_setup_no_vacuum',
        description: 'cleaning_setup_no_vacuum_desc',
    },
    NotSure: {
        label: 'cleaning_setup_not_sure',
        description: 'cleaning_setup_not_sure_desc',
    },
};

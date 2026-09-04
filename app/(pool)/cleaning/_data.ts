import type { CleaningType } from '@/lib/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const POOL_CLEANING = {
  heading: 'cleaning-setup' as const,
  details: {
    database_column_name: 'cleaning_type' as const,
    value: {
      Robotic: { name: 'cleaning_setup_robotic', description: 'cleaning_setup_robotic_desc' },
      SuctionSide: { name: 'cleaning_setup_suction_side', description: 'cleaning_setup_suction_side_desc' },
      PressureSide: {
        name: 'cleaning_setup_pressure_side',
        description: 'cleaning_setup_pressure_side_desc',
      },
      ManualVacuum: { name: 'cleaning_setup_manual', description: 'cleaning_setup_manual_desc' },
      NoVacuum: { name: 'cleaning_setup_no_vacuum', description: 'cleaning_setup_no_vacuum_desc' },
    } as Record<CleaningType, { name: string; description: string }>,
  },
  brand: {
    label: 'pool_cleaning_review_brand',
    value: 'Dolphin / Maytronics',
  },
  model: {
    label: 'pool_cleaning_review_model',
    value: 'Dolphin Nautilus CC Plus',
  },
  glanceTitle: 'pool_cleaning_review_at_a_glance',
  glance: [
    {
      icon: 'view-grid-outline' as IconName,
      label: 'pool_cleaning_review_coverage',
      value: 'pool_cleaning_review_coverage_value',
    },
    {
      icon: 'calendar-month-outline' as IconName,
      label: 'pool_cleaning_review_frequency',
      value: 'pool_cleaning_review_frequency_value',
    },
    {
      icon: 'power-plug-outline' as IconName,
      label: 'pool_cleaning_review_power',
      value: 'pool_cleaning_review_power_value',
    },
    {
      icon: 'clock-outline' as IconName,
      label: 'pool_cleaning_review_duration',
      value: 'pool_cleaning_review_duration_value',
    },
  ],
  careNote: {
    title: 'pool_cleaning_review_care_note',
    body: 'pool_cleaning_review_care_note_desc',
  },
  why: {
    title: 'pool_cleaning_review_why_title',
    body: 'pool_cleaning_review_why_desc',
  },
};

import type {
  HotTubType,
  NumberOfPoolUsers,
  PoolType,
  ScreenedType,
  SpaAttachmentType,
  UsageFrequency,
  UseType,
} from '@/lib/types';

// export const POOL_NAME = 'Backyard Pool';
// export const POOL_TAGS = ['Not sure', 'Screened', 'Family'] as const;

export const POOL_BASICS = {
  heading: 'pool-basics' as const,
  details: [
    {
      database_column_name: 'pool_type' as const,
      title: 'pool_basics_review_sanitizer',
      value: {
        Chlorine: { name: 'pool_basics_type_chlorine', description: 'pool_basics_type_chlorine_desc' },
        Saltwater: { name: 'pool_basics_type_saltwater', description: 'pool_basics_type_saltwater_desc' },
        Bromine: { name: 'pool_basics_type_bromine', description: 'pool_basics_type_bromine_desc' },
        Other: { name: 'pool_basics_type_other', description: 'pool_basics_type_other_desc' },
      } as Record<PoolType, { name: string; description: string }>,
    },
    {
      database_column_name: 'pool_screen' as const,
      title: 'pool_basics_review_environment',
      value: {
        Screened: { name: 'pool_basics_screened_yes', description: 'pool_basics_screened_yes_desc' },
        Unscreened: { name: 'pool_basics_screened_no', description: 'pool_basics_screened_no_desc' },
      } as Record<ScreenedType, { name: string; description: string }>,
    },
    {
      database_column_name: 'hot_tub_type' as const,
      title: 'pool_basics_review_hot_tub',
      value: {
        Yes: { name: 'pool_basics_hot_tub_yes', description: 'pool_basics_hot_tub_yes_review_desc' },
        No: { name: 'pool_basics_hot_tub_no', description: 'pool_basics_hot_tub_no_review_desc' },
      } as Record<HotTubType, { name: string; description: string }>,
    },
    {
      database_column_name: 'spa_attachment' as const,
      title: 'pool_basics_review_hot_tub',
      value: {
        Attached: { name: 'pool_basics_spa_attached', description: 'pool_basics_spa_attached_desc' },
        Detached: { name: 'pool_basics_spa_detached', description: 'pool_basics_spa_detached_desc' },
      } as Record<SpaAttachmentType, { name: string; description: string }>,
    },
    {
      database_column_name: 'pool_use_type' as const,
      title: 'pool_basics_review_primary_use',
      value: {
        Family: { name: 'pool_basics_use_family', description: 'pool_basics_use_family_desc' },
        VacationHome: { name: 'pool_basics_use_vacation', description: 'pool_basics_use_vacation_desc' },
        ShortTermRental: { name: 'pool_basics_use_rental', description: 'pool_basics_use_rental_desc' },
      } as Record<UseType, { name: string; description: string }>,
    },
    {
      database_column_name: 'usage_frequency' as const,
      title: 'pool_basics_review_usage_frequency',
      value: {
        '0-1': { name: 'pool_basics_usage_frequency_0_1', description: 'pool_basics_usage_frequency_0_1_desc' },
        '2-3': { name: 'pool_basics_usage_frequency_2_3', description: 'pool_basics_usage_frequency_2_3_desc' },
        '4-5': { name: 'pool_basics_usage_frequency_4_5', description: 'pool_basics_usage_frequency_4_5_desc' },
        '6-7': { name: 'pool_basics_usage_frequency_6_7', description: 'pool_basics_usage_frequency_6_7_desc' },
      } as Record<UsageFrequency, { name: string; description: string }>,
    },
    {
      database_column_name: 'number_of_users' as const,
      title: 'pool_basics_review_number_of_users',
      value: {
        '1-2': { name: 'pool_basics_bather_1_2', description: 'pool_basics_pool_users_1_2_desc' },
        '3-5': { name: 'pool_basics_bather_3_5', description: 'pool_basics_pool_users_3_5_desc' },
        '6-10': { name: 'pool_basics_bather_6_10', description: 'pool_basics_pool_users_6_10_desc' },
        '10+': { name: 'pool_basics_bather_10_plus', description: 'pool_basics_pool_users_10_plus_desc' },
      } as Record<NumberOfPoolUsers, { name: string; description: string }>,
    },
  ],
};

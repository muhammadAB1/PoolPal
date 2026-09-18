import type {
  HotTubType,
  ManualChlorineStatus,
  NumberOfPoolUsers,
  OccupancyPattern,
  PoolEnvironment,
  PoolType,
  RentalActivity,
  SaltSystemStatus,
  SpaAttachmentType,
  SpaSanitizer,
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
      database_column_name: 'salt_system_status' as const,
      title: 'pool_basics_review_salt_status',
      value: {
        working: { name: 'pool_basics_salt_status_working', description: 'pool_basics_salt_status_working_desc' },
        not_working: { name: 'pool_basics_salt_status_not_working', description: 'pool_basics_salt_status_not_working_desc' },
      } as Record<SaltSystemStatus, { name: string; description: string }>,
    },
    {
      database_column_name: 'manual_chlorine_during_salt_failure' as const,
      title: 'pool_basics_review_manual_chlorine',
      value: {
        yes: { name: 'common_yes', description: 'pool_basics_manual_chlorine_yes_desc' },
        no: { name: 'common_no', description: 'pool_basics_manual_chlorine_no_desc' },
      } as Record<ManualChlorineStatus, { name: string; description: string }>,
    },
    {
      database_column_name: 'pool_screen' as const,
      title: 'pool_basics_review_environment',
      value: {
        Outdoor: { name: 'pool_basics_environment_outdoor', description: 'pool_basics_environment_outdoor_desc' },
        Screened: { name: 'pool_basics_environment_screened', description: 'pool_basics_environment_screened_desc' },
        Covered: { name: 'pool_basics_environment_covered', description: 'pool_basics_environment_covered_desc' },
        Indoor: { name: 'pool_basics_environment_indoor', description: 'pool_basics_environment_indoor_desc' },
      } as Record<PoolEnvironment, { name: string; description: string }>,
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
      database_column_name: 'standalone_spa_sanitizer' as const,
      title: 'pool_basics_review_spa_sanitizer',
      value: {
        chlorine: { name: 'pool_basics_sanitizer_chlorine', description: 'pool_basics_sanitizer_chlorine_desc' },
        saltwater: { name: 'pool_basics_sanitizer_saltwater', description: 'pool_basics_sanitizer_saltwater_desc' },
        bromine: { name: 'pool_basics_sanitizer_bromine', description: 'pool_basics_sanitizer_bromine_desc' },
        unknown: { name: 'pool_basics_sanitizer_unknown', description: 'pool_basics_sanitizer_unknown_desc' },
      } as Record<SpaSanitizer, { name: string; description: string }>,
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
      database_column_name: 'occupancy_pattern' as const,
      title: 'pool_basics_review_occupancy',
      value: {
        year_round: { name: 'pool_basics_year_round_yes', description: 'pool_basics_year_round_yes_desc' },
        seasonal: { name: 'pool_basics_year_round_no', description: 'pool_basics_year_round_no_desc' },
      } as Record<OccupancyPattern, { name: string; description: string }>,
    },
    {
      database_column_name: 'seasonal_unused_months' as const,
      title: 'pool_basics_review_unused_months',
      value: {
        Jan: { name: 'Jan', description: 'pool_basics_review_unused_months_desc' },
        Feb: { name: 'Feb', description: 'pool_basics_review_unused_months_desc' },
        Mar: { name: 'Mar', description: 'pool_basics_review_unused_months_desc' },
        Apr: { name: 'Apr', description: 'pool_basics_review_unused_months_desc' },
        May: { name: 'May', description: 'pool_basics_review_unused_months_desc' },
        Jun: { name: 'Jun', description: 'pool_basics_review_unused_months_desc' },
        Jul: { name: 'Jul', description: 'pool_basics_review_unused_months_desc' },
        Aug: { name: 'Aug', description: 'pool_basics_review_unused_months_desc' },
        Sep: { name: 'Sep', description: 'pool_basics_review_unused_months_desc' },
        Oct: { name: 'Oct', description: 'pool_basics_review_unused_months_desc' },
        Nov: { name: 'Nov', description: 'pool_basics_review_unused_months_desc' },
        Dec: { name: 'Dec', description: 'pool_basics_review_unused_months_desc' },
      } as Record<string, { name: string; description: string }>,
    },
    {
      database_column_name: 'rental_activity' as const,
      title: 'pool_basics_review_rental_activity',
      value: {
        year_round: { name: 'pool_basics_rental_year_round', description: 'pool_basics_rental_year_round_desc' },
        seasonal: { name: 'pool_basics_rental_seasonal', description: 'pool_basics_rental_seasonal_desc' },
      } as Record<RentalActivity, { name: string; description: string }>,
    },
    {
      database_column_name: 'rental_active_months' as const,
      title: 'pool_basics_review_active_months',
      value: {
        Jan: { name: 'Jan', description: 'pool_basics_review_active_months_desc' },
        Feb: { name: 'Feb', description: 'pool_basics_review_active_months_desc' },
        Mar: { name: 'Mar', description: 'pool_basics_review_active_months_desc' },
        Apr: { name: 'Apr', description: 'pool_basics_review_active_months_desc' },
        May: { name: 'May', description: 'pool_basics_review_active_months_desc' },
        Jun: { name: 'Jun', description: 'pool_basics_review_active_months_desc' },
        Jul: { name: 'Jul', description: 'pool_basics_review_active_months_desc' },
        Aug: { name: 'Aug', description: 'pool_basics_review_active_months_desc' },
        Sep: { name: 'Sep', description: 'pool_basics_review_active_months_desc' },
        Oct: { name: 'Oct', description: 'pool_basics_review_active_months_desc' },
        Nov: { name: 'Nov', description: 'pool_basics_review_active_months_desc' },
        Dec: { name: 'Dec', description: 'pool_basics_review_active_months_desc' },
      } as Record<string, { name: string; description: string }>,
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

import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Static rows for the Pool tab ("My Pool Profile").
 * heading matches the onboarding screen name in app/(onboarding)/
 * titleKey points at strings in translations.ts
 */
export type PoolProfileRow = {
  heading: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  titleKey: string;
  showWarning?: boolean;
  description?: string;
};

export const POOL_PROFILE_ROWS: PoolProfileRow[] = [
  {
    heading: 'pool-basics',
    icon: 'waves',
    titleKey: 'pool_tab_basics',
  },
  {
    heading: 'pool-condition',
    icon: 'water-outline',
    titleKey: 'pool_tab_condition',
  },
  {
    heading: 'pool-size-gallons',
    icon: 'ruler',
    titleKey: 'pool_tab_size',
  },
  {
    heading: 'equipment-basics',
    icon: 'speedometer',
    titleKey: 'pool_tab_equipment',
  },
  {
    heading: 'surface-type',
    icon: 'layers-outline',
    titleKey: 'pool_tab_surface',
  },
  {
    heading: 'cleaning-setup',
    icon: 'star-four-points-outline',
    titleKey: 'pool_tab_cleaning',
  },
  {
    heading: 'weekly-reminder',
    icon: 'bell-outline',
    titleKey: 'pool_tab_reminder',
  },
];

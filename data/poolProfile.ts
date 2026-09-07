import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';

/**
 * Static rows for the Pool tab ("My Pool Profile").
 * heading matches the onboarding screen name in app/(onboarding)/
 * href points at the matching review stub in app/(pool)/
 * titleKey points at strings in translations.ts
 */
export type PoolProfileRow = {
  heading: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  titleKey: string;
  href: Href;
  showWarning?: boolean;
  description?: string;
};

export const POOL_PROFILE_ROWS: PoolProfileRow[] = [
  {
    heading: 'pool-basics',
    icon: 'waves',
    titleKey: 'pool_tab_basics',
    href: '/(pool)/basics' as Href,
  },
  {
    heading: 'pool-condition',
    icon: 'water-outline',
    titleKey: 'pool_tab_condition',
    href: '/(pool)/condition' as Href,
  },
  {
    heading: 'pool-size-gallons',
    icon: 'ruler',
    titleKey: 'pool_tab_size',
    href: '/(pool)/size' as Href,
  },
  {
    heading: 'equipment-basics',
    icon: 'speedometer',
    titleKey: 'pool_tab_equipment',
    href: '/(pool)/equipment' as Href,
  },
  {
    heading: 'surface-type',
    icon: 'layers-outline',
    titleKey: 'pool_tab_surface',
    href: '/(pool)/surface' as Href,
  },
  {
    heading: 'cleaning-setup',
    icon: 'star-four-points-outline',
    titleKey: 'pool_tab_cleaning',
    href: '/(pool)/cleaning' as Href,
  },
  {
    heading: 'weekly-reminder',
    icon: 'bell-outline',
    titleKey: 'pool_tab_reminder',
    href: '/(pool)/reminder' as Href,
  },
];

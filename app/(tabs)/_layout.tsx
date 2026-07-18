import { navImages } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, ImageSourcePropType, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Each source PNG has different amounts of built-in padding, so the same
 * box size can make icons look bigger/smaller than their neighbors.
 * Tune `active`/`inactive` per tab below until they look visually balanced.
 */
const NAV_ICON_SIZES: Record<
  'home' | 'pool' | 'readings' | 'checklist' | 'learn',
  { active: number; inactive: number }
> = {
  home: { active:40 , inactive: 30 },
  pool: { active: 40, inactive: 70 },
  readings: { active: 40, inactive: 37 },
  checklist: { active: 40, inactive: 37 },
  learn: { active: 50, inactive: 50 },
};

type NavIconProps = {
  source: { active: ImageSourcePropType; inactive: ImageSourcePropType };
  focused: boolean;
  tintActive?: boolean;
  activeSize: number;
  inactiveSize: number;
};

function NavIcon({ source, focused, tintActive, activeSize, inactiveSize }: NavIconProps) {
  const size = focused ? activeSize : inactiveSize;

  return (
    <Image
      source={focused ? source.active : source.inactive}
      resizeMode="contain"
      style={[
        { width: size, height: size },
        tintActive && focused ? { tintColor: colors.brand.blue } : undefined,
      ]}
    />
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const { loading: poolLoading } = usePool();

  if (loading || poolLoading) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center gap-6">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </SafeAreaView>
  }
  if (!user) {
    return <Redirect href="/" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand.blue,
        tabBarInactiveTintColor: colors.text.faint,
        tabBarLabelStyle: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 11 },
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: colors.surface.white,
          borderTopWidth: 0.5,
          borderTopColor: colors.border.default,
          elevation: 0,
          shadowOpacity: 0,
          shadowColor: 'transparent',
        },
        tabBarItemStyle: { gap: 2 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('nav_home'),
          tabBarIcon: ({ focused }) => (
            <NavIcon
              source={navImages.home}
              focused={focused}
              activeSize={NAV_ICON_SIZES.home.active}
              inactiveSize={NAV_ICON_SIZES.home.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pool"
        options={{
          title: t('nav_pool'),
          tabBarIcon: ({ focused }) => (
            <NavIcon
              source={navImages.pool}
              focused={focused}
              activeSize={NAV_ICON_SIZES.pool.active}
              inactiveSize={NAV_ICON_SIZES.pool.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="readings"
        options={{
          title: t('nav_readings'),
          tabBarIcon: ({ focused }) => (
            <NavIcon
              source={navImages.readings}
              focused={focused}
              activeSize={NAV_ICON_SIZES.readings.active}
              inactiveSize={NAV_ICON_SIZES.readings.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: t('nav_checklist'),
          tabBarIcon: ({ focused }) => (
            <NavIcon
              source={navImages.checklist}
              focused={focused}
              tintActive
              activeSize={NAV_ICON_SIZES.checklist.active}
              inactiveSize={NAV_ICON_SIZES.checklist.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('nav_learn'),
          tabBarIcon: ({ focused }) => (
            <NavIcon
              source={navImages.learn}
              focused={focused}
              activeSize={NAV_ICON_SIZES.learn.active}
              inactiveSize={NAV_ICON_SIZES.learn.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}

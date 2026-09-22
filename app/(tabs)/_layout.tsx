import { navImages } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, ImageSourcePropType, Platform, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ICON_SIZES: Record<
  'home' | 'pool' | 'shop' | 'readings' | 'checklist',
  { active: number; inactive: number }
> = {
  home: { active: 34, inactive: 28 },
  pool: { active: 35, inactive: 40 },
  shop: { active: 35, inactive: 32 },
  readings: { active: 34, inactive: 32 },
  checklist: { active: 34, inactive: 32 },
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
        tintActive && focused ? { tintColor: '#0B84F3' } : undefined,
      ]}
    />
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const { loading: poolLoading } = usePool();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 14 : 8);

  if (loading || poolLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View className="flex-1 items-center justify-center gap-6">
          <ActivityIndicator size="large" color="#0B84F3" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0B84F3',
        tabBarInactiveTintColor: '#7D879B',
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_600SemiBold',
          fontSize: 11,
          marginTop: 1,
        },
        tabBarStyle: {
          height: 62 + bottomInset,
          paddingTop: 7,
          paddingBottom: bottomInset,
          backgroundColor: colors.surface.white,
          borderTopWidth: 1,
          borderTopColor: '#DCE6EE',
          elevation: 10,
          shadowColor: '#073B5C',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarItemStyle: { paddingVertical: 1 },
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
        name="shop"
        options={{
          title: t('nav_shop'),
          tabBarIcon: ({ focused }) => (
            <NavIcon
              source={navImages.shop}
              focused={focused}
              activeSize={NAV_ICON_SIZES.shop.active}
              inactiveSize={NAV_ICON_SIZES.shop.inactive}
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
      <Tabs.Screen name="learn" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}

import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { icons } from '@/constants/images';
import { usePool } from '@/providers/PoolProvider';

const onboardingSteps = ['pool-basics', 'pool-condition', 'pool-size-gallons', 'equipment-basics', 'surface-type', 'cleaning-setup', 'test-readings', 'weekly-reminder'] as const;

function OnboardingHeader({
  routeName,
  onBackPress,
}: {
  routeName: string;
  onBackPress: () => void;
}) {
  const currentStepIndex = onboardingSteps.indexOf(routeName as (typeof onboardingSteps)[number]);
  const progressPercent = currentStepIndex >= 0
    ? ((currentStepIndex + 1) / onboardingSteps.length) * 100
    : 0;
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-surface-white px-5 pb-1" style={{ paddingTop: Math.max(insets.top, 4) }}>
      <TouchableOpacity
        className="w-10 h-10 items-center justify-center -ml-2"
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Image
          source={icons.backArrow}
          className="w-5 h-5"
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View className="progress-bar mt-1 -mb-8">
        <View className="progress-bar__fill" style={{ width: `${progressPercent}%` }} />
      </View>
    </View>
  );
}

export default function OnboardingLayout() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { poolId, loading: poolLoading } = usePool();
  const { resume } = useGlobalSearchParams<{ resume?: string }>();

  // Once a user enters via the dashboard's "resume" link, keep letting them
  // move between onboarding steps for the rest of this session, even though
  // internal navigation won't keep re-sending the `resume` param on every screen.
  const resumingRef = useRef(false);
  if (resume === '1') {
    resumingRef.current = true;
  }

  if (loading || poolLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View className="flex-1 items-center justify-center gap-6">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Redirect href="/" />;
  }

  if (poolId && !resumingRef.current) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShown: true,
        headerShadowVisible: false,
        headerTitle: '',
        headerStyle: { backgroundColor: '#FFFFFF' },
        header: () => (
          <OnboardingHeader
            routeName={route.name}
            onBackPress={() => {
              if (router.canGoBack()) {
                router.back();
              }
            }}
          />
        ),
      })}
    >
      <Stack.Screen name="pool-basics" />
      <Stack.Screen name="pool-condition" />
      <Stack.Screen name="pool-size-gallons" />
      <Stack.Screen name="surface-type" />
      <Stack.Screen name="equipment-basics" />
      <Stack.Screen name="cleaning-setup" />
      <Stack.Screen name="test-readings" />
      <Stack.Screen name="weekly-reminder" />
      <Stack.Screen name="onboarding-complete"
        options={{ headerShown: false }} />
    </Stack>
  );
}

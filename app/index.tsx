import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, Redirect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { graphics } from '@/constants/images';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { poolId, loading: poolLoading } = usePool();

  console.log('hello from index')
  if (authLoading || poolLoading) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center gap-6">
        <Image
          source={graphics.poolPalLogo}
          className=" left-[18%]"
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  }

  if (user) {
    return <Redirect href={poolId ? '/(tabs)/dashboard' as Href : '/(onboarding)/pool-basics' as Href} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center gap-6">
        <Image
          source={graphics.poolPalLogo}
          className=" left-[18%]"
          resizeMode="contain"
        />
        <TouchableOpacity
          className="bg-brand-blue rounded-full py-[14px] px-8 items-center"
          onPress={() => router.replace('/welcome')}
          activeOpacity={0.85}
        >
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('open_welcome')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

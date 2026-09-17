import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, Redirect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import PoolTonicLogo from '@/components/PoolTonicLogo';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthScreenGuard } from '@/hooks/useAuthScreenGuard';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const authRedirect = useAuthScreenGuard();

  console.log('hello from index')
  if (authLoading) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center gap-6">
        <PoolTonicLogo width={220} height={64} />
      </View>
    </SafeAreaView>
  }

  if (user && authRedirect) {
    return <Redirect href={authRedirect as Href} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center gap-6">
        <PoolTonicLogo width={220} height={64} />
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

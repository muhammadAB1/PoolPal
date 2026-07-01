import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSupabase } from '@/hooks/supabaseHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { logout } = useSupabase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-h1 font-jakarta-extrabold text-brand-navy text-center">
          {t('dashboard_welcome_back')}
        </Text>
        <Button title="Logout" onPress={async () => { await logout(); await AsyncStorage.removeItem('activePoolId'); router.replace('/'); }} />
      </View>
    </SafeAreaView>
  );
}

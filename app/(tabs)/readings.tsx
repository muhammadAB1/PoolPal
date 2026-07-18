import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function ReadingsScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-h2 font-jakarta-extrabold text-brand-navy text-center">
          {t('nav_readings')}
        </Text>
        <Text className="text-body font-jakarta text-sub text-center mt-2">
          {t('dashboard_coming_soon')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

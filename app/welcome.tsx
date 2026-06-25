import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { icons } from '@/constants/images';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 px-5 pt-6 pb-6">
        <View className="flex-1">
          <View className="bg-surface-soft-aqua rounded-[28px] items-center pt-9 pb-8">
            <View className="w-20 h-20 bg-surface-white rounded-2xl items-center justify-center">
              <Image source={icons.waterDrop} className="w-10 h-10" resizeMode="contain" />
            </View>
            <Text className="text-h2 font-jakarta-extrabold text-brand-navy mt-3">PoolWise</Text>
          </View>

          <View className="mt-8">
            <Text className="text-h1 font-jakarta-extrabold text-brand-navy leading-tight">
              {t('welcome_title')}
            </Text>
            <Text className="text-body font-jakarta text-sub mt-3 leading-relaxed">
              {t('welcome_subtitle')}
            </Text>

            <View className="mt-8 flex-row items-center">
              <View className="w-16 h-16 bg-surface-soft-aqua rounded-2xl items-center justify-center">
                <Image source={icons.camera} className="w-8 h-8" resizeMode="contain" />
              </View>
              <Text className="text-body font-jakarta text-sub leading-relaxed ml-3 flex-1">
                {t('welcome_photo_tip')}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity
            className="bg-brand-blue rounded-full h-16 items-center justify-center"
            onPress={() => {
              router.push('/signup');
            }}
            activeOpacity={0.85}
          >
            <Text className="text-button font-jakarta-bold text-surface-white">
              {t('welcome_get_started')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-surface-soft-aqua rounded-full h-16 items-center justify-center mt-3"
            onPress={() => {
              router.push('/signin');
            }}
            activeOpacity={0.85}
          >
            <Text className="text-button font-jakarta-bold text-brand-blue">
              {t('welcome_have_account')}
            </Text>
          </TouchableOpacity>

          <Text className="text-small font-jakarta text-faint text-center mt-5">
            {t('welcome_setup_note')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

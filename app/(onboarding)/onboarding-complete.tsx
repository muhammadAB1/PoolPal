import ProfileCompletionRing from '@/components/ProfileCompletionRing';
import { icons, onboardingCompleteImages } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { useSupabase } from '@/hooks/supabaseHooks';
import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PlanPoint = {
  icon: ImageSourcePropType;
  titleKey: string;
  descKey: string;
};

const PLAN_POINTS: PlanPoint[] = [
  {
    icon: onboardingCompleteImages.knowWhatToDo,
    titleKey: 'onboarding_complete_know_title',
    descKey: 'onboarding_complete_know_desc',
  },
  {
    icon: onboardingCompleteImages.catchProblems,
    titleKey: 'onboarding_complete_problems_title',
    descKey: 'onboarding_complete_problems_desc',
  },
  {
    icon: onboardingCompleteImages.keepWaterSafe,
    titleKey: 'onboarding_complete_water_title',
    descKey: 'onboarding_complete_water_desc',
  },
  {
    icon: onboardingCompleteImages.rightProducts,
    titleKey: 'onboarding_complete_products_title',
    descKey: 'onboarding_complete_products_desc',
  },
  {
    icon: onboardingCompleteImages.weeklyCare,
    titleKey: 'onboarding_complete_weekly_title',
    descKey: 'onboarding_complete_weekly_desc',
  },
];

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { percentage } = useLocalSearchParams<{ percentage?: string }>();
  const { weeklyReminderInsert } = useSupabase();
  const [fetchedPercentage, setFetchedPercentage] = useState<string>();

  useEffect(() => {
    void weeklyReminderInsert({}).then(({ data }) => {
      if (data?.profile_completion_score != null) {
        setFetchedPercentage(String(data.profile_completion_score));
      }
    });
  }, []);

  const rawPercentage = fetchedPercentage ?? percentage ?? '0';
  const completionScore = Number.parseInt(rawPercentage, 10);
  const safePercentage = Number.isFinite(completionScore)
    ? Math.min(100, Math.max(0, completionScore))
    : 0;

  function handleGoToDashboard() {
    router.replace('/(tabs)/dashboard' as Href);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Image
        source={onboardingCompleteImages.background}
        resizeMode="cover"
        pointerEvents="none"
        className="absolute top-0 left-0 w-full h-full"
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 pt-2">
            <View className="items-center mt-1">
              <ProfileCompletionRing
                percentage={safePercentage}
                size={148}
                strokeWidth={12}
                label={t('onboarding_complete_profile_label')}
              />
            </View>

            <View className="flex-row items-center gap-1.5 self-center bg-[#E5F8EF] px-3 py-1.5 rounded-full mt-5">
              <Ionicons name="checkmark-circle" size={18} color={colors.status.success} />
              <Text className="text-[13px] font-jakarta-bold text-success-text">
                {t('onboarding_complete_badge')}
              </Text>
            </View>

            <Text className="text-[26px] leading-8 font-jakarta-extrabold text-brand-navy text-center mt-4 px-2">
              {t('onboarding_complete_title')}
            </Text>

            <Text className="text-[15px] leading-6 font-jakarta text-sub text-center mt-2 px-3">
              {t('onboarding_complete_subtitle')}
            </Text>

            <View
              className="bg-surface-white rounded-3xl border border-border-default mt-5 px-3.5"
              style={shadow.card}
            >
              {PLAN_POINTS.map((point, index) => {
                const isLast = index === PLAN_POINTS.length - 1;
                return (
                  <View
                    key={point.titleKey}
                    className={`flex-row items-center py-3.5 ${isLast ? '' : 'border-b border-border-default'}`}
                  >
                    <Image
                      source={point.icon}
                      className="w-14 h-14"
                      resizeMode="contain"
                    />
                    <View className="flex-1 ml-3">
                      <Text className="text-[15px] leading-5 font-jakarta-bold text-brand-navy">
                        {t(point.titleKey)}
                      </Text>
                      <Text className="text-[13px] leading-5 font-jakarta text-sub mt-0.5">
                        {t(point.descKey)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View className="mt-4 px-3.5 py-3.5 rounded-2xl flex-row items-center gap-2.5 bg-[#E7F6EF]">
              <Image
                source={icons.info}
                className="w-6 h-6"
                resizeMode="contain"
              />
              <Text className="flex-1 text-[13px] leading-5 font-jakarta text-charcoal">
                {t('onboarding_complete_info')}
              </Text>
            </View>

            <TouchableOpacity
              className="btn--primary rounded-full py-4.25 items-center justify-center mt-4 mb-2"
              onPress={handleGoToDashboard}
              activeOpacity={0.85}
            >
              <Text className="text-button font-jakarta-bold btn__label--primary">
                {t('onboarding_complete_cta')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

import ProfileCompletionRing from '@/components/ProfileCompletionRing';
import { onboardingCompleteImages } from '@/constants/images';
import { colors } from '@/constants/theme';
import { usePool } from '@/providers/PoolProvider';
import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
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

type ImproveStep = {
  icon: ImageSourcePropType;
  titleKey: string;
  descKey: string;
};

const IMPROVE_STEPS: ImproveStep[] = [
  {
    icon: onboardingCompleteImages.waterDrop,
    titleKey: 'onboarding_complete_water_title',
    descKey: 'onboarding_complete_water_desc',
  },
  {
    icon: onboardingCompleteImages.testTube,
    titleKey: 'onboarding_complete_kit_title',
    descKey: 'onboarding_complete_kit_desc',
  },
  {
    icon: onboardingCompleteImages.photo,
    titleKey: 'onboarding_complete_photos_title',
    descKey: 'onboarding_complete_photos_desc',
  },
  {
    icon: onboardingCompleteImages.calculator,
    titleKey: 'onboarding_complete_gallons_title',
    descKey: 'onboarding_complete_gallons_desc',
  },
];

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { percentage, poolId: routePoolId } = useLocalSearchParams<{ percentage?: string, poolId?: string }>();
  const { poolId: contextPoolId, pools, setPoolId } = usePool();

  // When arriving here from the dashboard's "resume" flow (finishing off the
  // last missing detail), no params are passed - fall back to what's already
  // in context instead.
  const resolvedPoolId = routePoolId || contextPoolId;
  const rawPercentage = percentage ?? pools?.profile_completion_score?.toString();
  const completionScore = Number.parseInt(rawPercentage ?? '0', 10);
  const safePercentage = Number.isFinite(completionScore)
    ? Math.min(100, Math.max(0, completionScore))
    : 0;

  function handleGoToDashboard() {
    router.replace('/(tabs)/dashboard' as Href);
    setPoolId(resolvedPoolId as string);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-2">
          <View className="items-center mt-2">
            <ProfileCompletionRing
              percentage={safePercentage}
              size={148}
              strokeWidth={12}
              label={t('onboarding_complete_profile_label')}
            />
          </View>

          <Text className="text-h1 font-jakarta-extrabold text-brand-navy text-center mt-5 px-2">
            {t('onboarding_complete_title')}
          </Text>

          <View className="items-center mt-3">
            <View className="chip--success flex-row items-center gap-1.5 px-3 py-1.5 rounded-full">
              <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
              <Text className="text-small font-jakarta-bold text-success-text">
                {t('onboarding_complete_badge')}
              </Text>
            </View>
          </View>

          <View className="card--info mt-5 px-4 py-3.5 flex-row items-start gap-3">
            <Image
              source={onboardingCompleteImages.info}
              className="w-6 h-6 mt-0.5"
              resizeMode="contain"
            />
            <Text className="flex-1 text-body font-jakarta text-charcoal">
              <Text className="font-jakarta-bold">{t('onboarding_complete_info_bold')} </Text>
              {t('onboarding_complete_info_rest')}
            </Text>
          </View>

          <View className="card mt-5 px-4 pt-4 pb-1">
            <Text className="text-h3 font-jakarta-extrabold text-brand-navy">
              {t('onboarding_complete_improve_title')}
            </Text>
            <Text className="text-small font-jakarta text-sub mt-1 mb-2">
              {t('onboarding_complete_improve_subtitle')}
            </Text>

            {IMPROVE_STEPS.map((step, index) => {
              const isLast = index === IMPROVE_STEPS.length - 1;
              return (
                <TouchableOpacity
                  key={step.titleKey}
                  activeOpacity={0.7}
                  className={`flex-row items-center py-3.5 ${isLast ? '' : 'border-b border-border-default'}`}
                >
                  <Image
                    source={step.icon}
                    className="w-11 h-11"
                    resizeMode="contain"
                  />
                  <View className="flex-1 ml-3 mr-2">
                    <Text className="text-body font-jakarta-bold text-brand-navy">
                      {t(step.titleKey)}
                    </Text>
                    <Text className="text-small font-jakarta text-sub mt-0.5">
                      {t(step.descKey)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.text.faint} />
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="card--success mt-5 px-4 py-3.5 flex-row items-start gap-3">
            <Image
              source={onboardingCompleteImages.star}
              className="w-10 h-10"
              resizeMode="contain"
            />
            <Text className="flex-1 text-small font-jakarta text-charcoal mt-1">
              {t('onboarding_complete_tip')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-surface-white px-5 pt-3 pb-7 border-t border-border-default">
        <TouchableOpacity
          className="bg-brand-blue rounded-full py-4.25 items-center justify-center"
          onPress={handleGoToDashboard}
          activeOpacity={0.85}
        >
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('onboarding_complete_cta')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

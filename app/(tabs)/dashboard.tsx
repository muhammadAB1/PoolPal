import ProfileCompletionRing from '@/components/ProfileCompletionRing';
import { dashboardImages } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { useSupabase } from '@/hooks/supabaseHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Image, ImageSourcePropType, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type User } from '@supabase/supabase-js';

type QuickAction = {
  icon: ImageSourcePropType;
  titleKey: string;
  descKey: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: dashboardImages.uploadPhotoIcon,
    titleKey: 'dashboard_upload_photo_title',
    descKey: 'dashboard_upload_photo_desc',
  },
  {
    icon: dashboardImages.askPoolwiseIcon,
    titleKey: 'dashboard_ask_poolwise_title',
    descKey: 'dashboard_ask_poolwise_desc',
  },
  {
    icon: dashboardImages.learnIcon,
    titleKey: 'dashboard_learn_title',
    descKey: 'dashboard_learn_desc',
  },
];

function getDisplayName(user: User | null) {
  return user?.user_metadata?.full_name.split(' ')[0]
}

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { pools, refreshPools } = usePool();
  const { logout } = useSupabase();

  // Keep pool context fresh when landing on dashboard (e.g. after onboarding).
  useFocusEffect(
    useCallback(() => {
      void refreshPools({ silent: true });
    }, [refreshPools]),
  );

  const displayName = getDisplayName(user);
  const completionScore = pools?.profile_completion_score ?? 0;
  const detailsLeft = pools?.missing_details?.length ?? 0;

  const checklistCompleted = 3;
  const checklistTotal = 11;
  const checklistProgress = checklistCompleted / checklistTotal;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-0">
              <Text className="text-h1 font-jakarta-extrabold text-brand-navy -mr-4">
                {t('dashboard_greeting', { name: displayName })}
              </Text>
              <Image source={dashboardImages.helloEmoji} className="w-16 h-16 -mb-2" />
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Image source={dashboardImages.notificationBell} className="w-16 h-16" />
            </TouchableOpacity>
          </View>

          {/* Pool summary card */}
          <View className="card--info mt-4 p-4 flex-row items-center">
            <Image
              source={dashboardImages.poolIllustration}
              className="w-20 h-20 rounded-full -ml-2"
            />
            <View className="flex-1 ml-1">
              <Text className="text-h3 font-jakarta-extrabold text-brand-navy">
                {pools?.pool_name ?? ''}
              </Text>
              <View className="chip--success flex-row items-center self-start  gap-1 mt-1.5 rounded-full">
                <Image source={dashboardImages.greenCheckIcon} className="w-8 h-8 mt-1 -mr-2" />
                <Text className="text-small font-jakarta-bold text-success-text mr-2">
                  {t('dashboard_plan_ready_badge')}
                </Text>
              </View>
            </View>
            <ProfileCompletionRing
              percentage={completionScore}
              size={64}
              strokeWidth={7}
              progressColor={colors.brand.blue}
            />
          </View>

          {/* Recommended first step */}
          <View className="card--success mt-4 p-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center gap-1.5">
                  <Image source={dashboardImages.starBadge} className="w-6 h-6" resizeMode="contain" />
                  <Text className="text-tiny font-jakarta-extrabold text-success-text tracking-wide">
                    {t('dashboard_recommended_badge').toUpperCase()}
                  </Text>
                </View>
                <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-1.5">
                  {t('dashboard_testing_kit_title')}
                </Text>
                <Text className="text-body font-jakarta text-sub mt-1.5">
                  {t('dashboard_testing_kit_desc')}
                </Text>
              </View>
              <Image
                source={dashboardImages.testingKitGraphic}
                className="w-24 h-24 rounded-2xl"
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              className="bg-brand-blue self-start flex-row items-center gap-1.5 rounded-full px-5 py-3 mt-3.5"
              activeOpacity={0.85}
            >
              <Text className="text-button font-jakarta-bold text-surface-white">
                {t('dashboard_choose_kit_cta')}
              </Text>
              <Image
                source={dashboardImages.chevronRight}
                className="w-3 h-3"
                resizeMode="contain"
                style={{ tintColor: colors.surface.white }}
              />
            </TouchableOpacity>
          </View>

          {/* Profile / Next Step */}
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              className="card flex-1 p-4"
              activeOpacity={0.7}
              onPress={() => {
                const [firstStep, ...rest] = pools?.missing_details ?? [];
                if (!firstStep) return;
                router.push({
                  pathname: `/(onboarding)/${firstStep}`,
                  params: { resume: '1', remaining: rest.join(',') },
                } as Href);
              }}
            >
              <View className="flex-row items-start justify-between">
                <Image source={dashboardImages.profileIcon} className="w-12 h-12 -ml-2" />
                <Image
                  source={dashboardImages.chevronRight}
                  className="w-8 h-8 mt-1"
                />
              </View>
              <Text className="text-body-lg font-jakarta-bold text-brand-navy mt-2">
                {t('dashboard_profile_label')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-1">
                {t('dashboard_profile_percent_label', { percent: completionScore })}
              </Text>
              <Text className="text-small font-jakarta text-sub">
                {t('dashboard_details_left', { count: detailsLeft })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="card flex-1 p-4" activeOpacity={0.7}>
              <View className="flex-row items-start justify-between">
                <Image source={dashboardImages.nextStepIcon} className="w-10 h-10 -ml-2" />
                <Image
                  source={dashboardImages.chevronRight}
                  className="w-8 h-8 mt-1"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-body-lg font-jakarta-bold text-brand-navy mt-4">
                {t('dashboard_next_step_label')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-1">
                {t('dashboard_testing_kit_title')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Weekly Care Checklist */}
          <TouchableOpacity className="card mt-4 p-4 flex-row items-center" activeOpacity={0.7}>
            <View className="icon-circle">
              <Image source={dashboardImages.checklistIcon} className="w-14 h-14" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t('dashboard_checklist_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('dashboard_checklist_progress', {
                  completed: checklistCompleted,
                  total: checklistTotal,
                })}
              </Text>
              <View className="progress-bar mt-2">
                <View
                  className="progress-bar__fill"
                  style={{ width: `${checklistProgress * 100}%` }}
                />
              </View>
            </View>
            <Image source={dashboardImages.chevronRight} className="w-8 h-8 ml-2" />
          </TouchableOpacity>

          {/* Latest Readings */}
          <TouchableOpacity className="card mt-4 p-4 flex-row items-start" activeOpacity={0.7}>
            <Image source={dashboardImages.readingsIcon} className="w-13 h-13 self-center -ml-1" />
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t('dashboard_readings_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-1">
                <Text className="font-jakarta-bold text-brand-blue">
                  {t('dashboard_readings_cta')}
                </Text>
                {t('dashboard_readings_or_upload')}
              </Text>
            </View>
            <Image source={dashboardImages.chevronRight} className="w-4 h-4 mt-1 ml-2" resizeMode="contain" />
          </TouchableOpacity>

          {/* Quick actions */}
          <View className="card mt-4 px-4">
            {QUICK_ACTIONS.map((action, index) => {
              const isLast = index === QUICK_ACTIONS.length - 1;
              return (
                <TouchableOpacity
                  key={action.titleKey}
                  activeOpacity={0.7}
                  className={`flex-row items-center py-3.5 ${isLast ? '' : 'border-b border-border-default'}`}
                >
                  <Image source={action.icon} className="w-14 h-14 rounded-full" />
                  <View className="flex-1 ml-3 mr-2">
                    <Text className="text-body font-jakarta-bold text-brand-navy">
                      {t(action.titleKey)}
                    </Text>
                    <Text className="text-small font-jakarta text-sub mt-0.5">
                      {t(action.descKey)}
                    </Text>
                  </View>
                  <Image source={dashboardImages.chevronRight} className="w-6 h-6" resizeMode="contain" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-h1 font-jakarta-extrabold text-brand-navy text-center">
            {t('dashboard_welcome_back')}
          </Text>
          <Button title="Logout" onPress={async () => { await logout(); await AsyncStorage.removeItem('activePoolId'); router.replace('/welcome'); }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

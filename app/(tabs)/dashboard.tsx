import ProfileCompletionRing from '@/components/ProfileCompletionRing';
import { dashboardImages, icons, navImages } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useSupabase } from '@/hooks/supabaseHooks';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type User } from '@supabase/supabase-js';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type QuickAction = {
  key: string;
  titleKey: string;
  descKey: string;
  icon?: ImageSourcePropType;
  ionicon?: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    key: 'solve',
    titleKey: 'dashboard_solve_problems_title',
    descKey: 'dashboard_solve_problems_desc',
    ionicon: 'search-outline',
    iconBg: '#E8F8F0',
    iconColor: '#2EB872',
  },
  {
    key: 'shop',
    titleKey: 'dashboard_shop_title',
    descKey: 'dashboard_shop_desc',
    ionicon: 'bag-handle-outline',
    iconBg: '#EEF2FF',
    iconColor: '#6366F1',
  },
  {
    key: 'ask',
    titleKey: 'dashboard_ask_poolwise_title',
    descKey: 'dashboard_ask_poolwise_desc',
    icon: dashboardImages.askPoolwiseIcon,
    iconBg: '#E8FFF7',
    iconColor: '#2EB872',
  },
  {
    key: 'learn',
    titleKey: 'dashboard_learn_title',
    descKey: 'dashboard_learn_desc',
    icon: dashboardImages.learnIcon,
    iconBg: '#FFF4E8',
    iconColor: '#F6B84B',
  },
];

/** Sample reading chips matching the dashboard design (UI only until readings are wired). */
const SAMPLE_READINGS = [
  { label: 'FC 3.2 ppm', color: '#E87B5A' },
  { label: 'pH 7.4', color: '#2EB872' },
  { label: 'TA 90 ppm', color: '#0E97DC' },
  { label: 'CYA 50 ppm', color: '#2EB872' },
] as const;

function getDisplayName(user: User | null, fallback: string) {
  const first = user?.user_metadata?.full_name?.split(' ')[0];
  return first || fallback;
}

function resumeProfile(
  missingDetails: string[] | null | undefined,
  router: ReturnType<typeof useRouter>,
) {
  const [firstStep, ...rest] = missingDetails ?? [];
  if (!firstStep) return;
  router.push({
    pathname: `/(onboarding)/${firstStep}`,
    params: { resume: '1', remaining: rest.join(',') },
  } as Href);
}

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { pools, refreshPools } = usePool();
  const { logout } = useSupabase();

  useFocusEffect(
    useCallback(() => {
      void refreshPools({ silent: true });
    }, [refreshPools]),
  );

  const displayName = getDisplayName(user, t('dashboard_greeting_fallback_name'));
  const completionScore = pools?.profile_completion_score ?? 0;
  const detailsLeft = pools?.missing_details?.length ?? 0;
  const isSetupComplete = completionScore >= 100;

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
          {/* Brand header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Image source={icons.waterDrop} className="w-7 h-7 z-1" resizeMode="contain"></Image>
              <View className='w-9 h-9 rounded-2xl absolute -translate-x-0.75 bg-brand-blue items-center justify-center'></View>
              <Text className="text-h3 font-jakarta-extrabold text-brand-navy">
                {t('dashboard_brand_name')}
              </Text>
    
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
            >
              <Ionicons name="notifications-outline" size={20} color={colors.brand.navy} />
              <View
                className="absolute w-2 h-2 rounded-full bg-error"
                style={{ top: 8, right: 9 }}
              />
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-4">
            {t('dashboard_greeting', { name: displayName })}
          </Text>
          <Text className="text-body font-jakarta text-sub mt-1">
            {t('dashboard_tagline')}
          </Text>

          {/* Pool summary card */}
          <View className="card mt-5 p-4 flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-brand-blue items-center justify-center">
              <Image
                source={navImages.pool.active}
                className="w-6 h-6"
                resizeMode="contain"
                style={{ tintColor: colors.surface.white }}
              />
            </View>
            <View className="flex-1 ml-3 mr-2">
              <Text className="text-body-lg font-jakarta-extrabold text-brand-navy">
                {pools?.pool_name ?? ''}
              </Text>
              <View className="flex-row items-center gap-1.5 mt-1">
                {isSetupComplete ? (
                  <Image source={dashboardImages.greenCheckIcon} className="w-4 h-4" />
                ) : (
                  <View
                    className="w-3.5 h-3.5 rounded-full border-2"
                    style={{ borderColor: colors.status.warning, borderTopColor: 'transparent' }}
                  />
                )}
                <Text
                  className={`text-small font-jakarta-semibold ${isSetupComplete ? 'text-success-text' : 'text-sub'
                    }`}
                >
                  {t(isSetupComplete ? 'dashboard_plan_ready_badge' : 'dashboard_setup_in_progress')}
                </Text>
              </View>
              <View className="flex-row items-center gap-1 mt-1">
                <Text className="text-small font-jakarta text-sub">
                  {t('dashboard_profile_percent_complete', { percent: completionScore })}
                </Text>
                <Image source={dashboardImages.smallInfoIcon} className="w-3.5 h-3.5" />
              </View>
            </View>
            <ProfileCompletionRing
              percentage={completionScore}
              size={64}
              strokeWidth={7}
              progressColor={colors.brand.aqua}
            />
          </View>

          {/* Recommended first step */}
          <View className="card--success mt-4 p-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center gap-1.5">
                  <Image source={dashboardImages.starBadge} className="w-5 h-5" resizeMode="contain" />
                  <Text className="text-tiny font-jakarta-extrabold text-success-text tracking-wide">
                    {t('dashboard_recommended_badge').toUpperCase()}
                  </Text>
                </View>
                <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-2">
                  {t('dashboard_testing_kit_title')}
                </Text>
                <Text className="text-body font-jakarta text-sub mt-1.5 leading-5">
                  {t('dashboard_testing_kit_desc')}
                </Text>
              </View>
              <View className="w-14 h-14 items-center justify-center mt-1">
                <Image
                  source={icons.testStrip}
                  className="w-10 h-10"
                  resizeMode="contain"
                  style={{ tintColor: colors.brand.aqua }}
                />
              </View>
            </View>
            <TouchableOpacity
              className="bg-brand-blue self-start flex-row items-center gap-1.5 rounded-full px-5 py-3 mt-4"
              activeOpacity={0.85}
            >
              <Text className="text-button font-jakarta-bold text-surface-white">
                {t('dashboard_choose_kit_cta')}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.surface.white} />
            </TouchableOpacity>
          </View>

          {/* Profile / Next Step */}
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              className="card flex-1 p-4"
              activeOpacity={0.7}
              onPress={() => resumeProfile(pools?.missing_details, router)}
            >
              <Image source={dashboardImages.profileIcon} className="w-10 h-10" />
              <Text className="text-body-lg font-jakarta-bold text-brand-navy mt-3">
                {t('dashboard_profile_label')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-1">
                {t('dashboard_profile_percent_label', { percent: completionScore })}
              </Text>
              <Text className="text-small font-jakarta-semibold text-brand-blue mt-0.5">
                {t('dashboard_details_left', { count: detailsLeft })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="card flex-1 p-4" activeOpacity={0.7}>
              <Image source={dashboardImages.nextStepIcon} className="w-10 h-10" />
              <Text className="text-body-lg font-jakarta-bold text-brand-navy mt-3">
                {t('dashboard_next_step_label')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-1">
                {t('dashboard_next_step_desc')}
              </Text>
              <View className="flex-row items-center gap-0.5 mt-1">
                <Text className="text-small font-jakarta-bold text-brand-blue">
                  {t('dashboard_next_step_go')}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={colors.brand.blue} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Weekly Care Checklist */}
          <TouchableOpacity
            className="card mt-4 p-4"
            activeOpacity={0.7}
            onPress={() => router.navigate('/(tabs)/checklist')}
          >
            <View className="flex-row items-center">
              <View className="icon-circle">
                <Image
                  source={dashboardImages.checklistIcon}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1 ml-3 mr-2">
                <Text className="text-body font-jakarta-bold text-brand-navy">
                  {t('dashboard_checklist_title')}
                </Text>
                <Text className="text-small font-jakarta text-sub mt-0.5">
                  {t('dashboard_checklist_progress', {
                    completed: checklistCompleted,
                    total: checklistTotal,
                  })}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.text.faint} />
            </View>
            <View className="progress-bar mt-3">
              <View
                className="progress-bar__fill"
                style={{ width: `${checklistProgress * 100}%` }}
              />
            </View>
          </TouchableOpacity>

          {/* Latest Readings */}
          <TouchableOpacity className="card mt-4 p-4 flex-row items-start" activeOpacity={0.7}>
            <Image source={dashboardImages.readingsIcon} className="w-10 h-10" />
            <View className="flex-1 ml-3">
              <Text className="text-body font-jakarta-bold text-brand-navy">
                {t('dashboard_readings_title')}
              </Text>
              <View className="flex-row flex-wrap gap-x-3 gap-y-1 mt-1.5">
                {SAMPLE_READINGS.map((reading) => (
                  <Text
                    key={reading.label}
                    className="text-small font-jakarta-bold"
                    style={{ color: reading.color }}
                  >
                    {reading.label}
                  </Text>
                ))}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.faint} />
          </TouchableOpacity>

          {/* Quick actions — separate cards */}
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.key}
              className="card mt-3 p-4 flex-row items-center"
              activeOpacity={0.7}
            >
              {action.icon ? (
                <Image source={action.icon} className="w-10 h-10 rounded-full" />
              ) : (
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: action.iconBg }}
                >
                  <Ionicons name={action.ionicon!} size={20} color={action.iconColor} />
                </View>
              )}
              <View className="flex-1 ml-3 mr-2">
                <Text className="text-body font-jakarta-bold text-brand-navy">
                  {t(action.titleKey)}
                </Text>
                <Text className="text-small font-jakarta text-sub mt-0.5 leading-5">
                  {t(action.descKey)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.text.faint} />
            </TouchableOpacity>
          ))}

          {/* Logout — temporary for flow testing */}
          <View className="mt-6 items-center">
            <Button
              title="Logout"
              onPress={async () => {
                await logout();
                await AsyncStorage.removeItem('activePoolId');
                router.replace('/welcome');
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

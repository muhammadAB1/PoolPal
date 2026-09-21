import NextStepCard from '@/components/NextStepCard';
import PoolTonicLogo from '@/components/PoolTonicLogo';
import ProfileCompletionRing from '@/components/ProfileCompletionRing';
import { dashboardImages } from '@/constants/images';
import { colors } from '@/constants/theme';
import { REQUIRED_TASK_IDS } from '@/data/checklist';
import { OVERALL_STATUS, SWIM_STATUS } from '@/data/readingPoolAndSwimStatusUiLabelsColorsAndIcons';
import { expireStaleChecklistTasks } from '@/lib/checklistStorage';
import { getAvatarUrl, getFirstName, getInitials } from '@/lib/user';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { useTestStrips } from '@/providers/TestStripProvider';
import { Ionicons } from '@expo/vector-icons';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  type ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Prominent status card used to surface the pool/swim status on the dashboard. */
function StatusPill({
  caption,
  color,
  icon,
  label,
}: {
  caption: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View className="flex-1 rounded-2xl px-3 py-2.5" style={{ backgroundColor: color }}>
      <Text className="text-tiny font-jakarta-bold text-surface-white opacity-80 tracking-wide">
        {caption.toUpperCase()}
      </Text>
      <View className="flex-row items-center gap-1.5 mt-1">
        <Ionicons name={icon} size={18} color={colors.surface.white} />
        <Text className="text-body font-jakarta-extrabold text-surface-white">{label}</Text>
      </View>
    </View>
  );
}

function DashboardToolRow({
  image,
  title,
  description,
  onPress,
  last = false,
}: {
  image: ImageSourcePropType;
  title: string;
  description: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      className={`min-h-22 flex-row items-center gap-3 py-3 ${last ? '' : 'border-b border-border-default'}`}
      activeOpacity={0.78}
      onPress={onPress}
    >
      <Image source={image} className="w-14 h-14 shrink-0" resizeMode="contain" />
      <View className="flex-1 min-w-0">
        <Text className="text-body-lg font-jakarta-bold text-[#071C5A]">{title}</Text>
        <Text className="text-[13px] leading-4.5 font-jakarta text-[#74809A] mt-0.5">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#74819A" />
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, name } = useAuth();
  const { pools, refreshPoolsIfStale } = usePool();
  const { latestReading } = useTestStrips();

  useFocusEffect(
    useCallback(() => {
      void refreshPoolsIfStale({ silent: true });
    }, [refreshPoolsIfStale]),
  );

  const displayName = getFirstName(name) ?? t('dashboard_greeting_fallback_name');
  const avatarUrl = getAvatarUrl(user);
  const initials = getInitials(name, user?.email);
  const completionScore = pools?.profile_completion_score ?? 0;
  const setupComplete = completionScore >= 100;
  const unreadCountRaw = user?.user_metadata?.unread_notification_count;
  const unreadCount = typeof unreadCountRaw === 'number' ? unreadCountRaw : Number(unreadCountRaw ?? 0) || 0;
  const hasUnreadNotifications = unreadCount > 0;

  const [checklistCompleted, setChecklistCompleted] = useState(0);
  const [incompleteTasks, setIncompleteTasks] = useState<string[]>([]);
  const checklistTotal = REQUIRED_TASK_IDS.length;
  const checklistProgress = checklistTotal > 0 ? checklistCompleted / checklistTotal : 0;

  // Recount from storage each time the dashboard is focused.
  // Tasks completed before this Monday are cleared so a new week shows 0, not stale 14/14.
  useFocusEffect(
    useCallback(() => {
      async function countCompletedTasks() {
        const { completed, incompleteIds } = await expireStaleChecklistTasks();
        setChecklistCompleted(completed);
        setIncompleteTasks(incompleteIds);
      }
      void countCompletedTasks();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-surface-bg" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <View className="min-h-13.5 flex-row items-center justify-between gap-2">
            <PoolTonicLogo width={188} height={48} />
            <View className="flex-row items-center gap-1 shrink-0">
              <TouchableOpacity
                className="w-11.5 h-11.5 items-center justify-center"
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={t(
                  hasUnreadNotifications
                    ? 'dashboard_notification_unread_a11y'
                    : 'dashboard_notification_a11y',
                )}
              >
                <Image
                  source={
                    hasUnreadNotifications
                      ? dashboardImages.notificationBellUnread
                      : dashboardImages.notificationBell
                  }
                  className="w-[30px] h-[30px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/(tabs)/profile')}
              >
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} className="w-11 h-11 rounded-full" />
                ) : (
                  <View className="w-11 h-11 rounded-full bg-brand-blue items-center justify-center">
                    <Text className="text-body-lg font-jakarta-extrabold text-surface-white">
                      {initials}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center gap-0 mt-1.5">
            <Text className="text-h1 font-jakarta-extrabold text-brand-navy -mr-4">
              {t('dashboard_greeting', { name: displayName })}
            </Text>
            <Image source={dashboardImages.helloEmoji} className="w-16 h-16 -mb-2" />
          </View>

          <TouchableOpacity
            className="mt-4 rounded-[18px] border border-[#C9E8F7] bg-[#F3FBFF] p-3"
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/pool')}
          >
            <View className="min-h-19 flex-row items-center gap-2.5">
              <Image
                source={dashboardImages.poolIllustration}
                className="w-15.5 h-15.5 rounded-full"
                resizeMode="cover"
              />
              <View className="flex-1 min-w-0">
                <Text className="text-h3 font-jakarta-extrabold text-[#071C5A]" numberOfLines={1}>
                  {pools?.pool_name || t('dashboard_default_pool_name')}
                </Text>
                <Text className="text-small font-jakarta-semibold text-sub mt-1">
                  {t(setupComplete ? 'dashboard_setup_complete' : 'dashboard_setup_in_progress')}
                </Text>
              </View>
              <ProfileCompletionRing percentage={completionScore} size={58} strokeWidth={6} />
              <Ionicons name="chevron-forward" size={19} color="#74819A" />
            </View>

            {latestReading?.poolStatus && latestReading.swimmingStatus && (
              <View className="flex-row gap-3 mt-4 pt-3.5 border-t border-border-default">
                <StatusPill
                  caption={t('water_results_pool_status_label')}
                  color={OVERALL_STATUS[latestReading.poolStatus].badgeColor}
                  icon={OVERALL_STATUS[latestReading.poolStatus].icon}
                  label={t(OVERALL_STATUS[latestReading.poolStatus].labelKey)}
                />
                <StatusPill
                  caption={t('water_results_swim_status_label')}
                  color={SWIM_STATUS[latestReading.swimmingStatus].badgeColor}
                  icon={SWIM_STATUS[latestReading.swimmingStatus].icon}
                  label={t(SWIM_STATUS[latestReading.swimmingStatus].labelKey)}
                />
              </View>
            )}
          </TouchableOpacity>

          <NextStepCard
            pool={pools}
            latestReading={latestReading}
            checklistCompleted={checklistCompleted}
            checklistTotal={checklistTotal}
            incompleteTasks={incompleteTasks}
          />

          <TouchableOpacity
            className="card mt-4 p-4 flex-row items-center"
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/checklist',
                params: { checklistCompleted },
              })
            }
          >
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

          <Text className="text-[20px] font-jakarta-extrabold text-[#071C5A] mt-6 mb-2.5">
            {t('dashboard_more_tools')}
          </Text>
          <View className="card px-3.5 mb-1">
            <DashboardToolRow
              image={dashboardImages.solveProblems}
              title={t('dashboard_solve_problems_title')}
              description={t('dashboard_solve_problems_desc')}
              onPress={() => router.push('/(problems)/questions' as Href)}
            />
            <DashboardToolRow
              image={dashboardImages.learn}
              title={t('dashboard_learn_title')}
              description={t('dashboard_learn_desc')}
              onPress={() => router.push('/(tabs)/learn')}
            />
            <DashboardToolRow
              image={dashboardImages.askPoolTonic}
              title={t('dashboard_ask_title')}
              description={t('dashboard_ask_desc')}
              last
              onPress={() => Alert.alert(t('dashboard_ask_title'), t('dashboard_ask_desc'))}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

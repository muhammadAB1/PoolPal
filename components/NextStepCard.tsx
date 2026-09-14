import { dashboardImages } from '@/constants/images';
import { colors } from '@/constants/theme';
import { getNextStep } from '@/lib/nextStep';
import type { Pool } from '@/lib/types';
import type { LatestReading } from '@/providers/TestStripProvider';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type NextStepCardProps = {
  pool: Pool | null;
  latestReading: LatestReading | null;
  checklistCompleted: number;
  checklistTotal: number;
  incompleteTasks: string[];
};

/**
 * Full-width dashboard hero card that surfaces the single most useful next
 * action for the user's pool (see lib/nextStep.ts for priority order).
 */
export default function NextStepCard({
  pool,
  latestReading,
  checklistCompleted,
  checklistTotal,
  incompleteTasks,
}: NextStepCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const nextStep = getNextStep({ pool, latestReading, checklistCompleted, checklistTotal, incompleteTasks });

  return (
    <View className="card--success mt-4 p-4">
      <View className="flex-row items-center gap-1.5">
        <Image source={dashboardImages.nextStepIcon} className="w-6 h-6" resizeMode="contain" />
        <Text className="text-tiny font-jakarta-extrabold text-success-text tracking-wide">
          {t('dashboard_next_step_label').toUpperCase()}
        </Text>
      </View>
      <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-1.5">
        {nextStep.title}
      </Text>
      <Text className="text-body font-jakarta text-sub mt-1.5">
        {nextStep.description}
      </Text>

      {nextStep.route && nextStep.ctaLabel ? (
        <TouchableOpacity
          className="bg-brand-blue self-start flex-row items-center gap-1.5 rounded-full px-5 py-3 mt-3.5"
          activeOpacity={0.85}
          onPress={() => router.push(nextStep.route!)}
        >
          <Text className="text-body-lg font-jakarta-bold text-surface-white">
            {nextStep.ctaLabel}
          </Text>
          <Image
            source={dashboardImages.chevronRight}
            className="w-3 h-3"
            resizeMode="contain"
            style={{ tintColor: colors.surface.white }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

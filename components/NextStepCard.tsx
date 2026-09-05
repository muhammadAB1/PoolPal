import { dashboardImages } from '@/constants/images';
import { getNextStep } from '@/lib/nextStep';
import type { Pool } from '@/lib/types';
import type { LatestReading } from '@/providers/TestStripProvider';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type NextStepCardProps = {
  pool: Pool | null;
  latestReading: LatestReading | null;
};

/** Dashboard card that surfaces the single most useful next action for the user's pool. */
export default function NextStepCard({ pool, latestReading }: NextStepCardProps) {
  const { t } = useTranslation();
  const nextStep = getNextStep({ pool, latestReading });

  return (
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
        {nextStep}
      </Text>
    </TouchableOpacity>
  );
}

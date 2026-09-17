import PoolSizeGallonsScreen from '@/app/(onboarding)/pool-size-gallons';
import PoolReviewHeader from '@/components/PoolReviewHeader';
import { icons } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { poolShapeTranslationKeys } from '@/data/poolShapes';
import type { PoolShape } from '@/lib/types';
import { usePool } from '@/providers/PoolProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { POOL_SIZE } from './_data';

export default function PoolSizeScreen() {
  const { estimatedVolume, estimationDetails, improveBanner, infoBanner } = POOL_SIZE;

  const { pools, refreshPools } = usePool();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';

  const volumeUnit =
    pools?.measurement_unit === 'us'
      ? t('pool_size_review_unit_gallons')
      : t('pool_size_review_unit_liters');
  const rawVolume =
    pools?.measurement_unit === 'metric'
      ? (pools?.volume_liters ?? pools?.gallons ?? estimatedVolume.value)
      : (pools?.volume_us_gallons ?? pools?.gallons ?? estimatedVolume.value);
  const volumeValue = typeof rawVolume === 'number' ? Math.round(rawVolume) : rawVolume;
  const volumeDisplay =
    volumeValue == null ? `— ${volumeUnit}`.trim() : `${volumeValue} ${volumeUnit}`.trim();

  const updatedEstimationDetails = estimationDetails.map((row) => {
    const raw = row.database_column_name ? pools?.[row.database_column_name] : undefined;
    let value = row.value;

    if (raw != null) {
      if (row.database_column_name === 'measurement_unit') {
        value = raw === 'us' ? t('pool_size_units_us') : t('pool_size_units_metric');
      } else if (row.database_column_name === 'shape') {
        value = t(poolShapeTranslationKeys[raw as PoolShape]);
      } else {
        value = String(raw);
      }
    } else {
      value = '—';
    }

    return { ...row, value };
  });

  if (isEditing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
        <PoolReviewHeader
          title={t(POOL_SIZE.title)}
          onBackPress={() => setIsEditing(false)}
          showEdit={false}
        />
        <PoolSizeGallonsScreen
          initialPoolSize={{
            units: pools?.measurement_unit ?? undefined,
            length: pools?.length ?? undefined,
            width: pools?.width ?? undefined,
            shallowDepth: pools?.shallow_depth ?? undefined,
            deepDepth: pools?.deep_depth ?? undefined,
            shape: pools?.shape ?? undefined,
            freeformSections: pools?.freeform_sections ?? undefined,
          }}
          showSkip={false}
          markStale={false}
          onSuccess={async () => {
            await refreshPools({ silent: true });
            setIsEditing(false);
            router.replace('/(tabs)/pool');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <PoolReviewHeader title={t(POOL_SIZE.title)} onEditPress={() => setIsEditing(true)} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <View className="card p-4" style={shadow.card}>
            <View className="flex-row items-start">
              <View className="w-12 h-12 rounded-xl bg-surface-soft-aqua items-center justify-center">
                <MaterialCommunityIcons name="waves" size={24} color={colors.brand.blue} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-small font-jakarta text-sub">{t(estimatedVolume.label)}</Text>
                <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-0.5">
                  {volumeDisplay}
                </Text>
                <Text className="text-small font-jakarta text-sub mt-2">
                  {t(estimatedVolume.footer)}
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-5 mb-2 ml-1">
            {t(POOL_SIZE.detailsTitle)}
          </Text>

          <View className="card overflow-hidden" style={shadow.card}>
            {updatedEstimationDetails.map((row, index) => {
              const isLast = index === updatedEstimationDetails.length - 1;

              return (
                <View
                  key={row.label}
                  className={`flex-row items-center justify-between px-4 py-3.5 ${isLast ? '' : 'border-b border-border-default'}`}
                >
                  <Text className="text-body font-jakarta text-brand-navy flex-1 mr-3">
                    {row.database_column_name === 'width' && pools?.shape === 'Kidney'
                      ? `${t('pool_size_width_widest_hint')} ${t(row.label)}`
                      : t(row.label)}
                  </Text>
                  <Text className="text-body font-jakarta-bold text-brand-navy text-right">
                    {row.value}
                  </Text>
                </View>
              );
            })}
          </View>

          <View className="card--success mt-4 p-4 flex-row items-start">
            <MaterialCommunityIcons name="target" size={28} color={colors.brand.blue} />
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t(improveBanner.title)}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t(improveBanner.body)}
              </Text>
              <TouchableOpacity className="flex-row items-center mt-2" activeOpacity={0.7}>
                <Text className="text-body font-jakarta-bold text-brand-blue">
                  {t(improveBanner.linkText)}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color={colors.brand.blue} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="card--info mt-4 p-4 flex-row items-start">
            <MaterialCommunityIcons name="information" size={28} color={colors.brand.blue} />
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t(infoBanner.title)}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-1">
                {t(infoBanner.body)}
              </Text>
            </View>
          </View>
          {pools?.updated_at ? (
            <View className="flex-row items-center justify-center mt-6">
              <Image source={icons.calendar} className="w-3.5 h-3.5" resizeMode="contain" />
              <Text className="text-small font-jakarta text-faint ml-1.5">
                {t('pool_basics_review_last_updated', {
                  date: (() => {
                    const date = new Date(pools.updated_at);
                    const month = date.toLocaleString(locale, { month: 'long', timeZone: 'UTC' });
                    const day = date.getUTCDate();
                    const year = date.getUTCFullYear();
                    return `${month} ${day} ${year}`;
                  })(),
                })}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

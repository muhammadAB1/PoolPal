import PoolBasicsForm from '@/app/(onboarding)/pool-basics';
import PoolReviewHeader from '@/components/PoolReviewHeader';
import { poolTabImages } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { toPoolEnvironment } from '@/lib/pool';
import { usePool } from '@/providers/PoolProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { POOL_BASICS } from './_data';

const DETAIL_ICONS = {
  pool_type: 'help-circle-outline',
  salt_system_status: 'cog-outline',
  manual_chlorine_during_salt_failure: 'flask-outline',
  pool_screen: 'shield-outline',
  hot_tub_type: 'waves',
  spa_attachment: 'waves',
  standalone_spa_sanitizer: 'hot-tub',
  pool_use_type: 'account-multiple-outline',
  occupancy_pattern: 'calendar-clock',
  seasonal_unused_months: 'calendar-month-outline',
  rental_activity: 'home-city-outline',
  rental_active_months: 'calendar-check-outline',
  usage_frequency: 'calendar-week',
  number_of_users: 'account-group-outline',
} as const;

export default function PoolBasicsScreen() {
  const { pools, refreshPools } = usePool();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const updatedPoolBasics = POOL_BASICS.details.map((detail) => {
    const rawSelected = pools?.[detail.database_column_name];
    const selected =
      detail.database_column_name === 'pool_screen'
        ? toPoolEnvironment(typeof rawSelected === 'string' ? rawSelected : null)
        : rawSelected;
    const option = Array.isArray(selected)
      ? selected.length
        ? {
            name: selected.join(', '),
            description: Object.values(detail.value)[0]?.description ?? '',
          }
        : undefined
      : selected
        ? (detail.value as Record<string, { name: string; description: string }>)[String(selected)]
        : undefined;

    return {
      ...detail,
      value: {
        name: option?.name ?? null,
        description: option?.description ?? '',
      },
    };
  });

  const environmentLabel = updatedPoolBasics.find((row) => row.database_column_name === 'pool_screen')?.value.name;

  const sectionCompleted = pools?.missing_details?.includes('pool-basics') ? false : true;

  if (isEditing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
        <PoolReviewHeader
          title={t('pool_tab_basics')}
          onBackPress={() => setIsEditing(false)}
          showEdit={false}
        />
        <PoolBasicsForm
          initialPoolBasics={{
            poolName: pools?.pool_name ?? undefined,
            poolType: pools?.pool_type ?? undefined,
            screened: pools?.pool_screen ?? undefined,
            hasHotTub: pools?.hot_tub_type ?? undefined,
            spaAttachment: pools?.spa_attachment ?? undefined,
            useType: pools?.pool_use_type ?? undefined,
            usageFrequency: pools?.usage_frequency ?? undefined,
            numberOfPoolUsers: pools?.number_of_users ?? undefined,
            saltSystemStatus: pools?.salt_system_status ?? undefined,
            manualChlorine: pools?.manual_chlorine_during_salt_failure ?? undefined,
            spaSanitizer: pools?.standalone_spa_sanitizer ?? undefined,
            occupancyPattern: pools?.occupancy_pattern ?? undefined,
            unusedMonths: pools?.seasonal_unused_months ?? [],
            rentalActivity: pools?.rental_activity ?? undefined,
            activeMonths: pools?.rental_active_months ?? [],
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
      <PoolReviewHeader title={t('pool_tab_basics')} onEditPress={() => setIsEditing(true)} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <View className="rounded-2xl overflow-hidden h-48" style={shadow.card}>
            <Image
              source={poolTabImages.basicsHero}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-brand-navy/30" />
            <View className="flex-1 justify-end px-4 pb-3.5">
              <Text
                className="text-h2 font-jakarta-extrabold text-surface-white"
                style={{
                  textShadowColor: colors.brand.navy,
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 6,
                }}
              >
                {pools?.pool_name}
              </Text>
              <Text className="text-small font-jakarta text-surface-white mt-0.5">
                {/* List pool attributes in a readable way */}
                {[
                  pools?.pool_type === 'Chlorine'
                    ? t('pool_basics_type_chlorine')
                    : pools?.pool_type === 'Bromine'
                      ? t('pool_basics_type_bromine')
                      : pools?.pool_type === 'Other'
                        ? t('pool_basics_type_other')
                        : t('pool_basics_type_saltwater'),
                  environmentLabel ? t(environmentLabel) : '',
                  pools?.hot_tub_type === 'Yes' && pools?.spa_attachment
                    ? `${t(pools.spa_attachment === 'Attached' ? 'pool_basics_spa_attached' : 'pool_basics_spa_detached')} ${t('pool_basics_review_hot_tub_tag')}`
                    : '',
                  pools?.pool_use_type === 'Family' ? t('pool_basics_use_family') : pools?.pool_use_type === 'VacationHome' ? t('pool_basics_use_vacation') : t('pool_basics_use_rental'),
                ]
                  .filter(Boolean)
                  .join(' • ')}
              </Text>
            </View>
          </View>

          {sectionCompleted ? (
            <View className="card--success mt-4 p-3.5 flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-brand-blue items-center justify-center">
                <MaterialCommunityIcons name="check" size={20} color={colors.surface.white} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-body-lg font-jakarta-bold text-brand-blue">
                  {t('pool_basics_review_profile_complete_title')}
                </Text>
                <Text className="text-small font-jakarta text-sub mt-0.5">
                  {t('pool_basics_review_profile_complete_desc')}
                </Text>
              </View>
            </View>
          ) : (
            <View className="card--warning mt-4 p-3.5 flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-warning items-center justify-center">
                <MaterialCommunityIcons name="alert" size={20} color={colors.surface.white} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-body-lg font-jakarta-bold text-charcoal">
                  {t('pool_basics_review_profile_incomplete_title')}
                </Text>
                <Text className="text-small font-jakarta text-sub mt-0.5">
                  {t('pool_basics_review_profile_incomplete_desc')}
                </Text>
              </View>
            </View>
          )}

          <Text className="text-tiny font-jakarta-bold text-faint tracking-widest uppercase mt-5 mb-2 ml-1">
            {t('pool_basics_review_details_heading')}
          </Text>

          <View className="card overflow-hidden" style={shadow.card}>
            {updatedPoolBasics.map((row, index) => {
              if (pools?.pool_use_type !== 'Family' && (row.database_column_name === 'usage_frequency' || row.database_column_name === 'number_of_users')) return null;
              if (row.database_column_name === 'hot_tub_type' || (pools?.hot_tub_type !== 'Yes' && (row.database_column_name === 'spa_attachment' || row.database_column_name === 'standalone_spa_sanitizer'))) return null;
              if (pools?.spa_attachment !== 'Detached' && row.database_column_name === 'standalone_spa_sanitizer') return null;
              if (pools?.pool_type !== 'Saltwater' && (row.database_column_name === 'salt_system_status' || row.database_column_name === 'manual_chlorine_during_salt_failure')) return null;
              if (pools?.salt_system_status !== 'not_working' && row.database_column_name === 'manual_chlorine_during_salt_failure') return null;
              if (pools?.pool_use_type !== 'VacationHome' && (row.database_column_name === 'occupancy_pattern' || row.database_column_name === 'seasonal_unused_months')) return null;
              if (pools?.occupancy_pattern !== 'seasonal' && row.database_column_name === 'seasonal_unused_months') return null;
              if (pools?.pool_use_type !== 'ShortTermRental' && (row.database_column_name === 'rental_activity' || row.database_column_name === 'rental_active_months')) return null;
              if (pools?.rental_activity !== 'seasonal' && row.database_column_name === 'rental_active_months') return null;

              const isLast = index === updatedPoolBasics.length - 1;
              const icon = DETAIL_ICONS[row.database_column_name];
              const isMissing = row.value.name == null;

              return (
                <TouchableOpacity
                  key={row.database_column_name}
                  className={`flex-row items-center px-4 py-3.5 ${isLast ? '' : 'border-b border-border-default'}`}
                  activeOpacity={0.7}
                >
                  <View className="icon-circle">
                    <MaterialCommunityIcons
                      name={isMissing ? 'alert' : icon}
                      size={20}
                      color={isMissing ? colors.status.warning : colors.brand.blue}
                    />
                  </View>

                  <View className="flex-1 ml-3 mr-2">
                    <View className="flex-row items-center">
                      <Text className="text-body-lg font-jakarta-bold text-brand-navy">{t(row.title)}</Text>
                      {isMissing ? <View className="w-2 h-2 rounded-full bg-warning ml-1.5" /> : null}
                    </View>
                    <Text
                      className={`text-small font-jakarta mt-0.5 ${isMissing ? 'text-warning' : 'text-sub'}`}
                    >
                      {isMissing ? t('pool_tab_not_set') : t(row.value.description)}
                    </Text>
                  </View>

                  <Text
                    className={`text-body font-jakarta-bold mr-1 ${isMissing ? 'text-warning' : 'text-brand-navy'}`}
                  >
                    {row.value.name ? t(row.value.name) : ''}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={colors.text.faint} />
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="card--info mt-4 p-3.5 flex-row items-start">
            <View className="w-10 h-10 rounded-full bg-brand-blue items-center justify-center">
              <MaterialCommunityIcons name="information-variant" size={20} color={colors.surface.white} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-blue">
                {t('pool_basics_review_why_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('pool_basics_review_why_desc')}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="card mt-4 p-3.5 flex-row items-center"
            style={shadow.card}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/(onboarding)/pool-basics', params: { newPool: '1' } } as Href)}
          >
            <View className="w-10 h-10 rounded-full bg-brand-blue items-center justify-center">
              <MaterialCommunityIcons name="plus" size={22} color={colors.surface.white} />
            </View>
            <View className="flex-1 ml-3 mr-2">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t('pool_basics_review_add_pool')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('pool_basics_review_add_pool_desc')}
              </Text>
            </View>
            <Text className="text-body font-jakarta-bold text-brand-blue mr-1">
              {t('pool_basics_review_add_pool_price')}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.text.faint} />
          </TouchableOpacity>

          <Text className="text-small font-jakarta text-faint text-center mt-6">
            {pools?.updated_at
              ? t('pool_basics_review_last_updated', {
                date: (() => {
                  const date = new Date(pools.updated_at);
                  const month = date.toLocaleString(locale, { month: 'long', timeZone: 'UTC' });
                  const day = date.getUTCDate();
                  const year = date.getUTCFullYear();
                  return `${month} ${day} ${year}`;
                })(),
              })
              : null}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { colors, shadow } from '@/constants/theme';
import { POOL_PROFILE_ROWS } from '@/data/poolProfile';
import { isHotTubPool } from '@/lib/pool';
import { usePool } from '@/providers/PoolProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PoolScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { pools, allPools, poolId, switchPool } = usePool();

  // If a row's titleKey exists in pools.missing_details, set showWarning to true for that row
  // const poolProfileRowsWithWarnings = POOL_PROFILE_ROWS.map((row) => ({
  //   ...row,
  //   showWarning: pools?.missing_details?.includes(row.heading) || false,
  // }));

  const poolProfileRowsDescription = POOL_PROFILE_ROWS.map((row) => {
    let description: string | number | undefined;
    const showWarning = pools?.missing_details?.includes(row.heading) || false;

    switch (row.heading) {
      case 'pool-basics':
        description = [
          pools?.pool_type ? pools.pool_type : '',
          pools?.pool_screen ? pools.pool_screen : '',
          pools?.hot_tub_type === 'Yes' && pools?.spa_attachment && !isHotTubPool(pools)
            ? `${t(pools.spa_attachment === 'Attached' ? 'pool_basics_spa_attached' : 'pool_basics_spa_detached')} ${t('pool_basics_review_hot_tub_tag')}`
            : isHotTubPool(pools)
              ? t('pool_basics_review_hot_tub')
              : '',
          pools?.pool_use_type ? pools.pool_use_type : '',
        ].filter(Boolean).join(' • ');
        break;
      case 'pool-condition':
        description = pools?.pool_condition ?? undefined;
        break;
      case 'equipment-basics':
        description = [
          pools?.pump_type ? `${pools.pump_type} pump` : '',
          pools?.filter_type ? `${pools.filter_type} filter` : '',
          pools?.heater === 'Yes' ? 'Heater' : '',
        ].filter(Boolean).join(' • ');
        break;
      case 'pool-size-gallons':
        description = pools?.gallons ?? undefined;
        break;
      case 'surface-type':
        description = pools?.surface_type ?? undefined;
        break;
      case 'cleaning-setup':
        description = pools?.cleaning_type
          ? pools.cleaning_type
          : undefined;
        break;
      case 'weekly-reminder':
        description = [
          pools?.reminder_day ? pools.reminder_day : '',
          pools?.reminder_time ? pools.reminder_time : '',
        ].filter(Boolean).join(' at ');
        break;
      default:
        description = undefined;
    }



    return { ...row, showWarning, description };
  });

  console.log(poolProfileRowsDescription.map((row) => row.description));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-h1 font-jakarta-extrabold text-brand-navy">
          {t('pool_tab_title')}
        </Text>
        <Text className="text-body font-jakarta text-sub mt-1 mb-5">
          {t('pool_tab_subtitle')}
        </Text>

        {allPools.length > 1 ? (
          <View className="mb-5">
            <View className="flex-row items-center gap-1.5 mb-2">
              <MaterialCommunityIcons name="pool" size={16} color={colors.brand.blue} />
              <Text className="text-tiny font-jakarta-extrabold text-brand-blue tracking-wide">
                {t('pool_tab_your_pools').toUpperCase()}
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2.5">
                {allPools.map((pool) => {
                  const isActive = pool.id === poolId;
                  const iconColor = isActive ? colors.surface.white : colors.brand.navy;
                  return (
                    <TouchableOpacity
                      key={pool.id}
                      className={`flex-row items-center px-3.5 py-2 rounded-2xl border-2 ${isActive ? 'bg-brand-blue border-brand-blue' : 'bg-surface-white border-border-default'}`}
                      style={isActive ? shadow.card : undefined}
                      activeOpacity={0.7}
                      onPress={() => void switchPool(pool.id)}
                    >
                      {isActive ? (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={16}
                          color={colors.surface.white}
                          style={{ marginRight: 6 }}
                        />
                      ) : null}
                      <MaterialCommunityIcons
                        name={isHotTubPool(pool) ? 'hot-tub' : 'pool'}
                        size={16}
                        color={iconColor}
                        style={{ marginRight: 6 }}
                      />
                      <Text className={`text-small font-jakarta-bold ${isActive ? 'text-surface-white' : 'text-brand-navy'}`}>
                        {pool.pool_name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            <Text className="text-tiny font-jakarta text-faint mt-1.5">
              {t('pool_tab_switch_pool_hint')}
            </Text>
          </View>
        ) : null}

        {poolProfileRowsDescription.map((row) => (
          <TouchableOpacity
            key={row.titleKey}
            className="card flex-row items-center px-4 py-3.5 mb-3"
            style={shadow.card}
            activeOpacity={0.7}
            onPress={() => router.push(row.href)}
          >
            <View className="w-11 h-11 rounded-xl items-center justify-center bg-surface-soft-aqua">
              <MaterialCommunityIcons name={row.icon} size={22} color={colors.brand.blue} />
            </View>

            <View className="flex-1 ml-3 mr-2">
              <View className="flex-row items-center">
                <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                  {t(row.titleKey)}
                </Text>
                {row.showWarning ? (
                  <View className="w-2 h-2 rounded-full bg-warning ml-1.5" />
                ) : null}
              </View>
              <Text
                className={`text-small font-jakarta mt-0.5 ${row.showWarning ? 'text-warning' : 'text-sub'}`}
              >
                {row.showWarning ? t('pool_tab_not_set') : row.description}
              </Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.text.faint} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          className="card flex-row items-center px-4 py-3.5 mt-1"
          style={shadow.card}
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: '/(onboarding)/pool-basics', params: { newPool: '1' } } as Href)}
        >
          <View className="w-11 h-11 rounded-full bg-brand-blue items-center justify-center">
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
      </ScrollView>
    </SafeAreaView>
  );
}

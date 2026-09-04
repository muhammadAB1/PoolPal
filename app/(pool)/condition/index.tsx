import PoolReviewHeader from '@/components/PoolReviewHeader';
import { icons, poolConditionImages } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { usePool } from '@/providers/PoolProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { POOL_CONDITION } from './_data';

export default function PoolConditionScreen() {
  const { pools } = usePool();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';

  const detail = POOL_CONDITION.details;
  const selected = pools?.[detail.database_column_name];
  const option = selected ? detail.value[selected] : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <PoolReviewHeader title={t('pool_tab_condition')} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <View className="card overflow-hidden" style={shadow.card}>
            <Image
              source={poolConditionImages[selected ?? 'NOT_SURE']}
              className="w-full h-48"
              resizeMode="cover"
            />

            <View className="p-4">
              {option?.name &&
                <Text className="text-h3 font-jakarta-extrabold text-brand-navy">
                  {t(option.name)}
                </Text>
              }

              {!option && (
                <View className="flex-row items-center self-start bg-warning-bg border border-warning rounded-full px-3 py-1">
                  <MaterialCommunityIcons name="alert" size={14} color={colors.status.warning} />
                  <Text className="text-small font-jakarta-bold text-warning ml-1">{t('pool_tab_not_set')}</Text>
                </View>
              )}
            </View>
          </View>

          <View className="card mt-4 p-3.5 flex-row items-start" style={shadow.card}>
            <View className="icon-circle">
              <MaterialCommunityIcons name="water" size={20} color={colors.brand.blue} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t('pool_condition_review_care_note')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('pool_condition_review_care_note_desc')}
              </Text>
            </View>
          </View>

          <View className="card mt-4 p-3.5 flex-row items-start" style={shadow.card}>
            <View className="icon-circle">
              <MaterialCommunityIcons name="information-outline" size={20} color={colors.brand.blue} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t('pool_condition_review_why_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('pool_condition_review_why_desc')}
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

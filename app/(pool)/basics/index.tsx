import { icons, poolTabImages } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { usePool } from '@/providers/PoolProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { POOL_BASICS } from './_data';

const DETAIL_ICONS = {
  pool_type: 'help-circle-outline',
  pool_screen: 'shield-outline',
  hot_tub_type: 'waves',
  pool_use_type: 'account-multiple-outline',
  usage_frequency: 'calendar-week',
  number_of_users: 'account-group-outline',
} as const;

export default function PoolBasicsScreen() {
  const router = useRouter();
  const { pools } = usePool();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';

  const updatedPoolBasics = POOL_BASICS.details.map((detail) => {
    const selected = pools?.[detail.database_column_name];
    const option = selected
      ? (detail.value as Record<string, { name: string; description: string }>)[selected]
      : undefined;

    return {
      ...detail,
      value: {
        name: option?.name ?? null,
        description: option?.description ?? '',
      },
    };
  });

  const sectionCompleted = updatedPoolBasics.every((row) => row.value.name != null);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="w-12 h-10 items-start justify-center -ml-1"
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>

            <Text className="text-h3 font-jakarta-extrabold text-brand-navy">{t('pool_tab_basics')}</Text>

            <TouchableOpacity className="w-12 h-10 items-end justify-center" activeOpacity={0.7}>
              <Text className="text-body-lg font-jakarta-bold text-brand-blue">Edit</Text>
            </TouchableOpacity>
          </View>

          <View className="rounded-2xl overflow-hidden mt-3 h-48" style={shadow.card}>
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
                  pools?.pool_type,
                  pools?.pool_screen,
                  pools?.hot_tub_type === 'Yes' ? 'hot tub and spa' : '',
                  pools?.pool_use_type,
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
                <Text className="text-body-lg font-jakarta-bold text-brand-blue">Profile complete</Text>
                <Text className="text-small font-jakarta text-sub mt-0.5">
                  We have everything we need to personalize your care plan.
                </Text>
              </View>
            </View>
          ) : (
            <View className="card--warning mt-4 p-3.5 flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-warning items-center justify-center">
                <MaterialCommunityIcons name="alert" size={20} color={colors.surface.white} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-body-lg font-jakarta-bold text-charcoal">Profile incomplete</Text>
                <Text className="text-small font-jakarta text-sub mt-0.5">
                  Add the missing details so we can personalize your care plan.
                </Text>
              </View>
            </View>
          )}

          <Text className="text-tiny font-jakarta-bold text-faint tracking-widest uppercase mt-5 mb-2 ml-1">
            Pool details
          </Text>

          <View className="card overflow-hidden" style={shadow.card}>
            {updatedPoolBasics.map((row, index) => {
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
              <Text className="text-body-lg font-jakarta-bold text-brand-blue">Why these details matter</Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                PoolWise uses these answers to personalize your testing ranges, reminders, and maintenance recommendations.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="card mt-4 p-3.5 flex-row items-center"
            style={shadow.card}
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-brand-blue items-center justify-center">
              <MaterialCommunityIcons name="plus" size={22} color={colors.surface.white} />
            </View>
            <View className="flex-1 ml-3 mr-2">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">Add another pool</Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                Separate profile, readings, reminders, and care plan.
              </Text>
            </View>
            <Text className="text-body font-jakarta-bold text-brand-blue mr-1">$4.99/month</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.text.faint} />
          </TouchableOpacity>

          <Text className="text-small font-jakarta text-faint text-center mt-6">
            {pools?.updated_at
              ? (() => {
                const date = new Date(pools.updated_at);
                const month = date.toLocaleString(locale, { month: 'long', timeZone: 'UTC' });
                const day = date.getUTCDate();
                const year = date.getUTCFullYear();
                return `${month} ${day} ${year}`;
              })()
              : null}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

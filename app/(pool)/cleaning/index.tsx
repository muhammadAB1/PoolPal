import CleaningSetupScreen from '@/app/(onboarding)/cleaning-setup';
import PoolReviewHeader from '@/components/PoolReviewHeader';
import { cleaningSetupImages, icons } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { usePool } from '@/providers/PoolProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { POOL_CLEANING } from './_data';

function GlanceCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <TouchableOpacity
      className="card flex-1 p-3.5"
      style={shadow.card}
      activeOpacity={0.8}
    >
      <View className="flex-row items-start justify-between">
        <MaterialCommunityIcons name={icon} size={20} color={colors.brand.blue} />
        <MaterialCommunityIcons name="chevron-right" size={18} color={colors.text.faint} />
      </View>
      <Text className="text-small font-jakarta text-sub mt-2">{label}</Text>
      <Text className="text-body font-jakarta-bold text-brand-navy mt-0.5">{value}</Text>
    </TouchableOpacity>
  );
}

export default function PoolCleaningScreen() {
  const { pools, refreshPools } = usePool();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const detail = POOL_CLEANING.details;
  const selected = pools?.[detail.database_column_name];
  const option = selected ? detail.value[selected] : undefined;
  const heroImage = selected ? cleaningSetupImages[selected] : cleaningSetupImages.NotSure;

  if (isEditing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
        <PoolReviewHeader
          title={t('pool_tab_cleaning')}
          onBackPress={() => setIsEditing(false)}
          showEdit={false}
        />
        <CleaningSetupScreen
          initialCleaningType={selected ?? null}
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
      <PoolReviewHeader title={t('pool_tab_cleaning')} onEditPress={() => setIsEditing(true)} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <View className="card overflow-hidden" style={shadow.card}>
            <View className="mx-3 mt-3 rounded-xl overflow-hidden">
              <Image
                source={heroImage}
                className="w-full h-48"
                resizeMode="cover"
              />
            </View>

            <View className="p-4">
              {option?.name ? (
                <>
                  <View className="chip chip--success flex-row items-center self-start">
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.brand.blue} />
                    <Text className="text-small font-jakarta-bold text-brand-blue ml-1">
                      {t('pool_cleaning_review_confirmed')}
                    </Text>
                  </View>
                  <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-2">
                    {t(option.name)}
                  </Text>
                  <View className="flex-row items-center mt-4">
                    <View className="flex-1 mr-2">
                      <Text className="text-small font-jakarta text-sub">
                        {t(POOL_CLEANING.brand.label)}
                      </Text>
                      <Text className="text-body font-jakarta-bold text-brand-navy mt-0.5">
                        {POOL_CLEANING.brand.value}
                      </Text>
                    </View>
                    <View className="flex-1 mr-2">
                      <Text className="text-small font-jakarta text-sub">
                        {t(POOL_CLEANING.model.label)}
                      </Text>
                      <Text className="text-body font-jakarta-bold text-brand-navy mt-0.5">
                        {POOL_CLEANING.model.value}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="border border-brand-blue rounded-full px-4 py-1.5"
                      activeOpacity={0.7}
                    >
                      <Text className="text-body font-jakarta-bold text-brand-blue">
                        {t('pool_basics_review_edit')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View className="flex-row items-center self-start bg-warning-bg border border-warning rounded-full px-3 py-1">
                  <MaterialCommunityIcons name="alert" size={14} color={colors.status.warning} />
                  <Text className="text-small font-jakarta-bold text-warning ml-1">{t('pool_tab_not_set')}</Text>
                </View>
              )}
            </View>
          </View>

          <Text className="text-tiny font-jakarta-extrabold text-faint tracking-widest mt-5 mb-2 ml-1">
            {t(POOL_CLEANING.glanceTitle)}
          </Text>

          <View className="flex-row gap-3">
            {POOL_CLEANING.glance.slice(0, 2).map((item) => (
              <GlanceCard
                key={item.label}
                icon={item.icon}
                label={t(item.label)}
                value={t(item.value)}
              />
            ))}
          </View>
          <View className="flex-row gap-3 mt-3">
            {POOL_CLEANING.glance.slice(2, 4).map((item) => (
              <GlanceCard
                key={item.label}
                icon={item.icon}
                label={t(item.label)}
                value={t(item.value)}
              />
            ))}
          </View>

          <View className="card--success mt-4 p-4 flex-row items-start">
            <MaterialCommunityIcons name="star-four-points" size={20} color={colors.brand.blue} />
            <View className="flex-1 ml-3 mr-2">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t(POOL_CLEANING.careNote.title)}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5 leading-relaxed">
                {t(POOL_CLEANING.careNote.body)}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.faint} />
          </View>

          <View className="card--info mt-4 p-4 flex-row items-start">
            <MaterialCommunityIcons name="information-outline" size={20} color={colors.brand.blue} />
            <View className="flex-1 ml-3 mr-2">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t(POOL_CLEANING.why.title)}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5 leading-relaxed">
                {t(POOL_CLEANING.why.body)}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.faint} />
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

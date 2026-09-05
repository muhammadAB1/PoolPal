import SurfaceTypeScreen from '@/app/(onboarding)/surface-type';
import PoolReviewHeader from '@/components/PoolReviewHeader';
import { icons, poolSurfaceImages } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { usePool } from '@/providers/PoolProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { POOL_SURFACE } from './_data';

export default function PoolSurfaceScreen() {
  const { pools, refreshPools } = usePool();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const detail = POOL_SURFACE.details;
  const selected = pools?.[detail.database_column_name];
  const option = selected ? detail.value[selected] : undefined;

  if (isEditing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
        <PoolReviewHeader
          title={t('pool_tab_surface')}
          onBackPress={() => setIsEditing(false)}
          showEdit={false}
        />
        <SurfaceTypeScreen
          initialSurfaceType={selected ?? null}
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
      <PoolReviewHeader title={t('pool_tab_surface')} onEditPress={() => setIsEditing(true)} />
      <View className="divider" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <View className="card overflow-hidden" style={shadow.card}>
            <Image
              source={selected ? poolSurfaceImages[selected] : poolSurfaceImages.NotSure}
              className="w-full h-48"
              resizeMode="cover"
            />

            <View className="p-4">
              {option?.name ? (
                <>
                  <Text className="text-h3 font-jakarta-extrabold text-brand-navy">
                    {t(option.name)}
                  </Text>
                  <Text className="text-small font-jakarta text-sub mt-1">
                    {t(option.description)}
                  </Text>
                  <View className="chip flex-row items-center self-start mt-3">
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.brand.blue} />
                    <Text className="text-small font-jakarta-bold text-brand-blue ml-1">
                      {t('pool_surface_review_selected')}
                    </Text>
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

          <View className="card mt-4 p-3.5 flex-row items-start" style={shadow.card}>
            <View className="icon-circle icon-circle--blue">
              <MaterialCommunityIcons name="water" size={20} color={colors.surface.white} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t('pool_surface_review_care_note')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('pool_surface_review_care_note_desc')}
              </Text>
            </View>
          </View>

          <View className="card mt-4 p-3.5 flex-row items-start" style={shadow.card}>
            <View className="icon-circle icon-circle--muted">
              <MaterialCommunityIcons name="information-outline" size={20} color={colors.brand.navy} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t('pool_surface_review_why_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('pool_surface_review_why_desc')}
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

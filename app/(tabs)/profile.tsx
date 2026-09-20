import OptionSheet from '@/components/OptionSheet';
import SearchSelectionModal, { type SearchSelectionItem } from '@/components/SearchSelectionModal';
import { icons } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { COUNTRY_CODES, getCountryFlag, getCountryName, normalizeCountryCode } from '@/data/locations';
import { useSupabase } from '@/hooks/supabaseHooks';
import { setLanguage as changeAppLanguage } from '@/lib/i18n';
import type { Country, Language, Measurement } from '@/lib/types';
import { getAvatarUrl, getInitials } from '@/lib/user';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function DetailRow({
  label,
  value,
  leading,
  onPress,
  loading,
  isLast,
}: {
  label: string;
  value: string;
  leading?: string;
  onPress?: () => void;
  loading?: boolean;
  isLast?: boolean;
}) {
  const Row = onPress ? TouchableOpacity : View;
  return (
    <Row
      className={`flex-row items-center justify-between py-3.5 ${isLast ? '' : 'border-b border-border-default'}`}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={loading}
    >
      <Text className="text-body font-jakarta text-sub">{label}</Text>
      <View className="flex-row items-center gap-2">
        {leading ? <Text className="text-[16px]">{leading}</Text> : null}
        <Text className="text-body font-jakarta-bold text-brand-navy">{value}</Text>
        {onPress ? (
          loading ? (
            <ActivityIndicator size="small" color={colors.brand.blue} />
          ) : (
            <Ionicons name="chevron-forward" size={16} color={colors.text.faint} />
          )
        ) : null}
      </View>
    </Row>
  );
}

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { user, plan, country, language, measurement, name } = useAuth();
  const { logout, saveAccountBasics } = useSupabase();

  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [languageSheetOpen, setLanguageSheetOpen] = useState(false);
  const [measurementSheetOpen, setMeasurementSheetOpen] = useState(false);
  const [savingField, setSavingField] = useState<'language' | 'country' | 'measurement' | null>(null);

  const activeLanguage: Language = i18n.language.startsWith('es') ? 'es' : 'en';
  const countryCode = normalizeCountryCode(country);


  const countryOptions = useMemo<SearchSelectionItem[]>(
    () =>
      COUNTRY_CODES.map((code) => ({
        id: code,
        label: getCountryName(code, activeLanguage),
        leading: getCountryFlag(code),
      })).sort((a, b) => a.label.localeCompare(b.label, activeLanguage === 'es' ? 'es-ES' : 'en-US')),
    [activeLanguage],
  );

  const avatarUrl = getAvatarUrl(user);
  const initials = getInitials(name, user?.email);
  const fullName = name ?? t('dashboard_greeting_fallback_name');

  async function updatePreference(
    field: 'language' | 'country' | 'measurement',
    next: Partial<{ country: Country; language: Language; measurement: Measurement }>,
  ) {
    if (next.language) {
      changeAppLanguage(next.language);
    }

    const payload = {
      country: next.country ?? country ?? 'US',
      language: next.language ?? language ?? 'en',
      measurement: next.measurement ?? measurement ?? 'us',
    };

    setSavingField(field);
    const { error } = await saveAccountBasics(payload);
    setSavingField(null);

    if (error) Alert.alert(t('account_update_error_title'), t('account_update_error_desc'));
  }

  function handleSelectLanguage(id: string) {
    setLanguageSheetOpen(false);
    if (id !== language) updatePreference('language', { language: id as Language });
  }

  function handleSelectMeasurement(id: string) {
    setMeasurementSheetOpen(false);
    if (id !== measurement) updatePreference('measurement', { measurement: id as Measurement });
  }

  function handleLogout() {
    Alert.alert(t('account_logout_confirm_title'), t('account_logout_confirm_desc'), [
      { text: t('account_logout_cancel'), style: 'cancel' },
      {
        text: t('account_logout'),
        style: 'destructive',
        onPress: async () => {
          await logout();
          await AsyncStorage.removeItem('activePoolId');
          router.replace('/welcome');
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <View className="px-5 pt-2 pb-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
            onPress={() => router.navigate('/(tabs)/dashboard')}
            activeOpacity={0.7}
          >
            <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
          </TouchableOpacity>
          <Text className="text-h3 font-jakarta-extrabold text-brand-navy">{t('account_title')}</Text>
          <View className="w-10 h-10" />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          {/* Avatar + identity */}
          <View className="items-center mt-6">
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} className="w-24 h-24 rounded-full" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-brand-blue items-center justify-center">
                <Text className="text-h1 font-jakarta-extrabold text-surface-white">{initials}</Text>
              </View>
            )}
            <Text className="text-h2 font-jakarta-extrabold text-brand-navy mt-3">{fullName}</Text>
            {user?.email ? <Text className="text-body font-jakarta text-sub mt-1">{user.email}</Text> : null}
          </View>

          {/* Account details */}
          <View className="card mt-8 px-4" style={shadow.card}>
            <DetailRow label={t('account_plan_label')} value={plan ? capitalize(plan) : '—'} />
            <DetailRow
              label={t('signup_language')}
              value={language === 'es' ? t('signup_language_es') : t('signup_language_en')}
              onPress={() => setLanguageSheetOpen(true)}
              loading={savingField === 'language'}
            />
            <DetailRow
              label={t('signup_country')}
              value={getCountryName(countryCode, activeLanguage)}
              leading={getCountryFlag(countryCode)}
              onPress={() => setCountryPickerOpen(true)}
              loading={savingField === 'country'}
            />
            <DetailRow
              label={t('signup_measurement')}
              value={measurement === 'metric' ? t('signup_measurement_metric') : t('signup_measurement_us')}
              onPress={() => setMeasurementSheetOpen(true)}
              loading={savingField === 'measurement'}
              isLast
            />
          </View>

          {/* Logout */}
          <TouchableOpacity
            className="btn btn--secondary mt-8 flex-row items-center justify-center gap-2"
            activeOpacity={0.85}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.status.error} />
            <Text className="text-body-lg font-jakarta-bold" style={{ color: colors.status.error }}>
              {t('account_logout')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <OptionSheet
        visible={languageSheetOpen}
        title={t('signup_language')}
        options={[
          { id: 'en', label: t('signup_language_en'), leading: '🇺🇸' },
          { id: 'es', label: t('signup_language_es'), leading: '🇪🇸' },
        ]}
        selectedId={language ?? 'en'}
        onSelect={handleSelectLanguage}
        onClose={() => setLanguageSheetOpen(false)}
      />

      <OptionSheet
        visible={measurementSheetOpen}
        title={t('signup_measurement')}
        options={[
          { id: 'us', label: t('signup_measurement_us'), sublabel: t('signup_measurement_us_units') },
          { id: 'metric', label: t('signup_measurement_metric'), sublabel: t('signup_measurement_metric_units') },
        ]}
        selectedId={measurement ?? 'us'}
        onSelect={handleSelectMeasurement}
        onClose={() => setMeasurementSheetOpen(false)}
      />

      <SearchSelectionModal
        visible={countryPickerOpen}
        title={t('signup_country_select_title')}
        placeholder={t('signup_country_search_placeholder')}
        items={countryOptions}
        selectedId={countryCode}
        onClose={() => setCountryPickerOpen(false)}
        onSelect={(item) => {
          setCountryPickerOpen(false);
          if (item.id !== countryCode) updatePreference('country', { country: item.id });
        }}
        closeLabel={t('common_close')}
        emptyLabel={t('common_no_results')}
      />
    </SafeAreaView>
  );
}

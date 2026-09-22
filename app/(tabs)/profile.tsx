import Preferences from '@/components/Preferences';
import { colors, shadow } from '@/constants/theme';
import { useSupabase } from '@/hooks/supabaseHooks';
import { setLanguage as changeAppLanguage } from '@/lib/i18n';
import type { Country, Language, Measurement } from '@/lib/types';
import { getAvatarUrl, getInitials } from '@/lib/user';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { logout, saveAccountBasics } = useSupabase();
  const {
    user,
    country: savedCountry,
    language: savedLanguage,
    measurement: savedMeasurement,
    name,
    cityOrTown: savedCityOrTown,
    cityOrTownId: savedCityOrTownId,
  } = useAuth();

  const [country, setCountry] = useState<Country>(savedCountry ?? 'US');
  const [cityOrTown, setCityOrTown] = useState(savedCityOrTown ?? '');
  const [cityOrTownId, setCityOrTownId] = useState<string | null>(savedCityOrTownId);
  const [language, setLanguage] = useState<Language>(savedLanguage ?? 'en');
  const [measurement, setMeasurement] = useState<Measurement>(savedMeasurement ?? 'us');
  const [savingPreferences, setSavingPreferences] = useState(false);

  useEffect(() => {
    if (savedCountry) setCountry(savedCountry);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedMeasurement) setMeasurement(savedMeasurement);
    if (savedCityOrTown != null) setCityOrTown(savedCityOrTown);
    if (savedCityOrTownId !== undefined) setCityOrTownId(savedCityOrTownId);
  }, [savedCountry, savedLanguage, savedMeasurement, savedCityOrTown, savedCityOrTownId]);

  const avatarUrl = getAvatarUrl(user);
  const initials = getInitials(name, user?.email);
  const fullName = name ?? t('dashboard_greeting_fallback_name');
  const activeLanguage: Language = i18n.language.startsWith('es') ? 'es' : 'en';

  function savePreferences() {
    if (savingPreferences) return;
    setSavingPreferences(true);
    if (language !== activeLanguage) void changeAppLanguage(language);
    void saveAccountBasics({ country, language, measurement }).then((result) => {
      setSavingPreferences(false);
      if (result.error) Alert.alert(t('profile_preferences_error_title'), t('common_save_error'));
      else Alert.alert(t('profile_preferences_saved_title'), t('profile_preferences_saved_desc'));
    });
  }

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/dashboard');
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between mb-4.5">
            <TouchableOpacity
              className="w-11 h-11 rounded-full bg-surface-white border border-border-default items-center justify-center"
              onPress={goBack}
              activeOpacity={0.75}
            >
              <Ionicons name="chevron-back" size={27} color={colors.brand.navy} />
            </TouchableOpacity>
            <Text className="text-h1 font-jakarta-extrabold text-brand-navy">{t('account_title')}</Text>
            <View className="w-11 h-11" />
          </View>

          <View className="card flex-row items-center p-4" style={shadow.card}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} className="w-16 h-16 rounded-full mr-3.5" />
            ) : (
              <View className="w-16 h-16 rounded-full bg-surface-soft-aqua items-center justify-center mr-3.5">
                {initials && initials !== '?' ? (
                  <Text className="text-h2 font-jakarta-extrabold text-brand-navy">{initials}</Text>
                ) : (
                  <Ionicons name="person-outline" size={34} color={colors.brand.navy} />
                )}
              </View>
            )}
            <View className="flex-1">
              <Text className="text-[18px] font-jakarta-bold text-brand-navy">{fullName}</Text>
              <Text className="text-[13px] font-jakarta text-sub mt-[3px]">
                {user?.email || t('profile_email_unavailable')}
              </Text>
            </View>
          </View>

          <Text className="text-h2 font-jakarta-extrabold text-brand-navy mt-[22px] mb-2.5">
            {t('profile_preferences_title')}
          </Text>
          <View className="card p-4" style={shadow.card}>
            <Preferences
              country={country}
              setCountry={setCountry}
              cityOrTown={cityOrTown}
              cityOrTownId={cityOrTownId}
              setCityOrTown={setCityOrTown}
              setCityOrTownId={setCityOrTownId}
              language={language}
              measurement={measurement}
              setMeasurement={setMeasurement}
              handleLanguageChange={setLanguage}
              showIntro={false}
              showCity
            />
            <TouchableOpacity
              className={`btn btn--primary mt-5 min-h-[50px] ${savingPreferences ? 'opacity-50' : ''}`}
              onPress={savePreferences}
              disabled={savingPreferences}
              activeOpacity={0.85}
            >
              <Text
                className="font-jakarta-bold text-surface-white text-[16px]"
                style={{ lineHeight: 22, includeFontPadding: true }}
              >
                {savingPreferences ? t('common_saving') : t('profile_preferences_save')}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-6 min-h-[54px] rounded-full flex-row items-center justify-center gap-2"
            style={{ borderWidth: 1.5, borderColor: '#F2B8BA', backgroundColor: '#FFF7F7' }}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#C3363A" />
            <Text className="text-body-lg font-jakarta-bold" style={{ color: '#C3363A' }}>
              {t('account_logout')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

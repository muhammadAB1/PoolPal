import { icons } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { useSupabase } from '@/hooks/supabaseHooks';
import { getAvatarUrl, getInitials } from '@/lib/user';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, plan, country, language, measurement, name } = useAuth();
  const { logout } = useSupabase();

  const avatarUrl = getAvatarUrl(user);
  const initials = getInitials(name, user?.email);
  const fullName = name ?? t('dashboard_greeting_fallback_name');

  const detailRows = [
    { label: t('account_plan_label'), value: plan ? capitalize(plan) : '—' },
    { label: t('signup_language'), value: language === 'es' ? t('signup_language_es') : t('signup_language_en') },
    { label: t('signup_country'), value: country === 'es' ? t('signup_country_es_name') : t('signup_country_us_name') },
    { label: t('signup_measurement'), value: measurement === 'metric' ? t('signup_measurement_metric') : t('signup_measurement_us') },
  ];

  function handleLogout() {
    Alert.alert(
      t('account_logout_confirm_title'),
      t('account_logout_confirm_desc'),
      [
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
      ],
    );
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
          <Text className="text-h3 font-jakarta-extrabold text-brand-navy">
            {t('account_title')}
          </Text>
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
            {user?.email ? (
              <Text className="text-body font-jakarta text-sub mt-1">{user.email}</Text>
            ) : null}
          </View>

          {/* Account details */}
          <View className="card mt-8 px-4" style={shadow.card}>
            {detailRows.map((row, index) => (
              <View
                key={row.label}
                className={`flex-row items-center justify-between py-3.5 ${
                  index === detailRows.length - 1 ? '' : 'border-b border-border-default'
                }`}
              >
                <Text className="text-body font-jakarta text-sub">{row.label}</Text>
                <Text className="text-body font-jakarta-bold text-brand-navy">{row.value}</Text>
              </View>
            ))}
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
    </SafeAreaView>
  );
}

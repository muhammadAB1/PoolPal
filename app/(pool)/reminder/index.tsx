import PoolReviewHeader from '@/components/PoolReviewHeader';
import { colors, shadow } from '@/constants/theme';
import { WEEKDAYS, weekdayTranslationKeys } from '@/data/poolWeeklyReminder';
import { usePool } from '@/providers/PoolProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { POOL_REMINDER } from './_data';

function NotSetIndicator() {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center bg-warning-bg border border-warning rounded-full px-2 py-0.5">
      <View className="w-1.5 h-1.5 rounded-full bg-warning" />
      <Text className="text-tiny font-jakarta-bold text-warning ml-1">{t('pool_tab_not_set')}</Text>
    </View>
  );
}

export default function PoolReminderScreen() {
  const { t, i18n } = useTranslation();
  const { pools } = usePool();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';

  const updatedPoolReminder = {
    ...POOL_REMINDER,
    reminder_day: pools?.reminder_day ?? null,
    reminder_time: pools?.reminder_time ?? null,
    enabled: Boolean(pools?.reminder_day && pools?.reminder_time),
  };

  const [enabled, setEnabled] = useState(updatedPoolReminder.enabled);
  const [includesOpen, setIncludesOpen] = useState(false);

  const dayLabel = updatedPoolReminder.reminder_day
    ? t(weekdayTranslationKeys[updatedPoolReminder.reminder_day])
    : null;
  const timeLabel = updatedPoolReminder.reminder_time;

  let nextReminder: string | null = null;
  if (updatedPoolReminder.reminder_day && timeLabel) {
    const nextDate = new Date();
    const daysAhead = (WEEKDAYS.indexOf(updatedPoolReminder.reminder_day) - nextDate.getDay() + 7) % 7;
    nextDate.setDate(nextDate.getDate() + daysAhead);
    nextReminder = t('pool_reminder_review_next_value', {
      day: dayLabel,
      month: nextDate.toLocaleString(locale, { month: 'long' }),
      date: nextDate.getDate(),
      time: timeLabel,
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <PoolReviewHeader title={t(updatedPoolReminder.title)} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <View className="card--success p-4 flex-row items-center">
            <View className="w-14 h-14 rounded-2xl bg-surface-white items-center justify-center">
              <MaterialCommunityIcons name="calendar-month-outline" size={28} color={colors.brand.navy} />
              {updatedPoolReminder.reminder_day && timeLabel ? (
                <View className="absolute -bottom-0.5 -right-0.5 bg-surface-white rounded-full">
                  <MaterialCommunityIcons name="check-circle" size={18} color={colors.status.success} />
                </View>
              ) : null}
            </View>
            <View className="flex-1 ml-3.5">
              {dayLabel && timeLabel ? (
                <>
                  <Text className="text-small font-jakarta text-sub">
                    {t('pool_reminder_review_every_day', { day: dayLabel })}
                  </Text>
                  <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-0.5">
                    {timeLabel}
                  </Text>
                </>
              ) : (
                <Text className="text-h1 font-jakarta-extrabold text-brand-navy">—</Text>
              )}
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t(updatedPoolReminder.heroSubtitle)}
              </Text>
            </View>
          </View>

          <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-5 mb-2 ml-1">
            {t(updatedPoolReminder.settingsTitle)}
          </Text>

          <View className="card overflow-hidden" style={shadow.card}>
            <View className="flex-row items-center px-4 py-3.5 border-b border-border-default">
              <View className="icon-circle">
                <MaterialCommunityIcons name="bell-outline" size={20} color={colors.brand.blue} />
              </View>
              <View className="flex-1 ml-3 mr-3">
                <Text className="text-body-lg font-jakarta-bold text-charcoal">
                  {t(updatedPoolReminder.toggleTitle)}
                </Text>
                <Text className="text-small font-jakarta text-sub mt-0.5 leading-relaxed">
                  {t(updatedPoolReminder.toggleSubtitle)}
                </Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                trackColor={{ false: colors.border.default, true: colors.brand.aqua }}
                thumbColor={colors.surface.white}
                ios_backgroundColor={colors.border.default}
              />
            </View>

            <View className="flex-row items-center px-4 py-3.5 border-b border-border-default">
              <View className="icon-circle">
                <MaterialCommunityIcons name="calendar-month-outline" size={20} color={colors.brand.blue} />
              </View>
              <Text className="flex-1 text-body-lg font-jakarta-bold text-charcoal ml-3">
                {t(updatedPoolReminder.dayLabel)}
              </Text>
              {dayLabel ? (
                <Text className="text-body font-jakarta text-sub mr-1">{dayLabel}</Text>
              ) : (
                <View className="mr-1">
                  <NotSetIndicator />
                </View>
              )}
              <Ionicons name="chevron-forward" size={16} color={colors.text.faint} />
            </View>

            <View className="flex-row items-center px-4 py-3.5">
              <View className="icon-circle">
                <MaterialCommunityIcons name="clock-outline" size={20} color={colors.brand.blue} />
              </View>
              <Text className="flex-1 text-body-lg font-jakarta-bold text-charcoal ml-3">
                {t(updatedPoolReminder.timeLabel)}
              </Text>
              {timeLabel ? (
                <Text className="text-body font-jakarta text-sub mr-1">{timeLabel}</Text>
              ) : (
                <View className="mr-1">
                  <NotSetIndicator />
                </View>
              )}
              <Ionicons name="chevron-forward" size={16} color={colors.text.faint} />
            </View>
          </View>

          <View className="card--success mt-4 p-4 flex-row items-start">
            <View className="icon-circle icon-circle--success">
              <MaterialCommunityIcons name="calendar-check" size={20} color={colors.status.successText} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t(updatedPoolReminder.nextTitle)}
              </Text>
              <Text
                className={`text-body font-jakarta-bold mt-0.5 ${nextReminder ? 'text-brand-blue' : 'text-faint'}`}
              >
                {nextReminder ?? '—'}
              </Text>
            </View>
          </View>

          <View className="card--info mt-4 p-4 flex-row items-start">
            <View className="icon-circle">
              <MaterialCommunityIcons name="information-outline" size={20} color={colors.brand.blue} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t(updatedPoolReminder.whyTitle)}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5 leading-relaxed">
                {t(updatedPoolReminder.whyBody)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="rounded-2xl border border-brand-aqua bg-surface-white px-4 py-3.5 mt-4"
            activeOpacity={0.8}
            onPress={() => setIncludesOpen((prev) => !prev)}
          >
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="format-list-bulleted" size={20} color={colors.status.successText} />
              <Text className="flex-1 text-body-lg font-jakarta-bold text-success-text ml-3">
                {t(updatedPoolReminder.includesTitle)}
              </Text>
              <Ionicons
                name={includesOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.status.successText}
              />
            </View>

            {includesOpen ? (
              <View className="mt-3 pt-3 border-t border-border-default gap-3.5">
                {updatedPoolReminder.includesItems.map((item) => (
                  <View key={item} className="flex-row items-center">
                    <MaterialCommunityIcons name="check" size={18} color={colors.brand.aqua} />
                    <Text className="flex-1 text-body font-jakarta text-charcoal ml-2.5">
                      {t(item)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

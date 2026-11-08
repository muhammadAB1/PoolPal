import { WEEKDAYS, type Weekday } from '@/data/poolWeeklyReminder';
import i18n from '@/lib/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

const ID = 'weekly-reminder';
const CHANNEL_ID = 'reminders';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

function hour24(time: string) {
  const match = /^(\d{1,2}):00\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  if (hour < 1 || hour > 12) return null;
  const isPm = match[2].toUpperCase() === 'PM';
  if (hour === 12) return isPm ? 12 : 0;
  return isPm ? hour + 12 : hour;
}

function enabledKey(poolId: string) {
  return `weeklyReminderOn:${poolId}`;
}

export async function isWeeklyReminderEnabled(poolId: string) {
  return (await AsyncStorage.getItem(enabledKey(poolId))) !== '0';
}

export async function setWeeklyReminderEnabled(poolId: string, enabled: boolean) {
  await AsyncStorage.setItem(enabledKey(poolId), enabled ? '1' : '0');
}

/**
 * Schedules the weekly local notification for the saved day/time.
 * Cancels it if no day/time is set, or if notification permission is denied
 * (and turns the reminder off in that case).
 */
export async function syncWeeklyReminder(
  poolId: string,
  day?: Weekday | null,
  time?: string | null,
  askAgain = false,
) {
  if (Platform.OS === 'web') return false;

  const hour = day && time ? hour24(time) : null;
  const weekday = day ? WEEKDAYS.indexOf(day) + 1 : 0;

  if (hour == null || weekday < 1) {
    await Notifications.cancelScheduledNotificationAsync(ID);
    return false;
  }

  let permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted' && permission.canAskAgain) {
    permission = await Notifications.requestPermissionsAsync();
  }
  if (permission.status !== 'granted') {
    await Notifications.cancelScheduledNotificationAsync(ID);
    await setWeeklyReminderEnabled(poolId, false);
    if (askAgain && !permission.canAskAgain) await Linking.openSettings();
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.scheduleNotificationAsync({
    identifier: ID,
    content: {
      title: i18n.t('weekly_reminder_notification_title'),
      body: i18n.t('weekly_reminder_notification_body'),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday,
      hour,
      minute: 0,
      channelId: CHANNEL_ID,
    },
  });
  return true;
}

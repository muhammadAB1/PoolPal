import { WEEKDAYS, type Weekday } from '@/data/poolWeeklyReminder';
import i18n from '@/lib/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

const ID = 'weekly-reminder';
const CHANNEL_ID = 'reminders-test';

function hour24(time: string) {
  const match = /^(\d{1,2}):00\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  if (hour < 1 || hour > 12) return null;
  const isPm = match[2].toUpperCase() === 'PM';
  if (hour === 12) return isPm ? 12 : 0;
  return isPm ? hour + 12 : hour;
}

function nextStoredReminderDate(day: Weekday, time: string) {
  const hour = hour24(time);
  const target = WEEKDAYS.indexOf(day);
  if (hour == null || target < 0) return null;
  const next = new Date();
  let daysAhead = (target - next.getDay() + 7) % 7;
  next.setHours(hour, 0, 0, 0);
  if (daysAhead === 0 && next.getTime() <= Date.now()) daysAhead = 7;
  next.setDate(next.getDate() + daysAhead);
  return next;
}

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
 * Schedules one local notification for the pool's saved reminder day and time.
 */
export async function syncWeeklyReminder(
  poolId: string,
  day?: Weekday | null,
  time?: string | null,
  askAgain = false,
) {
  if (Platform.OS === 'web') return false;

  const when = day && time ? nextStoredReminderDate(day, time) : null;
  if (!when) {
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
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(ID);
  } catch {
    // No previous reminder to replace.
  }

  await Notifications.scheduleNotificationAsync({
    identifier: ID,
    content: {
      title: i18n.t('weekly_reminder_notification_title'),
      body: i18n.t('weekly_reminder_notification_body'),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
      channelId: CHANNEL_ID,
    },
  });
  return true;
}

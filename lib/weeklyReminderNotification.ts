import { WEEKDAYS, type Weekday } from '@/data/poolWeeklyReminder';
import i18n from '@/lib/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const ID = 'weekly-reminder';
const CHANNEL_ID = 'reminders';
const CATEGORY_ID = 'weeklyreminder';

let lastKey: string | null = null;
let queue = Promise.resolve();

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

async function apply(day?: Weekday | null, time?: string | null) {
  if (Platform.OS === 'web') return;

  const key = day && time ? `${day}|${time}` : '';
  if (key === lastKey) return;

  if (!day || !time) {
    await Notifications.cancelScheduledNotificationAsync(ID);
    lastKey = '';
    return;
  }

  const hour = hour24(time);
  const weekday = WEEKDAYS.indexOf(day) + 1;
  if (hour == null || weekday < 1) return;

  const current = await Notifications.getPermissionsAsync();
  if (current.status !== 'granted') {
    if (!current.canAskAgain) return;
    const next = await Notifications.requestPermissionsAsync();
    if (next.status !== 'granted') return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
    {
      identifier: 'startpoolcheck',
      buttonTitle: i18n.t('weekly_reminder_notification_button'),
      options: { opensAppToForeground: true },
    },
  ]);

  await Notifications.cancelScheduledNotificationAsync(ID);
  await Notifications.scheduleNotificationAsync({
    identifier: ID,
    content: {
      title: i18n.t('weekly_reminder_notification_title'),
      body: i18n.t('weekly_reminder_notification_body'),
      categoryIdentifier: CATEGORY_ID,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday,
      hour,
      minute: 0,
      channelId: CHANNEL_ID,
    },
  });
  lastKey = key;
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

/** Schedules or cancels the one weekly local notification for the saved reminder. */
export function syncWeeklyReminder(day?: Weekday | null, time?: string | null) {
  queue = queue.then(() => apply(day, time)).catch(() => undefined);
  return queue;
}

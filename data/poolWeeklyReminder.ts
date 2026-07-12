export const WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const weekdayTranslationKeys: Record<Weekday, string> = {
    Sunday: 'weekly_reminder_day_sunday',
    Monday: 'weekly_reminder_day_monday',
    Tuesday: 'weekly_reminder_day_tuesday',
    Wednesday: 'weekly_reminder_day_wednesday',
    Thursday: 'weekly_reminder_day_thursday',
    Friday: 'weekly_reminder_day_friday',
    Saturday: 'weekly_reminder_day_saturday',
};

export const REMINDER_HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type ReminderHour = (typeof REMINDER_HOURS)[number];

export const REMINDER_PERIODS = ['AM', 'PM'] as const;

export type ReminderPeriod = (typeof REMINDER_PERIODS)[number];

export function formatReminderTime(hour: ReminderHour, period: ReminderPeriod): string {
    return `${hour}:00 ${period}`;
}

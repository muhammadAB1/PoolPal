import type { Weekday } from '@/data/poolWeeklyReminder';

/**
 * Static copy for the reminder review screen.
 * `reminder_day` and `reminder_time` come from the pool profile and stay unset when missing.
 */
export const POOL_REMINDER = {
  heading: 'weekly-reminder' as const,
  title: 'pool_tab_reminder',
  enabled: false,
  reminder_day: null as Weekday | null,
  reminder_time: null as string | null,
  heroSubtitle: 'pool_reminder_review_hero_subtitle',
  settingsTitle: 'pool_reminder_review_settings_title',
  toggleTitle: 'weekly_reminder_card_title',
  toggleSubtitle: 'pool_reminder_review_toggle_subtitle',
  dayLabel: 'pool_reminder_review_day',
  timeLabel: 'pool_reminder_review_time',
  nextTitle: 'pool_reminder_review_next_title',
  whyTitle: 'pool_reminder_review_why_title',
  whyBody: 'pool_reminder_review_why_body',
  includesTitle: 'pool_reminder_review_includes_title',
  includesItems: [
    'pool_reminder_review_includes_test',
    'pool_reminder_review_includes_readings',
    'pool_reminder_review_includes_baskets',
    'pool_reminder_review_includes_clarity',
    'pool_reminder_review_includes_checklist',
  ],
};

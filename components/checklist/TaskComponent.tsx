import { colors } from '@/constants/theme';
import type { ChecklistTask } from '@/data/checklist';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

const TEAL = '#2EC4B6';

/** Monday 00:00 of the current week — anything saved before this has expired. */
function getWeekStart() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() + (now.getDay() === 0 ? -6 : 1 - now.getDay()));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  required: { bg: '#E6F8F6', text: '#1A9E94' },
  afterTesting: { bg: '#EEF2FF', text: '#6366F1' },
  weekly: { bg: '#E6F8F6', text: '#1A9E94' },
  asNeeded: { bg: '#F2F4F7', text: colors.text.sub },
  monthly: { bg: '#F2F4F7', text: colors.text.sub },
  optional: { bg: '#F2F4F7', text: colors.text.sub },
};

type TaskComponentProps = {
  task: ChecklistTask;
  disabled: boolean;
  onChange: (done: boolean, optional?: boolean) => void;
};

function TaskComponent({ task, disabled, onChange }: TaskComponentProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
  const badge = BADGE_COLORS[task.badge];

  const [done, setDone] = useState(false);
  const [completedAt, setCompletedAt] = useState<Date | null>(null);

  async function toggle() {
    if (disabled) return;
    setDone(!done);
    if (!done && task.showCompletedAt) setCompletedAt(new Date());
    if (done) setCompletedAt(null);
    if (!done) {
      await AsyncStorage.setItem(`checklist.${task.id}`,
        JSON.stringify({ done: true, completedAt: new Date().toISOString() }));
    } else {
      await AsyncStorage.setItem(`checklist.${task.id}`,
        JSON.stringify({ done: false, completedAt: null }));
    }
    onChange(!done, task.optional);
  }

  useEffect(() => {
    async function fetchTaskStatus() {
      console.log('I started fetching task status');
      const raw = await AsyncStorage.getItem(`checklist.${task.id}`);
      if (!raw) return;
      const rawData = JSON.parse(raw);
      if (rawData.completedAt && new Date(rawData.completedAt) < getWeekStart()) {
        setDone(false);
        setCompletedAt(null);
        await AsyncStorage.setItem(`checklist.${task.id}`,
          JSON.stringify({ done: false, completedAt: null }));
      } else {
        setDone(rawData.done);
        setCompletedAt(rawData.completedAt ? new Date(rawData.completedAt) : null);
      }
    }
    fetchTaskStatus();
  }, [task.id])

  let subtext: string | null = null;
  if (task.subtextKey) {
    subtext = t(`checklist.subtexts.${task.subtextKey}`);
  } else if (task.showCompletedAt && done && completedAt) {
    const datetime = completedAt.toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
    subtext = t('checklist.completedAt', { datetime });
  }

  return (
    <TouchableOpacity
      className="flex-row items-start px-4 py-3.5"
      activeOpacity={0.7}
      disabled={disabled}
      onPress={toggle}
    >
      {done ? (
        <Ionicons name="checkmark-circle" size={24} color={TEAL} />
      ) : (
        <View
          className="w-6 h-6 rounded-full border-2"
          style={{ borderColor: colors.border.default }}
        />
      )}

      <View className="flex-1 ml-3 mr-2">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-body font-jakarta-bold text-brand-navy">
            {t(`checklist.tasks.${task.id}`)}
          </Text>
          <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: badge.bg }}>
            <Text className="text-tiny font-jakarta-bold" style={{ color: badge.text }}>
              {t(`checklist.badges.${task.badge}`)}
            </Text>
          </View>
        </View>
        {subtext ? (
          <Text className="text-small font-jakarta text-sub mt-1">{subtext}</Text>
        ) : null}
      </View>

      {task.hasChevron ? (
        <Ionicons name="chevron-forward" size={18} color={colors.text.faint} />
      ) : null}
    </TouchableOpacity>
  );
}

export default memo(TaskComponent);

import { colors } from '@/constants/theme';
import type { ChecklistTask } from '@/data/checklist';
import { isChecklistTaskExpired } from '@/lib/checklistStorage';
import { useChecklist } from '@/providers/ChecklistProvider';
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

const TEAL = '#2EC4B6';

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  required: { bg: '#E6F8F6', text: '#1A9E94' },
  afterTesting: { bg: '#EEF2FF', text: '#6366F1' },
  weekly: { bg: '#E6F8F6', text: '#1A9E94' },
  asNeeded: { bg: '#F2F4F7', text: colors.text.sub },
  monthly: { bg: '#F2F4F7', text: colors.text.sub },
  optional: { bg: '#F2F4F7', text: colors.text.sub },
};

function TaskComponent({ task, disabled }: { task: ChecklistTask; disabled: boolean }) {
  const { t, i18n } = useTranslation();
  const { checklist, setTask } = useChecklist();
  const badge = BADGE_COLORS[task.badge];
  const raw = checklist[task.id];
  const done = !!raw?.done && !isChecklistTaskExpired(raw.completedAt);
  const completedAt = done && raw.completedAt ? new Date(raw.completedAt) : null;
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';

  let subtext: string | null = null;
  if (task.subtextKey) {
    subtext = t(`checklist.subtexts.${task.subtextKey}`);
  } else if (task.showCompletedAt && completedAt) {
    subtext = t('checklist.completedAt', {
      datetime: completedAt.toLocaleString(locale, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    });
  }

  return (
    <TouchableOpacity
      className="flex-row items-start px-4 py-3.5"
      activeOpacity={0.7}
      disabled={disabled}
      onPress={() => !disabled && setTask(task.id, !done)}
    >
      {done ? (
        <Ionicons name="checkmark-circle" size={24} color={TEAL} />
      ) : (
        <View className="w-6 h-6 rounded-full border-2" style={{ borderColor: colors.border.default }} />
      )}
      <View className="flex-1 ml-3 mr-2">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-body font-jakarta-bold text-brand-navy">{t(`checklist.tasks.${task.id}`)}</Text>
          <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: badge.bg }}>
            <Text className="text-tiny font-jakarta-bold" style={{ color: badge.text }}>
              {t(`checklist.badges.${task.badge}`)}
            </Text>
          </View>
        </View>
        {subtext ? <Text className="text-small font-jakarta text-sub mt-1">{subtext}</Text> : null}
      </View>
      {task.hasChevron ? <Ionicons name="chevron-forward" size={18} color={colors.text.faint} /> : null}
    </TouchableOpacity>
  );
}

export default memo(TaskComponent);

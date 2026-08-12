import TaskComponent from '@/components/checklist/TaskComponent';
import ProfileCompletionRing from '@/components/ProfileCompletionRing';
import { icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
  CHECKLIST_SECTIONS,
  REQUIRED_TASK_IDS,
  getNextMondayLabel,
  getWeekLabel,
} from '@/data/checklist';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL = '#2EC4B6';

export default function ChecklistScreen() {
  const { checklistCompleted } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';

  // Parent only tracks the count for progress / footer
  const [completed, setCompleted] = useState(Number(checklistCompleted));
  const [weekDone, setWeekDone] = useState(false);

  const total = REQUIRED_TASK_IDS.length;
  const percent = Math.round((completed / total) * 100);
  const allDone = completed === total;
  const nextReset = getNextMondayLabel(locale);

  const handleTaskChange = useCallback((done: boolean, optional?: boolean) => {
    if (optional) return;
    setCompleted((n) => (done ? n + 1 : n - 1));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-4 pt-2 pb-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            onPress={() => router.navigate('/(tabs)/dashboard')}
          >
            <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
          </TouchableOpacity>
          <Text className="text-h3 font-jakarta-extrabold text-brand-navy">{t('checklist.title')}</Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons name="ellipsis-vertical" size={20} color={colors.brand.navy} />
          </TouchableOpacity>
        </View>
        <Text className="text-body font-jakarta text-sub text-center mt-1">{t('checklist.subtitle')}</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress card */}
        <View className="card--success p-4 mb-5">
          <View className="flex-row items-center">
            <ProfileCompletionRing
              percentage={percent}
              size={64}
              strokeWidth={7}
              progressColor={TEAL}
              trackColor="#D8F0EC"
            />
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-extrabold text-brand-navy">
                {t('checklist.weekOf', { range: getWeekLabel(locale) })}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('checklist.completeStatus', { completed, total, percent })}
              </Text>
              <View className="progress-bar mt-2.5">
                <View className="progress-bar__fill" style={{ width: `${percent}%` }} />
              </View>
              <Text className="text-small font-jakarta-semibold text-brand-navy mt-2">
                {allDone ? t('checklist.routineComplete') : t('checklist.almostDone')}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center self-start mt-3 rounded-full bg-surface-white px-2.5 py-1 border border-border-default">
            <Text className="text-tiny font-jakarta-semibold text-sub">{t('checklist.resetsMonday')}</Text>
            <Image
              source={icons.info}
              className="w-3.5 h-3.5 ml-1"
              resizeMode="contain"
              style={{ tintColor: colors.text.faint }}
            />
          </View>
        </View>

        {/* Task sections */}
        {CHECKLIST_SECTIONS.map((section) => (
          <View key={section.id} className="mb-5">
            <View className="flex-row items-center gap-2 mb-2.5">
              <Ionicons name={section.icon} size={16} color={TEAL} />
              <Text className="text-tiny font-jakarta-extrabold text-brand-navy tracking-wide">
                {t(`checklist.sections.${section.id}`)}
              </Text>
            </View>

            <View className="card overflow-hidden">
              {section.tasks.map((task, index) => (
                <View key={task.id}>
                  {index > 0 ? <View className="divider mx-4" /> : null}
                  <TaskComponent
                    task={task}
                    disabled={weekDone}
                    onChange={handleTaskChange}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Shown after user taps "Complete This Week" */}
        {weekDone ? (
          <View className="card--success flex-row items-center gap-2 px-4 py-3.5">
            <Ionicons name="checkmark-circle" size={20} color={TEAL} />
            <View className="flex-1">
              <Text className="text-body font-jakarta-bold text-brand-navy">{t('checklist.weekCompleted')}</Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('checklist.nextChecklistStarts', { date: nextReset })}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Footer button */}
      <View className="px-4 pt-3 pb-3 bg-surface-bg border-t border-border-default">
        <TouchableOpacity
          className="rounded-2xl py-4 items-center"
          style={{ backgroundColor: allDone && !weekDone ? TEAL : '#E8ECF0' }}
          disabled={!allDone || weekDone}
          onPress={() => setWeekDone(true)}
        >
          <Text
            className="text-button font-jakarta-bold"
            style={{ color: allDone && !weekDone ? colors.surface.white : colors.text.sub }}
          >
            {allDone && !weekDone ? t('checklist.completeWeek') : t('checklist.completeFirst')}
          </Text>
        </TouchableOpacity>

        {allDone && !weekDone ? (
          <View className="flex-row items-center justify-center gap-1.5 mt-2.5">
            <Ionicons name="calendar-outline" size={14} color={colors.text.faint} />
            <Text className="text-small font-jakarta text-faint">
              {t('checklist.nextReset', { date: nextReset })}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

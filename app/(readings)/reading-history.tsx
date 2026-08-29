import { icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
  HAVE_RESULTS_FIELD_COLUMNS,
  HAVE_RESULTS_FIELDS,
  testReadingRowToSelections,
  type HaveResultsFieldKey,
} from '@/data/chooseTestMethod';
import {
  getIdealStatusRange,
  getReadingStatus,
  type ReadingStatus,
} from '@/data/readingBands';
import { STATUS_BADGE } from '@/data/readingPoolAndSwimStatusUiLabelsColorsAndIcons';
import type { TestReadingRow } from '@/lib/types';
import { usePool } from '@/providers/PoolProvider';
import { useTestStrips } from '@/providers/TestStripProvider';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatHistoryDateTime(iso: string) {
  const date = new Date(iso);
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
  const monthDay = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${weekday}, ${monthDay}, ${time}`;
}

function getFieldValue(row: TestReadingRow, fieldKey: HaveResultsFieldKey): string | null {
  const column = HAVE_RESULTS_FIELD_COLUMNS[fieldKey];
  const raw = row[column];
  if (raw == null || raw === '') return null;
  return String(raw);
}

function valueTextClass(status: ReadingStatus | null): string {
  if (status == null) return 'text-faint';
  return STATUS_BADGE[status].text;
}

export default function ReadingHistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { pools } = usePool();
  const { allReadings } = useTestStrips();

  const idealRangesByRow = useMemo(
    () =>
      allReadings.map((row) =>
        getIdealStatusRange(testReadingRowToSelections(row), pools),
      ),
    [allReadings, pools],
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          {/* Header */}
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-10 h-10 items-start justify-center -ml-1"
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-1">
            {t('reading_history_title')}
          </Text>
          <Text className="text-body font-jakarta text-sub mt-1">
            {t('reading_history_subtitle')}
          </Text>

          {/* Summary card */}
          <View className="card mt-5 p-4 flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-full bg-surface-soft-aqua items-center justify-center">
              <Image source={icons.calendar} className="w-5 h-5" resizeMode="contain" />
            </View>
            <View className="flex-1">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t('reading_history_saved_tests', { count: idealRangesByRow.length })}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('reading_history_summary_hint')}
              </Text>
            </View>
          </View>

          {/* History list */}
          {idealRangesByRow.length === 0 ? (
            <View className="card mt-4 p-6 items-center">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy text-center">
                {t('reading_history_empty_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-2 text-center">
                {t('reading_history_empty_desc')}
              </Text>
            </View>
          ) : (
            <View className="mt-4 gap-3">
              {allReadings.map((row, index) => {
                const idealRanges = idealRangesByRow[index] ?? {};
                const createdAt = row.created_at ?? '';

                return (
                  <View key={row.id} className="card p-4">
                    <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                      {createdAt ? formatHistoryDateTime(createdAt) : '\u2014'}
                    </Text>

                    <View className="divider my-4" />

                    <View className="flex-row flex-wrap">
                      {HAVE_RESULTS_FIELDS.filter(
                        (field) => getFieldValue(row, field.key) != null,
                      ).map((field) => {
                        const value = getFieldValue(row, field.key)!;
                        const unit =
                          field.unitKey === 'choose_test_method_unit_none' ? '' : ' ppm';
                        const range = idealRanges[field.testName] ?? null;
                        const status = getReadingStatus(field.testName, value, range);

                        return (
                          <View key={field.key} className="w-1/4 mb-3">
                            <Text className="text-tiny font-jakarta text-sub">
                              {field.abbreviation}
                            </Text>
                            <Text
                              className={`text-body font-jakarta-bold mt-1 ${valueTextClass(status)}`}
                            >
                              {`${value}${unit}`}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { chemistryIcons } from '@/constants/images';
import { colors } from '@/constants/theme';
import { HAVE_RESULTS_FIELDS } from '@/data/chooseTestMethod';
import {
  getIdealStatusRange,
  getReadingStatus,
  type IdealRange,
  type ReadingStatus,
} from '@/data/readingBands';
import {
  OVERALL_STATUS,
  STATUS_BADGE,
  STATUS_LABEL,
  SWIM_STATUS,
} from '@/data/readingPoolAndSwimStatusUiLabelsColorsAndIcons';
import { testMeta } from '@/data/waterTestNameToAbbreviationAndColor';
import { usePool } from '@/providers/PoolProvider';
import { useTestStrips } from '@/providers/TestStripProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEST_INTERVAL_DAYS = 7;

type TestedRow = {
  testName: string;
  unit: string;
  value: string;
  status: ReadingStatus;
  range: IdealRange | null;
};

type UntestedRow = {
  testName: string;
  unit: string;
  range: IdealRange | null;
};

function daysSince(iso: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
}

function formatReadingDateTime(iso: string) {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
  const timePart = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${datePart} at ${timePart}`;
}

export default function ReadingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { pools } = usePool();
  const { latestReading } = useTestStrips();

  const selections = latestReading?.selections ?? {};
  const idealRanges = getIdealStatusRange(selections, pools);
  const createdAt = latestReading?.createdAt ?? null;
  const daysAgo = createdAt ? daysSince(createdAt) : null;
  const overdueDays =
    daysAgo != null && daysAgo > TEST_INTERVAL_DAYS ? daysAgo - TEST_INTERVAL_DAYS : null;
  const formattedDate = createdAt ? formatReadingDateTime(createdAt) : null;

  const testedRows: TestedRow[] = [];
  const untestedRows: UntestedRow[] = [];

  for (const field of HAVE_RESULTS_FIELDS) {
    const unit = field.unitKey === 'choose_test_method_unit_none' ? '' : 'ppm';
    const range = idealRanges[field.testName] ?? null;
    const value = selections[field.testName];
    if (value == null) {
      untestedRows.push({ testName: field.testName, unit, range });
      continue;
    }
    testedRows.push({
      testName: field.testName,
      unit,
      value,
      status: getReadingStatus(field.testName, value, range),
      range,
    });
  }

  const attentionRows = testedRows.filter((row) => row.status !== 'ideal');
  const idealRows = testedRows.filter((row) => row.status === 'ideal');

  const overall = latestReading?.poolStatus
    ? OVERALL_STATUS[latestReading.poolStatus]
    : null;
  const swim = latestReading?.swimmingStatus
    ? SWIM_STATUS[latestReading.swimmingStatus]
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-h1 font-jakarta-extrabold text-brand-navy">
              {t('readings_title')}
            </Text>
            <TouchableOpacity
              className="w-9 h-9 rounded-full border border-border-default items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="information-circle-outline" size={20} color={colors.brand.navy} />
            </TouchableOpacity>
          </View>
          <Text className="text-body font-jakarta text-sub mt-1">
            {t('readings_subtitle')}
          </Text>

          {/* Overdue banner */}
          {overdueDays != null ? (
            <TouchableOpacity className="card--warning flex-row items-center gap-2.5 px-4 py-3 mt-4" activeOpacity={0.8}>
              <Ionicons name="warning" size={18} color={colors.status.warning} />
              <Text className="flex-1 text-small font-jakarta-bold text-[#92400E]">
                {t('readings_overdue', { count: overdueDays })}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.status.warning} />
            </TouchableOpacity>
          ) : null}

          {/* Pool status */}
          <View className="card mt-4 p-4">
            <StatusPillRow
              icon="warning-outline"
              iconBg="bg-surface-mint"
              iconColor={colors.brand.aqua}
              label={t('readings_pool_status_label')}
              badgeLabel={overall ? t(overall.labelKey) : t('readings_not_tested_badge')}
              badgeColor={overall?.badgeColor ?? colors.text.faint}
              badgeIcon={overall?.icon ?? 'help-circle-outline'}
            />

            <View className="divider my-3" />

            <StatusPillRow
              icon="water-outline"
              iconBg="bg-surface-soft-aqua"
              iconColor={colors.brand.blue}
              label={t('water_results_swim_status_label')}
              badgeLabel={swim ? t(swim.labelKey) : t('readings_not_tested_badge')}
              badgeColor={swim?.badgeColor ?? colors.text.faint}
              badgeIcon={swim?.icon ?? 'help-circle-outline'}
            />

            <View className="flex-row items-center gap-4 mt-3.5">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-success" />
                <Text className="text-small font-jakarta-bold text-charcoal">
                  {t('readings_legend_ideal', { count: idealRows.length })}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-warning" />
                <Text className="text-small font-jakarta-bold text-charcoal">
                  {t('readings_legend_needs_attention', { count: attentionRows.length })}
                </Text>
              </View>
              {/* No dot for "Not tested" — a neutral marker isn't used here by design. */}
              <Text className="text-small font-jakarta-bold text-sub">
                {t('readings_legend_not_tested', { count: untestedRows.length })}
              </Text>
            </View>

            <Text className="text-small font-jakarta text-sub mt-3">
              {t('readings_status_tip')}
            </Text>
          </View>

          {/* Latest pool test */}
          <View className="card mt-4 p-4">
            <View className="flex-row items-start gap-3">
              <View className="w-11 h-11 rounded-full bg-surface-soft-aqua items-center justify-center">
                <Ionicons name="flask-outline" size={20} color={colors.brand.blue} />
              </View>
              <View className="flex-1">
                <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                  {t('readings_latest_test_title')}
                </Text>
                {formattedDate && daysAgo != null ? (
                  <Text className="text-small font-jakarta text-sub mt-0.5">
                    {t('readings_latest_test_datetime', { date: formattedDate, daysAgo })}
                  </Text>
                ) : (
                  <Text className="text-small font-jakarta text-sub mt-0.5">
                    {t('readings_empty_desc')}
                  </Text>
                )}
              </View>
            </View>

            <View className="flex-row items-center gap-4 mt-3.5">
              <TouchableOpacity
                className="flex-row items-center gap-1.5 rounded-full bg-success px-4 py-2.5"
                activeOpacity={0.85}
                onPress={() => router.push('/(readings)/choose-test-method')}
              >
                <Ionicons name="add" size={16} color={colors.surface.white} />
                <Text className="text-small font-jakarta-bold text-surface-white">
                  {t('readings_add_new')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7}>
                <Ionicons name="create-outline" size={15} color={colors.brand.blue} />
                <Text className="text-small font-jakarta-bold text-brand-blue">
                  {t('readings_edit_last')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recommended treatment */}
          <View className="card--warning mt-4 p-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="flask-outline" size={16} color={colors.status.warning} />
              <Text className="text-tiny font-jakarta-extrabold text-warning tracking-wide">
                {t('readings_recommended_treatment_label').toUpperCase()}
              </Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-center gap-1.5 rounded-full bg-success px-5 py-3.5 mt-3"
              activeOpacity={0.85}
              onPress={() => router.push('/(readings)/water-results')}
            >
              <Text className="text-button font-jakarta-bold text-surface-white">
                {t('readings_view_treatment_plan')}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.surface.white} />
            </TouchableOpacity>

            <View className="flex-row items-center gap-6 mt-3.5">
              {/* this data need to be fetched from database */}
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="time-outline" size={14} color={colors.text.sub} />
                <Text className="text-tiny font-jakarta text-sub">{t('readings_est_time')}</Text>
              </View>
              {/* this data need to be fetched from database */}
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="cart-outline" size={14} color={colors.text.sub} />
                <Text className="text-tiny font-jakarta text-sub">
                  {t('readings_supplies_needed')}
                </Text>
              </View>
            </View>
          </View>

          {/* Latest test results */}
          <View className="card mt-4 p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-h3 font-jakarta-extrabold text-brand-navy">
                {t('readings_latest_results_title')}
              </Text>
              {formattedDate ? (
                <Text className="text-tiny font-jakarta text-sub">{formattedDate}</Text>
              ) : null}
            </View>

            {!latestReading ? (
              <Text className="text-small font-jakarta text-sub text-center py-6">
                {t('readings_empty_desc')}
              </Text>
            ) : (
              <>
                {attentionRows.length > 0 ? (
                  <View className="mt-4">
                    <View className="flex-row items-center gap-1.5">
                      <View className="w-1.5 h-1.5 rounded-full bg-error" />
                      <Text className="text-small font-jakarta-extrabold text-error">
                        {t('readings_needs_attention_section', { count: attentionRows.length })}
                      </Text>
                    </View>
                    <View className="mt-2.5 gap-4">
                      {attentionRows.map((row) => (
                        <TestResultRow key={row.testName} row={row} />
                      ))}
                    </View>
                  </View>
                ) : null}

                {idealRows.length > 0 ? (
                  <View className={attentionRows.length > 0 ? 'mt-4' : 'mt-2'}>
                    {attentionRows.length > 0 ? <View className="divider mb-4" /> : null}
                    <View className="flex-row items-center gap-1.5">
                      <View className="w-1.5 h-1.5 rounded-full bg-success" />
                      <Text className="text-small font-jakarta-extrabold text-success-text">
                        {t('readings_in_range_section', { count: idealRows.length })}
                      </Text>
                    </View>
                    <View className="mt-2.5 gap-4">
                      {idealRows.map((row) => (
                        <TestResultRow key={row.testName} row={row} />
                      ))}
                    </View>
                  </View>
                ) : null}

                {untestedRows.length > 0 ? (
                  <View className="mt-4">
                    <View className="divider mb-4" />
                    {/* No grey dot indicator for "Not Tested" by design. */}
                    <Text className="text-small font-jakarta-extrabold text-sub">
                      {t('readings_not_tested_section', { count: untestedRows.length })}
                    </Text>
                    <View className="mt-2.5 gap-4">
                      {untestedRows.map((row) => (
                        <TestResultRow key={row.testName} row={row} />
                      ))}
                    </View>
                  </View>
                ) : null}
              </>
            )}
          </View>

          {/* View reading history */}
          <TouchableOpacity
            className="card mt-4 p-4 flex-row items-center"
            activeOpacity={0.7}
            onPress={() => router.push('/(readings)/reading-history')}
          >
            <View className="w-11 h-11 rounded-full bg-surface-soft-aqua items-center justify-center">
              <Ionicons name="bar-chart-outline" size={18} color={colors.brand.blue} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                {t('readings_view_history_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5">
                {t('readings_view_history_desc')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.faint} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Icon + label on the left, a colored status pill on the right. Used for
 *  both Pool Status and Swim Status so either can hold a long label without
 *  breaking the layout. */
function StatusPillRow({
  icon,
  iconBg,
  iconColor,
  label,
  badgeLabel,
  badgeColor,
  badgeIcon,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  badgeLabel: string;
  badgeColor: string;
  badgeIcon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View className={`w-10 h-10 rounded-full items-center justify-center ${iconBg}`}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text className="flex-1 text-body font-jakarta-bold text-charcoal" numberOfLines={1}>
        {label}
      </Text>
      <View
        className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
        style={{ backgroundColor: badgeColor }}
      >
        <Ionicons name={badgeIcon} size={12} color={colors.surface.white} />
        <Text className="text-tiny font-jakarta-extrabold text-surface-white" numberOfLines={1}>
          {badgeLabel}
        </Text>
      </View>
    </View>
  );
}

/** One row in the "Latest Test Results" card — tested or not-tested. */
const CHEMISTRY_ICON_BY_ABBR = {
  FC: chemistryIcons.freeChlorine,
  TC: chemistryIcons.totalChlorine,
  CC: chemistryIcons.combinedChlorine,
  BR: chemistryIcons.bromine,
  pH: chemistryIcons.ph,
  TA: chemistryIcons.totalAlkalinity,
  CH: chemistryIcons.calciumHardness,
  CYA: chemistryIcons.cyanuricAcid,
  S: chemistryIcons.salt,
  Salt: chemistryIcons.salt,
  TH: chemistryIcons.totalHardness,
  H: chemistryIcons.calciumHardness,
  PO4: chemistryIcons.phosphates,
  TDS: chemistryIcons.tds,
  FE: chemistryIcons.iron,
  CU: chemistryIcons.copper,
} as const;

function TestResultRow({ row }: { row: TestedRow | UntestedRow }) {
  const { t } = useTranslation();
  const abbr =
    HAVE_RESULTS_FIELDS.find((field) => field.testName === row.testName)?.abbreviation ??
    testMeta(row.testName).abbr;
  const chemistryIcon =
    CHEMISTRY_ICON_BY_ABBR[abbr as keyof typeof CHEMISTRY_ICON_BY_ABBR];
  const unitSuffix = row.unit ? ` ${row.unit}` : '';
  const isTested = 'value' in row;
  const badge = isTested
    ? STATUS_BADGE[row.status]
    : { container: 'bg-surface-bg', text: 'text-sub' };
  const badgeLabel = isTested ? t(STATUS_LABEL[row.status]) : t('readings_not_tested_badge');

  return (
    <View className="flex-row items-start justify-between gap-3">
      <View className="flex-1 flex-row items-center">
        {chemistryIcon ? (
          <Image
            source={chemistryIcon}
            className="w-12 h-12 mr-3"
            style={{ width: 48, height: 48 }}
            resizeMode="contain"
          />
        ) : null}

        <View className="flex-1">
          <Text className="text-body font-jakarta-bold text-brand-navy">
            {row.testName}
          </Text>
          {row.range ? (
            <Text className="text-tiny font-jakarta text-sub mt-0.5">
              {t('readings_recommended_range', {
                min: row.range.min,
                max: row.range.max,
                unit: unitSuffix,
              })}
            </Text>
          ) : null}
        </View>
      </View>
      <View className="items-end">
        <Text
          className={`text-body font-jakarta-bold ${isTested ? 'text-brand-navy' : 'text-faint'}`}
        >
          {isTested ? `${row.value}${unitSuffix}` : '\u2014'}
        </Text>
        <View className={`rounded-full px-2.5 py-1 mt-1 ${badge.container}`}>
          <Text className={`text-tiny font-jakarta-bold ${badge.text}`}>{badgeLabel}</Text>
        </View>
      </View>
    </View>
  );
}

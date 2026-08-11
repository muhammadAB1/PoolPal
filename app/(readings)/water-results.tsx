import { dashboardImages, icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
  getIdealStatusRange,
  getOverallPoolStatus,
  getReadingStatus,
  parseReadingValue,
  type OverallStatus,
  type ReadingStatus,
} from '@/data/readingBands';
import { getPads, type TestStripPad } from '@/data/testStripBrands';
import { usePool } from '@/providers/PoolProvider';
import { useTestStrips } from '@/providers/TestStripProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATUS_LABEL: Record<ReadingStatus, string> = {
  very_low: 'water_results_status_very_low',
  low: 'water_results_status_low',
  ideal: 'water_results_status_ideal',
  high: 'water_results_status_high',
  very_high: 'water_results_status_very_high',
};

const STATUS_BADGE: Record<ReadingStatus, { container: string; text: string }> = {
  very_low: { container: 'bg-[#FDECEC]', text: 'text-error' },
  low: { container: 'bg-warning-bg', text: 'text-warning' },
  ideal: { container: 'bg-surface-mint', text: 'text-success-text' },
  high: { container: 'bg-warning-bg', text: 'text-warning' },
  very_high: { container: 'bg-[#FDECEC]', text: 'text-error' },
};

/** Badge + summary copy/colors for the 4 overall statuses from readingBands. */
const OVERALL_STATUS: Record<
  OverallStatus,
  {
    labelKey: string;
    summaryKey: string;
    badgeColor: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  looking_great: {
    labelKey: 'water_results_looking_great',
    summaryKey: 'water_results_summary_looking_great',
    badgeColor: colors.status.success,
    icon: 'checkmark',
  },
  mostly_balanced: {
    labelKey: 'water_results_mostly_balanced',
    summaryKey: 'water_results_summary_mostly_balanced',
    badgeColor: colors.brand.aqua,
    icon: 'checkmark',
  },
  needs_balancing: {
    labelKey: 'water_results_needs_balancing',
    summaryKey: 'water_results_summary_needs_balancing',
    badgeColor: colors.status.warning,
    icon: 'alert',
  },
  action_needed: {
    labelKey: 'water_results_action_needed',
    summaryKey: 'water_results_summary_action_needed',
    badgeColor: colors.status.error,
    icon: 'alert',
  },
};

const TEST_META: { match: RegExp; abbr: string; color: string }[] = [
  { match: /hardness/i, abbr: 'H', color: '#6E9C4D' },
  { match: /alkalinity/i, abbr: 'TA', color: '#8B9A3C' },
  { match: /cyanuric|stabilizer/i, abbr: 'CYA', color: '#F0983D' },
  { match: /total\s*chlorine/i, abbr: 'TC', color: '#2EB8D9' },
  { match: /free\s*chlorine|available\s*chlorine|fac/i, abbr: 'FC', color: '#E87BA0' },
  { match: /bromine/i, abbr: 'BR', color: '#6B8CAE' },
  { match: /^ph$/i, abbr: 'pH', color: '#E5484D' },
];

function testMeta(testName: string) {
  const found = TEST_META.find((item) => item.match.test(testName));
  return found ?? { abbr: testName.slice(0, 2).toUpperCase(), color: colors.brand.blue };
}

function scaleEnds(pad: TestStripPad) {
  const nums = pad.colors
    .map((c) => parseReadingValue(c.value))
    .filter((n): n is number => n !== null);
  if (nums.length === 0) return { min: 0, max: 1 };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export default function WaterResultsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedBrand, selections } = useTestStrips();
  const { pools } = usePool();
  const idealRanges = getIdealStatusRange(selections, pools);

  const pads = selectedBrand ? getPads(selectedBrand) : [];
  const rows = pads.filter((pad) => selections[pad.testName] != null);
  const statuses = rows.map((pad) =>
    getReadingStatus(pad.testName, selections[pad.testName]),
  );
  const idealCount = statuses.filter((status) => status === 'ideal').length;

  // this is status of the pool coming from the array declared at the start with the name of OVERALL_STATUS.
  //pool condition wont be based on statuses, it will be changed later.
  const overall = OVERALL_STATUS[getOverallPoolStatus(statuses)];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.white }}>
      <View className="px-5 pt-1 pb-2 bg-surface-white">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Image
              source={icons.backArrow}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <Image
              source={icons.waterDrop}
              className="w-7 h-7 z-1"
              resizeMode="contain"
            />
            <View className="w-9 h-9 rounded-2xl absolute -translate-x-0.75 bg-brand-blue items-center justify-center" />
            <Text className="text-h3 font-jakarta-extrabold text-brand-navy">
              {t('dashboard_brand_name')}
            </Text>
          </View>

          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-h3 font-jakarta-bold text-brand-navy">?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5">
          <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-2">
            {t('water_results_title')}
          </Text>
          <Text className="text-body font-jakarta text-sub mt-1">
            {t('water_results_subtitle')}
          </Text>

          {/* Summary */}
          <View className="card--info flex-row items-start gap-3 px-4 py-4 mt-4">
            <Image
              source={dashboardImages.poolIllustration}
              className="w-14 h-14"
              resizeMode="contain"
            />
            <View className="flex-1">
              <View
                className="self-start flex-row items-center gap-1 rounded-full px-2.5 py-1"
                style={{ backgroundColor: overall.badgeColor }}
              >
                <Ionicons
                  name={overall.icon}
                  size={12}
                  color={colors.surface.white}
                />
                <Text className="text-tiny font-jakarta-extrabold text-surface-white">
                  {t(overall.labelKey)}
                </Text>
              </View>
              <Text className="text-small font-jakarta text-charcoal mt-2 leading-5">
                {t(overall.summaryKey)}
              </Text>
              <View className="flex-row items-center gap-1 mt-2">
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={overall.badgeColor}
                />
                <Text className="text-small font-jakarta-bold text-brand-navy">
                  {t('water_results_in_range', {
                    count: idealCount,
                    total: rows.length,
                  })}
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-5 mb-3">
            {t('water_results_detailed')}
          </Text>

          {rows.length === 0 ? (
            <Text className="text-small font-jakarta text-sub text-center py-6">
              {t('water_results_empty')}
            </Text>
          ) : (
            <View className="gap-3">
              <Text>a</Text>
              {rows.map((pad) => (
                <ResultRow
                  key={pad.testName}
                  pad={pad}
                  value={selections[pad.testName]}
                  range={idealRanges[pad.testName] ?? null}
                />
              ))}
            </View>
          )}

          <View className="card--info flex-row items-start gap-2.5 px-3.5 py-3 mt-5">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.text.sub}
            />
            <Text className="flex-1 text-small font-jakarta text-charcoal leading-5">
              {t('water_results_info')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pt-2 pb-3">
        <TouchableOpacity className="btn btn--primary" activeOpacity={0.85}>
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('water_results_cta')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ResultRow({
  pad,
  value,
  range,
}: {
  pad: TestStripPad;
  value: string;
  range: { min: number; max: number } | null;
}) {
  const { t } = useTranslation();
  const status = getReadingStatus(pad.testName, value);
  const meta = testMeta(pad.testName);
  const { min, max } = scaleEnds(pad);
  const span = max - min || 1;
  const selectedNum = parseReadingValue(value);
  const markerPct =
    selectedNum == null ? 0.5 : clamp01((selectedNum - min) / span) * 100;
  const idealLeft =
    range == null ? null : clamp01((range.min - min) / span) * 100;
  const idealWidth =
    range == null
      ? null
      : Math.max(0, clamp01((range.max - min) / span) * 100 - (idealLeft ?? 0));
  const unitSuffix = pad.unit ? ` ${pad.unit}` : '';

  return (
    <View className="card px-3.5 py-3.5">
      <View className="flex-row items-start gap-3">
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: meta.color }}
        >
          <Text className="text-tiny font-jakarta-extrabold text-surface-white">
            {meta.abbr}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1">
              <Text className="text-body font-jakarta-bold text-brand-navy">
                {pad.testName}
              </Text>
              <Text className="text-body font-jakarta-bold text-brand-aqua mt-0.5">
                {value}
                {unitSuffix}
              </Text>
            </View>
            <View
              className={`rounded-full px-2.5 py-1 ${STATUS_BADGE[status].container}`}
            >
              <Text
                className={`text-tiny font-jakarta-bold ${STATUS_BADGE[status].text}`}
              >
                {t(STATUS_LABEL[status])}
              </Text>
            </View>
          </View>

          {/* Range bar */}
          <View className="mt-3">
            <View className="h-2 rounded-full bg-border-default overflow-hidden relative">
              {idealLeft != null && idealWidth != null ? (
                <View
                  className="absolute h-full rounded-full bg-success"
                  style={{ left: `${idealLeft}%`, width: `${idealWidth}%` }}
                />
              ) : null}
            </View>
            <View
              className="absolute -mt-1"
              style={{ left: `${markerPct}%`, marginLeft: -6 }}
            >
              <View className="w-3 h-3 rounded-full bg-brand-aqua border-2 border-surface-white" />
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-tiny font-jakarta text-faint">{min}</Text>
              <Text className="text-tiny font-jakarta text-faint">{max}</Text>
            </View>
            {range ? (
              <Text className="text-tiny font-jakarta text-sub mt-1">
                {t('water_results_ideal_range', {
                  min: range.min,
                  max: range.max,
                  unit: unitSuffix,
                })}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

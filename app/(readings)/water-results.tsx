import PoolTonicLogo from '@/components/PoolTonicLogo';
import { dashboardImages, icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
  getIdealStatusRange,
  getOverallPoolStatus,
  getOverallSwimmingStatus,
  getReadingStatus,
  parseReadingValue,
  READING_RANGE,
  toParamKey,
  toTestReadingsProps,
  type ReadingStatus,
} from '@/data/readingBands';
import { OVERALL_STATUS, STATUS_BADGE, STATUS_LABEL, SWIM_STATUS } from '@/data/readingPoolAndSwimStatusUiLabelsColorsAndIcons';
import { resolvePads, type TestStripPad } from '@/data/testStripBrands';
import { testMeta } from '@/data/waterTestNameToAbbreviationAndColor';
import { useSupabase } from '@/hooks/supabaseHooks';
import { usePool } from '@/providers/PoolProvider';
import { useTestStrips } from '@/providers/TestStripProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function scaleEnds(pad: TestStripPad) {
  const nums = pad.colors
    .map((c) => parseReadingValue(c.value))
    .filter((n): n is number => n !== null);
  if (nums.length > 0) {
    return { min: Math.min(...nums), max: Math.max(...nums) };
  }

  const key = toParamKey(pad.testName);
  const axis = key ? READING_RANGE[key] : undefined;
  if (axis) return axis;

  return { min: 0, max: 1 };
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export default function WaterResultsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedBrand, selections, savedReadingId, setSavedReadingId, setResultStatus } = useTestStrips();
  const { pools } = usePool();
  const { testReadingsInsert } = useSupabase();
  const idealRanges = getIdealStatusRange(selections, pools);

  const pads = resolvePads(selectedBrand, selections);
  const rows = pads.filter((pad) => selections[pad.testName] != null);
  const statuses = rows.map((pad) =>
    getReadingStatus(
      pad.testName,
      selections[pad.testName],
      idealRanges[pad.testName],
    ),
  );
  const idealCount = statuses.filter((status) => status === 'ideal').length;

  // Hand every reading to the scoring functions; readingBands.ts figures out
  // which param each one is and picks the most severe result across all of them.
  // `value` is the raw parsed number — needed for hard swim-safety rules
  // (e.g. FC above 10 ppm) that a 5-band classification can't express.
  const readings = rows.map((pad, index) => ({
    testName: pad.testName,
    status: statuses[index],
    value: parseReadingValue(selections[pad.testName]),
  }));

  // this is status of the pool coming from the array declared at the start with the name of OVERALL_STATUS.
  const { status: poolStatus, messages: poolMessages } =
    getOverallPoolStatus(readings, pools, idealRanges);
  const { status: swimmingStatus, messages: swimMessages } =
    getOverallSwimmingStatus(readings);
  const overall = OVERALL_STATUS[poolStatus];
  const swim = SWIM_STATUS[swimmingStatus];

  // Save the readings once per visit — moved from select-strip-results so the
  // insert happens alongside the statuses shown here instead of twice.
  // If the user went Back to change pads and returned, savedReadingId is
  // still set, so this updates the existing row instead of inserting again.
  const hasInsertedRef = useRef(false);
  useEffect(() => {
    if (hasInsertedRef.current || rows.length === 0) return;
    hasInsertedRef.current = true;
    const props = toTestReadingsProps(selections);
    props.pool_status = poolStatus;
    props.swimming_status = swimmingStatus;
    setResultStatus(poolStatus, statuses, swimmingStatus);
    if (poolStatus === 'unable_to_determine' || swimmingStatus === 'unable_to_determine') return;
    void testReadingsInsert({ props, id: savedReadingId ?? undefined }).then(({ data }) => {
      if (data?.id) setSavedReadingId(data.id);
    });
  }, [rows.length]);

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

          <PoolTonicLogo width={152} height={43} />

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
          <View className="card--info px-4 py-4 mt-4">
            <View className="flex-row items-start gap-3">
              <Image
                source={dashboardImages.poolIllustration}
                className="w-14 h-14"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="text-body font-jakarta-bold text-brand-navy leading-5">
                  {t(overall.summaryKey)}
                </Text>
                <View className="flex-row items-center gap-1 mt-1.5">
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={overall.badgeColor}
                  />
                  <Text className="text-small font-jakarta-bold text-sub">
                    {t('water_results_in_range', {
                      count: idealCount,
                      total: rows.length,
                    })}
                  </Text>
                </View>
              </View>
            </View>

            <View className="divider mt-3.5" />

            <View className="gap-3 mt-3.5">
              <StatusRow
                label={t('water_results_pool_status_label')}
                badgeLabel={t(overall.labelKey)}
                badgeColor={overall.badgeColor}
                icon={overall.icon}
                messages={poolMessages}
              />
              <StatusRow
                label={t('water_results_swim_status_label')}
                badgeLabel={t(swim.labelKey)}
                badgeColor={swim.badgeColor}
                icon={swim.icon}
                messages={swimMessages}
              />
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
              {rows.map((pad, index) => (
                <ResultRow
                  key={pad.testName}
                  pad={pad}
                  value={selections[pad.testName]}
                  range={idealRanges[pad.testName] ?? null}
                  status={statuses[index]}
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
        <TouchableOpacity
          className={`btn btn--primary ${poolStatus !== 'unable_to_determine' && swimmingStatus !== 'unable_to_determine' ? '' : 'opacity-50'}`}
          activeOpacity={0.85}
          disabled={poolStatus === 'unable_to_determine' || swimmingStatus === 'unable_to_determine'}
        >
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('water_results_cta')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/** One labelled status line: label, its badge, and any warnings it triggered. */
function StatusRow({
  label,
  badgeLabel,
  badgeColor,
  icon,
  messages,
}: {
  label: string;
  badgeLabel: string;
  badgeColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  messages: string[];
}) {
  return (
    <View>
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-body font-jakarta-bold text-sub">{label}</Text>
        <View
          className="flex-row items-center gap-1 rounded-full px-2.5 py-1"
          style={{ backgroundColor: badgeColor }}
        >
          <Ionicons name={icon} size={12} color={colors.surface.white} />
          <Text className="text-small font-jakarta-extrabold text-surface-white">
            {badgeLabel}
          </Text>
        </View>
      </View>

      {messages.map((message) => (
        <View key={message} className="flex-row items-start gap-1.5 mt-2">
          <Ionicons
            name="alert-circle"
            size={14}
            color={colors.status.error}
          />
          <Text className="flex-1 text-body font-jakarta text-error leading-5">
            {message}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ResultRow({
  pad,
  value,
  range,
  status
}: {
  pad: TestStripPad;
  value: string;
  range: { min: number; max: number } | null;
  status: ReadingStatus;
}) {
  const { t } = useTranslation();
  // const status = getReadingStatus(pad.testName, value, range);
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
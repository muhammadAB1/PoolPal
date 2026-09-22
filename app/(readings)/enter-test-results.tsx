import PoolTonicLogo from '@/components/PoolTonicLogo';
import { chooseTestMethodImages, icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
  additionalSanitizerFields,
  additionalWaterFields,
  analyzableFieldKeys,
  HAVE_RESULTS_FIELDS,
  mainFieldsFor,
  poolTypeToResultSanitizer,
  type HaveResultsField,
  type HaveResultsFieldKey,
} from '@/data/chooseTestMethod';
import { parseReadingValue } from '@/data/readingBands';
import { isHotTubPool } from '@/lib/pool';
import { usePool } from '@/providers/PoolProvider';
import { useTestStrips } from '@/providers/TestStripProvider';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const INFO_KEYS: Partial<Record<HaveResultsFieldKey, string>> = {
  freeChlorine: 'test_readings_info_fc_desc',
  bromine: 'test_results_info_bromine',
  ph: 'test_readings_info_ph_desc',
  totalAlkalinity: 'test_readings_info_ta_desc',
  calciumHardness: 'test_readings_info_ch_desc',
  cyanuricAcid: 'test_readings_info_cya_desc',
  salt: 'test_results_info_salt',
  totalChlorine: 'test_results_info_total_chlorine',
  totalHardness: 'test_results_info_total_hardness',
};

const COMBINED_CHLORINE = HAVE_RESULTS_FIELDS.find((field) => field.key === 'combinedChlorine')!;

export default function EnterTestResultsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { pools } = usePool();
  const { setSelectedBrand, setSelections, setSavedReadingId } = useTestStrips();
  const [readings, setReadings] = useState<Partial<Record<HaveResultsFieldKey, string>>>({});
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const waterBody = isHotTubPool(pools) ? 'standalone_spa' : 'pool';
  const activeSanitizer = poolTypeToResultSanitizer(pools?.pool_type);

  const mainFields = useMemo(
    () => mainFieldsFor(activeSanitizer, waterBody),
    [activeSanitizer, waterBody],
  );
  const sanitizerFields = useMemo(
    () => additionalSanitizerFields(activeSanitizer),
    [activeSanitizer],
  );
  const waterFields = useMemo(() => additionalWaterFields(), []);
  const showsChlorinePair = activeSanitizer === 'chlorine' || activeSanitizer === 'saltwater';

  const freeChlorine = parseReadingValue(readings.freeChlorine ?? '');
  const totalChlorine = parseReadingValue(readings.totalChlorine ?? '');
  const invalidChlorineRelationship =
    showsChlorinePair && freeChlorine != null && totalChlorine != null && totalChlorine < freeChlorine;
  const combinedChlorine =
    showsChlorinePair && freeChlorine != null && totalChlorine != null && !invalidChlorineRelationship
      ? Number((totalChlorine - freeChlorine).toFixed(2))
      : null;

  const fieldErrors = useMemo(() => {
    const result: Partial<Record<HaveResultsFieldKey, string>> = {};
    for (const [key, raw] of Object.entries(readings) as [HaveResultsFieldKey, string][]) {
      if (!raw?.trim()) continue;
      const n = Number(raw);
      if (!Number.isFinite(n)) result[key] = t('test_results_invalid_number');
      else if (n < 0) result[key] = t('test_results_negative_error');
      else if (key === 'ph' && n > 14) result[key] = t('test_results_ph_error');
    }
    if (invalidChlorineRelationship) result.totalChlorine = t('test_results_tc_less_than_fc');
    return result;
  }, [readings, invalidChlorineRelationship, t]);

  const analyzableKeys = analyzableFieldKeys(activeSanitizer, waterBody);
  const enteredCount = analyzableKeys.filter((key) => readings[key]?.trim()).length;
  const analyzableCount = analyzableKeys.filter(
    (key) => readings[key]?.trim() && !fieldErrors[key],
  ).length;
  const hasFieldError = analyzableKeys.some((key) => Boolean(fieldErrors[key]));
  const canContinue = analyzableCount > 0 && !hasFieldError;

  const feedback = useMemo(() => {
    if (enteredCount === 0) return t('test_results_feedback_zero');
    if (!readings.ph?.trim() || !readings.totalAlkalinity?.trim()) {
      return t('test_results_feedback_more_complete');
    }
    if (analyzableCount >= 2) return t('test_results_feedback_enough');
    return t('test_results_feedback_count', { count: enteredCount });
  }, [enteredCount, analyzableCount, readings.ph, readings.totalAlkalinity, t]);

  function updateReading(key: HaveResultsFieldKey, value: string) {
    setReadings((current) => ({ ...current, [key]: value.replace(',', '.') }));
    setFormError(null);
  }

  function showInfo(field: HaveResultsField) {
    const infoKey = INFO_KEYS[field.key];
    if (!infoKey) return;
    Alert.alert(t(field.labelKey), t(infoKey));
  }

  function handleContinue() {
    if (!canContinue) {
      setFormError(analyzableCount === 0 ? t('test_results_need_analyzable') : t('test_results_fix_errors'));
      return;
    }

    const scoredKeys = new Set(analyzableKeys);
    const selections: Record<string, string> = {};
    for (const field of HAVE_RESULTS_FIELDS) {
      if (!scoredKeys.has(field.key)) continue;
      const raw = readings[field.key]?.trim();
      if (raw && !fieldErrors[field.key]) selections[field.testName] = raw;
    }
    if (combinedChlorine != null) {
      selections[COMBINED_CHLORINE.testName] = String(combinedChlorine);
    }

    setSelectedBrand(null);
    setSavedReadingId(null);
    setSelections(selections);
    router.push('/(readings)/water-results');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.white }}>
      <View className="px-5 pt-1 pb-2 bg-surface-white">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
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
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5">
          <Text className="text-[31px] leading-9.5 font-jakarta-extrabold text-brand-navy mt-1">
            {t('test_results_title')}
          </Text>
          <Text className="text-[16px] leading-5.75 font-jakarta text-[#6F7A91] mt-1 mb-4">
            {t('test_results_subtitle')}
          </Text>

          {activeSanitizer === 'unknown' ? (
            <View className="flex-row gap-2.5 rounded-[15px] p-3 mb-3.5 bg-[#EDFBFA] border border-[#CBEFEB]">
              <Ionicons name="information-circle-outline" size={24} color="#078B8F" />
              <View className="flex-1">
                <Text className="text-[13px] leading-4.5 font-jakarta text-[#49627D]">
                  {t('test_results_unknown_sanitizer')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(pool)/basics' as Href)} activeOpacity={0.7}>
                  <Text className="text-[13px] font-jakarta-bold text-brand-blue-dark mt-1">
                    {t('test_results_identify_sanitizer')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View className="flex-row items-center gap-3 rounded-[18px] px-3.5 py-3 bg-[#ECFAFD] mb-2.5">
            <View className="w-11.5 h-11.5 rounded-full bg-[#D4F6F6] items-center justify-center">
              <Ionicons name="stats-chart" size={25} color="#078B8F" />
            </View>
            <View className="flex-1">
              <Text className="text-[18px] font-jakarta-bold text-brand-navy">
                {t('test_results_main_title')}
              </Text>
              <Text className="text-body leading-4.75 font-jakarta text-[#6F7A91] mt-0.5">
                {t('test_results_main_subtitle')}
              </Text>
            </View>
          </View>

          <View className="border border-[#DCE5EC] rounded-[18px] overflow-hidden bg-surface-white">
            {mainFields.map((field, index) => (
              <ReadingInputRow
                key={field.key}
                field={field}
                value={readings[field.key] ?? ''}
                error={fieldErrors[field.key]}
                onChange={(value) => updateReading(field.key, value)}
                onInfo={() => showInfo(field)}
                last={index === mainFields.length - 1}
              />
            ))}
          </View>

          <TouchableOpacity
            className={`min-h-20 flex-row items-center gap-3 border border-[#DCE5EC] rounded-[18px] bg-surface-white px-3.5 py-3 mt-3.5 ${
              additionalOpen ? 'border-brand-blue rounded-b-none' : ''
            }`}
            activeOpacity={0.82}
            onPress={() => setAdditionalOpen((open) => !open)}
          >
            <Image source={chooseTestMethodImages.settings} className="w-12 h-12" resizeMode="contain" />
            <View className="flex-1 min-w-0">
              <Text className="text-[17px] leading-5.5 font-jakarta-bold text-brand-navy">
                {t('test_results_additional_title')}
              </Text>
              <Text className="text-[12.5px] leading-4.5 font-jakarta text-[#6F7A91] mt-0.5">
                {t('test_results_additional_subtitle')}
              </Text>
            </View>
            <Ionicons
              name={additionalOpen ? 'chevron-up' : 'chevron-down'}
              size={26}
              color="#61708B"
            />
          </TouchableOpacity>

          {additionalOpen ? (
            <View className="border border-t-0 border-brand-blue rounded-b-[18px] p-2.5 bg-[#FCFFFF]">
              {showsChlorinePair ? (
                <ReadingGroup title={t('test_results_additional_sanitizer')}>
                  {sanitizerFields.map((field) => (
                    <ReadingInputRow
                      key={field.key}
                      field={field}
                      value={readings[field.key] ?? ''}
                      error={fieldErrors[field.key]}
                      onChange={(value) => updateReading(field.key, value)}
                      onInfo={() => showInfo(field)}
                    />
                  ))}
                  <ReadOnlyCombined value={combinedChlorine} invalid={invalidChlorineRelationship} />
                </ReadingGroup>
              ) : null}

              <ReadingGroup title={t('test_results_additional_water')} last>
                {waterFields.map((field, index) => (
                  <ReadingInputRow
                    key={field.key}
                    field={field}
                    value={readings[field.key] ?? ''}
                    error={fieldErrors[field.key]}
                    onChange={(value) => updateReading(field.key, value)}
                    onInfo={() => showInfo(field)}
                    supportingKey="test_results_total_hardness_support"
                    last={index === waterFields.length - 1}
                  />
                ))}
              </ReadingGroup>
            </View>
          ) : null}

          <Text className="text-[13px] leading-4.5 font-jakarta-semibold text-[#637188] text-center mt-3">
            {feedback}
          </Text>
          {formError ? (
            <Text className="text-[12.5px] leading-4.25 font-jakarta text-error text-center mt-1">
              {formError}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      <View className="px-5 pt-2 pb-3 border-t border-[#EFF3F6] bg-surface-white">
        <TouchableOpacity
          className={`btn btn--primary ${canContinue ? '' : 'opacity-50'}`}
          activeOpacity={0.85}
          disabled={!canContinue}
          onPress={handleContinue}
        >
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('choose_test_method_continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ReadingGroup({
  title,
  children,
  last = false,
}: {
  title: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <View className={last ? '' : 'mb-4'}>
      <Text className="text-[11px] font-jakarta-bold text-[#6F7A91] tracking-widest uppercase mb-1.5 ml-1">
        {title}
      </Text>
      <View className="border border-[#E2E9EF] rounded-[14px] overflow-hidden bg-surface-white">
        {children}
      </View>
    </View>
  );
}

function ReadingInputRow({
  field,
  value,
  error,
  onChange,
  onInfo,
  supportingKey,
  last = false,
}: {
  field: HaveResultsField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onInfo: () => void;
  supportingKey?: string;
  last?: boolean;
}) {
  const { t } = useTranslation();
  const unit = field.unitKey === 'choose_test_method_unit_none' ? '' : t(field.unitKey);

  return (
    <View className={`min-h-19 flex-row items-center px-3.5 py-2.5 gap-2.5 ${last ? '' : 'border-b border-[#E6ECF1]'}`}>
      <View
        className="w-11 h-11 rounded-full items-center justify-center shrink-0"
        style={{ backgroundColor: field.badgeColor }}
      >
        <Text className="text-body font-jakarta-bold text-surface-white">
          {field.abbreviation === 'Salt' ? 'S' : field.abbreviation}
        </Text>
      </View>
      <View className="flex-1 min-w-0">
        <View className="flex-row items-center gap-1.5 flex-wrap">
          <Text className="text-body leading-4.75 font-jakarta-bold text-brand-navy shrink">
            {t(field.labelKey)}
          </Text>
          <TouchableOpacity onPress={onInfo} hitSlop={8} activeOpacity={0.7}>
            <Ionicons name="information-circle-outline" size={18} color="#42668D" />
          </TouchableOpacity>
        </View>
        {supportingKey ? (
          <Text className="text-[10.5px] leading-3.5 font-jakarta text-[#78859C] mt-0.5">
            {t(supportingKey)}
          </Text>
        ) : null}
        {error ? (
          <Text className="text-[10.5px] leading-3.5 font-jakarta text-error mt-0.5">
            {error}
          </Text>
        ) : null}
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholder=""
        placeholderTextColor="#A0A9B7"
        style={{ textAlign: 'center' }}
        className={`w-19.25 h-11.25 rounded-xl border bg-surface-white text-[16px] font-jakarta text-[#5B6982] px-1.5 ${
          error ? 'border-error' : 'border-[#D4DEE8]'
        }`}
      />
      <Text className="w-8 text-[13px] font-jakarta-bold text-brand-navy">{unit}</Text>
    </View>
  );
}

function ReadOnlyCombined({ value, invalid }: { value: number | null; invalid: boolean }) {
  const { t } = useTranslation();

  return (
    <View className="min-h-19 flex-row items-center px-3.5 py-2.5 gap-2.5">
      <View
        className="w-11 h-11 rounded-full items-center justify-center shrink-0"
        style={{ backgroundColor: COMBINED_CHLORINE.badgeColor }}
      >
        <Text className="text-body font-jakarta-bold text-surface-white">
          {COMBINED_CHLORINE.abbreviation}
        </Text>
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-body leading-4.75 font-jakarta-bold text-brand-navy">
          {t(COMBINED_CHLORINE.labelKey)}
        </Text>
        <Text className="text-[10.5px] leading-3.5 font-jakarta text-[#78859C] mt-0.5">
          {t('test_results_cc_calculated')}
        </Text>
        {invalid ? (
          <Text className="text-[10.5px] leading-3.5 font-jakarta text-error mt-0.5">
            {t('test_results_tc_less_than_fc')}
          </Text>
        ) : null}
      </View>
      <View className="w-19.25 h-11.25 rounded-xl border border-[#D4DEE8] bg-[#F4F7F9] items-center justify-center">
        <Text className="text-[16px] font-jakarta-semibold text-[#5B6982]">
          {value == null ? '—' : String(value)}
        </Text>
      </View>
      <Text className="w-8 text-[13px] font-jakarta-bold text-brand-navy">ppm</Text>
    </View>
  );
}

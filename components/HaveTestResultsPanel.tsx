import { chooseTestMethodImages, icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
  HAVE_RESULTS_FIELDS,
  type HaveResultsField,
  type HaveResultsFieldKey,
} from '@/data/chooseTestMethod';
import {
  parseReadingValue,
  READING_RANGE,
  toParamKey,
  type IdealRange,
} from '@/data/readingBands';
import type { PanelHandle } from '@/lib/types';
import { useTestStrips } from '@/providers/TestStripProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/** What a real test can report for this field, e.g. pH 6.2–9.0. */
function rangeFor(field: HaveResultsField): IdealRange | null {
  const key = toParamKey(field.testName);
  return (key ? READING_RANGE[key] : undefined) ?? null;
}

/** Empty is allowed; anything typed must be a number inside the range. */
function isOutOfRange(field: HaveResultsField, value: string) {
  if (value.trim() === '') return false;
  const parsed = parseReadingValue(value);
  if (parsed == null) return true;
  const range = rangeFor(field);
  if (!range) return false;
  return parsed < range.min || parsed > range.max;
}

const HaveTestResultsPanel = forwardRef<PanelHandle>(
  function HaveTestResultsPanel(_props, ref) {
    const { t } = useTranslation();
    const router = useRouter();
    const { setSelectedBrand, setSelections, setSavedReadingId } = useTestStrips();
    const [visible, setVisible] = useState(false);
    const [readings, setReadings] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [advancedOpen, setAdvancedOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }));

    if (!visible) {
      return null;
    }

    function updateReading(key: HaveResultsFieldKey, value: string) {
      setReadings((prev) => ({ ...prev, [key]: value }));
    }

    const selections = Object.fromEntries(
      HAVE_RESULTS_FIELDS
        .filter((field) => parseReadingValue(readings[field.key]) != null)
        .map((field) => [field.testName, readings[field.key]]),
    );
    // Checks the current values, not the blur flags, so a bad reading still
    // blocks Continue if the user never left that field.
    const hasError = HAVE_RESULTS_FIELDS.some((field) =>
      isOutOfRange(field, readings[field.key] ?? ''),
    );
    const canContinue = Object.keys(selections).length > 0 && !hasError;

    function handleContinue() {
      if (!canContinue) return;
      setSelectedBrand(null);
      setSavedReadingId(null);
      setSelections(selections);
      router.push('/(readings)/water-results');
    }

    return (
      <View className="mt-6">
        <Text className="text-h2 font-jakarta-extrabold text-brand-navy">
          {t('choose_test_method_enter_title')}
        </Text>
        <Text className="text-body font-jakarta text-sub mt-1">
          {t('choose_test_method_enter_subtitle')}
        </Text>

        <View className="mt-5 gap-4">
          {HAVE_RESULTS_FIELDS.map((field) => {
            const value = readings[field.key] ?? '';
            const range = rangeFor(field);
            const showError = !!errors[field.key];

            return (
              <View key={field.key} className="w-full">
                <View className="w-full flex-row items-center justify-between gap-2">
                  <View className="min-w-0 flex-1 flex-row items-center gap-2">
                    <View
                      className="w-9 h-9 rounded-full items-center justify-center"
                      style={{ backgroundColor: field.badgeColor }}
                    >
                      <Text
                        className="text-tiny font-jakarta-extrabold text-surface-white"
                        numberOfLines={1}
                      >
                        {field.abbreviation === 'Salt' ? 'S' : field.abbreviation}
                      </Text>
                    </View>

                    <View className="min-w-0 flex-1 flex-row items-center gap-1">
                      <Text
                        className="shrink text-body font-jakarta-bold text-brand-navy"
                        numberOfLines={1}
                      >
                        {t(field.labelKey)}
                      </Text>
                      <Image
                        source={icons.info}
                        className="w-3.5 h-3.5"
                        resizeMode="contain"
                      />
                    </View>
                  </View>

                  <View className="flex-row items-center gap-1.5 shrink-0">
                    <View
                      className={`rounded-xl border bg-surface-white ${
                        showError ? 'border-error' : 'border-border-default'
                      }`}
                      style={{ width: 64, paddingVertical: 8, paddingHorizontal: 6 }}
                    >
                      <TextInput
                        className="text-body font-jakarta text-charcoal p-0"
                        style={{ textAlign: 'center' }}
                        value={value}
                        onChangeText={(text) => updateReading(field.key, text)}
                        onBlur={() =>
                          setErrors((prev) => ({
                            ...prev,
                            [field.key]: isOutOfRange(field, value),
                          }))
                        }
                        keyboardType="decimal-pad"
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.text.faint}
                      />
                    </View>

                    <Text
                      className="text-small font-jakarta-bold text-charcoal w-9"
                      numberOfLines={1}
                    >
                      {t(field.unitKey)}
                    </Text>

                    <View className="w-5 items-center">
                      {showError ? (
                        <Ionicons
                          name="close-circle"
                          size={18}
                          color={colors.status.error}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>

                {showError && range ? (
                  <Text className="text-tiny font-jakarta text-error mt-1 text-right">
                    {t('choose_test_method_range_error', {
                      label: t(field.labelKey),
                      min: range.min,
                      max: range.max,
                    })}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          className="card flex-row items-center px-3.5 py-3.5 gap-3 mt-5"
          activeOpacity={0.8}
          onPress={() => setAdvancedOpen((open) => !open)}
        >
          <Image
            source={chooseTestMethodImages.settings}
            className="w-11 h-11"
            resizeMode="contain"
          />
          <View className="flex-1">
            <Text className="text-body font-jakarta-bold text-brand-navy">
              {t('choose_test_method_advanced_title')}
            </Text>
            <Text className="text-small font-jakarta text-sub mt-0.5">
              {t('choose_test_method_advanced_desc')}
            </Text>
          </View>
          <Ionicons
            name={advancedOpen ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.text.faint}
          />
        </TouchableOpacity>

        {advancedOpen ? (
          <View className="card--info px-4 py-3 mt-3">
            <Text className="text-small font-jakarta text-sub">
              {t('choose_test_method_advanced_placeholder')}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          className={`btn btn--primary mt-8 ${canContinue ? '' : 'opacity-50'}`}
          activeOpacity={0.85}
          disabled={!canContinue}
          onPress={handleContinue}
        >
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('choose_test_method_continue')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);

export default HaveTestResultsPanel;

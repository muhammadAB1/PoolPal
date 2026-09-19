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
import { useTestStrips } from '@/providers/TestStripProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function EnterTestResultsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setSelectedBrand, setSelections, setSavedReadingId } = useTestStrips();
  const [readings, setReadings] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.white }}>
      {/* Fixed header */}
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
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5">
          {/* Title + subtitle */}
          <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-3">
            {t('choose_test_method_enter_title')}
          </Text>
          <Text className="text-body font-jakarta text-sub mt-2 leading-5">
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
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <View className="px-5 pt-2 pb-3">
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

import { chooseTestMethodImages, icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
  HAVE_RESULTS_FIELDS,
  getReadingStatus,
  type HaveResultsFieldKey,
  type ReadingStatusKey,
} from '@/data/chooseTestMethod';
import type { PanelHandle } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const STATUS_LABEL_KEY: Record<ReadingStatusKey, string> = {
  good: 'choose_test_method_status_good',
  bad: 'choose_test_method_status_bad',
};

const STATUS_BADGE_CLASS: Record<ReadingStatusKey, { container: string; text: string }> = {
  good: {
    container: 'bg-surface-mint',
    text: 'text-success-text',
  },
  bad: {
    container: 'bg-[#FDECEC]',
    text: 'text-error',
  },
};

const HaveTestResultsPanel = forwardRef<PanelHandle>(
  function HaveTestResultsPanel(_props, ref) {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [readings, setReadings] = useState<Record<string, string>>({});
    const [advancedOpen, setAdvancedOpen] = useState(false);

    console.log('HaveTestResultsPanel render', { visible });

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
            const status = getReadingStatus(value, field);

            return (
              <View
                key={field.key}
                className="w-full flex-row items-center justify-between gap-2"
              >
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
                    className="rounded-xl border border-border-default bg-surface-white"
                    style={{ width: 64, paddingVertical: 8, paddingHorizontal: 6 }}
                  >
                    <TextInput
                      className="text-body font-jakarta text-charcoal p-0"
                      style={{ textAlign: 'center' }}
                      value={value}
                      onChangeText={(text) => updateReading(field.key, text)}
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

                  <View
                    className={`h-6 w-14 items-center justify-center rounded-full ${
                      status ? STATUS_BADGE_CLASS[status].container : ''
                    }`}
                  >
                    {status ? (
                      <Text
                        className={`text-tiny font-jakarta-bold ${STATUS_BADGE_CLASS[status].text}`}
                        numberOfLines={1}
                      >
                        {t(STATUS_LABEL_KEY[status])}
                      </Text>
                    ) : null}
                  </View>
                </View>
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

        <TouchableOpacity className="btn btn--primary mt-8" activeOpacity={0.85}>
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('choose_test_method_continue')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);

export default HaveTestResultsPanel;

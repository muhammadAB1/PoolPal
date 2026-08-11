import { icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import { getPads, type TestStripPad } from '@/data/testStripBrands';
import { useTestStrips } from '@/providers/TestStripProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelectStripResultsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedBrand, setSelections: saveSelections } = useTestStrips();
  const [selections, setSelections] = useState<Record<string, string>>({});

  const pads = selectedBrand ? getPads(selectedBrand) : [];
  const selectedCount = Object.keys(selections).length;
  const allSelected = pads.length > 0 && selectedCount === pads.length;

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
      >
        <View className="px-5">
          {/* Step chip */}
          <View className="items-center mt-2">
            <View className="chip">
              <Text className="text-small font-jakarta-bold text-brand-navy">
                {t('strip_results_step')}
              </Text>
            </View>
          </View>

          {/* Title + subtitle */}
          <Text className="text-h1 font-jakarta-extrabold text-brand-navy text-center mt-3">
            {t('strip_results_title')}
          </Text>
          <Text className="text-body font-jakarta text-sub text-center mt-2 leading-5">
            {t('strip_results_subtitle')}
          </Text>

          {/* Info callout */}
          <View className="card--info flex-row items-start gap-2.5 px-3.5 py-3 mt-4">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.text.sub}
            />
            <Text className="flex-1 text-small font-jakarta text-charcoal leading-5">
              {t('strip_results_info')}
            </Text>
          </View>

          {/* Pads */}
          <View className="gap-3 mt-4">
            {pads.map((pad) => (
              <PadCard
                key={pad.testName}
                pad={pad}
                selected={selections[pad.testName] ?? null}
                onSelect={(value) =>
                  setSelections((prev) => ({ ...prev, [pad.testName]: value }))
                }
              />
            ))}

            {pads.length === 0 ? (
              <Text className="text-small font-jakarta text-sub text-center py-6">
                {t('strip_results_empty')}
              </Text>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <View className="px-5 pt-2 pb-3 items-center">
        {selectedCount > 0 ? (
          <>
            <View className="flex-row items-center gap-1.5 mb-1">
              <Ionicons name="checkmark-circle" size={16} color={colors.brand.aqua} />
              <Text className="text-small font-jakarta-bold text-brand-navy">
                {t('strip_results_count', {
                  selected: selectedCount,
                  total: pads.length,
                })}
              </Text>
            </View>
            <Text className="text-small font-jakarta text-sub mb-3">
              {t('strip_results_helper', { total: pads.length })}
            </Text>
          </>
        ) : (
          <View className="flex-row items-center gap-1.5 mb-3">
            <Ionicons name="ellipse-outline" size={16} color={colors.text.faint} />
            <Text className="text-small font-jakarta text-sub">
              {t('strip_results_helper', { total: pads.length })}
            </Text>
          </View>
        )}

        <TouchableOpacity
          className={`btn btn--primary ${allSelected ? '' : 'opacity-50'}`}
          activeOpacity={0.85}
          disabled={!allSelected}
          onPress={() => {
            saveSelections(selections);
            router.push('/(readings)/water-results');
          }}
        >
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('strip_results_continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function PadCard({
  pad,
  selected,
  onSelect,
}: {
  pad: TestStripPad;
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View className="card px-3.5 py-3.5">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="flex-1 text-body font-jakarta-bold text-brand-navy">
          {pad.unit ? `${pad.testName} (${pad.unit})` : pad.testName}
        </Text>
        {selected ? (
          <Text className="text-small font-jakarta-bold text-brand-aqua">
            {t('strip_results_selected', { value: selected })}
          </Text>
        ) : null}
      </View>

      <View className="flex-row gap-2 mt-3">
        {pad.colors.map((color) => (
          <TouchableOpacity
            key={color.value}
            className="items-center"
            activeOpacity={0.8}
            onPress={() => onSelect(color.value)}
          >
            <View
              className={`w-11 h-9 rounded-lg ${
                selected === color.value ? 'border-2 border-brand-aqua' : ''
              }`}
              style={{ backgroundColor: color.hex }}
            />
            <Text className="text-tiny font-jakarta text-sub mt-1">
              {color.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

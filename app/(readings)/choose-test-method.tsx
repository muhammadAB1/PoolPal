import PoolTonicLogo from '@/components/PoolTonicLogo';
import { chooseTestMethodImages, icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
  CHOOSE_TEST_METHOD_OPTIONS,
  type ChooseTestMethodOptionId,
} from '@/data/chooseTestMethod';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChooseTestMethodScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<ChooseTestMethodOptionId | null>(
    null,
  );

  function continueFlow() {
    if (!selectedId) return;
    if (selectedId === 'manual_strip') router.push('/(readings)/choose-strip-brand');
    else if (selectedId === 'have_results') router.push('/(readings)/enter-test-results');
    else router.push('/(problems)/questions' as Href);
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
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-5">
          {/* Title + hero */}
          <View className="relative mt-3">
            <View className="absolute right-0 -top-2 w-24 h-24 overflow-hidden rounded-full">
              <Image
                source={chooseTestMethodImages.hero}
                className="w-full h-full"
                style={{ transform: [{ scale: 1.28 }] }}
                resizeMode="cover"
              />
            </View>
            <View className="pr-24">
              <Text className="text-h1 font-jakarta-extrabold text-brand-navy">
                {t('choose_test_method_title')}
              </Text>
              <Text className="text-body font-jakarta text-sub mt-2 leading-5">
                {t('choose_test_method_subtitle')}
              </Text>
            </View>
          </View>

          {/* Options */}
          <View className="mt-6 gap-3">
            {CHOOSE_TEST_METHOD_OPTIONS.map((option) => {
              const selected = selectedId === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  className={`min-h-28 flex-row items-center rounded-[20px] px-3.5 py-3 gap-3 ${selected
                      ? 'bg-selection-bg border-2 border-brand-blue'
                      : 'bg-surface-white border-[1.3px] border-[#DCE5EC]'
                    }`}
                  activeOpacity={0.82}
                  onPress={() => setSelectedId(option.id)}
                >
                  <View className="w-19 h-19 items-center justify-center shrink-0">
                    <Image
                      source={option.icon}
                      className="w-17.5 h-17.5"
                      resizeMode="contain"
                    />
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="text-[17px] leading-5.75 font-jakarta-bold text-brand-navy">
                      {t(option.titleKey)}
                    </Text>
                    <Text className="text-[13px] leading-4.75 font-jakarta text-[#6F7A91] mt-0.75">
                      {t(option.descriptionKey)}
                    </Text>
                  </View>
                  <Image
                    source={selected ? icons.selectedCheckBadge : icons.unselectedRadioIndicator}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Info callout */}
          <View className="card--info flex-row items-start gap-3 px-4 py-4 mt-5">
            <Image
              source={chooseTestMethodImages.info}
              className="w-10 h-10"
              resizeMode="contain"
              accessible={false}
            />
            <View className="flex-1">
              <Text className="text-body font-jakarta-bold text-brand-navy">
                {t('choose_test_method_info_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-1 leading-5">
                {t('choose_test_method_info_desc')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pt-2 pb-3">
        <TouchableOpacity
          className={`btn btn--primary ${selectedId ? '' : 'opacity-50'}`}
          activeOpacity={0.85}
          disabled={!selectedId}
          onPress={continueFlow}
        >
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('choose_test_method_continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

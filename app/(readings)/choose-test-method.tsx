import HaveTestResultsPanel from '@/components/HaveTestResultsPanel';
import { chooseTestMethodImages, icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
  CHOOSE_TEST_METHOD_OPTIONS,
  type ChooseTestMethodOptionId,
} from '@/data/chooseTestMethod';
import type { PanelHandle } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
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
  const haveResultsRef = useRef<PanelHandle>(null);
  const [selectedId, setSelectedId] = useState<ChooseTestMethodOptionId | null>(
    null,
  );

  const scrollViewRef = useRef<ScrollView>(null);

  console.log('ChooseTestMethodScreen render');

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
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
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
                  className={`flex-row items-center rounded-2xl px-3.5 py-3.5 gap-3 border-[1.5px] ${selected
                      ? 'bg-surface-white border-brand-aqua'
                      : 'bg-surface-white border-border-default'
                    }`}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedId(option.id);
                    if (option.id === 'have_results') {
                      haveResultsRef.current?.show();
                      setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                    } else {
                      haveResultsRef.current?.hide();
                    }
                  }}
                >
                  <Image
                    source={option.icon}
                    className="w-14 h-14"
                    resizeMode="contain"
                  />
                  <View className="flex-1 pr-1">
                    <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                      {t(option.titleKey)}
                    </Text>
                    <Text className="text-small font-jakarta text-sub mt-0.5 leading-5">
                      {t(option.descriptionKey)}
                    </Text>
                  </View>
                  {selected ? (
                    <Image
                      source={icons.selectedCheckBadge}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.text.faint}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Info callout */}
          <View className="card--info flex-row items-start gap-3 px-4 py-4 mt-5">
            <View className="w-8 h-8 rounded-full bg-brand-aqua items-center justify-center mt-0.5">
              <Text className="text-body font-jakarta-bold text-surface-white">
                i
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-body font-jakarta-bold text-brand-navy">
                {t('choose_test_method_info_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-1 leading-5">
                {t('choose_test_method_info_desc')}
              </Text>
            </View>
          </View>
          <HaveTestResultsPanel ref={haveResultsRef} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

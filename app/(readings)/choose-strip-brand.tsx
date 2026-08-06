import { icons } from '@/constants/images';
import { colors } from '@/constants/theme';
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
  type ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OTHER_BRAND = 'Other';

export default function ChooseStripBrandScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { brands, selectedBrand, setSelectedBrand } = useTestStrips();
  const [query, setQuery] = useState('');

  const visibleBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.white }}>
      {/* Fixed header */}
      <View className="px-5 pt-1 pb-2 flex-row items-center">
        <TouchableOpacity
          className="w-10 h-10 items-start justify-center"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Image
            source={icons.backArrow}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center justify-center gap-2">
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

        <View className="w-10" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5">
          {/* Step chip */}
          <View className="items-center mt-2">
            <View className="chip">
              <Text className="text-small font-jakarta-bold text-brand-navy">
                {t('strip_brand_step')}
              </Text>
            </View>
          </View>

          {/* Title + subtitle */}
          <Text className="text-h1 font-jakarta-extrabold text-brand-navy text-center mt-3">
            {t('strip_brand_title')}
          </Text>
          <Text className="text-body font-jakarta text-sub text-center mt-2 leading-5">
            {t('strip_brand_subtitle')}
          </Text>

          {/* Search */}
          <View className="flex-row items-center gap-2.5 rounded-2xl border border-border-default px-4 py-3.5 mt-4">
            <Ionicons name="search" size={18} color={colors.text.faint} />
            <TextInput
              className="flex-1 text-body font-jakarta text-charcoal p-0"
              value={query}
              onChangeText={setQuery}
              placeholder={t('strip_brand_search_placeholder')}
              placeholderTextColor={colors.text.faint}
            />
          </View>

          {/* Info callout */}
          <View className="card--info flex-row items-start gap-2.5 px-3.5 py-3 mt-3">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.text.sub}
            />
            <Text className="flex-1 text-small font-jakarta text-charcoal leading-5">
              {t('strip_brand_info')}
            </Text>
          </View>

          {/* Section label */}
          <Text className="text-tiny font-jakarta-bold text-faint uppercase mt-5 mb-2.5">
            {t('strip_brand_section')}
          </Text>

          {/* Brands */}
          <View className="gap-2.5">
            {visibleBrands.map((brand) => (
              <BrandRow
                key={brand.name}
                icon={brand.icon}
                title={brand.name}
                description={t('strip_brand_supported')}
                selected={selectedBrand === brand.name}
                onPress={() => setSelectedBrand(brand.name)}
              />
            ))}

            {visibleBrands.length === 0 ? (
              <Text className="text-small font-jakarta text-sub text-center py-4">
                {t('strip_brand_empty')}
              </Text>
            ) : null}

            <BrandRow
              icon={icons.testStrip}
              title={t('strip_brand_other_title')}
              description={t('strip_brand_other_desc')}
              selected={selectedBrand === OTHER_BRAND}
              onPress={() => setSelectedBrand(OTHER_BRAND)}
            />
          </View>

          {/* Help callout */}
          <View className="card--info flex-row items-start gap-2.5 px-3.5 py-3 mt-3">
            <Ionicons
              name="help-circle-outline"
              size={18}
              color={colors.text.sub}
            />
            <View className="flex-1">
              <Text className="text-small font-jakarta-bold text-brand-navy">
                {t('strip_brand_help_title')}
              </Text>
              <Text className="text-small font-jakarta text-sub mt-0.5 leading-5">
                {t('strip_brand_help_desc')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <View className="px-5 pt-2 pb-3">
        <TouchableOpacity
          className={`btn btn--primary ${selectedBrand ? '' : 'opacity-50'}`}
          activeOpacity={0.85}
          disabled={!selectedBrand}
        >
          <Text className="text-button font-jakarta-bold text-surface-white">
            {t('strip_brand_continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function BrandRow({
  icon,
  title,
  description,
  selected,
  onPress,
}: {
  icon: ImageSourcePropType;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`flex-row items-center rounded-2xl px-3.5 py-3 gap-3 border-[1.5px] ${
        selected
          ? 'bg-surface-soft-aqua border-brand-aqua'
          : 'bg-surface-white border-border-default'
      }`}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image source={icon} className="w-10 h-12" resizeMode="contain" />

      <View className="flex-1">
        <Text className="text-body-lg font-jakarta-bold text-brand-navy">
          {title}
        </Text>
        <Text className="text-small font-jakarta text-sub mt-0.5">
          {description}
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
}

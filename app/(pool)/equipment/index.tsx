import EquipmentExamplesModal, { EquipmentExampleItem } from '@/components/EquipmentExamplesModal';
import PoolReviewHeader from '@/components/PoolReviewHeader';
import { equipmentImages, icons } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import type { FilterType, PumpType } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaterChoice, POOL_EQUIPMENT } from './_data';


/** A single selectable card used inside the filter / pump / heater lists. */
function EquipmentOptionCard({
  selected,
  onPress,
  title,
  description,
  thumbnail,
  thumbnailClassName = 'bg-surface-bg',
}: {
  selected: boolean;
  onPress: () => void;
  title: string;
  description: string;
  thumbnail: React.ReactNode;
  thumbnailClassName?: string;
}) {
  return (
    <TouchableOpacity
      className={`card flex-row items-center p-3 ${selected ? 'border-brand-blue' : ''}`}
      style={shadow.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View className={`w-14 h-14 rounded-xl overflow-hidden items-center justify-center ${thumbnailClassName}`}>
        {thumbnail}
      </View>
      <View className="flex-1 ml-3 mr-2">
        <Text className="text-body-lg font-jakarta-bold text-charcoal">{title}</Text>
        <Text className="text-small font-jakarta text-sub mt-0.5 leading-relaxed">
          {description}
        </Text>
      </View>
      <Image
        source={selected ? icons.radioSelected : icons.radioEmpty}
        className="w-5 h-5"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

/** Section heading with an optional "View examples" link, matching the Filter type section. */
function EquipmentSectionHeader({
  label,
  onViewExamples,
  isUnset = false,
}: {
  label: string;
  onViewExamples?: () => void;
  isUnset?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center flex-1 mr-2">
        <Text className="section__title shrink" numberOfLines={1}>{t(label)}</Text>
        {isUnset ? (
          <View className="flex-row items-center bg-warning-bg border border-warning rounded-full px-2 py-0.5 ml-2 shrink-0">
            <View className="w-1.5 h-1.5 rounded-full bg-warning" />
            <Text className="text-tiny font-jakarta-bold text-warning ml-1">{t('pool_tab_not_set')}</Text>
          </View>
        ) : null}
      </View>
      {onViewExamples ? (
        <TouchableOpacity onPress={onViewExamples} activeOpacity={0.7}>
          <Text className="text-small font-jakarta-bold text-brand-blue">
            {t('equipment_basics_see_examples')}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const HEATER_ICON: Record<'Yes' | 'No', { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string; bg: string }> = {
  Yes: { name: 'fire', color: colors.status.warning, bg: 'bg-warning-bg' },
  No: { name: 'power-plug-off-outline', color: colors.text.faint, bg: 'bg-surface-bg' },
};

function EquipmentDetailsBlock({
  detailsLabel,
  identifyTitle,
  identifyDescription,
}: {
  detailsLabel: string;
  identifyTitle: string;
  identifyDescription: string;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <>
      <Text className="text-label font-jakarta-bold text-charcoal mt-5">
        {t(detailsLabel)} <Text className="text-sub font-jakarta">{t('signup_phone_optional')}</Text>
      </Text>
      <Text className="text-small font-jakarta text-sub mt-1 leading-relaxed">
        {t('equipment_details_help')}
      </Text>

      <TouchableOpacity
        className="form-input flex-row items-center justify-between mt-3"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="pricetag-outline" size={16} color={colors.text.faint} />
          <Text className="text-body font-jakarta text-faint">{t('equipment_select_brand')}</Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={colors.text.faint} />
      </TouchableOpacity>

      {user?.user_metadata?.plan === 'free' ? (
        <>
          <TouchableOpacity className="self-start mt-2.5" activeOpacity={0.7}>
            <Text className="text-small font-jakarta-bold text-brand-blue">
              {t('equipment_basics_heater_not_sure')}
            </Text>
          </TouchableOpacity >

          <View className="rounded-2xl border border-dashed border-brand-aqua bg-surface-soft-aqua p-4 mt-4">
            <View className="flex-row items-center justify-end gap-1">
              <Ionicons name="sparkles" size={12} color={colors.brand.blue} />
              <Text className="text-tiny font-jakarta-extrabold text-brand-blue">
                {t('equipment_premium_badge')}
              </Text>
            </View>

            <View className="flex-row items-center gap-2 mt-1.5">
              <Ionicons name="camera-outline" size={18} color={colors.brand.navy} />
              <Text className="flex-1 text-body-lg font-jakarta-bold text-charcoal">
                {t(identifyTitle)}
              </Text>
            </View>

            <Text className="text-small font-jakarta text-sub mt-2 leading-relaxed">
              {t(identifyDescription)}
            </Text>

            <TouchableOpacity
              className="bg-surface-white border border-border-default rounded-full py-3 flex-row items-center justify-center gap-2 mt-3"
              activeOpacity={0.85}
            >
              <Ionicons name="camera-outline" size={16} color={colors.brand.blue} />
              <Text className="text-body font-jakarta-bold text-brand-blue">
                {t('equipment_photo_id_button')}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center justify-center gap-1 mt-2">
              <Ionicons name="lock-closed" size={10} color={colors.text.faint} />
              <Text className="text-tiny font-jakarta text-faint">
                {t('equipment_premium_feature')}
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </>
  );
}

export default function PoolEquipmentScreen() {
  const { t } = useTranslation();
  const { pools } = usePool();

  const savedHeater = (pools as { heater?: HeaterChoice } | null)?.heater ?? pools?.heater;

  const updatePoolEquipment = {
    ...POOL_EQUIPMENT,
    filter: {
      ...POOL_EQUIPMENT.filter,
      defaultValue: pools?.filter_type ?? null,
    },
    pump: {
      ...POOL_EQUIPMENT.pump,
      defaultValue: pools?.pump_type ?? null,
    },
    heater: {
      ...POOL_EQUIPMENT.heater,
      defaultValue: savedHeater ?? null,
    },
  };



  const [filterType, setFilterType] = useState<FilterType | null>(updatePoolEquipment.filter.defaultValue);
  const [pumpType, setPumpType] = useState<PumpType | null>(updatePoolEquipment.pump.defaultValue);
  const [heater, setHeater] = useState<HeaterChoice | null>(updatePoolEquipment.heater.defaultValue);

  const [filterExamplesVisible, setFilterExamplesVisible] = useState(false);
  const [pumpExamplesVisible, setPumpExamplesVisible] = useState(false);

  const filterExampleItems: EquipmentExampleItem[] = updatePoolEquipment.filter.options.map((option) => ({
    key: option.value,
    image: equipmentImages.filter[option.value],
    title: t(option.title),
    description: t(option.exampleDescription ?? option.description),
    identifyLabel: t('equipment_how_to_identify'),
    identify: option.identifyHint ? t(option.identifyHint) : '',
  }));

  const pumpExampleItems: EquipmentExampleItem[] = updatePoolEquipment.pump.options.map((option) => ({
    key: option.value,
    image: equipmentImages.pump[option.value],
    title: t(option.title),
    description: t(option.exampleDescription ?? option.description),
    identifyLabel: t('equipment_how_to_identify_pump'),
    identify: option.identifyHint ? t(option.identifyHint) : '',
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <PoolReviewHeader title={t('pool_tab_equipment')} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <Text className="text-body font-jakarta text-sub mb-5">
            {t('equipment_basics_subtitle')}
          </Text>

          {/* Filter type */}
          <View>
            <EquipmentSectionHeader
              label={updatePoolEquipment.filter.label}
              onViewExamples={() => setFilterExamplesVisible(true)}
              isUnset={!filterType}
            />

            <View className="gap-3 mt-3">
              {updatePoolEquipment.filter.options.map((option) => (
                <EquipmentOptionCard
                  key={option.value}
                  selected={filterType === option.value}
                  onPress={() => setFilterType(option.value)}
                  title={t(option.title)}
                  description={t(option.description)}
                  thumbnail={
                    <Image
                      source={equipmentImages.filter[option.value] as ImageSourcePropType}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  }
                />
              ))}
            </View>

            <EquipmentDetailsBlock
              detailsLabel="equipment_filter_details"
              identifyTitle="equipment_identify_filter_title"
              identifyDescription="equipment_identify_filter_desc"
            />
          </View>

          {/* Pump */}
          <View className="mt-8">
            <EquipmentSectionHeader
              label={updatePoolEquipment.pump.label}
              onViewExamples={() => setPumpExamplesVisible(true)}
              isUnset={!pumpType}
            />

            <View className="gap-3 mt-3">
              {updatePoolEquipment.pump.options.map((option) => (
                <EquipmentOptionCard
                  key={option.value}
                  selected={pumpType === option.value}
                  onPress={() => setPumpType(option.value)}
                  title={t(option.title)}
                  description={t(option.description)}
                  thumbnail={
                    <Image
                      source={equipmentImages.pump[option.value] as ImageSourcePropType}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  }
                />
              ))}
            </View>

            <EquipmentDetailsBlock
              detailsLabel="equipment_pump_details"
              identifyTitle="equipment_identify_pump_title"
              identifyDescription="equipment_identify_pump_desc"
            />
          </View>

          {/* Heater */}
          <View className="mt-8">
            <EquipmentSectionHeader
              label={updatePoolEquipment.heater.label}
              isUnset={!heater}
            />

            <View className="gap-3 mt-3">
              {updatePoolEquipment.heater.options.map((option) => (
                <EquipmentOptionCard
                  key={option.value}
                  selected={heater === option.value}
                  onPress={() => setHeater(option.value)}
                  title={t(option.title)}
                  description={t(option.description)}
                  thumbnailClassName={HEATER_ICON[option.value].bg}
                  thumbnail={
                    <MaterialCommunityIcons
                      name={HEATER_ICON[option.value].name}
                      size={26}
                      color={HEATER_ICON[option.value].color}
                    />
                  }
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <EquipmentExamplesModal
        visible={filterExamplesVisible}
        onClose={() => setFilterExamplesVisible(false)}
        title={t('equipment_examples_filter_title')}
        subtitle={t('equipment_examples_filter_subtitle')}
        footerNote={t('equipment_examples_filter_footer')}
        items={filterExampleItems}
      />

      <EquipmentExamplesModal
        visible={pumpExamplesVisible}
        onClose={() => setPumpExamplesVisible(false)}
        title={t('equipment_examples_pump_title')}
        subtitle={t('equipment_examples_pump_subtitle')}
        footerNote={t('equipment_examples_pump_footer')}
        items={pumpExampleItems}
      />
    </SafeAreaView>
  );
}

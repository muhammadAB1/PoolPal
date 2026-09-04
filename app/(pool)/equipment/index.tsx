import EquipmentExamplesModal, { EquipmentExampleItem } from '@/components/EquipmentExamplesModal';
import PoolReviewHeader from '@/components/PoolReviewHeader';
import { equipmentImages, icons } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import type { FilterType, PumpType } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
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
}: {
  label: string;
  onViewExamples?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="section__title">{label}</Text>
      {onViewExamples ? (
        <TouchableOpacity onPress={onViewExamples} activeOpacity={0.7}>
          <Text className="text-small font-jakarta-bold text-brand-blue">View examples</Text>
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

  const { user } = useAuth();

  return (
    <>
      <Text className="text-label font-jakarta-bold text-charcoal mt-5">
        {detailsLabel} <Text className="text-sub font-jakarta">(optional)</Text>
      </Text>
      <Text className="text-small font-jakarta text-sub mt-1 leading-relaxed">
        Adding these helps us give you more specific maintenance and troubleshooting advice.
      </Text>

      <TouchableOpacity
        className="form-input flex-row items-center justify-between mt-3"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="pricetag-outline" size={16} color={colors.text.faint} />
          <Text className="text-body font-jakarta text-faint">Select brand</Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={colors.text.faint} />
      </TouchableOpacity>

      {user?.user_metadata?.plan === 'free' ? (
        <>
          <TouchableOpacity className="self-start mt-2.5" activeOpacity={0.7}>
            <Text className="text-small font-jakarta-bold text-brand-blue">Not sure</Text>
          </TouchableOpacity >

          <View className="rounded-2xl border border-dashed border-brand-aqua bg-surface-soft-aqua p-4 mt-4">
            <View className="flex-row items-center justify-end gap-1">
              <Ionicons name="sparkles" size={12} color={colors.brand.blue} />
              <Text className="text-tiny font-jakarta-extrabold text-brand-blue">PREMIUM</Text>
            </View>

            <View className="flex-row items-center gap-2 mt-1.5">
              <Ionicons name="camera-outline" size={18} color={colors.brand.navy} />
              <Text className="flex-1 text-body-lg font-jakarta-bold text-charcoal">
                {identifyTitle}
              </Text>
            </View>

            <Text className="text-small font-jakarta text-sub mt-2 leading-relaxed">
              {identifyDescription}
            </Text>

            <TouchableOpacity
              className="bg-surface-white border border-border-default rounded-full py-3 flex-row items-center justify-center gap-2 mt-3"
              activeOpacity={0.85}
            >
              <Ionicons name="camera-outline" size={16} color={colors.brand.blue} />
              <Text className="text-body font-jakarta-bold text-brand-blue">
                Use Photo Identification
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center justify-center gap-1 mt-2">
              <Ionicons name="lock-closed" size={10} color={colors.text.faint} />
              <Text className="text-tiny font-jakarta text-faint">
                PoolWise Premium feature
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </>
  );
}

export default function PoolEquipmentScreen() {
  const { pools } = usePool();

  const savedHeater = (pools as { heater?: HeaterChoice } | null)?.heater ?? pools?.heater_type;

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
    title: option.title,
    description: option.exampleDescription ?? option.description,
    identifyLabel: 'How to identify it:',
    identify: option.identifyHint ?? '',
  }));

  const pumpExampleItems: EquipmentExampleItem[] = updatePoolEquipment.pump.options.map((option) => ({
    key: option.value,
    image: equipmentImages.pump[option.value],
    title: option.title,
    description: option.exampleDescription ?? option.description,
    identifyLabel: 'How to identify it:',
    identify: option.identifyHint ?? '',
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <PoolReviewHeader title="Equipment" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <Text className="text-body font-jakarta text-sub mb-5">
            Tell us about your pool equipment so we can provide the best guidance.
          </Text>

          {/* Filter type */}
          <View>
            <EquipmentSectionHeader
              label={updatePoolEquipment.filter.label}
              onViewExamples={() => setFilterExamplesVisible(true)}
            />

            <View className="gap-3 mt-3">
              {updatePoolEquipment.filter.options.map((option) => (
                <EquipmentOptionCard
                  key={option.value}
                  selected={filterType === option.value}
                  onPress={() => setFilterType(option.value)}
                  title={option.title}
                  description={option.description}
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
              detailsLabel="Filter details"
              identifyTitle="Identify your filter from a photo"
              identifyDescription="Take a clear photo of your filter and PoolWise can help identify its type, brand, and model."
            />
          </View>

          {/* Pump */}
          <View className="mt-8">
            <EquipmentSectionHeader
              label={updatePoolEquipment.pump.label}
              onViewExamples={() => setPumpExamplesVisible(true)}
            />

            <View className="gap-3 mt-3">
              {updatePoolEquipment.pump.options.map((option) => (
                <EquipmentOptionCard
                  key={option.value}
                  selected={pumpType === option.value}
                  onPress={() => setPumpType(option.value)}
                  title={option.title}
                  description={option.description}
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
              detailsLabel="Pump details"
              identifyTitle="Identify your pump from a photo"
              identifyDescription="Take a clear photo of your pump and PoolWise can help identify its type, brand, and model."
            />
          </View>

          {/* Heater */}
          <View className="mt-8">
            <EquipmentSectionHeader label={updatePoolEquipment.heater.label} />

            <View className="gap-3 mt-3">
              {updatePoolEquipment.heater.options.map((option) => (
                <EquipmentOptionCard
                  key={option.value}
                  selected={heater === option.value}
                  onPress={() => setHeater(option.value)}
                  title={option.title}
                  description={option.description}
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
        title="Examples of Filter Types"
        subtitle="These are common filter types you may have."
        footerNote="Not sure which filter you have? Upload a photo of your filter equipment and we'll help you identify it."
        items={filterExampleItems}
      />

      <EquipmentExamplesModal
        visible={pumpExamplesVisible}
        onClose={() => setPumpExamplesVisible(false)}
        title="Examples of Pump Types"
        subtitle="These are common pump types you may have."
        footerNote="Not sure which pump you have? Upload a photo of your equipment pad and we'll help you identify it."
        items={pumpExampleItems}
      />
    </SafeAreaView>
  );
}

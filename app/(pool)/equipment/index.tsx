import EquipmentBasicsScreen from '@/app/(onboarding)/equipment-basics';
import EquipmentExamplesModal, { EquipmentExampleItem } from '@/components/EquipmentExamplesModal';
import PoolReviewHeader from '@/components/PoolReviewHeader';
import { equipmentChoiceImages, equipmentImages } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import type { FilterType, PumpType } from '@/lib/types';
import { usePool } from '@/providers/PoolProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  type ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaterChoice, POOL_EQUIPMENT } from './_data';

const HEATER_ICON: Record<
  HeaterChoice,
  { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string; bg: string }
> = {
  Yes: { name: 'fire', color: colors.status.warning, bg: 'bg-warning-bg' },
  No: { name: 'power-plug-off-outline', color: colors.text.faint, bg: 'bg-surface-bg' },
};

function EquipmentSectionHeader({
  label,
  onViewExamples,
}: {
  label: string;
  onViewExamples?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between">
      <Text className="section__title">{t(label)}</Text>
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

function SavedEquipmentCard({
  title,
  description,
  image,
  heater,
  onPress,
}: {
  title: string;
  description: string;
  image?: ImageSourcePropType;
  heater?: HeaterChoice;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      className="rounded-2xl border border-surface-mint-border bg-surface-mint p-3 flex-row items-center mt-3"
      style={shadow.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        className={`w-16 h-16 rounded-xl overflow-hidden items-center justify-center ${
          heater ? HEATER_ICON[heater].bg : 'bg-surface-white'
        }`}
      >
        {image ? <Image source={image} className="w-full h-full" resizeMode="contain" /> : null}
        {heater ? (
          <MaterialCommunityIcons
            name={HEATER_ICON[heater].name}
            size={28}
            color={HEATER_ICON[heater].color}
          />
        ) : null}
      </View>

      <View className="flex-1 ml-3 mr-2">
        <Text className="text-body-lg font-jakarta-bold text-charcoal">{title}</Text>
        <Text className="text-small font-jakarta text-sub mt-1 leading-relaxed">
          {description}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.text.faint} />
    </TouchableOpacity>
  );
}

export default function PoolEquipmentScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { pools, refreshPools } = usePool();
  const [isEditing, setIsEditing] = useState(false);
  const [filterExamplesVisible, setFilterExamplesVisible] = useState(false);
  const [pumpExamplesVisible, setPumpExamplesVisible] = useState(false);

  const filterType = pools?.filter_type as FilterType | null | undefined;
  const pumpType = pools?.pump_type as PumpType | null | undefined;
  const heater =
    pools?.heater === 'Yes' || pools?.heater === 'No' ? (pools.heater as HeaterChoice) : null;

  const filterOption = filterType
    ? POOL_EQUIPMENT.filter.options.find((option) => option.value === filterType)
    : undefined;
  const pumpOption = pumpType
    ? POOL_EQUIPMENT.pump.options.find((option) => option.value === pumpType)
    : undefined;
  const heaterOption = heater
    ? POOL_EQUIPMENT.heater.options.find((option) => option.value === heater)
    : undefined;

  const filterExampleItems: EquipmentExampleItem[] = POOL_EQUIPMENT.filter.options.map((option) => ({
    key: option.value,
    image: equipmentImages.filter[option.value],
    title: t(option.title),
    description: t(option.exampleDescription ?? option.description),
    identifyLabel: t('equipment_how_to_identify'),
    identify: option.identifyHint ? t(option.identifyHint) : '',
  }));

  const pumpExampleItems: EquipmentExampleItem[] = POOL_EQUIPMENT.pump.options.map((option) => ({
    key: option.value,
    image: equipmentImages.pump[option.value],
    title: t(option.title),
    description: t(option.exampleDescription ?? option.description),
    identifyLabel: t('equipment_how_to_identify_pump'),
    identify: option.identifyHint ? t(option.identifyHint) : '',
  }));

  const hasSavedEquipment = Boolean(filterOption || pumpOption || heaterOption);

  if (isEditing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
        <PoolReviewHeader
          title={t('pool_tab_equipment')}
          onBackPress={() => setIsEditing(false)}
          showEdit={false}
        />
        <EquipmentBasicsScreen
          initialFilterType={filterType ?? null}
          initialPumpType={pumpType ?? null}
          initialHeater={heater ?? null}
          showSkip={false}
          markStale={false}
          onSuccess={async () => {
            await refreshPools({ silent: true });
            setIsEditing(false);
            router.replace('/(tabs)/pool');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <PoolReviewHeader
        title={t('pool_tab_equipment')}
        // Edit button commented out for now — equipment card arrows open the onboarding form instead.
        // onEditPress={() => setIsEditing(true)}
        showEdit={false}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <Text className="text-body font-jakarta text-sub mb-5">
            {t('equipment_basics_subtitle')}
          </Text>

          {filterOption && filterType ? (
            <View>
              <EquipmentSectionHeader
                label={POOL_EQUIPMENT.filter.label}
                onViewExamples={() => setFilterExamplesVisible(true)}
              />
              <SavedEquipmentCard
                title={t(filterOption.title)}
                description={t(filterOption.description)}
                image={equipmentChoiceImages.filter[filterType]}
                onPress={() => setIsEditing(true)}
              />
            </View>
          ) : null}

          {pumpOption && pumpType ? (
            <View className={filterOption ? 'mt-8' : ''}>
              <EquipmentSectionHeader
                label={POOL_EQUIPMENT.pump.label}
                onViewExamples={() => setPumpExamplesVisible(true)}
              />
              <SavedEquipmentCard
                title={t(pumpOption.title)}
                description={t(pumpOption.description)}
                image={equipmentChoiceImages.pump[pumpType]}
                onPress={() => setIsEditing(true)}
              />
            </View>
          ) : null}

          {heaterOption && heater ? (
            <View className={filterOption || pumpOption ? 'mt-8' : ''}>
              <EquipmentSectionHeader label={POOL_EQUIPMENT.heater.label} />
              <SavedEquipmentCard
                title={t(heaterOption.title)}
                description={t(heaterOption.description)}
                heater={heater}
                onPress={() => setIsEditing(true)}
              />
            </View>
          ) : null}

          {!hasSavedEquipment ? (
            <TouchableOpacity
              className="rounded-2xl border border-border-default bg-surface-white p-5 flex-row items-center"
              activeOpacity={0.7}
              onPress={() => setIsEditing(true)}
            >
              <Text className="flex-1 text-body font-jakarta text-sub text-center">
                {t('pool_tab_not_set')}
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.text.faint} />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      <EquipmentExamplesModal
        visible={filterExamplesVisible}
        onClose={() => setFilterExamplesVisible(false)}
        title={t('equipment_examples_filter_title')}
        subtitle={t('equipment_examples_filter_subtitle')}
        items={filterExampleItems}
      />

      <EquipmentExamplesModal
        visible={pumpExamplesVisible}
        onClose={() => setPumpExamplesVisible(false)}
        title={t('equipment_examples_pump_title')}
        subtitle={t('equipment_examples_pump_subtitle')}
        items={pumpExampleItems}
      />
    </SafeAreaView>
  );
}

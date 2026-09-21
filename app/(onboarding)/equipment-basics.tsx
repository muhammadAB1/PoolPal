import EquipmentExamplesModal, {
    EquipmentExampleItem,
} from '@/components/EquipmentExamplesModal';
import { equipmentChoiceImages, equipmentImages } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import {
    FILTER_TYPES,
    filterExampleTranslationKeys,
    filterTypeTranslationKeys,
    HEATER_OPTIONS,
    heaterOptionTranslationKeys,
    PUMP_TYPES,
    pumpExampleTranslationKeys,
    pumpTypeTranslationKeys,
} from '@/data/poolEquipment';
import { useSupabase } from '@/hooks/supabaseHooks';
import { parseRemainingSteps, resumeOnboardingHref } from '@/lib/onboardingFlow';
import type { FilterType, HeaterOption, PumpType } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
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

function PhotoIdentifyCard({ title, description }: { title: string; description: string }) {
    const { t } = useTranslation();

    return (
        <View className="rounded-2xl border border-dashed border-brand-aqua bg-surface-soft-aqua p-4 mt-5">
            <View className="flex-row items-center justify-end gap-1">
                <Ionicons name="sparkles" size={12} color={colors.brand.blue} />
                <Text className="text-tiny font-jakarta-extrabold text-brand-blue">
                    {t('equipment_premium_badge')}
                </Text>
            </View>

            <View className="flex-row items-center gap-2 mt-1.5">
                <Ionicons name="camera-outline" size={20} color={colors.brand.navy} />
                <Text className="flex-1 text-body-lg font-jakarta-bold text-charcoal">{title}</Text>
            </View>

            <Text className="text-small font-jakarta text-sub mt-2 leading-relaxed">{description}</Text>

            <TouchableOpacity
                className="bg-surface-white border border-border-default rounded-full py-3 flex-row items-center justify-center gap-2 mt-3"
                activeOpacity={0.85}
                onPress={() => {}}
            >
                <Ionicons name="images-outline" size={18} color={colors.brand.blue} />
                <Text className="text-body font-jakarta-bold text-brand-blue">
                    {t('equipment_photo_id_button')}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function EquipmentChoiceCard({
    selected,
    onPress,
    image,
    title,
    description,
}: {
    selected: boolean;
    onPress: () => void;
    image: ImageSourcePropType;
    title: string;
    description: string;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.82}
            onPress={onPress}
            className={`rounded-2xl border p-3 flex-row items-center ${
                selected
                    ? 'bg-surface-mint border-surface-mint-border'
                    : 'bg-surface-white border-border-default'
            }`}
            style={shadow.card}
        >
            <View className="w-16 h-16 rounded-xl bg-surface-bg overflow-hidden items-center justify-center">
                <Image source={image} style={{ width: 64, height: 64 }} resizeMode="contain" />
            </View>

            <View className="flex-1 ml-3 mr-2">
                <Text className="text-body-lg font-jakarta-bold text-charcoal">{title}</Text>
                <Text className="text-small font-jakarta text-sub mt-1 leading-relaxed">
                    {description}
                </Text>
            </View>

            <Ionicons
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={colors.brand.navy}
            />
        </TouchableOpacity>
    );
}

type EquipmentBasicsScreenProps = {
    /** Preselects the current pool filter when editing from the Pool tab. */
    initialFilterType?: FilterType | null;
    /** Preselects the current pool pump when editing from the Pool tab. */
    initialPumpType?: PumpType | null;
    /** Preselects the current heater choice when editing from the Pool tab. */
    initialHeater?: HeaterOption | null;
    /** Hides "Skip for now". Defaults to true (onboarding keeps the skip option). */
    showSkip?: boolean;
    /**
     * When provided, this screen is being embedded (e.g. from the Equipment review "Edit" action)
     * instead of rendered as an onboarding route. On success this is called instead of the
     * normal onboarding navigation, and the outer SafeAreaView is skipped so the parent screen
     * stays in control of the safe area and header.
     */
    onSuccess?: () => void;
    /** Defaults to true for onboarding. Pool tab Edit passes false because it refreshes the provider itself. */
    markStale?: boolean;
};

export default function EquipmentBasicsScreen({
    initialFilterType,
    initialPumpType,
    initialHeater,
    showSkip = true,
    onSuccess,
    markStale = true,
}: EquipmentBasicsScreenProps = {}) {
    const router = useRouter();
    const { t } = useTranslation();
    const { poolEquipmentInsert } = useSupabase();
    const { resume, remaining } = useLocalSearchParams<{ resume?: string; remaining?: string }>();
    const isResuming = resume === '1';
    const remainingSteps = parseRemainingSteps(remaining);
    const isEmbedded = Boolean(onSuccess);

    const [filterType, setFilterType] = useState<FilterType>(initialFilterType ?? 'Sand');
    const [filterExamplesVisible, setFilterExamplesVisible] = useState(false);

    const [pumpType, setPumpType] = useState<PumpType>(initialPumpType ?? 'Variable');
    const [pumpExamplesVisible, setPumpExamplesVisible] = useState(false);

    const [heater, setHeater] = useState<HeaterOption>(initialHeater ?? 'Yes');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filterExampleItems: EquipmentExampleItem[] = FILTER_TYPES.map((item) => {
        const keys = filterExampleTranslationKeys[item];
        return {
            key: item,
            image: equipmentImages.filter[item],
            title: t(keys.title),
            description: t(keys.description),
            identifyLabel: t(keys.identifyLabel),
            identify: t(keys.identify),
        };
    });

    const pumpExampleItems: EquipmentExampleItem[] = PUMP_TYPES.map((item) => {
        const keys = pumpExampleTranslationKeys[item];
        return {
            key: item,
            image: equipmentImages.pump[item],
            title: t(keys.title),
            description: t(keys.description),
            identifyLabel: t(keys.identifyLabel),
            identify: t(keys.identify),
        };
    });

    async function handleContinue() {
        setErrorMessage(null);

        if (!filterType || !pumpType || !heater) {
            setErrorMessage(t('pool_basics_error'));
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await poolEquipmentInsert({
                props: {
                    filterType,
                    pumpType,
                    heaterOption: heater,
                },
                markStale,
            });
            if (error) {
                setErrorMessage(error.message);
                return;
            }
            if (onSuccess) {
                onSuccess();
                return;
            }
            router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/surface-type' as Href));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : t('pool_basics_error'));
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleSkipForNow() {
        router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/surface-type' as Href));
    }

    const content = (
        <>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 px-5 pt-2">
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-2">
                        {t('equipment_basics_title')}
                    </Text>
                    <Text className="text-body font-jakarta text-sub mt-1">
                        {t('equipment_basics_subtitle')}
                    </Text>

                    <View className="mt-6">
                        <View className="flex-row items-center justify-between">
                            <Text className="section__title">{t('equipment_basics_filter_label')}</Text>
                            <TouchableOpacity
                                onPress={() => setFilterExamplesVisible(true)}
                                activeOpacity={0.7}
                            >
                                <Text className="text-small font-jakarta-bold text-brand-blue">
                                    {t('equipment_basics_see_examples')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="gap-3 mt-3">
                            {FILTER_TYPES.map((item) => {
                                const keys = filterExampleTranslationKeys[item];
                                return (
                                    <EquipmentChoiceCard
                                        key={item}
                                        selected={filterType === item}
                                        onPress={() => setFilterType(item)}
                                        image={equipmentChoiceImages.filter[item]}
                                        title={t(filterTypeTranslationKeys[item])}
                                        description={t(keys.description)}
                                    />
                                );
                            })}
                        </View>

                        <PhotoIdentifyCard
                            title={t('equipment_identify_filter_title')}
                            description={t('equipment_identify_filter_desc')}
                        />
                    </View>

                    <View className="mt-8">
                        <View className="flex-row items-center justify-between">
                            <Text className="section__title">{t('equipment_basics_pump_label')}</Text>
                            <TouchableOpacity
                                onPress={() => setPumpExamplesVisible(true)}
                                activeOpacity={0.7}
                            >
                                <Text className="text-small font-jakarta-bold text-brand-blue">
                                    {t('equipment_basics_see_examples')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="gap-3 mt-3">
                            {PUMP_TYPES.map((item) => {
                                const keys = pumpExampleTranslationKeys[item];
                                return (
                                    <EquipmentChoiceCard
                                        key={item}
                                        selected={pumpType === item}
                                        onPress={() => setPumpType(item)}
                                        image={equipmentChoiceImages.pump[item]}
                                        title={t(pumpTypeTranslationKeys[item])}
                                        description={t(keys.description)}
                                    />
                                );
                            })}
                        </View>

                        <PhotoIdentifyCard
                            title={t('equipment_identify_pump_title')}
                            description={t('equipment_identify_pump_desc')}
                        />
                    </View>

                    <View className="mt-8">
                        <Text className="section__title">{t('equipment_basics_heater_label')}</Text>

                        <View className="flex-row gap-2.5 mt-3">
                            {HEATER_OPTIONS.map((item) => {
                                const selected = heater === item;
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        activeOpacity={0.86}
                                        onPress={() => setHeater(item)}
                                        className={`flex-1 rounded-full py-3.5 items-center border-[1.5px] ${
                                            selected
                                                ? 'bg-surface-mint border-surface-mint-border'
                                                : 'bg-surface-white border-border-default'
                                        }`}
                                    >
                                        <Text
                                            className={`text-body font-jakarta-bold ${
                                                selected ? 'text-brand-navy' : 'text-charcoal'
                                            }`}
                                        >
                                            {t(heaterOptionTranslationKeys[item])}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="h-28" />
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-surface-white px-5 pt-3 pb-7 border-t border-border-default">
                {errorMessage ? (
                    <Text className="text-body font-jakarta text-error mb-3 text-center">
                        {errorMessage}
                    </Text>
                ) : null}
                <TouchableOpacity
                    className={`bg-brand-blue rounded-full py-4.25 items-center justify-center ${
                        isSubmitting ? 'opacity-50' : ''
                    }`}
                    onPress={handleContinue}
                    disabled={isSubmitting}
                    activeOpacity={0.85}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('equipment_basics_continue')}
                    </Text>
                </TouchableOpacity>

                {showSkip ? (
                    <TouchableOpacity
                        className="items-center justify-center mt-3.5 py-1"
                        onPress={handleSkipForNow}
                        activeOpacity={0.7}
                    >
                        <Text className="text-body font-jakarta-bold text-brand-blue">
                            {t('equipment_basics_skip_for_now')}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>

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
        </>
    );

    if (isEmbedded) {
        return <View className="flex-1">{content}</View>;
    }

    return (
        <SafeAreaView className="flex-1 bg-surface-white" style={{ flex: 1 }}>
            {content}
        </SafeAreaView>
    );
}

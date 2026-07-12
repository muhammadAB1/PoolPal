import EquipmentExamplesModal, {
    EquipmentExampleItem,
} from '@/components/EquipmentExamplesModal';
import { equipmentImages, icons } from '@/constants/images';
import { colors } from '@/constants/theme';
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
import type { FilterType, HeaterOption, PumpType } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
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

export default function EquipmentBasicsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { poolEquipmentInsert } = useSupabase();

    const [filterType, setFilterType] = useState<FilterType>('Sand');
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [filterExamplesVisible, setFilterExamplesVisible] = useState(false);

    const [pumpType, setPumpType] = useState<PumpType>('Variable');
    const [pumpMenuOpen, setPumpMenuOpen] = useState(false);
    const [pumpExamplesVisible, setPumpExamplesVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [heater, setHeater] = useState<HeaterOption>('Yes');

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
        // setErrorMessage(null);

        // if (!filterType || !pumpType || !heater) {
        //     setErrorMessage(t('pool_basics_error'));
        //     return;
        // }

        // setIsSubmitting(true);

        // try {
        //     const { error } = await poolEquipmentInsert({
        //         props: {
        //             filterType,
        //             pumpType,
        //             heaterOption: heater,
        //         },
        //     });
        //     if (error) {
        //         setErrorMessage(error.message);
        //         return;
        //     }
            router.replace('/surface-type' as Href);
        // } catch (error) {
        //     setErrorMessage(error instanceof Error ? error.message : t('pool_basics_error'));
        // } finally {
        //     setIsSubmitting(false);
        // }
    }

    function handleSkipForNow() {
        router.replace('/surface-type' as Href);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 px-5 pt-2 -mt-6">
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                        {t('equipment_basics_title')}
                    </Text>
                    <Text className="text-body font-jakarta text-sub mt-1">
                        {t('equipment_basics_subtitle')}
                    </Text>

                    {/* Filter Type */}
                    <View className="mt-6">
                        <View className="flex-row items-center justify-between">
                            <Text className="section__title">
                                {t('equipment_basics_filter_label')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setFilterExamplesVisible(true)}
                                activeOpacity={0.7}
                            >
                                <Text className="text-small font-jakarta-bold text-brand-blue">
                                    {t('equipment_basics_see_examples')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            className="form-input flex-row items-center justify-between mt-3"
                            activeOpacity={0.8}
                            onPress={() => setFilterMenuOpen((prev) => !prev)}
                        >
                            <View className="flex-row items-center gap-2.5">
                                <View className="w-2 h-2 rounded-full bg-brand-blue" />
                                <Text className="text-body font-jakarta text-charcoal">
                                    {t(filterTypeTranslationKeys[filterType])}
                                </Text>
                            </View>
                            <Ionicons
                                name={filterMenuOpen ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color={colors.text.sub}
                            />
                        </TouchableOpacity>

                        {filterMenuOpen ? (
                            <View className="mt-2 rounded-xl border border-border-default bg-surface-white overflow-hidden">
                                {FILTER_TYPES.map((item, index) => {
                                    const selected = filterType === item;
                                    return (
                                        <TouchableOpacity
                                            key={item}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                setFilterType(item);
                                                setFilterMenuOpen(false);
                                            }}
                                            className={`px-4 py-3 ${index !== FILTER_TYPES.length - 1
                                                ? 'border-b border-border-default'
                                                : ''
                                                } ${selected ? 'bg-surface-soft-aqua' : ''}`}
                                        >
                                            <Text
                                                className={`text-body font-jakarta ${selected
                                                    ? 'font-jakarta-bold text-brand-blue'
                                                    : 'text-charcoal'
                                                    }`}
                                            >
                                                {t(filterTypeTranslationKeys[item])}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : null}

                        <TouchableOpacity
                            className="flex-row items-start gap-3 rounded-2xl border border-dashed border-brand-aqua bg-surface-soft-aqua px-4 py-3.5 mt-3"
                            activeOpacity={0.7}
                            onPress={() => { }}
                        >
                            <View className="w-14 h-14 rounded-xl bg-surface-white items-center justify-center">
                                <Image
                                    source={icons.camera}
                                    className="w-7 h-7"
                                    resizeMode="contain"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-body font-jakarta-bold text-charcoal">
                                    {t('equipment_basics_upload_filter_title')}
                                </Text>
                                <Text className="text-tiny font-jakarta text-sub mt-1 leading-relaxed">
                                    {t('equipment_basics_upload_filter_desc')}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={colors.text.sub}
                                style={{ marginTop: 4 }}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Pump Type */}
                    <View className="mt-6">
                        <View className="flex-row items-center justify-between">
                            <Text className="section__title">
                                {t('equipment_basics_pump_label')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setPumpExamplesVisible(true)}
                                activeOpacity={0.7}
                            >
                                <Text className="text-small font-jakarta-bold text-brand-blue">
                                    {t('equipment_basics_see_examples')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            className="form-input flex-row items-center justify-between mt-3"
                            activeOpacity={0.8}
                            onPress={() => setPumpMenuOpen((prev) => !prev)}
                        >
                            <View className="flex-row items-center gap-2.5">
                                <View className="w-2 h-2 rounded-full bg-brand-blue" />
                                <Text className="text-body font-jakarta text-charcoal">
                                    {t(pumpTypeTranslationKeys[pumpType])}
                                </Text>
                            </View>
                            <Ionicons
                                name={pumpMenuOpen ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color={colors.text.sub}
                            />
                        </TouchableOpacity>

                        {pumpMenuOpen ? (
                            <View className="mt-2 rounded-xl border border-border-default bg-surface-white overflow-hidden">
                                {PUMP_TYPES.map((item, index) => {
                                    const selected = pumpType === item;
                                    return (
                                        <TouchableOpacity
                                            key={item}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                setPumpType(item);
                                                setPumpMenuOpen(false);
                                            }}
                                            className={`px-4 py-3 ${index !== PUMP_TYPES.length - 1
                                                ? 'border-b border-border-default'
                                                : ''
                                                } ${selected ? 'bg-surface-soft-aqua' : ''}`}
                                        >
                                            <Text
                                                className={`text-body font-jakarta ${selected
                                                    ? 'font-jakarta-bold text-brand-blue'
                                                    : 'text-charcoal'
                                                    }`}
                                            >
                                                {t(pumpTypeTranslationKeys[item])}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : null}

                        <TouchableOpacity
                            className="flex-row items-start gap-3 rounded-2xl border border-dashed border-brand-aqua bg-surface-soft-aqua px-4 py-3.5 mt-3"
                            activeOpacity={0.7}
                            onPress={() => { }}
                        >
                            <View className="w-14 h-14 rounded-xl bg-surface-white items-center justify-center">
                                <Image
                                    source={icons.camera}
                                    className="w-7 h-7"
                                    resizeMode="contain"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-body font-jakarta-bold text-charcoal">
                                    {t('equipment_basics_upload_pump_title')}
                                </Text>
                                <Text className="text-tiny font-jakarta text-sub mt-1 leading-relaxed">
                                    {t('equipment_basics_upload_pump_desc')}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={colors.text.sub}
                                style={{ marginTop: 4 }}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Heater */}
                    <View className="mt-6">
                        <Text className="section__title">{t('equipment_basics_heater_label')}</Text>

                        <View className="flex-row gap-2.5 mt-3">
                            {HEATER_OPTIONS.map((item) => {
                                const selected = heater === item;
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        activeOpacity={0.8}
                                        onPress={() => setHeater(item)}
                                        className={`flex-1 rounded-full py-3.5 items-center border-[1.5px] ${selected
                                            ? 'bg-surface-mint border-surface-mint-border'
                                            : 'bg-surface-white border-border-default'
                                            }`}
                                    >
                                        <Text
                                            className={`text-body font-jakarta-bold ${selected ? 'text-success-text' : 'text-charcoal'
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
                    className="bg-brand-blue rounded-full py-[17px] items-center justify-center"
                    onPress={handleContinue}
                    activeOpacity={0.85}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('equipment_basics_continue')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="items-center justify-center mt-3.5 py-1"
                    onPress={handleSkipForNow}
                    activeOpacity={0.7}
                >
                    <Text className="text-body font-jakarta-bold text-brand-blue">
                        {t('equipment_basics_skip_for_now')}
                    </Text>
                </TouchableOpacity>
            </View>

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

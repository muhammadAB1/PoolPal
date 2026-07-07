import { icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import { POOL_SHAPES, poolShapeTranslationKeys } from '@/data/poolShapes';
import { useSupabase } from '@/hooks/supabaseHooks';
import type {
    MeasurementMethod,
    MeasurementUnit,
    PoolShape,
} from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PoolSizeGallonsScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { measurement } = useAuth();
    const { poolSizeInsert } = useSupabase();
    const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod>('Known');
    const [units, setUnits] = useState<MeasurementUnit>(measurement || 'us');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [shallowDepth, setShallowDepth] = useState('');
    const [deepDepth, setDeepDepth] = useState('');
    const [shape, setShape] = useState<PoolShape>('Rectangle');
    const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canUploadPhoto = measurementMethod === 'Estimate';
    const distanceSuffix = units === 'us'
        ? t('pool_size_unit_suffix_ft')
        : t('pool_size_unit_suffix_m');
    const volumeSuffix = units === 'us'
        ? t('pool_size_unit_gal')
        : t('pool_size_unit_liters');

    const estimatedVolume = useMemo(() => {
        const numericLength = parseFloat(length) || 0;
        const numericWidth = parseFloat(width) || 0;
        const numericShallowDepth = parseFloat(shallowDepth) || 0;
        const numericDeepDepth = parseFloat(deepDepth) || 0;

        return Math.round(
            numericLength * numericWidth * numericShallowDepth * numericDeepDepth
        );
    }, [length, width, shallowDepth, deepDepth]);

    const formattedEstimatedVolume = estimatedVolume.toLocaleString(
        i18n.language === 'es' ? 'es-ES' : 'en-US'
    );

    async function handleContinue() {
        setErrorMessage(null);

        const numericLength = parseFloat(length);
        const numericWidth = parseFloat(width);
        const numericShallowDepth = parseFloat(shallowDepth);
        const numericDeepDepth = parseFloat(deepDepth);

        if (
            !length.trim() ||
            !width.trim() ||
            !shallowDepth.trim() ||
            !deepDepth.trim() ||
            Number.isNaN(numericLength) ||
            Number.isNaN(numericWidth) ||
            Number.isNaN(numericShallowDepth) ||
            Number.isNaN(numericDeepDepth) ||
            numericLength <= 0 ||
            numericWidth <= 0 ||
            numericShallowDepth <= 0 ||
            numericDeepDepth <= 0
        ) {
            setErrorMessage(t('pool_basics_error'));
            return;
        }

        setIsSubmitting(true);

        // try {
        //     const { error } = await poolSizeInsert({
        //         props: {
        //             length: numericLength,
        //             width: numericWidth,
        //             shallowDepth: numericShallowDepth,
        //             deepDepth: numericDeepDepth,
        //             shape,
        //             gallons: estimatedVolume,
        //         },
        //     });

        //     if (error) {
        //         setErrorMessage(error.message);
        //         return;
        //     }

            router.replace('/equipment-basics' as Href);
        // } catch (error) {
        //     setErrorMessage(
        //         error instanceof Error ? error.message : t('pool_basics_error')
        //     );
        // } finally {
        //     setIsSubmitting(false);
        // }
    }

    function handleSkipForNow() {
        router.replace('/equipment-basics' as Href);
    }

    const methodOptions: {
        value: MeasurementMethod;
        icon: ImageSourcePropType;
        label: string;
        description: string;
    }[] = [
            {
                value: 'Known',
                icon: icons.checkmark,
                label: t('pool_size_option_yes_label'),
                description: t('pool_size_option_yes_desc'),
            },
            {
                value: 'Estimate',
                icon: icons.pool,
                label: t('pool_size_option_estimate_label'),
                description: t('pool_size_option_estimate_desc'),
            },
        ];

    const unitOptions: { value: MeasurementUnit; label: string }[] = [
        { value: 'us', label: t('pool_size_units_us') },
        { value: 'metric', label: t('pool_size_units_metric') },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-5 pt-2 -mt-6">
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                        {t('pool_size_title')}
                    </Text>
                    <Text className="text-body font-jakarta text-sub mt-1">
                        {t('pool_size_subtitle')}
                    </Text>

                    <View className="flex-row mt-5 gap-2.5">
                        {methodOptions.map((item) => (
                            <MethodCard
                                key={item.value}
                                icon={item.icon}
                                label={item.label}
                                description={item.description}
                                selected={measurementMethod === item.value}
                                onPress={() => setMeasurementMethod(item.value)}
                            />
                        ))}
                    </View>

                    <View className="flex-row items-center justify-between mt-6">
                        <Text className="section__title">{t('pool_size_units_label')}</Text>
                        <View className="flex-row bg-surface-bg rounded-full p-1 border border-border-default">
                            {unitOptions.map((item) => {
                                const selected = units === item.value;
                                return (
                                    <TouchableOpacity
                                        key={item.value}
                                        onPress={() => setUnits(item.value)}
                                        activeOpacity={0.8}
                                        className={`rounded-full px-3.5 py-2 ${selected ? 'bg-brand-blue' : ''}`}
                                    >
                                        <Text
                                            className={`text-small font-jakarta-bold ${selected ? 'text-surface-white' : 'text-sub'
                                                }`}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <Text className="section__title mt-6">
                        {t('pool_size_measurements_title')}
                    </Text>

                    <View className="flex-row gap-3 mt-3">
                        <MeasurementField
                            label={t('pool_size_length_label')}
                            value={length}
                            onChangeText={setLength}
                            suffix={distanceSuffix}
                        />
                        <MeasurementField
                            label={t('pool_size_width_label')}
                            value={width}
                            onChangeText={setWidth}
                            suffix={distanceSuffix}
                        />
                    </View>

                    <View className="flex-row gap-3 mt-3">
                        <MeasurementField
                            label={t('pool_size_shallow_depth_label')}
                            value={shallowDepth}
                            onChangeText={setShallowDepth}
                            suffix={distanceSuffix}
                        />
                        <MeasurementField
                            label={t('pool_size_deep_depth_label')}
                            value={deepDepth}
                            onChangeText={setDeepDepth}
                            suffix={distanceSuffix}
                        />
                    </View>

                    <View className="mt-3">
                        <Text className="form-label">{t('pool_size_shape_label')}</Text>
                        <TouchableOpacity
                            className="form-input flex-row items-center justify-between"
                            activeOpacity={0.8}
                            onPress={() => setShapeMenuOpen((prev) => !prev)}
                        >
                            <Text className="text-body font-jakarta text-charcoal">
                                {t(poolShapeTranslationKeys[shape])}
                            </Text>
                            <Ionicons
                                name={shapeMenuOpen ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color={colors.text.sub}
                            />
                        </TouchableOpacity>

                        {shapeMenuOpen ? (
                            <View className="mt-2 rounded-xl border border-border-default bg-surface-white overflow-hidden">
                                {POOL_SHAPES.map((item, index) => {
                                    const selected = shape === item;
                                    return (
                                        <TouchableOpacity
                                            key={item}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                setShape(item);
                                                setShapeMenuOpen(false);
                                            }}
                                            className={`px-4 py-3 hover:bg-surface-bg ${index !== POOL_SHAPES.length - 1
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
                                                {t(poolShapeTranslationKeys[item])}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : null}
                    </View>

                    <View className="card--info px-4 py-4 mt-6">
                        <View className="flex-row items-center gap-2">
                            <Image
                                source={icons.pool}
                                className="w-4 h-4"
                                resizeMode="contain"
                            />
                            <Text className="text-tiny font-jakarta text-sub">
                                {t('pool_size_estimated_gallons_label')}
                            </Text>
                        </View>
                        <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-1.5">
                            {formattedEstimatedVolume} {volumeSuffix}
                        </Text>
                        <Text className="text-tiny font-jakarta text-sub mt-1.5">
                            {t('pool_size_estimated_gallons_note')}
                        </Text>
                    </View>

                    {/* <View
                        className={`card flex-row items-center px-4 py-3.5 mt-4 gap-3 ${!canUploadPhoto ? 'opacity-50' : ''
                            }`}
                    >
                        <TouchableOpacity
                            className="flex-1 flex-row items-center gap-3"
                            activeOpacity={canUploadPhoto ? 0.7 : 1}
                            disabled={!canUploadPhoto}
                            onPress={() => { }}
                        >
                            <Image
                                source={icons.camera}
                                className="w-6 h-6"
                                resizeMode="contain"
                            />
                            <View className="flex-1">
                                <Text className="text-body font-jakarta-bold text-charcoal">
                                    {t('pool_size_upload_photo_label')}
                                </Text>
                                <Text className="text-tiny font-jakarta text-sub mt-0.5">
                                    {t('pool_size_upload_photo_desc')}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center gap-1"
                            activeOpacity={canUploadPhoto ? 0.7 : 1}
                            disabled={!canUploadPhoto}
                            onPress={() => { }}
                        >
                            <Text
                                className={`text-small font-jakarta-bold ${canUploadPhoto ? 'text-brand-blue' : 'text-faint'
                                    }`}
                            >
                                {t('pool_size_skip')}
                            </Text>
                            <Image
                                source={icons.arrowRight}
                                className="w-3 h-3"
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View> */}

                    <TouchableOpacity
                        className="card flex-row items-center px-4 py-3.5 mt-3 gap-3"
                        activeOpacity={0.7}
                        onPress={handleSkipForNow}
                    >
                        <Image
                            source={icons.arrowRight}
                            className="w-5 h-5"
                            resizeMode="contain"
                        />
                        <View className="flex-1">
                            <Text className="text-body font-jakarta-bold text-charcoal">
                                {t('pool_size_skip_for_now_label')}
                            </Text>
                            <Text className="text-tiny font-jakarta text-sub mt-0.5">
                                {t('pool_size_skip_for_now_desc')}
                            </Text>
                        </View>
                        <Image
                            source={icons.arrowRight}
                            className="w-3 h-3"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

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
                    className={`bg-brand-blue rounded-full py-[17px] items-center justify-center ${isSubmitting ? 'opacity-60' : ''}`}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                    disabled={isSubmitting}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('pool_size_continue')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

interface MethodCardProps {
    icon: ImageSourcePropType;
    label: string;
    description: string;
    selected: boolean;
    onPress: () => void;
}

function MethodCard({ icon, label, description, selected, onPress }: MethodCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className={`flex-1 rounded-2xl px-3.5 py-3.5 border-[1.5px] ${selected
                ? 'bg-surface-soft-aqua border-brand-blue'
                : 'bg-surface-white border-border-default'
                }`}
        >
            <Image source={icon} className="w-[18px] h-[18px]" resizeMode="contain" />
            <Text className="mt-2.5 text-body font-jakarta-bold text-charcoal">
                {label}
            </Text>
            <Text className="mt-0.5 text-small font-jakarta text-sub">
                {description}
            </Text>
        </TouchableOpacity>
    );
}

interface MeasurementFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    suffix: string;
}

function MeasurementField({ label, value, onChangeText, suffix }: MeasurementFieldProps) {
    return (
        <View className="flex-1">
            <Text className="form-label">{label}</Text>
            <View className="form-input flex-row items-center justify-between">
                <TextInput
                    className="flex-1 text-body font-jakarta text-charcoal p-0"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={colors.text.faint}
                />
                <Text className="text-small font-jakarta text-sub ml-2">{suffix}</Text>
            </View>
        </View>
    );
}

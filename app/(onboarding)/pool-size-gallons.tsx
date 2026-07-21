import { icons, poolSizeGraphics } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
    depthsFromProfile,
    POOL_DEPTH_PROFILES,
    POOL_SHAPES,
    poolDepthProfileTranslationKeys,
    poolShapeTranslationKeys,
} from '@/data/poolShapes';
import { useSupabase } from '@/hooks/supabaseHooks';
import { parseRemainingSteps, resumeOnboardingHref } from '@/lib/onboardingFlow';
import type {
    MeasurementMethod,
    MeasurementUnit,
    PoolDepthProfile,
    PoolShape,
} from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
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
    const { resume, remaining } = useLocalSearchParams<{ resume?: string; remaining?: string }>();
    const isResuming = resume === '1';
    const remainingSteps = parseRemainingSteps(remaining);
    const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod>('Known');
    const [units, setUnits] = useState<MeasurementUnit>(measurement || 'us');
    const [length, setLength] = useState('0');
    const [width, setWidth] = useState('0');
    const [shallowDepth, setShallowDepth] = useState('0');
    const [deepDepth, setDeepDepth] = useState('0');
    const [shape, setShape] = useState<PoolShape>('Rectangle');
    const [depthProfile, setDepthProfile] = useState<PoolDepthProfile>('ShallowDeep');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEstimate = measurementMethod === 'Estimate';
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

    const subtitle = isEstimate
        ? t('pool_size_subtitle_estimate')
        : t('pool_size_subtitle_known');

    function handleMethodChange(method: MeasurementMethod) {
        setMeasurementMethod(method);
        if (method === 'Estimate') {
            const defaults = depthsFromProfile(depthProfile);
            setShallowDepth(defaults.shallowDepth);
            setDeepDepth(defaults.deepDepth);
        }
    }

    function handleDepthProfileChange(profile: PoolDepthProfile) {
        setDepthProfile(profile);
        const defaults = depthsFromProfile(profile);
        setShallowDepth(defaults.shallowDepth);
        setDeepDepth(defaults.deepDepth);
    }

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

        try {
            const { error } = await poolSizeInsert({
                props: {
                    length: numericLength,
                    width: numericWidth,
                    shallowDepth: numericShallowDepth,
                    deepDepth: numericDeepDepth,
                    shape,
                    gallons: estimatedVolume,
                },
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

        router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/equipment-basics' as Href));
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : t('pool_basics_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleSkipForNow() {
        router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/equipment-basics' as Href));
    }

    const methodOptions: {
        value: MeasurementMethod;
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        description: string;
    }[] = [
            {
                value: 'Known',
                icon: 'resize-outline',
                label: t('pool_size_option_yes_label'),
                description: t('pool_size_option_yes_desc'),
            },
            {
                value: 'Estimate',
                icon: 'chatbubble-ellipses-outline',
                label: t('pool_size_option_estimate_label'),
                description: t('pool_size_option_estimate_desc'),
            },
        ];

    const unitOptions: { value: MeasurementUnit; label: string }[] = [
        { value: 'us', label: t('pool_size_units_us') },
        { value: 'metric', label: t('pool_size_units_metric') },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-5 pt-2 -mt-6">
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                        {t('pool_size_title')}
                    </Text>
                    <Text className="text-body font-jakarta text-sub mt-1">
                        {subtitle}
                    </Text>

                    <View className="flex-row mt-5 gap-2.5">
                        {methodOptions.map((item) => (
                            <MethodCard
                                key={item.value}
                                icon={item.icon}
                                label={item.label}
                                description={item.description}
                                selected={measurementMethod === item.value}
                                onPress={() => handleMethodChange(item.value)}
                            />
                        ))}
                    </View>

                    <View className="flex-row items-center justify-center gap-1.5 mt-4">
                        <Image
                            source={poolSizeGraphics.reminderShield}
                            className="w-4 h-4"
                            resizeMode="contain"
                        />
                        <Text className="text-tiny font-jakarta text-brand-blue">
                            {t('pool_size_adjust_later_note')}
                        </Text>
                    </View>

                    <View className="mt-5">
                        <Text className="section__title">{t('pool_size_units_label')}</Text>
                        <View className="flex-row bg-surface-bg rounded-full p-1 border border-border-default mt-2.5">
                            {unitOptions.map((item) => {
                                const selected = units === item.value;
                                return (
                                    <TouchableOpacity
                                        key={item.value}
                                        onPress={() => setUnits(item.value)}
                                        activeOpacity={0.8}
                                        className={`flex-1 rounded-full py-2.5 items-center ${selected ? 'bg-brand-blue' : ''}`}
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

                    {isEstimate ? (
                        <EstimateForm
                            shape={shape}
                            onShapeChange={setShape}
                            length={length}
                            onLengthChange={setLength}
                            width={width}
                            onWidthChange={setWidth}
                            depthProfile={depthProfile}
                            onDepthProfileChange={handleDepthProfileChange}
                            distanceSuffix={distanceSuffix}
                            formattedEstimatedVolume={formattedEstimatedVolume}
                            volumeSuffix={volumeSuffix}
                            canUploadPhoto={canUploadPhoto}
                        />
                    ) : (
                        <KnownForm
                            shape={shape}
                            onShapeChange={setShape}
                            length={length}
                            onLengthChange={setLength}
                            width={width}
                            onWidthChange={setWidth}
                            shallowDepth={shallowDepth}
                            onShallowDepthChange={setShallowDepth}
                            deepDepth={deepDepth}
                            onDeepDepthChange={setDeepDepth}
                            distanceSuffix={distanceSuffix}
                            formattedEstimatedVolume={formattedEstimatedVolume}
                            volumeSuffix={volumeSuffix}
                            canUploadPhoto={canUploadPhoto}
                            onSkipUpload={handleSkipForNow}
                        />
                    )}
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-surface-white px-5 pt-3 pb-7 border-t border-border-default">
                {errorMessage ? (
                    <Text className="text-body font-jakarta text-error mb-3 text-center">
                        {errorMessage}
                    </Text>
                ) : null}
                <TouchableOpacity
                    className={`bg-brand-blue rounded-full py-4.25 items-center justify-center ${isSubmitting ? 'opacity-60' : ''}`}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                    disabled={isSubmitting}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('pool_size_continue')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="items-center justify-center mt-3.5 py-1"
                    onPress={handleSkipForNow}
                    activeOpacity={0.7}
                >
                    <Text className="text-body font-jakarta-bold text-brand-blue">
                        {t('pool_size_skip_for_now_label')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

/* ─── Known measurements form (design image 3) ─────────────────────────────── */

interface KnownFormProps {
    shape: PoolShape;
    onShapeChange: (shape: PoolShape) => void;
    length: string;
    onLengthChange: (value: string) => void;
    width: string;
    onWidthChange: (value: string) => void;
    shallowDepth: string;
    onShallowDepthChange: (value: string) => void;
    deepDepth: string;
    onDeepDepthChange: (value: string) => void;
    distanceSuffix: string;
    formattedEstimatedVolume: string;
    volumeSuffix: string;
    canUploadPhoto: boolean;
    onSkipUpload: () => void;
}

function KnownForm({
    shape,
    onShapeChange,
    length,
    onLengthChange,
    width,
    onWidthChange,
    shallowDepth,
    onShallowDepthChange,
    deepDepth,
    onDeepDepthChange,
    distanceSuffix,
    formattedEstimatedVolume,
    volumeSuffix,
    canUploadPhoto,
    onSkipUpload,
}: KnownFormProps) {
    const { t } = useTranslation();

    return (
        <View className="mt-5">
            <Text className="section__title">{t('pool_size_shape_label')}</Text>
            <ShapePillRow shape={shape} onShapeChange={onShapeChange} />

            <Text className="section__title mt-5">{t('pool_size_measurements_title')}</Text>
            <Text className="text-tiny font-jakarta text-sub mt-0.5">
                {t('pool_size_measurements_subtitle')}
            </Text>

            <View className="flex-row gap-3 mt-3">
                <MeasurementField
                    label={t('pool_size_length_label')}
                    value={length}
                    onChangeText={onLengthChange}
                    suffix={distanceSuffix}
                />
                <MeasurementField
                    label={t('pool_size_width_label')}
                    value={width}
                    onChangeText={onWidthChange}
                    suffix={distanceSuffix}
                />
            </View>

            <View className="flex-row gap-3 mt-3">
                <MeasurementField
                    label={t('pool_size_shallow_depth_label')}
                    value={shallowDepth}
                    onChangeText={onShallowDepthChange}
                    suffix={distanceSuffix}
                />
                <MeasurementField
                    label={t('pool_size_deep_depth_label')}
                    value={deepDepth}
                    onChangeText={onDeepDepthChange}
                    suffix={distanceSuffix}
                />
            </View>

            <EstimateCard
                formattedVolume={formattedEstimatedVolume}
                volumeSuffix={volumeSuffix}
                note={t('pool_size_estimated_gallons_note')}
                layout="known"
            />

            <UploadPhotoRow
                enabled={canUploadPhoto}
                label={t('pool_size_upload_photo_label')}
                description={t('pool_size_upload_photo_desc')}
                showSkipLink
                onSkip={onSkipUpload}
            />
        </View>
    );
}

/* ─── Help me estimate form (design image 2) ───────────────────────────────── */

interface EstimateFormProps {
    shape: PoolShape;
    onShapeChange: (shape: PoolShape) => void;
    length: string;
    onLengthChange: (value: string) => void;
    width: string;
    onWidthChange: (value: string) => void;
    depthProfile: PoolDepthProfile;
    onDepthProfileChange: (profile: PoolDepthProfile) => void;
    distanceSuffix: string;
    formattedEstimatedVolume: string;
    volumeSuffix: string;
    canUploadPhoto: boolean;
}

function EstimateForm({
    shape,
    onShapeChange,
    length,
    onLengthChange,
    width,
    onWidthChange,
    depthProfile,
    onDepthProfileChange,
    distanceSuffix,
    formattedEstimatedVolume,
    volumeSuffix,
    canUploadPhoto,
}: EstimateFormProps) {
    const { t } = useTranslation();

    return (
        <View className="mt-5">
            <View className="border-t border-border-default pt-4">
                <Text className="text-body font-jakarta-bold text-charcoal">
                    {t('pool_size_q_shape')}
                </Text>
                <ShapePillRow shape={shape} onShapeChange={onShapeChange} />
            </View>

            <View className="border-t border-border-default mt-4 pt-4">
                <Text className="text-body font-jakarta-bold text-charcoal">
                    {t('pool_size_q_length')}
                </Text>
                <View className="form-input flex-row items-center justify-between mt-2.5">
                    <TextInput
                        className="flex-1 text-body font-jakarta text-charcoal p-0"
                        value={length}
                        onChangeText={onLengthChange}
                        keyboardType="decimal-pad"
                        placeholder="0"
                        placeholderTextColor={colors.text.faint}
                    />
                    <Text className="text-small font-jakarta text-sub ml-2">{distanceSuffix}</Text>
                </View>
            </View>

            <View className="border-t border-border-default mt-4 pt-4">
                <Text className="text-body font-jakarta-bold text-charcoal">
                    {t('pool_size_q_width')}
                </Text>
                <View className="form-input flex-row items-center justify-between mt-2.5">
                    <TextInput
                        className="flex-1 text-body font-jakarta text-charcoal p-0"
                        value={width}
                        onChangeText={onWidthChange}
                        keyboardType="decimal-pad"
                        placeholder="0"
                        placeholderTextColor={colors.text.faint}
                    />
                    <Text className="text-small font-jakarta text-sub ml-2">{distanceSuffix}</Text>
                </View>
            </View>

            <View className="border-t border-border-default mt-4 pt-4">
                <Text className="text-body font-jakarta-bold text-charcoal">
                    {t('pool_size_q_depth')}
                </Text>
                <View className="flex-row flex-wrap gap-2 mt-3">
                    {POOL_DEPTH_PROFILES.map((item) => {
                        const selected = depthProfile === item;
                        return (
                            <TouchableOpacity
                                key={item}
                                onPress={() => onDepthProfileChange(item)}
                                activeOpacity={0.8}
                                className={`rounded-full px-3.5 py-2.5 border ${selected
                                    ? 'bg-surface-soft-aqua border-brand-blue'
                                    : 'bg-surface-white border-border-default'
                                    }`}
                            >
                                <Text
                                    className={`text-small font-jakarta-bold ${selected ? 'text-brand-blue' : 'text-sub'
                                        }`}
                                >
                                    {t(poolDepthProfileTranslationKeys[item])}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <UploadPhotoRow
                enabled={canUploadPhoto}
                label={t('pool_size_upload_photo_label_estimate')}
                description={t('pool_size_upload_photo_desc_estimate')}
                showChevron
            />

            <EstimateCard
                formattedVolume={formattedEstimatedVolume}
                volumeSuffix={volumeSuffix}
                note={t('pool_size_estimated_gallons_note_estimate')}
                layout="estimate"
            />
        </View>
    );
}

/* ─── Shared pieces ────────────────────────────────────────────────────────── */

interface ShapePillRowProps {
    shape: PoolShape;
    onShapeChange: (shape: PoolShape) => void;
}

function ShapePillRow({ shape, onShapeChange }: ShapePillRowProps) {
    const { t } = useTranslation();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingTop: 12 }}
        >
            {POOL_SHAPES.map((item) => {
                const selected = shape === item;
                const color = selected ? colors.brand.blue : colors.text.sub;
                return (
                    <TouchableOpacity
                        key={item}
                        onPress={() => onShapeChange(item)}
                        activeOpacity={0.8}
                        className={`flex-row items-center gap-1.5 rounded-full px-3 py-2.5 border ${selected
                            ? 'bg-surface-soft-aqua border-brand-blue'
                            : 'bg-surface-white border-border-default'
                            }`}
                    >
                        <ShapeIcon shape={item} color={color} />
                        <Text
                            className={`text-small font-jakarta-bold ${selected ? 'text-brand-blue' : 'text-sub'
                                }`}
                        >
                            {t(poolShapeTranslationKeys[item])}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

interface ShapeIconProps {
    shape: PoolShape;
    color: string;
}

function ShapeIcon({ shape, color }: ShapeIconProps) {
    if (shape === 'Rectangle') {
        return (
            <View
                style={{
                    width: 14,
                    height: 11,
                    borderWidth: 1.5,
                    borderColor: color,
                    borderRadius: 1.5,
                }}
            />
        );
    }

    if (shape === 'Round') {
        return (
            <View
                style={{
                    width: 13,
                    height: 13,
                    borderWidth: 1.5,
                    borderColor: color,
                    borderRadius: 7,
                }}
            />
        );
    }

    if (shape === 'Oval') {
        return (
            <View
                style={{
                    width: 16,
                    height: 11,
                    borderWidth: 1.5,
                    borderColor: color,
                    borderRadius: 8,
                }}
            />
        );
    }

    // Freeform / Kidney — soft bean shape via overlapping rounded views
    return (
        <View style={{ width: 16, height: 12, alignItems: 'center', justifyContent: 'center' }}>
            <View
                style={{
                    width: 15,
                    height: 10,
                    borderWidth: 1.5,
                    borderColor: color,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 8,
                }}
            />
        </View>
    );
}

interface EstimateCardProps {
    formattedVolume: string;
    volumeSuffix: string;
    note: string;
    layout: 'known' | 'estimate';
}

function EstimateCard({ formattedVolume, volumeSuffix, note, layout }: EstimateCardProps) {
    const { t } = useTranslation();

    if (layout === 'known') {
        return (
            <View className="card--info flex-row items-center px-4 py-4 mt-5 gap-3">
                <Text className="text-h2 font-jakarta-bold text-brand-blue">~</Text>
                <View className="flex-1">
                    <Text className="text-tiny font-jakarta text-sub">
                        {t('pool_size_estimated_gallons_label')}
                    </Text>
                    <Text className="text-h2 font-jakarta-extrabold text-brand-navy mt-0.5">
                        {formattedVolume} {volumeSuffix}
                    </Text>
                    <Text className="text-tiny font-jakarta text-sub mt-1">{note}</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="card--info px-4 py-4 mt-4">
            <View className="flex-row items-center gap-2">
                <Ionicons name="water-outline" size={18} color={colors.brand.blue} />
                <Text className="text-tiny font-jakarta text-sub">
                    {t('pool_size_estimated_gallons_label')}
                </Text>
            </View>
            <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-1.5">
                {formattedVolume} {volumeSuffix}
            </Text>
            <Text className="text-tiny font-jakarta text-sub mt-1.5">{note}</Text>
        </View>
    );
}

interface UploadPhotoRowProps {
    enabled: boolean;
    label: string;
    description: string;
    showSkipLink?: boolean;
    showChevron?: boolean;
    onSkip?: () => void;
}

function UploadPhotoRow({
    enabled,
    label,
    description,
    showSkipLink = false,
    showChevron = false,
    onSkip,
}: UploadPhotoRowProps) {
    const { t } = useTranslation();

    return (
        <View
            className={`card flex-row items-center px-4 py-3.5 mt-4 gap-3 ${!enabled ? 'opacity-45' : ''
                }`}
        >
            <TouchableOpacity
                className="flex-1 flex-row items-center gap-3"
                activeOpacity={enabled ? 0.7 : 1}
                disabled={!enabled}
                onPress={() => { }}
            >
                <Image
                    source={icons.camera}
                    className="w-6 h-6"
                    resizeMode="contain"
                    style={{ tintColor: enabled ? colors.brand.blue : colors.text.faint }}
                />
                <View className="flex-1">
                    <Text
                        className={`text-body font-jakarta-bold ${enabled ? 'text-charcoal' : 'text-faint'
                            }`}
                    >
                        {label}
                    </Text>
                    <Text className="text-tiny font-jakarta text-sub mt-0.5">
                        {description}
                    </Text>
                </View>
            </TouchableOpacity>

            {showSkipLink ? (
                <TouchableOpacity
                    className="flex-row items-center gap-1"
                    activeOpacity={enabled ? 0.7 : 1}
                    disabled={!enabled}
                    onPress={onSkip}
                >
                    <Text
                        className={`text-small font-jakarta-bold ${enabled ? 'text-brand-blue' : 'text-faint'
                            }`}
                    >
                        {t('pool_size_skip')}
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={14}
                        color={enabled ? colors.brand.blue : colors.text.faint}
                    />
                </TouchableOpacity>
            ) : null}

            {showChevron ? (
                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={enabled ? colors.text.sub : colors.text.faint}
                />
            ) : null}
        </View>
    );
}

interface MethodCardProps {
    icon: keyof typeof Ionicons.glyphMap;
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
            className={`flex-1 rounded-2xl px-3 py-3.5 border-[1.5px] relative ${selected
                ? 'bg-surface-soft-aqua border-brand-blue'
                : 'bg-surface-white border-border-default'
                }`}
        >
            <View className="absolute top-2.5 left-2.5">
                <Image
                    source={selected ? icons.selectedCheckBadge : icons.unselectedRadioIndicator}
                    className="w-5 h-5"
                    resizeMode="contain"
                />
            </View>

            <View className="items-center mt-5">
                <Ionicons
                    name={icon}
                    size={28}
                    color={colors.brand.navy}
                />
                <Text className="mt-2.5 text-small font-jakarta-bold text-brand-navy text-center">
                    {label}
                </Text>
                <Text className="mt-0.5 text-tiny font-jakarta text-sub text-center">
                    {description}
                </Text>
            </View>
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

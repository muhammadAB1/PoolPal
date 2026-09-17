import { icons, poolSizeGraphics } from '@/constants/images';
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
    FreeformSection,
    MeasurementMethod,
    MeasurementUnit,
    PoolDepthProfile,
    PoolShape,
} from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    type ImageSourcePropType,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const US_GALLONS_PER_CUBIC_FOOT = 7.48052;
const LITERS_PER_CUBIC_METER = 1000;
const LITERS_PER_US_GALLON = 3.785411784;
const MAX_FREEFORM_SECTIONS = 6;

const POOL_SHAPE_IMAGES: Record<PoolShape, ImageSourcePropType> = {
    Rectangle: poolSizeGraphics.shapeRectangle,
    Round: poolSizeGraphics.shapeRound,
    Oval: poolSizeGraphics.shapeOval,
    Freeform: poolSizeGraphics.shapeFreeform,
    Kidney: poolSizeGraphics.shapeFreeform,
};

type EditableSection = {
    id: string;
    length: string;
    averageWidth: string;
    shallowDepth: string;
    deepDepth: string;
};

type PoolSizeFields = {
    units?: MeasurementUnit;
    length?: number | null;
    width?: number | null;
    shallowDepth?: number | null;
    deepDepth?: number | null;
    shape?: PoolShape | null;
    freeformSections?: FreeformSection[] | null;
};

type PoolSizeGallonsScreenProps = {
    /** Preselects every field, e.g. the pool's current size when editing from the Pool tab. */
    initialPoolSize?: PoolSizeFields | null;
    /** Hides "Skip for now". Defaults to true (onboarding keeps the skip option). */
    showSkip?: boolean;
    /**
     * When provided, this screen is being embedded (e.g. from the Size review "Edit" action)
     * instead of rendered as an onboarding route. On success this is called instead of the
     * normal onboarding navigation, and the outer SafeAreaView is skipped so the parent screen
     * stays in control of the safe area and header.
     */
    onSuccess?: () => void;
    /** Defaults to true for onboarding. Pool tab Edit passes false because it refreshes the provider itself. */
    markStale?: boolean;
};

function numeric(value: string) {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) && n > 0 ? n : null;
}

function toCanonicalVolumes(nativeVolume: number, unit: MeasurementUnit) {
    if (unit === 'us') return { gallons: nativeVolume, liters: nativeVolume * LITERS_PER_US_GALLON };
    return { liters: nativeVolume, gallons: nativeVolume / LITERS_PER_US_GALLON };
}

function shapeVolume(
    shape: Exclude<PoolShape, 'Freeform' | 'Kidney'>,
    length: number,
    width: number,
    shallow: number,
    deep: number,
    unit: MeasurementUnit,
) {
    const avgDepth = (shallow + deep) / 2;
    const cubic =
        shape === 'Round'
            ? Math.PI * Math.pow(length / 2, 2) * avgDepth
            : shape === 'Oval'
                ? Math.PI * (length / 2) * (width / 2) * avgDepth
                : length * width * avgDepth;
    return cubic * (unit === 'us' ? US_GALLONS_PER_CUBIC_FOOT : LITERS_PER_CUBIC_METER);
}

function sectionVolume(section: EditableSection, unit: MeasurementUnit) {
    const length = numeric(section.length);
    const width = numeric(section.averageWidth);
    const shallow = numeric(section.shallowDepth);
    const deep = numeric(section.deepDepth);
    if (length == null || width == null || shallow == null || deep == null) return null;
    return length * width * ((shallow + deep) / 2) * (unit === 'us' ? US_GALLONS_PER_CUBIC_FOOT : LITERS_PER_CUBIC_METER);
}

function newSection(index: number): EditableSection {
    return {
        id: `section-${index}-${Date.now()}`,
        length: '',
        averageWidth: '',
        shallowDepth: '',
        deepDepth: '',
    };
}

export default function PoolSizeGallonsScreen({
    initialPoolSize,
    showSkip = true,
    onSuccess,
    markStale = true,
}: PoolSizeGallonsScreenProps = {}) {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { measurement } = useAuth();
    const { poolSizeInsert, updateMeasurementPreference } = useSupabase();
    const { resume, remaining } = useLocalSearchParams<{ resume?: string; remaining?: string }>();
    const isResuming = resume === '1';
    const remainingSteps = parseRemainingSteps(remaining);
    const isEmbedded = Boolean(onSuccess);
    const initialShape = initialPoolSize?.shape === 'Kidney' ? 'Freeform' : initialPoolSize?.shape ?? 'Rectangle';

    const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod>('Known');
    const [units, setUnits] = useState<MeasurementUnit>(initialPoolSize?.units ?? (measurement || 'us'));
    const [length, setLength] = useState<string>(initialPoolSize?.length != null ? String(initialPoolSize.length) : '');
    const [width, setWidth] = useState<string>(initialPoolSize?.width != null ? String(initialPoolSize.width) : '');
    const [shallowDepth, setShallowDepth] = useState<string>(
        initialPoolSize?.shallowDepth != null ? String(initialPoolSize.shallowDepth) : '',
    );
    const [deepDepth, setDeepDepth] = useState<string>(
        initialPoolSize?.deepDepth != null ? String(initialPoolSize.deepDepth) : '',
    );
    const [shape, setShape] = useState<PoolShape>(initialShape);
    const [depthProfile, setDepthProfile] = useState<PoolDepthProfile>('ShallowDeep');
    const [sections, setSections] = useState<EditableSection[]>(() => {
        if (initialPoolSize?.freeformSections?.length) {
            return initialPoolSize.freeformSections.map((section, index) => ({
                id: section.id || `section-${index + 1}`,
                length: section.length?.toString() ?? '',
                averageWidth: section.averageWidth?.toString() ?? '',
                shallowDepth: section.shallowDepth?.toString() ?? '',
                deepDepth: section.deepDepth?.toString() ?? '',
            }));
        }
        return [newSection(1)];
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFreeform = shape === 'Freeform' || shape === 'Kidney';
    const nativeVolume = useMemo(() => {
        if (isFreeform) {
            const volumes = sections.map((section) => sectionVolume(section, units));
            if (volumes.some((value) => value == null)) return null;
            return volumes.reduce<number>((sum, value) => sum + (value ?? 0), 0);
        }
        const numericLength = numeric(length);
        const numericShallow = numeric(shallowDepth);
        const numericDeep = numeric(deepDepth);
        const numericWidth = shape === 'Round' ? numericLength : numeric(width);
        if (numericLength == null || numericWidth == null || numericShallow == null || numericDeep == null) return null;
        return shapeVolume(shape as 'Rectangle' | 'Round' | 'Oval', numericLength, numericWidth, numericShallow, numericDeep, units);
    }, [isFreeform, sections, units, length, width, shallowDepth, deepDepth, shape]);
    const volumes = nativeVolume == null ? null : toCanonicalVolumes(nativeVolume, units);
    const primaryVolume = nativeVolume == null ? null : Math.round(nativeVolume);
    const numberLocale = i18n.language.startsWith('es') ? 'es-ES' : 'en-US';
    const distanceSuffix = units === 'us' ? t('pool_size_unit_suffix_ft') : t('pool_size_unit_suffix_m');
    const volumeSuffix = units === 'us' ? t('pool_size_unit_gal') : t('pool_size_unit_liters');
    const valid = nativeVolume != null && nativeVolume > 0;
    const continueDisabled = !valid || isSubmitting;

    function handleMethodChange(method: MeasurementMethod) {
        setMeasurementMethod(method);
        if (method === 'Estimate') {
            const defaults = depthsFromProfile(depthProfile);
            setShallowDepth(defaults.shallowDepth);
            setDeepDepth(defaults.deepDepth);
        }
        setErrorMessage(null);
    }

    function handleDepthProfileChange(profile: PoolDepthProfile) {
        setDepthProfile(profile);
        const defaults = depthsFromProfile(profile);
        setShallowDepth(defaults.shallowDepth);
        setDeepDepth(defaults.deepDepth);
    }

    function updateSection(id: string, key: keyof Omit<EditableSection, 'id'>, value: string) {
        setSections((current) => current.map((section) => (section.id === id ? { ...section, [key]: value } : section)));
    }

    function addSection() {
        if (sections.length < MAX_FREEFORM_SECTIONS) {
            setSections((current) => [...current, newSection(current.length + 1)]);
        }
    }

    function removeSection(id: string) {
        setSections((current) => (current.length <= 1 ? current : current.filter((section) => section.id !== id)));
    }

    function buildFreeformSections(): FreeformSection[] {
        return sections.map((section, index) => {
            const volume = sectionVolume(section, units);
            const canonical = volume == null ? null : toCanonicalVolumes(volume, units);
            return {
                id: section.id,
                index: index + 1,
                length: numeric(section.length),
                averageWidth: numeric(section.averageWidth),
                shallowDepth: numeric(section.shallowDepth),
                deepDepth: numeric(section.deepDepth),
                measurementUnit: units,
                volumeUsGallons: canonical?.gallons ?? null,
                volumeLiters: canonical?.liters ?? null,
            };
        });
    }

    async function handleContinue() {
        setErrorMessage(null);

        if (!valid || !volumes) {
            setErrorMessage(t('pool_size_validation_dimensions'));
            return;
        }

        setIsSubmitting(true);

        try {
            if (units !== measurement) {
                const preferenceResult = await updateMeasurementPreference(units);
                if (preferenceResult.error) {
                    setErrorMessage(t('pool_size_validation_dimensions'));
                    return;
                }
            }

            const numericLength = numeric(length);
            const numericWidth = shape === 'Round' ? numeric(length) : numeric(width);
            const numericShallow = numeric(shallowDepth);
            const numericDeep = numeric(deepDepth);

            const { error } = await poolSizeInsert({
                props: {
                    length: isFreeform ? null : numericLength,
                    width: isFreeform ? null : numericWidth,
                    shallowDepth: isFreeform ? null : numericShallow,
                    deepDepth: isFreeform ? null : numericDeep,
                    shape: isFreeform ? 'Freeform' : shape,
                    gallons: units === 'us' ? Math.round(nativeVolume!) : Math.round(volumes.gallons),
                    volumeUsGallons: volumes.gallons,
                    volumeLiters: volumes.liters,
                    volumeSource: 'calculated',
                    freeformSections: isFreeform ? buildFreeformSections() : [],
                    measurementUnit: units,
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

            router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/equipment-basics' as Href));
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : t('pool_size_validation_dimensions'),
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleSkipForNow() {
        router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/equipment-basics' as Href));
    }

    const content = (
        <>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: showSkip ? 168 : 124 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.page}>
                    <Text style={styles.h1}>{t('pool_size_title')}</Text>
                    <Text style={styles.subtitle}>
                        {t(measurementMethod === 'Estimate' ? 'pool_size_subtitle_estimate' : 'pool_size_subtitle_known')}
                    </Text>

                    <View style={styles.methodRow}>
                        <MethodCard
                            image={poolSizeGraphics.measurementsKnown}
                            title={t('pool_size_option_yes_label')}
                            description={t('pool_size_option_yes_desc')}
                            selected={measurementMethod === 'Known'}
                            onPress={() => handleMethodChange('Known')}
                        />
                        <MethodCard
                            image={poolSizeGraphics.helpEstimate}
                            title={t('pool_size_option_estimate_label')}
                            description={t('pool_size_option_estimate_desc')}
                            selected={measurementMethod === 'Estimate'}
                            onPress={() => handleMethodChange('Estimate')}
                        />
                    </View>

                    <Text style={styles.label}>{t('pool_size_units_label')}</Text>
                    <View style={styles.segmentRow}>
                        {(['us', 'metric'] as const).map((unit) => {
                            const selected = units === unit;
                            return (
                                <TouchableOpacity
                                    key={unit}
                                    style={[styles.segment, selected && styles.selected]}
                                    onPress={() => setUnits(unit)}
                                    activeOpacity={0.86}
                                >
                                    <Text style={styles.segmentText}>
                                        {t(unit === 'us' ? 'pool_size_units_us' : 'pool_size_units_metric')}
                                    </Text>
                                    {selected ? (
                                        <Image source={icons.selectedCheckBadge} style={styles.check} resizeMode="contain" />
                                    ) : null}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={styles.label}>{t('pool_size_shape_label')}</Text>
                    <View style={styles.shapeGrid}>
                        {POOL_SHAPES.map((item) => {
                            const selected = shape === item;
                            const shapeImage = POOL_SHAPE_IMAGES[item];
                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.shapeCard, selected && styles.selected]}
                                    onPress={() => setShape(item)}
                                    activeOpacity={0.86}
                                >
                                    {shapeImage ? (
                                        <View style={styles.shapeIconShell}>
                                            <Image source={shapeImage} style={styles.shapeIcon} resizeMode="contain" />
                                        </View>
                                    ) : null}
                                    <Text
                                        style={styles.shapeText}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit
                                        minimumFontScale={0.78}
                                    >
                                        {t(poolShapeTranslationKeys[item])}
                                    </Text>
                                    {selected ? (
                                        <Image source={icons.selectedCheckBadge} style={styles.shapeCheck} resizeMode="contain" />
                                    ) : null}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {isFreeform ? (
                        <>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoText}>{t('pool_size_freeform_explanation')}</Text>
                            </View>
                            {sections.map((section, index) => (
                                <View key={section.id} style={styles.sectionCard}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>{t('pool_size_section_label', { index: index + 1 })}</Text>
                                        {index > 0 ? (
                                            <TouchableOpacity onPress={() => removeSection(section.id)}>
                                                <Text style={styles.removeText}>{t('pool_size_remove_section')}</Text>
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                    <Dimension
                                        label={t('pool_size_length_label')}
                                        suffix={distanceSuffix}
                                        value={section.length}
                                        onChange={(value) => updateSection(section.id, 'length', value)}
                                    />
                                    <Dimension
                                        label={t('pool_size_average_width_label')}
                                        suffix={distanceSuffix}
                                        value={section.averageWidth}
                                        onChange={(value) => updateSection(section.id, 'averageWidth', value)}
                                    />
                                    <View style={styles.twoInputs}>
                                        <View style={{ flex: 1 }}>
                                            <Dimension
                                                label={t('pool_size_shallow_depth_label')}
                                                suffix={distanceSuffix}
                                                value={section.shallowDepth}
                                                onChange={(value) => updateSection(section.id, 'shallowDepth', value)}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Dimension
                                                label={t('pool_size_deep_depth_label')}
                                                suffix={distanceSuffix}
                                                value={section.deepDepth}
                                                onChange={(value) => updateSection(section.id, 'deepDepth', value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                            {sections.length < MAX_FREEFORM_SECTIONS ? (
                                <TouchableOpacity style={styles.addSection} onPress={addSection}>
                                    <Text style={styles.addSectionText}>+ {t('pool_size_add_section')}</Text>
                                </TouchableOpacity>
                            ) : null}
                        </>
                    ) : (
                        <>
                            {measurementMethod === 'Estimate' ? (
                                <>
                                    <Text style={styles.label}>{t('pool_size_q_depth')}</Text>
                                    <View style={styles.stack}>
                                        {POOL_DEPTH_PROFILES.map((profile) => {
                                            const selected = depthProfile === profile;
                                            return (
                                                <TouchableOpacity
                                                    key={profile}
                                                    style={[styles.row, selected && styles.selected]}
                                                    onPress={() => handleDepthProfileChange(profile)}
                                                    activeOpacity={0.86}
                                                >
                                                    <Text style={styles.rowText}>
                                                        {t(poolDepthProfileTranslationKeys[profile])}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </>
                            ) : null}
                            <View style={styles.measurements}>
                                <Dimension
                                    label={shape === 'Round' ? t('pool_size_diameter_label') : t('pool_size_length_label')}
                                    suffix={distanceSuffix}
                                    value={length}
                                    onChange={setLength}
                                />
                                {shape !== 'Round' ? (
                                    <Dimension
                                        label={t('pool_size_width_label')}
                                        suffix={distanceSuffix}
                                        value={width}
                                        onChange={setWidth}
                                    />
                                ) : null}
                                <View style={styles.twoInputs}>
                                    <View style={{ flex: 1 }}>
                                        <Dimension
                                            label={t('pool_size_shallow_depth_label')}
                                            suffix={distanceSuffix}
                                            value={shallowDepth}
                                            onChange={setShallowDepth}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Dimension
                                            label={t('pool_size_deep_depth_label')}
                                            suffix={distanceSuffix}
                                            value={deepDepth}
                                            onChange={setDeepDepth}
                                        />
                                    </View>
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.volumeCard}>
                        <Text style={styles.volumeLabel}>{t('pool_size_estimated_volume')}</Text>
                        <Text style={styles.volumeValue}>
                            {primaryVolume == null ? '—' : `${primaryVolume.toLocaleString(numberLocale)} ${volumeSuffix}`}
                        </Text>
                        {volumes ? (
                            <Text style={styles.volumeSecondary}>
                                {units === 'us'
                                    ? `${Math.round(volumes.liters).toLocaleString(numberLocale)} L`
                                    : `${Math.round(volumes.gallons).toLocaleString(numberLocale)} gal`}
                            </Text>
                        ) : null}
                    </View>
                    <View style={styles.tip}>
                        <Image source={poolSizeGraphics.tipsIcon} style={styles.tipIcon} resizeMode="contain" />
                        <Text style={styles.tipText}>{t('pool_size_adjust_later_note')}</Text>
                    </View>
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-surface-white px-5 pt-3 pb-7 border-t border-border-default">
                {errorMessage ? (
                    <Text className="text-body font-jakarta text-error mb-3 text-center">
                        {errorMessage}
                    </Text>
                ) : null}
                <TouchableOpacity
                    className={`bg-brand-blue rounded-full py-4.25 items-center justify-center ${continueDisabled ? 'opacity-50' : ''}`}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                    disabled={continueDisabled}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('pool_size_continue')}
                    </Text>
                </TouchableOpacity>
                {showSkip ? (
                    <TouchableOpacity
                        className="items-center justify-center mt-3.5 py-1"
                        onPress={handleSkipForNow}
                        activeOpacity={0.7}
                    >
                        <Text className="text-body font-jakarta-bold text-brand-blue">
                            {t('pool_size_skip_for_now')}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </>
    );

    if (isEmbedded) {
        return <View className="flex-1">{content}</View>;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            {content}
        </SafeAreaView>
    );
}

function MethodCard({
    image,
    title,
    description,
    selected,
    onPress,
}: {
    image: ImageSourcePropType;
    title: string;
    description: string;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={[styles.methodCard, selected && styles.selected]}
            onPress={onPress}
            activeOpacity={0.86}
        >
            <View style={styles.methodImageShell}>
                <Image source={image} style={styles.methodImage} resizeMode="contain" />
            </View>
            <Text style={styles.methodTitle}>{title}</Text>
            <Text style={styles.methodDesc}>{description}</Text>
            {selected ? (
                <Image source={icons.selectedCheckBadge} style={styles.methodCheck} resizeMode="contain" />
            ) : null}
        </TouchableOpacity>
    );
}

function Dimension({
    label,
    suffix,
    value,
    onChange,
}: {
    label: string;
    suffix: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <View style={styles.dimension}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputShell}>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#98A2B3"
                />
                <Text style={styles.suffix}>{suffix}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: { paddingHorizontal: 20, paddingTop: 4 },
    h1: { color: '#073B5C', fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 31, lineHeight: 38 },
    subtitle: { color: '#6F7A91', fontFamily: 'PlusJakartaSans_400Regular', fontSize: 15, lineHeight: 22, marginTop: 5 },
    methodRow: { flexDirection: 'row', gap: 12, marginTop: 22 },
    methodCard: {
        flex: 1,
        minHeight: 178,
        borderWidth: 1.5,
        borderColor: '#D9E2EA',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    methodImageShell: { width: '100%', height: 84, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
    methodImage: { width: '90%', height: 74 },
    methodTitle: { color: '#073B5C', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, textAlign: 'center', marginTop: 8 },
    methodDesc: { color: '#6F7A91', fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: 3 },
    methodCheck: { position: 'absolute', width: 21, height: 21, right: 8, top: 8 },
    label: { color: '#073B5C', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, marginTop: 24, marginBottom: 10 },
    segmentRow: { flexDirection: 'row', gap: 10 },
    segment: {
        flex: 1,
        minHeight: 54,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#D9E2EA',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 7,
        padding: 9,
        overflow: 'hidden',
    },
    segmentText: { color: '#073B5C', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 12, textAlign: 'center' },
    check: { width: 20, height: 20 },
    selected: { borderColor: '#0FB7BC', backgroundColor: '#EAFBF9' },
    shapeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
    shapeCard: {
        width: '48.5%',
        minHeight: 62,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#D9E2EA',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 8,
        paddingVertical: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    shapeIconShell: {
        width: 38,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
    },
    shapeIcon: { width: 46, height: 38 },
    shapeText: {
        color: '#073B5C',
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12.5,
        flexShrink: 1,
        minWidth: 0,
        textAlign: 'center',
    },
    shapeCheck: { position: 'absolute', width: 18, height: 18, right: 5, top: 5 },
    measurements: { marginTop: 12 },
    dimension: { marginTop: 12 },
    inputLabel: { color: '#344054', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, marginBottom: 6 },
    inputShell: {
        minHeight: 52,
        borderWidth: 1,
        borderColor: '#D9E2EA',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    input: { flex: 1, minHeight: 50, paddingHorizontal: 14, color: '#1E293B', fontFamily: 'PlusJakartaSans_400Regular', fontSize: 16 },
    suffix: { color: '#667085', fontFamily: 'PlusJakartaSans_600SemiBold', paddingRight: 14 },
    twoInputs: { flexDirection: 'row', gap: 10 },
    stack: { gap: 8 },
    row: {
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#D9E2EA',
        minHeight: 48,
        justifyContent: 'center',
        paddingHorizontal: 14,
        overflow: 'hidden',
    },
    rowText: { color: '#073B5C', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13 },
    infoBox: { marginTop: 16, borderRadius: 15, backgroundColor: '#F1FBFD', padding: 13 },
    infoText: { color: '#526174', fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, lineHeight: 19 },
    sectionCard: { marginTop: 14, borderRadius: 18, borderWidth: 1, borderColor: '#D9E2EA', padding: 14, backgroundColor: '#FFFFFF' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitle: { color: '#073B5C', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15 },
    removeText: { color: '#C3363A', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 12 },
    addSection: { alignSelf: 'flex-start', marginTop: 14, paddingVertical: 8 },
    addSectionText: { color: '#0B84F3', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14 },
    volumeCard: { marginTop: 22, borderRadius: 20, backgroundColor: '#073B5C', padding: 18, alignItems: 'center' },
    volumeLabel: { color: '#D9EFF8', fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13 },
    volumeValue: { color: '#FFFFFF', fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 28, marginTop: 4 },
    volumeSecondary: { color: '#BDEDEA', fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, marginTop: 3 },
    tip: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, backgroundColor: '#FFFBEA', padding: 13 },
    tipIcon: { width: 30, height: 30 },
    tipText: { flex: 1, color: '#526174', fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, lineHeight: 19 },
});

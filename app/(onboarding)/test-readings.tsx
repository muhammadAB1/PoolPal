import ReadingsInfoModal from '@/components/ReadingsInfoModal';
import { icons, testReadingsGraphics, testReadingsImages } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
    BASIC_READING_FIELDS,
    TEST_READINGS_METHODS,
    TEST_READINGS_PHOTO_TIPS,
    testReadingsMethodTranslationKeys,
} from '@/data/poolReadings';
import { parseRemainingSteps, resumeOnboardingHref } from '@/lib/onboardingFlow';
import type { TestReadingsMethod } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
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
import { useSupabase } from '@/hooks/supabaseHooks';

export default function TestReadingsScreen() {
    console.log('I was ran TestReadingsScreen')
    const router = useRouter();
    const { t } = useTranslation();
    const { resume, remaining } = useLocalSearchParams<{ resume?: string; remaining?: string }>();
    const isResuming = resume === '1';
    const remainingSteps = parseRemainingSteps(remaining);

    const [method, setMethod] = useState<TestReadingsMethod | null>(null);
    const [readings, setReadings] = useState<Record<string, string>>({});
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    const { testReadingsInsert } = useSupabase();



    async function handleContinue() {
        setErrorMessage(null);

        if (!method) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await testReadingsInsert({
                props: {
                    testing_preference: method,
                    free_chlorine: parseFloat(readings.freeChlorine),
                    ph: parseFloat(readings.ph),
                    total_alkalinity: parseFloat(readings.totalAlkalinity),
                    cyanuric_acid: parseFloat(readings.cyanuricAcid),
                    calcium_hardness: parseFloat(readings.calciumHardness),
                },
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }
            router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/weekly-reminder' as Href));
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : t('pool_basics_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleSkipForNow() {
        router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/weekly-reminder' as Href));
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ref={scrollViewRef}
            >
                <View className="flex-1 px-5 pt-2 -mt-6">
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                        {t('test_readings_title')}
                    </Text>
                    <Text className="text-body-lg font-jakarta text-sub mt-1">
                        {t('test_readings_subtitle')}
                    </Text>

                    <View className="flex-row items-start gap-2.5 rounded-2xl bg-surface-bg border border-border-default px-4 py-3.5 mt-5">
                        <Image
                            source={testReadingsGraphics.infoIcon}
                            className="w-7 h-7 mt-[-0.5px] -mr-2"
                            resizeMode="contain"
                        />
                        <View className="flex-1">
                            <Text className="text-body-lg font-jakarta-bold text-charcoal">
                                {t('test_readings_info_title')}
                            </Text>
                            <Text className="text-small font-jakarta text-sub mt-1 leading-relaxed">
                                {t('test_readings_info_desc')}
                            </Text>
                        </View>
                    </View>

                    <View className="mt-4 gap-3">
                        {TEST_READINGS_METHODS.map((value) => {
                            const keys = testReadingsMethodTranslationKeys[value];

                            return (
                                <MethodOptionCard
                                    key={value}
                                    method={value}
                                    label={t(keys.title)}
                                    description={t(keys.description)}
                                    selected={method === value}
                                    onPress={() => {
                                        setMethod(value);
                                        setErrorMessage(null);
                                        scrollViewRef.current?.scrollToEnd({ animated: true });
                                    }}
                                />
                            );
                        })}
                    </View>

                    {method === 'Readings' ? (
                        <View className="mt-6">
                            <Text className="text-h2 font-jakarta-extrabold text-brand-navy">
                                {t('test_readings_form_title')}
                            </Text>
                            <Text className="text-body font-jakarta text-sub mt-1">
                                {t('test_readings_form_subtitle')}
                            </Text>

                            <Text className="text-h3 font-jakarta-extrabold text-brand-blue mt-5">
                                {t('test_readings_basic_title')}
                            </Text>
                            <Text className="text-body font-jakarta text-sub mt-1">
                                {t('test_readings_basic_subtitle')}
                            </Text>

                            <View className="mt-4 gap-4">
                                {BASIC_READING_FIELDS.map((field) => (
                                    <ReadingField
                                        key={field.key}
                                        label={t(field.labelKey)}
                                        value={readings[field.key] ?? ''}
                                        onChangeText={(text) =>
                                            setReadings((prev) => ({ ...prev, [field.key]: text }))
                                        }
                                        placeholder={field.placeholder}
                                        unit={field.showUnit ? t('test_readings_unit_ppm') : undefined}
                                        onInfoPress={() => setInfoModalVisible(true)}
                                    />
                                ))}
                            </View>
                        </View>
                    ) : null}

                    {method === 'Photo' ? (
                        <View className="mt-6">
                            <Text className="text-h2 font-jakarta-extrabold text-brand-navy">
                                {t('test_readings_photo_title')}
                            </Text>
                            <Text className="text-body font-jakarta text-sub mt-1">
                                {t('test_readings_photo_subtitle')}
                            </Text>

                            <Image
                                source={testReadingsGraphics.stripPhoto}
                                className="w-full h-[180px] rounded-2xl mt-4"
                                resizeMode="cover"
                            />

                            <TouchableOpacity
                                className="card flex-row items-center px-4 py-3.5 mt-4 gap-3"
                                activeOpacity={0.7}
                                onPress={() => { }}
                            >
                                <Image
                                    source={testReadingsImages.Photo}
                                    className="w-11 h-11 rounded-full"
                                    resizeMode="contain"
                                />
                                <View className="flex-1">
                                    <Text className="text-body font-jakarta-bold text-charcoal">
                                        {t('test_readings_photo_upload_title')}
                                    </Text>
                                    <Text className="text-tiny font-jakarta text-sub mt-0.5">
                                        {t('test_readings_photo_upload_desc')}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={18}
                                    color={colors.text.sub}
                                />
                            </TouchableOpacity>

                            <View className="card--info px-4 py-4 mt-4">
                                <View className="flex-row items-center gap-2.5">
                                    <View className="w-8 h-8 rounded-full bg-surface-white items-center justify-center">
                                        <Ionicons name="bulb-outline" size={16} color={colors.brand.blue} />
                                    </View>
                                    <Text className="text-body font-jakarta-bold text-charcoal">
                                        {t('test_readings_photo_tips_title')}
                                    </Text>
                                </View>
                                <View className="mt-3 gap-1.5">
                                    {TEST_READINGS_PHOTO_TIPS.map((tipKey) => (
                                        <View key={tipKey} className="flex-row items-start gap-2 pl-1">
                                            <Text className="text-small font-jakarta text-sub">
                                                {'\u2022'}
                                            </Text>
                                            <Text className="flex-1 text-small font-jakarta text-sub">
                                                {t(tipKey)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ) : null}

                    {method === 'None' ? (
                        <View className="mt-6">
                            <Text className="text-h2 font-jakarta-extrabold text-brand-navy">
                                {t('test_readings_none_title')}
                            </Text>
                            <Text className="text-body font-jakarta text-sub mt-1">
                                {t('test_readings_none_subtitle')}
                            </Text>

                            <Image
                                source={testReadingsGraphics.backyardPhoto}
                                className="w-full h-[180px] rounded-2xl mt-4"
                                resizeMode="cover"
                            />

                            <View className="card flex-row items-center px-4 py-3.5 mt-4 gap-3">
                                <View className="w-11 h-11 rounded-full bg-faint items-center justify-center">
                                    <Ionicons name="time-outline" size={20} color="#FFFFFF" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-body font-jakarta-bold text-charcoal">
                                        {t('test_readings_none_row_title')}
                                    </Text>
                                    <Text className="text-tiny font-jakarta text-sub mt-0.5">
                                        {t('test_readings_none_row_desc')}
                                    </Text>
                                </View>
                            </View>

                            <View className="card--success flex-row items-start gap-2.5 px-4 py-3.5 mt-3">
                                <Ionicons
                                    name="information-circle-outline"
                                    size={20}
                                    color={colors.brand.aqua}
                                    style={{ marginTop: 1 }}
                                />
                                <View className="flex-1">
                                    <Text className="text-body font-jakarta-bold text-charcoal">
                                        {t('test_readings_none_info_title')}
                                    </Text>
                                    <Text className="text-tiny font-jakarta text-sub mt-1 leading-relaxed">
                                        {t('test_readings_none_info_desc')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ) : null}

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
                        {t('test_readings_continue')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="items-center justify-center mt-3.5 py-1"
                    onPress={handleSkipForNow}
                    activeOpacity={0.7}
                >
                    <Text className="text-body font-jakarta-bold text-brand-blue">
                        {t('test_readings_skip_for_now')}
                    </Text>
                </TouchableOpacity>
            </View>

            <ReadingsInfoModal
                visible={infoModalVisible}
                onClose={() => setInfoModalVisible(false)}
            />
        </SafeAreaView>
    );
}

interface MethodOptionCardProps {
    method: TestReadingsMethod;
    label: string;
    description: string;
    selected: boolean;
    onPress: () => void;
}

function MethodOptionCard({ method, label, description, selected, onPress }: MethodOptionCardProps) {

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className={`flex-row items-center rounded-2xl px-3 py-3 border-[1.5px] gap-3 ${selected
                ? 'bg-surface-soft-aqua border-brand-aqua'
                : 'bg-surface-white border-border-default'
                }`}
        >
            {method === 'Photo' ? (
                <Image
                    source={testReadingsImages[method]}
                    className="w-14 h-14 rounded-xl"
                    resizeMode="contain"
                />
            ) : (
                <Image
                    source={testReadingsImages[method]}
                    className="w-14 h-14 rounded-xl"
                    resizeMode="contain"
                />
            )}

            <View className="flex-1 pr-1">
                <Text className="text-body-lg font-jakarta-bold text-charcoal">
                    {label}
                </Text>
                <Text className="mt-0.5 text-body font-jakarta text-sub">
                    {description}
                </Text>
            </View>

            <Image
                source={selected ? icons.selectedCheckBadge : icons.unselectedRadioIndicator}
                className="w-[22px] h-[22px]"
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}

interface ReadingFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    unit?: string;
    onInfoPress: () => void;
}

function ReadingField({ label, value, onChangeText, placeholder, unit, onInfoPress }: ReadingFieldProps) {
    return (
        <View className="flex-row items-center justify-between gap-3">
            <TouchableOpacity
                className="flex-1 flex-row items-center gap-1.5 pr-2"
                activeOpacity={0.7}
                onPress={onInfoPress}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
            >
                <Text className="text-body-lg font-jakarta-bold text-charcoal">
                    {label}
                </Text>
                <Image
                    source={icons.info}
                    className="w-4 h-4 -ml-1 mt-1"
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
                <View className="form-input w-[80px]">
                    <TextInput
                        className="text-body font-jakarta text-charcoal p-0"
                        style={{ textAlign: 'center' }}
                        value={value}
                        onChangeText={onChangeText}
                        keyboardType="decimal-pad"
                        placeholder={placeholder}
                        placeholderTextColor={colors.text.faint}
                    />
                </View>
                {unit ? (
                    <Text
                        className="text-small font-jakarta-bold text-charcoal"
                        style={{ width: 30 }}
                        numberOfLines={1}
                    >
                        {unit}
                    </Text>
                ) : (
                    <View style={{ width: 30 }} />
                )}
            </View>
        </View>
    );
}